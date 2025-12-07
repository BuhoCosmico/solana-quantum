'use client';

import { Battery, Circle, DollarSign } from 'lucide-react';

interface RobotCardProps {
  id: string;
  name: string;
  status: 'online' | 'busy' | 'offline';
  battery: number;
  rate: number;
}

export const RobotCard = ({ id, name, status, battery, rate }: RobotCardProps) => {
  const statusConfig = {
    online: { color: 'bg-green-500', text: 'Disponible', ring: 'ring-green-500/20' },
    busy: { color: 'bg-yellow-500', text: 'En Uso', ring: 'ring-yellow-500/20' },
    offline: { color: 'bg-gray-500', text: 'Offline', ring: 'ring-gray-500/20' }
  };

  const config = statusConfig[status];

  return (
    <div className="bg-cyber-gray border border-white/10 rounded-xl p-6 hover:border-neon-cyan/50 transition-all group relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-neon-cyan/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-xs font-mono text-gray-500">{id}</p>
            <h3 className="text-lg font-bold text-white mt-1">{name}</h3>
          </div>

          <div className="flex items-center gap-2 px-3 py-1 rounded-full ring-2">
            <Circle size={8} className="fill-current" />
            <span className="text-xs font-medium text-gray-300">{config.text}</span>
          </div>
        </div>

        <div className="space-y-3 mb-4">
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2 text-gray-400">
              <Battery size={16} className="text-neon-cyan" />
              Bateria
            </span>
            <span className="font-mono font-medium text-white">{battery}%</span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2 text-gray-400">
              <DollarSign size={16} className="text-emerald-400" />
              Tarifa X402
            </span>
            <span className="font-mono font-medium text-white">{rate} USDC/min</span>
          </div>
        </div>

        <button
          disabled={status !== 'online'}
          className="w-full py-2 rounded-lg font-semibold transition-all bg-neon-cyan text-cyber-black hover:bg-neon-cyan/90 disabled:bg-white/5 disabled:text-gray-500 disabled:cursor-not-allowed"
        >
          {status === 'online' ? 'Iniciar Control' : 'No Disponible'}
        </button>
      </div>
    </div>
  );
};
