import React from 'react';

export default function TopNav() {
  return (
    <header className="w-full flex justify-between items-center px-6 py-2.5 border-b border-[#1A1A24] bg-[#0B0B0F]/80 backdrop-blur-md z-50 shrink-0">
      <div className="text-lg font-bold text-white flex items-center gap-2">
        <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-[#8B5CF6] to-[#A78BFA] shadow-[0_0_10px_rgba(139,92,246,0.4)]" />
        Kura
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1 bg-[#1A1A24] p-1 rounded-lg border border-white/5">
          <button className="w-7 h-7 rounded-md bg-[#8B5CF6] flex justify-center items-center shadow-[0_0_10px_rgba(139,92,246,0.4)] transition-transform hover:scale-105" title="Kura Dashboard">
            <span className="text-[12px]">📊</span>
          </button>
          <div className="relative group">
            <button className="w-7 h-7 rounded-md bg-[#0B0B0F] flex justify-center items-center border border-transparent hover:border-white/10 transition-colors cursor-not-allowed opacity-40">
              <span className="text-[12px]">💳</span>
            </button>
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap bg-[#1A1A24] text-[9px] text-[#A78BFA] font-bold px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">
              Rewards Soon
            </div>
          </div>
          <div className="relative group">
            <button className="w-7 h-7 rounded-md bg-[#0B0B0F] flex justify-center items-center border border-transparent hover:border-white/10 transition-colors cursor-not-allowed opacity-40">
              <span className="text-[12px]">🪐</span>
            </button>
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap bg-[#1A1A24] text-[9px] text-[#A78BFA] font-bold px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">
              Forum Soon
            </div>
          </div>
        </div>
        <button className="w-7 h-7 rounded-full border border-[#1A1A24] overflow-hidden hover:border-[#8B5CF6] transition-colors focus:outline-none">
          <img src="https://api.dicebear.com/7.x/notionists/svg?seed=Rick&backgroundColor=e2e8f0" alt="User Avatar" className="w-full h-full object-cover" />
        </button>
      </div>
    </header>
  );
}