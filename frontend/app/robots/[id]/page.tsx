'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { robotsAPI } from '@/lib/api/robots';
import { Robot } from '@/types/robot';
import { ExecutePayload } from '@/types/payment';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useWallet } from '@solana/wallet-adapter-react';
import { Loader2, ArrowLeft, Play, TrendingUp, Clock, Zap } from 'lucide-react';
import Link from 'next/link';

export default function RobotDetailPage() {
  const params = useParams();
  const robotId = params.id as string;

  const { connected } = useWallet();

  const [robot, setRobot] = useState<Robot | null>(null);
  const [loading, setLoading] = useState(true);
  const [executing, setExecuting] = useState(false);
  const [result, setResult] = useState<any>(null);

  const [service, setService] = useState('');
  const [parameters, setParameters] = useState('{}');

  useEffect(() => {
    loadRobot();
  }, [robotId]);

  const loadRobot = async () => {
    try {
      const data = await robotsAPI.getRobot(robotId);
      setRobot(data);
      if (data.services.length > 0) {
        setService(data.services[0]);
      }
    } catch (error) {
      console.error('Error loading robot:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExecute = async () => {
    if (!robot) return;

    try {
      setExecuting(true);
      setResult(null);

      let params = {};
      try {
        params = JSON.parse(parameters);
      } catch (e) {
        alert('Invalid JSON parameters');
        setExecuting(false);
        return;
      }

      const payload: ExecutePayload = {
        service,
        parameters: params,
      };

      // This will trigger 402 if payment not completed
      const response = await robotsAPI.executeRobot(robotId, payload);

      setResult(response);
    } catch (error: any) {
      console.error('Execution error:', error);
      setResult({
        success: false,
        error: error.message || 'Execution failed',
      });
    } finally {
      setExecuting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!robot) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Robot not found
          </h2>
          <Link href="/robots">
            <button className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg">
              Back to Robots
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="border-b border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/robots">
              <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
                <ArrowLeft className="w-6 h-6 text-gray-600 dark:text-gray-400" />
              </button>
            </Link>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {robot.name}
            </h1>
          </div>
          <WalletMultiButton />
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Robot Info */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 sticky top-24"
            >
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Robot Details
              </h2>

              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                    Description
                  </p>
                  <p className="text-gray-900 dark:text-white">
                    {robot.description}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                    Services
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {robot.services.map((s) => (
                      <span
                        key={s}
                        className="px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-full text-sm"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                    Price per Execution
                  </p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    {robot.price}{' '}
                    <span className="text-lg font-normal text-gray-500">
                      {robot.currency}
                    </span>
                  </p>
                </div>

                {/* Metrics */}
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Zap className="w-5 h-5 text-yellow-500" />
                      <span className="text-gray-600 dark:text-gray-400">
                        Executions
                      </span>
                    </div>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {robot.execution_count}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-green-500" />
                      <span className="text-gray-600 dark:text-gray-400">
                        Success Rate
                      </span>
                    </div>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {(robot.success_rate * 100).toFixed(0)}%
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock className="w-5 h-5 text-blue-500" />
                      <span className="text-gray-600 dark:text-gray-400">
                        Avg Response
                      </span>
                    </div>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {robot.avg_response_time.toFixed(1)}s
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Execute Form */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6"
            >
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Execute Robot
              </h2>

              <div className="space-y-6">
                {/* Service Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Service
                  </label>
                  <select
                    value={service}
                    onChange={(e) => setService(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  >
                    {robot.services.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Parameters */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Parameters (JSON)
                  </label>
                  <textarea
                    value={parameters}
                    onChange={(e) => setParameters(e.target.value)}
                    rows={8}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono text-sm focus:ring-2 focus:ring-blue-500"
                    placeholder='{"key": "value"}'
                  />
                </div>

                {/* Execute Button */}
                {!connected ? (
                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                    <p className="text-blue-600 dark:text-blue-400 mb-3">
                      Connect your wallet to execute this robot
                    </p>
                    <WalletMultiButton />
                  </div>
                ) : (
                  <button
                    onClick={handleExecute}
                    disabled={executing || robot.status !== 'active'}
                    className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors"
                  >
                    {executing ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Play className="w-5 h-5" />
                        Execute ({robot.price} {robot.currency})
                      </>
                    )}
                  </button>
                )}

                {/* Result */}
                {result && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`rounded-lg p-4 ${
                      result.success
                        ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
                        : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
                    }`}
                  >
                    <h3
                      className={`font-semibold mb-2 ${
                        result.success
                          ? 'text-green-800 dark:text-green-300'
                          : 'text-red-800 dark:text-red-300'
                      }`}
                    >
                      {result.success ? '✓ Success' : '✗ Error'}
                    </h3>
                    <pre className="text-sm font-mono overflow-x-auto text-gray-900 dark:text-white">
                      {JSON.stringify(result.data || result.error, null, 2)}
                    </pre>
                    {result.execution_time && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                        Execution time: {result.execution_time.toFixed(2)}s
                      </p>
                    )}
                  </motion.div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
