import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-slate-50 text-slate-900">
      <div className="z-10 max-w-5xl w-full items-center justify-center font-mono text-sm flex flex-col gap-8">
        <h1 className="text-4xl font-bold tracking-tight">Lisa Voice Assistant</h1>
        <p className="text-xl text-center max-w-2xl">
          An interactive, voice-driven AI assistant for booking and managing your medical appointments.
        </p>
        <Link 
          href="/call" 
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full transition-colors shadow-lg"
        >
          Start Conversation
        </Link>
      </div>
    </main>
  );
}
