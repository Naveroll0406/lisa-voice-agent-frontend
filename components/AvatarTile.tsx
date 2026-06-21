'use client';

import { useEffect, useRef } from 'react';
import { useTracks } from '@livekit/components-react';
import { Track } from 'livekit-client';

export default function AvatarTile() {
  const tracks = useTracks([Track.Source.Microphone]).filter(t => t.participant.isAgent);
  const agentAudioTrack = tracks[0]?.publication?.track;
  const mouthRef = useRef<SVGEllipseElement>(null);

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
        const average = sum / dataArray.length;
        
        if (mouthRef.current) {
          const mouthOpenness = 5 + (average / 255) * 30;
          mouthRef.current.setAttribute('ry', mouthOpenness.toString());
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

  return (
    <div className="flex flex-col items-center justify-center w-full h-full">
      <svg width="200" height="200" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
        <circle cx="100" cy="100" r="80" fill="#cbd5e1" />
        <circle cx="70" cy="80" r="10" fill="#1e293b" />
        <circle cx="130" cy="80" r="10" fill="#1e293b" />
        <ellipse ref={mouthRef} cx="100" cy="130" rx="30" ry="5" fill="#1e293b" className="transition-all duration-75" />
      </svg>
      <p className="mt-4 text-slate-500 font-mono text-sm tracking-wide">Lisa Agent</p>
    </div>
  );
}
