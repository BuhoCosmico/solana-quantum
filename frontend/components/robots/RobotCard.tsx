'use client';

import { Robot } from '@/types/robot';
import { motion } from 'framer-motion';
import { Zap, TrendingUp, Clock } from 'lucide-react';
import Link from 'next/link';

interface RobotCardProps {
  robot: Robot;
}

export function RobotCard({ robot }: RobotCardProps) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-shadow"
    >
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
              {robot.name}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
              {robot.description}
            </p>
          </div>
          <div
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              robot.status === 'active'
                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
            }`}
          >
            {robot.status}
          </div>
        </div>

        {/* Services */}
        <div className="flex flex-wrap gap-2 mb-4">
          {robot.services.slice(0, 3).map((service) => (
            <span
              key={service}
              className="px-2 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-xs rounded-md"
            >
              {service}
            </span>
          ))}
          {robot.services.length > 3 && (
            <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded-md">
              +{robot.services.length - 3} more
            </span>
          )}
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-yellow-500" />
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Executions</p>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                {robot.execution_count}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-green-500" />
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Success</p>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                {(robot.success_rate * 100).toFixed(0)}%
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-blue-500" />
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Avg Time</p>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                {robot.avg_response_time.toFixed(1)}s
              </p>
            </div>
          </div>
        </div>

        {/* Price & Action */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Price</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {robot.price} <span className="text-sm font-normal text-gray-500">{robot.currency}</span>
            </p>
          </div>
          <Link href={`/robots/${robot.id}`}>
            <button className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors">
              Execute
            </button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
