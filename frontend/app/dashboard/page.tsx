'use client';

import LayoutShell from '@/components/layout/LayoutShell';
import { AccountOverview } from '@/components/dashboard/AccountOverview';
import { RobotCard } from '@/components/dashboard/RobotCard';
import { Search } from 'lucide-react';

const mockRobots = [
    { id: 'RBT-001', name: 'Rover Alpha', status: 'online', battery: 88, rate: 0.15 },
    { id: 'RBT-002', name: 'Arm Manipulator X', status: 'busy', battery: 42, rate: 0.25 },
    { id: 'RBT-003', name: 'Drone Scout', status: 'offline', battery: 0, rate: 0.10 },
    { id: 'RBT-004', name: 'Factory Bot Delta', status: 'online', battery: 95, rate: 0.30 },
];

export default function DashboardPage() {
  return (
    <LayoutShell>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

        <div className="lg:col-span-1">
          <AccountOverview />
        </div>

        <div className="lg:col-span-3">
          <h1 className="text-3xl font-bold text-white mb-6 border-b border-white/10 pb-3">
            Catálogo de Flota
          </h1>

          <div className="mb-8 flex gap-4">
              <div className="relative flex-grow">
                  <input
                      type="text"
                      placeholder="Buscar por ID, nombre o función..."
                      className="w-full bg-cyber-gray border border-white/10 text-white rounded-lg pl-10 pr-4 py-3 focus:ring-1 focus:ring-neon-cyan focus:border-neon-cyan transition-colors"
                  />
                  <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
              </div>
              <select className="bg-cyber-gray border border-white/10 text-white rounded-lg px-4 py-3 focus:ring-1 focus:ring-neon-cyan">
                  <option>Estado: Todos</option>
                  <option>Online</option>
                  <option>Disponible</option>
              </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {mockRobots.map((robot) => (
              <RobotCard key={robot.id} {...robot} />
            ))}
          </div>
        </div>
      </div>
    </LayoutShell>
  );
}
