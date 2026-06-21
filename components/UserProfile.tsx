'use client';

export type UserInfo = {
  status: 'new_user' | 'existing_user';
  user_id: string;
  name?: string;
  phone_number: string;
  created_at: string;
  total_appointments: number;
};

export default function UserProfile({ userInfo }: { userInfo: UserInfo | null }) {
  if (!userInfo) {
    return (
      <div className="py-8 border-b border-slate-800 flex items-center justify-center text-slate-500 bg-[#0b1120] min-h-[160px]">
        <div className="flex items-center gap-3">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-slate-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-slate-500"></span>
          </span>
          Awaiting caller identification...
        </div>
      </div>
    );
  }

  const isExisting = userInfo.status === 'existing_user';

  return (
    <div className="border-b border-slate-800 bg-[#0b1120] p-8 flex justify-between items-center min-h-[160px]">
      <div className="grid grid-cols-2 gap-x-24 gap-y-6">
        <div className="flex flex-col gap-1 justify-center">
          <span className="text-slate-400 text-xs tracking-wider">Name</span>
          <span className="text-white font-bold text-lg leading-none">{userInfo.name || 'New Caller'}</span>
        </div>
        
        <div className="flex flex-col gap-1 justify-center">
          <span className="text-slate-400 text-xs tracking-wider">Status</span>
          <div className="flex items-center">
            <span className={`text-xs px-3 py-1 rounded-full font-medium leading-none ${isExisting ? 'bg-emerald-900/30 text-emerald-400 border border-emerald-800/50' : 'bg-amber-900/30 text-amber-400 border border-amber-800/50'}`}>
              {isExisting ? 'Existing user' : 'New user'}
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-1 justify-center">
          <span className="text-slate-400 text-xs tracking-wider">Phone</span>
          <span className="text-white font-bold text-lg leading-none">{userInfo.phone_number}</span>
        </div>

        <div className="flex flex-col gap-1 justify-center">
          <span className="text-slate-400 text-xs tracking-wider">Registered on</span>
          <span className="text-white font-bold text-lg leading-none">{userInfo.created_at}</span>
        </div>

        <div className="flex flex-col gap-1 justify-center">
          <span className="text-slate-400 text-xs tracking-wider">User ID</span>
          <span className="text-slate-200 font-mono leading-none">{userInfo.user_id}</span>
        </div>

        <div className="flex flex-col gap-1 justify-center">
          <span className="text-slate-400 text-xs tracking-wider">Active appointments</span>
          <span className="text-white font-bold text-lg leading-none">{userInfo.total_appointments}</span>
        </div>
      </div>
      
      <div className="hidden md:flex bg-slate-800/50 p-6 rounded-full border border-slate-700/50 shadow-inner">
        <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
          <circle cx="12" cy="7" r="4"></circle>
        </svg>
      </div>
    </div>
  );
}
