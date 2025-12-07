'use client';

import { Wallet, DollarSign, Activity, Settings, User } from 'lucide-react';

export const AccountOverview = () => {
  return (
    <div className="space-y-6 lg:sticky lg:top-24">
      <div className="bg-cyber-gray border border-white/10 p-6 rounded-xl shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-neon-cyan">Mi Billetera Solana</h3>
          <Wallet size={20} className="text-solana" />
        </div>
        <p className="font-mono text-sm text-gray-400">Dirección Conectada:</p>
        <p className="font-mono text-white text-md truncate">7K8x...z9A1b</p>

        <div className="mt-4 pt-4 border-t border-white/5">
            <p className="text-gray-500 text-sm">Balance USDC (aprox.):</p>
            <p className="text-3xl font-extrabold text-emerald-400">$ 452.91</p>
        </div>
      </div>

      <div className="bg-cyber-gray border border-white/10 p-6 rounded-xl shadow-lg">
        <h3 className="text-lg font-bold text-white mb-4">Métricas de Uso</h3>
        <div className="space-y-3">
          <StatItem icon={Activity} label="Minutos Totales" value="128 min" color="text-neon-cyan" />
          <StatItem icon={DollarSign} label="Costo X402 Total" value="$ 19.20" color="text-emerald-400" />
          <StatItem icon={User} label="Sesiones Activas" value="1" color="text-rose-500" />
        </div>
        <button className="w-full mt-4 text-sm text-solana hover:underline flex items-center justify-center">
            Ver Historial Completo
        </button>
      </div>

       <button className="w-full bg-solana text-white py-3 rounded-lg font-bold hover:bg-solana/80 transition-colors flex items-center justify-center gap-2">
           <Settings size={18} /> Ajustes de Cuenta
       </button>
    </div>
  );
};

const StatItem = ({ icon: Icon, label, value, color }: any) => (
  <div className="flex justify-between items-center text-sm border-b border-white/5 pb-2 last:border-b-0">
    <span className="flex items-center gap-2 text-gray-500">
        <Icon size={16} className={color} /> {label}
    </span>
    <span className="font-mono font-medium text-white">{value}</span>
  </div>
);
