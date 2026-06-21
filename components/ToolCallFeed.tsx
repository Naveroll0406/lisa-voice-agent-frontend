'use client';

import { useRoomContext } from '@livekit/components-react';
import { useEffect, useState, useRef } from 'react';
import { RoomEvent } from 'livekit-client';

type ToolCallEvent = {
  tool: string;
  status: 'running' | 'done';
  label: string;
  time: Date;
};

export default function ToolCallFeed({ onSummary, onUserInfo }: { onSummary?: (data: any) => void, onUserInfo?: (data: any) => void }) {
  const room = useRoomContext();
  const [events, setEvents] = useState<ToolCallEvent[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [events]);

  useEffect(() => {
    if (!room) return;

    const handleData = (data: Uint8Array, participant: any) => {
      try {
        const str = new TextDecoder().decode(data);
        const parsed = JSON.parse(str);
        if (parsed.type === 'tool_call') {
          setEvents(prev => [...prev, { ...parsed, time: new Date() }]);
        } else if (parsed.type === 'summary' && onSummary) {
          onSummary(parsed);
        } else if (parsed.type === 'user_info' && onUserInfo) {
          onUserInfo(parsed.data);
        } else if (parsed.type === 'action' && parsed.action === 'reload') {
          window.location.reload();
        }
      } catch (e) {
        // ignore parsing errors
      }
    };

    room.on(RoomEvent.DataReceived, handleData);
    return () => {
      room.off(RoomEvent.DataReceived, handleData);
    };
  }, [room, onSummary, onUserInfo]);

  return (
    <div className="flex flex-col gap-2 h-full w-full min-h-0">
      <h3 className="text-slate-400 text-sm font-bold uppercase tracking-wider mb-2 flex justify-between items-center">
        <span>Agent Actions</span>
        <span className="animate-pulse bg-green-500 w-2 h-2 rounded-full"></span>
      </h3>
      <div 
        ref={scrollRef}
        className="flex-1 min-h-0 overflow-y-auto pr-2 pb-2 scroll-smooth"
      >
        {events.length === 0 && (
          <p className="text-slate-600 text-sm italic mt-4">Waiting for agent actions...</p>
        )}
        {events.map((ev, i) => (
          <div key={i} className="flex flex-col text-sm border-l-2 border-blue-500 pl-3 py-2 mb-2 bg-slate-800/50 rounded-r-lg">
            <span className="text-slate-200 font-medium">{ev.label}</span>
            <span className="text-slate-500 text-xs mt-1">
              {ev.tool} • {ev.status} • {ev.time.toLocaleTimeString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
