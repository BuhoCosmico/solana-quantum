'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { X402Data } from '@/types/x402';
import { executePayment } from '@/lib/blockchain/payment';
import { paymentsAPI } from '@/lib/api/payments';
import { dispatchPaymentCompleted, dispatchPaymentCancelled } from '@/lib/x402/handler';
import { Loader2, X, Check, AlertCircle } from 'lucide-react';

type PaymentStatus = 'idle' | 'paying' | 'verifying' | 'success' | 'error';

export function PaymentModal() {
  const [paymentData, setPaymentData] = useState<X402Data | null>(null);
  const [status, setStatus] = useState<PaymentStatus>('idle');
  const [error, setError] = useState<string | null>(null);

  const { publicKey, signTransaction, connected } = useWallet();
  const { connection } = useConnection();

  useEffect(() => {
    const handler = (e: Event) => {
      const customEvent = e as CustomEvent<X402Data>;
      setPaymentData(customEvent.detail);
      setStatus('idle');
      setError(null);
    };

    window.addEventListener('x402-payment-required', handler);
    return () => window.removeEventListener('x402-payment-required', handler);
  }, []);

  const handlePay = async () => {
    if (!connected || !publicKey || !signTransaction || !paymentData) {
      setError('Please connect your wallet first');
      return;
    }

    try {
      setStatus('paying');
      setError(null);

      // Execute payment on Solana
      const signature = await executePayment({
        recipient: paymentData.recipient,
        amount: paymentData.amount,
        memo: paymentData.session_id,
        connection,
        publicKey,
        signTransaction,
      });

      setStatus('verifying');

      // Verify payment with backend
      const result = await paymentsAPI.verifyPayment({
        session_id: paymentData.session_id,
        tx_signature: signature,
      });

      if (result.verified) {
        setStatus('success');

        // Notify success
        setTimeout(() => {
          dispatchPaymentCompleted();
          setPaymentData(null);
        }, 2000);
      } else {
        throw new Error(result.error || 'Payment verification failed');
      }
    } catch (err: any) {
      console.error('Payment failed:', err);
      setStatus('error');
      setError(err.message || 'Payment failed. Please try again.');
    }
  };

  const handleCancel = () => {
    dispatchPaymentCancelled();
    setPaymentData(null);
    setStatus('idle');
    setError(null);
  };

  return (
    <AnimatePresence>
      {paymentData && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={handleCancel}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: 'spring', duration: 0.3 }}
            className="bg-white dark:bg-gray-900 rounded-2xl p-6 max-w-md w-full shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Payment Required
              </h2>
              <button
                onClick={handleCancel}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                disabled={status === 'paying' || status === 'verifying'}
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Payment Details */}
            <div className="space-y-4 mb-6">
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Service</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {paymentData.service}
                  </span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Amount</span>
                  <span className="text-2xl font-bold text-gray-900 dark:text-white">
                    {paymentData.amount} {paymentData.currency}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Network</span>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {paymentData.network}
                  </span>
                </div>
              </div>

              {/* Recipient Address */}
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                  Recipient Address
                </p>
                <p className="text-xs font-mono text-gray-700 dark:text-gray-300 break-all">
                  {paymentData.recipient}
                </p>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-2"
              >
                <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </motion.div>
            )}

            {/* Action Button */}
            {!connected ? (
              <WalletMultiButton className="w-full" />
            ) : (
              <button
                onClick={handlePay}
                disabled={status !== 'idle' && status !== 'error'}
                className={`w-full py-3 px-4 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors ${
                  status === 'success'
                    ? 'bg-green-600 text-white'
                    : status === 'error'
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'bg-blue-600 hover:bg-blue-700 text-white disabled:bg-gray-400 disabled:cursor-not-allowed'
                }`}
              >
                {status === 'idle' && 'Pay Now'}
                {status === 'paying' && (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Processing Payment...
                  </>
                )}
                {status === 'verifying' && (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Verifying...
                  </>
                )}
                {status === 'success' && (
                  <>
                    <Check className="w-5 h-5" />
                    Payment Confirmed
                  </>
                )}
                {status === 'error' && 'Retry Payment'}
              </button>
            )}

            {/* Footer Info */}
            <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-4">
              Powered by x402 Protocol on Solana
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
