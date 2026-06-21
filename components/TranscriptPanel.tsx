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
    <div className="flex flex-col h-full w-full min-h-0">
      <h3 className="text-slate-400 text-sm font-bold uppercase tracking-wider mb-2 flex justify-between items-center">
        <span>Live Transcript</span>
        <span className="animate-pulse bg-red-500 w-2 h-2 rounded-full"></span>
      </h3>
      <div 
        ref={scrollRef}
        className="text-slate-300 flex-1 min-h-0 overflow-y-auto text-sm pr-2 space-y-3 pb-2"
      >
        {lines.length === 0 ? (
          <div className="italic text-slate-500 mt-4">Waiting for someone to speak...</div>
        ) : (
          (() => {
            const groupedLines: { isAgent: boolean; name: string; texts: { text: string; isFinal: boolean }[] }[] = [];
            lines.forEach((line) => {
              if (groupedLines.length > 0 && groupedLines[groupedLines.length - 1].isAgent === line.isAgent) {
                groupedLines[groupedLines.length - 1].texts.push({ text: line.text, isFinal: line.isFinal });
              } else {
                groupedLines.push({
                  isAgent: line.isAgent,
                  name: line.name,
                  texts: [{ text: line.text, isFinal: line.isFinal }]
                });
              }
            });

            return groupedLines.map((group, idx) => (
              <div key={idx} className={`flex flex-col ${group.isAgent ? 'items-start' : 'items-end'}`}>
                <span className={`text-xs font-bold mb-1 ${group.isAgent ? 'text-blue-400' : 'text-green-400'}`}>
                  {group.name}
                </span>
                <div className={`px-3 py-2 rounded-lg max-w-[80%] ${
                  group.isAgent ? 'bg-slate-700/50' : 'bg-slate-600/50'
                } flex flex-col gap-1`}>
                  {group.texts.map((t, i) => (
                    <span key={i} className={!t.isFinal ? 'opacity-70 italic' : ''}>
                      {t.text}
                    </span>
                  ))}
                </div>
              </div>
            ));
          })()
        )}
      </div>
    </div>
  );
}
