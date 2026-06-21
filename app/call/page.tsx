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
      <header className="p-4 border-b border-slate-800">
        <h1 className="text-2xl font-bold">Mykare Voice Assistant</h1>
      </header>
      <div className="flex-1 p-6 flex items-center justify-center">
        <CallRoom token={token} serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL!} />
      </div>
    </main>
  );
}
