'use client';

import { useRoomContext } from '@livekit/components-react';
import { useEffect, useState, useRef } from 'react';
import { RoomEvent, TranscriptionSegment, Participant } from 'livekit-client';

type TranscriptLine = {
  id: string;
  name: string;
  text: string;
  isAgent: boolean;
  isFinal: boolean;
};

export default function TranscriptPanel() {
  const room = useRoomContext();
  const [lines, setLines] = useState<TranscriptLine[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!room) return;

    const handleTranscription = (
      segments: TranscriptionSegment[],
      participant?: Participant
    ) => {
      setLines((prev) => {
        const next = [...prev];
        
        segments.forEach((segment) => {
          const isAgent = participant?.identity !== room.localParticipant.identity;
          const name = isAgent ? 'Agent' : 'You';
          
          // Find if we already have this segment ID
          const existingIndex = next.findIndex((l) => l.id === segment.id);
          
          if (existingIndex >= 0) {
            next[existingIndex] = {
              ...next[existingIndex],
              text: segment.text,
              isFinal: segment.final,
            };
          } else {
            next.push({
              id: segment.id,
              name,
              text: segment.text,
              isAgent,
              isFinal: segment.final,
            });
          }
        });
        
        return next;
      });
    };

    room.on(RoomEvent.TranscriptionReceived, handleTranscription);
    return () => {
      room.off(RoomEvent.TranscriptionReceived, handleTranscription);
    };
  }, [room]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [lines]);

  return (
    <div className="flex flex-col h-full">
      <h3 className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-2 flex justify-between items-center">
        <span>Live Transcript</span>
        <span className="animate-pulse bg-red-400 w-2 h-2 rounded-full"></span>
      </h3>
      <div 
        ref={scrollRef}
        className="text-slate-800 flex-1 overflow-y-auto text-sm pr-2 space-y-3 pb-2"
      >
        {lines.length === 0 ? (
          <div className="italic text-slate-400 mt-4 text-center">Waiting for someone to speak...</div>
        ) : (
          lines.map((line, idx) => (
            <div key={idx} className={`flex flex-col ${line.isAgent ? 'items-start' : 'items-end'}`}>
              <span className={`text-[10px] font-bold mb-1 uppercase tracking-wider ${line.isAgent ? 'text-indigo-500' : 'text-emerald-500'}`}>
                {line.name}
              </span>
              <span className={`px-4 py-2.5 rounded-2xl max-w-[85%] shadow-sm ${
                line.isAgent ? 'bg-indigo-50 text-indigo-900 rounded-tl-sm' : 'bg-emerald-50 text-emerald-900 rounded-tr-sm'
              } ${!line.isFinal ? 'opacity-70 italic' : ''}`}>
                {line.text}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
