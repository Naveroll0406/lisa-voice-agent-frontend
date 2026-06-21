import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-slate-50 text-slate-900">
      <div className="z-10 max-w-5xl w-full items-center justify-center font-mono text-sm flex flex-col gap-8">
        <h1 className="text-5xl font-extrabold tracking-tight text-indigo-900">Lisa Voice Assistant</h1>
        <p className="text-xl text-center text-slate-600 max-w-2xl font-sans">
          An interactive, voice-driven AI assistant for booking and managing your medical appointments.
        </p>
        <Link 
          href="/call" 
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-4 px-10 rounded-full transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 mt-4 text-lg"
        >
          Start Conversation
        </Link>
      </div>
    </main>
  );
}
