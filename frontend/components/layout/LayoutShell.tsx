'use client';

import React, { ReactNode } from 'react';
import { Wallet, Cpu } from 'lucide-react';
import Link from 'next/link';

export default function LayoutShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-cyber-black text-gray-200 font-sans selection:bg-neon-cyan selection:text-black">
      <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none z-0"></div>
      <div className="fixed inset-0 bg-grid-pattern bg-[size:40px_40px] opacity-[0.05] pointer-events-none z-0"></div>

      <nav className="fixed top-0 w-full z-50 border-b border-white/10 bg-cyber-black/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-tr from-solana to-neon-cyan rounded-md flex items-center justify-center">
              <Cpu size={20} className="text-white" />
            </div>
            <span className="font-bold tracking-wider text-white">NEXUS<span className="text-neon-cyan">ROBOTICS</span></span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-400">
            <Link href="#" className="hover:text-neon-cyan transition-colors">Marketplace</Link>
            <Link href="#" className="text-white">Dashboard</Link>
            <Link href="#" className="hover:text-neon-cyan transition-colors">Docs X402</Link>
          </div>

          <button className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2 rounded-full transition-all text-sm font-mono text-neon-cyan group">
            <Wallet size={16} />
            <span>Connect Wallet</span>
            <div className="w-2 h-2 rounded-full bg-red-500 group-hover:bg-green-400 transition-colors shadow-[0_0_8px_rgba(0,255,0,0.5)]"></div>
          </button>
        </div>
      </nav>

      <main className="relative z-10 pt-24 px-6 max-w-7xl mx-auto pb-20">
        {children}
      </main>
    </div>
  );
}
