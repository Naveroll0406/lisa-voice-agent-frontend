// 'use client';

// import { useEffect, useRef } from 'react';
// import { useTracks } from '@livekit/components-react';
// import { Track } from 'livekit-client';

// export default function AvatarTile() {
//   const tracks = useTracks([Track.Source.Microphone]).filter(t => t.participant.isAgent);
//   const agentAudioTrack = tracks[0]?.publication?.track;
//   const mouthRef = useRef<SVGEllipseElement>(null);

//   useEffect(() => {
//     if (!agentAudioTrack) return;
    
//     try {
//       const mediaStream = new MediaStream([agentAudioTrack.mediaStreamTrack]);
//       const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
//       const source = audioContext.createMediaStreamSource(mediaStream);
//       const analyser = audioContext.createAnalyser();
//       analyser.fftSize = 256;
//       source.connect(analyser);

//       const dataArray = new Uint8Array(analyser.frequencyBinCount);

//       let animationId: number;
//       const animate = () => {
//         analyser.getByteFrequencyData(dataArray);
//         const sum = dataArray.reduce((a, b) => a + b, 0);
//         const average = sum / dataArray.length;
        
//         if (mouthRef.current) {
//           const mouthOpenness = 5 + (average / 255) * 30;
//           mouthRef.current.setAttribute('ry', mouthOpenness.toString());
//         }
//         animationId = requestAnimationFrame(animate);
//       };
      
//       animate();

//       return () => {
//         cancelAnimationFrame(animationId);
//         source.disconnect();
//         audioContext.close();
//       };
//     } catch (e) {
//       console.error("Audio context error:", e);
//     }
//   }, [agentAudioTrack]);

//   return (
//     <div className="flex flex-col items-center justify-center w-full h-full">
//       <svg width="200" height="200" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
//         <circle cx="100" cy="100" r="80" fill="#cbd5e1" />
//         <circle cx="70" cy="80" r="10" fill="#1e293b" />
//         <circle cx="130" cy="80" r="10" fill="#1e293b" />
//         <ellipse ref={mouthRef} cx="100" cy="130" rx="30" ry="5" fill="#1e293b" className="transition-all duration-75" />
//       </svg>
//       <p className="mt-4 text-slate-400 font-mono">Lisa Agent</p>
//     </div>
//   );
// }
'use client';

import { useEffect, useRef, useState } from 'react';
import { useTracks, useLocalParticipant } from '@livekit/components-react';
import { Track } from 'livekit-client';

export default function AvatarTile() {
  const tracks = useTracks([Track.Source.Microphone]).filter(t => t.participant.isAgent);
  const agentAudioTrack = tracks[0]?.publication?.track;

  // Optional: drives the "listening" ring while the user is talking.
  // If useLocalParticipant isn't available on your installed version of
  // @livekit/components-react, just delete this line and the effect below
  // plus the isListening className — everything else works without it.
  const { localParticipant } = useLocalParticipant();

  const mouthRef = useRef<SVGEllipseElement>(null);
  const leftEyeRef = useRef<SVGEllipseElement>(null);
  const rightEyeRef = useRef<SVGEllipseElement>(null);
  const smoothedRef = useRef(0);

  const [isBlinking, setIsBlinking] = useState(false);
  const [isListening, setIsListening] = useState(false);

  // ---- Agent audio -> mouth movement: your original approach, now smoothed ----
  useEffect(() => {
    if (!agentAudioTrack) return;

    try {
      const mediaStream = new MediaStream([agentAudioTrack.mediaStreamTrack]);
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const source = audioContext.createMediaStreamSource(mediaStream);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);

      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      let animationId: number;
      const animate = () => {
        analyser.getByteFrequencyData(dataArray);
        const sum = dataArray.reduce((a, b) => a + b, 0);
        const rawAverage = sum / dataArray.length / 255; // normalize 0-1

        // Exponential smoothing
        smoothedRef.current += (rawAverage - smoothedRef.current) * 0.25;

        if (mouthRef.current) {
          const intensity = smoothedRef.current;
          let targetRy = 5; // default closed
          
          // Discrete mouth shapes (like classic 2D animation frames)
          if (intensity > 0.5) {
            targetRy = 20; // Wide open
          } else if (intensity > 0.25) {
            targetRy = 14; // Open
          } else if (intensity > 0.1) {
            targetRy = 9; // Slightly open
          } else {
            targetRy = 5;  // Closed
          }

          mouthRef.current.setAttribute('ry', targetRy.toString());
        }
        animationId = requestAnimationFrame(animate);
      };

      animate();

      return () => {
        cancelAnimationFrame(animationId);
        source.disconnect();
        audioContext.close();
      };
    } catch (e) {
      console.error("Audio context error:", e);
    }
  }, [agentAudioTrack]);

  // ---- Idle blinking, independent of speech. Low-frequency, state is fine here. ----
  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    const scheduleBlink = () => {
      const delay = 2000 + Math.random() * 3000; // every 2-5s
      timeout = setTimeout(() => {
        setIsBlinking(true);
        setTimeout(() => setIsBlinking(false), 150);
        scheduleBlink();
      }, delay);
    };
    scheduleBlink();
    return () => clearTimeout(timeout);
  }, []);

  // ---- Listening indicator: LiveKit already tracks this on the participant,
  // no extra audio analysis needed. Polling here for safety across SDK
  // versions - if your version exposes a useIsSpeaking()-style hook, that's
  // a cleaner swap, worth checking your installed @livekit/components-react docs.
  useEffect(() => {
    if (!localParticipant) return;
    const interval = setInterval(() => {
      setIsListening(localParticipant.isSpeaking);
    }, 150);
    return () => clearInterval(interval);
  }, [localParticipant]);

  return (
    <div className="flex flex-col items-center justify-center w-full h-full">
      <div
        className={`avatar-ring rounded-full transition-shadow duration-300 ${
          isListening ? 'shadow-[0_0_0_6px_rgba(59,130,246,0.6)]' : 'shadow-[0_0_0_4px_rgba(51,65,85,0.8)]'
        }`}
      >
        <svg width="200" height="200" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <g className="breathe">
            <circle cx="100" cy="100" r="80" fill="#cbd5e1" />
            <ellipse
              ref={leftEyeRef}
              cx="70" cy="80" rx="10" ry={isBlinking ? 1 : 10}
              fill="#1e293b" className="transition-all duration-100"
            />
            <ellipse
              ref={rightEyeRef}
              cx="130" cy="80" rx="10" ry={isBlinking ? 1 : 10}
              fill="#1e293b" className="transition-all duration-100"
            />
            <ellipse
              ref={mouthRef}
              cx="100" cy="130" rx="30" ry="5"
              fill="#1e293b" className="transition-all duration-75"
            />
          </g>
        </svg>
      </div>
      <p className="mt-4 text-slate-400 font-mono">Lisa Agent</p>

      <style jsx>{`
        .breathe {
          animation: breathe 4s ease-in-out infinite;
          transform-origin: 100px 130px;
        }
        @keyframes breathe {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.015); }
        }
      `}</style>
    </div>
  );
}