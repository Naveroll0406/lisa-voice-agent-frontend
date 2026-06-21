'use client';

import {
  LiveKitRoom,
  RoomAudioRenderer,
} from '@livekit/components-react';
import { useState } from 'react';
import AvatarTile from './AvatarTile';
import ToolCallFeed from './ToolCallFeed';
import TranscriptPanel from './TranscriptPanel';
import SummaryCard from './SummaryCard';

export default function CallRoom({ token, serverUrl }: { token: string; serverUrl: string }) {
  const [callEnded, setCallEnded] = useState(false);
  const [summaryData, setSummaryData] = useState<any>(null);

  const handleSummary = (data: any) => {
    setSummaryData(data);
    setCallEnded(true);
  };

  return (
    <LiveKitRoom
      token={token}
      serverUrl={serverUrl}
      connect={true}
      audio={true}
      video={false}
      onDisconnected={() => {
        if (!summaryData) setCallEnded(true);
      }}
      className="w-full h-[85vh] max-h-[900px] max-w-6xl flex gap-6"
    >
      <RoomAudioRenderer />
      
      {!callEnded ? (
        <>
          <div className="flex-1 flex flex-col gap-6">
            <div className="bg-white rounded-3xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex-1 flex items-center justify-center border border-indigo-50 relative transition-all">
              <AvatarTile />
            </div>
            
            <div className="h-80 bg-white rounded-3xl p-6 overflow-y-auto border border-indigo-50 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
              <TranscriptPanel />
            </div>
          </div>
          
          <div className="w-96 bg-white rounded-3xl p-6 overflow-hidden flex flex-col border border-indigo-50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] max-h-full">
            <ToolCallFeed onSummary={handleSummary} />
          </div>
        </>
      ) : (
        <div className="w-full flex items-center justify-center">
          {summaryData ? (
             <SummaryCard summary={summaryData} />
          ) : (
             <div className="text-center bg-white p-10 rounded-3xl max-w-lg w-full border border-indigo-50 shadow-[0_8px_30px_rgb(0,0,0,0.06)]">
               <h2 className="text-3xl font-extrabold mb-4 text-slate-800 tracking-tight">Call Disconnected</h2>
               <p className="text-slate-500 text-lg">The connection was closed without generating a summary.</p>
             </div>
          )}
        </div>
      )}
    </LiveKitRoom>
  );
}
