// src/app/dashboard/page.tsx
import React from 'react';

export default function DashboardPage() {
  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Banking Overview</h1>
      
      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="p-6 rounded-2xl bg-[#1A1A24] border border-white/5">
          <div className="text-gray-400 text-sm mb-2">Total Balance</div>
          <div className="text-3xl font-bold">$124,500.00</div>
        </div>
      </div>

      <div className="h-96 rounded-2xl bg-[#1A1A24] border border-white/5 flex items-center justify-center text-gray-500">
        Interactive Chart Area
      </div>
    </div>
  );
}