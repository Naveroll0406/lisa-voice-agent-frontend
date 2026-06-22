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
import UserProfile, { UserInfo } from './UserProfile';

export default function CallRoom({ token, serverUrl }: { token: string; serverUrl: string }) {
  const [callEnded, setCallEnded] = useState(false);
  const [summaryData, setSummaryData] = useState<any>(null);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

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
      className="w-full h-full md:h-[85vh] md:max-h-[900px] max-w-6xl flex flex-col"
    >
      <RoomAudioRenderer />
      
      {!callEnded ? (
        <div className="flex flex-col w-full h-full min-h-0">
          {/* Top Panel: User Profile */}
          <div className="w-full shrink-0">
            <UserProfile userInfo={userInfo} />
          </div>
          
          {/* Bottom Area: 2 Columns */}
          <div className="flex-1 flex flex-col md:flex-row gap-4 md:gap-6 p-4 md:p-6 min-h-0">
            {/* Left Column: Avatar + Transcript */}
            <div className="flex-1 flex flex-col gap-4 md:gap-6 min-h-0">
              <div className="flex items-center justify-center relative shrink-0 min-h-[150px] md:min-h-[200px]">
                <AvatarTile />
              </div>
              
              <div className="flex-1 min-h-[200px] bg-slate-800 rounded-xl p-4 flex flex-col overflow-hidden border border-slate-700 shadow-inner">
                <TranscriptPanel />
              </div>
            </div>
            
            {/* Right Column: Agent Actions */}
            <div className="w-full md:w-96 shrink-0 bg-slate-800 rounded-xl p-4 overflow-hidden flex flex-col border border-slate-700 shadow-2xl h-[300px] md:h-full min-h-0">
              <ToolCallFeed onSummary={handleSummary} onUserInfo={setUserInfo} />
            </div>
          </div>
        </div>
      ) : (
        <div className="w-full flex items-center justify-center">
          {summaryData ? (
             <SummaryCard summary={summaryData} />
          ) : (
             <div className="text-center bg-slate-800 p-8 rounded-xl max-w-lg w-full border border-slate-700">
               <h2 className="text-2xl font-bold mb-4 text-slate-300">Call Disconnected</h2>
               <p className="text-slate-400">The connection was closed without generating a summary.</p>
             </div>
          )}
        </div>
      )}
    </LiveKitRoom>
  );
}
