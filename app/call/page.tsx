'use client';

import { useState, useEffect } from 'react';
import CallRoom from '@/components/CallRoom';

export default function CallPage() {
  const [token, setToken] = useState('');

  useEffect(() => {
    const fetchToken = async () => {
      const roomName = 'mykare-room-' + Math.floor(Math.random() * 10000);
      const res = await fetch(`/api/token?room=${roomName}&participantName=user`);
      const data = await res.json();
      setToken(data.token);
    };
    fetchToken();
  }, []);

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
        <p className="text-xl animate-pulse">Connecting to LiveKit...</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-900 text-slate-50 flex flex-col">
      <header className="p-4 border-b border-slate-800 bg-[#0b1120] flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="bg-emerald-500/20 p-2 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
            </svg>
          </div>
          <h1 className="text-xl font-bold text-white">Lisa voice assistant</h1>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 text-sm font-medium text-slate-300">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            Connected
          </div>
          <button 
            onClick={() => window.location.reload()}
            className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white px-4 py-1.5 rounded-lg text-sm font-bold shadow-lg transition-all flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"></path>
              <path d="M21 3v5h-5"></path>
            </svg>
            New User
          </button>
        </div>
      </header>
      <div className="flex-1 flex flex-col items-center justify-center bg-[#0f172a] min-h-0">
        <CallRoom token={token} serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL!} />
      </div>
    </main>
  );
}
