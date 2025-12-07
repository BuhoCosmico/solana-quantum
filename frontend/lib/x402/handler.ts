import { X402Data } from '@/types/x402';

export function parseX402Response(response: any): X402Data {
  const headers = response.headers;
  const data = response.data;

  return {
    session_id: headers['x-session-id'] || data.session_id,
    amount: parseFloat(headers['x-payment-amount'] || data.amount),
    currency: headers['x-payment-currency'] || data.currency,
    network: headers['x-payment-network'] || data.network,
    recipient: headers['x-payment-address'] || data.recipient,
    service: data.service,
    robot_id: data.robot_id,
    expires_at: headers['x-expires-at'] || data.expires_at,
    message: data.message,
  };
}

export async function handleX402Response(data: X402Data): Promise<boolean> {
  return new Promise((resolve) => {
    // Dispatch event to open payment modal
    window.dispatchEvent(
      new CustomEvent('x402-payment-required', { detail: data })
    );

    // Listen for payment completion
    const handlePaid = () => {
      resolve(true);
      window.removeEventListener('x402-payment-completed', handlePaid);
    };

    const handleCancelled = () => {
      resolve(false);
      window.removeEventListener('x402-payment-cancelled', handleCancelled);
    };

    window.addEventListener('x402-payment-completed', handlePaid);
    window.addEventListener('x402-payment-cancelled', handleCancelled);
  });
}

export function dispatchPaymentCompleted() {
  window.dispatchEvent(new CustomEvent('x402-payment-completed'));
}

export function dispatchPaymentCancelled() {
  window.dispatchEvent(new CustomEvent('x402-payment-cancelled'));
}
