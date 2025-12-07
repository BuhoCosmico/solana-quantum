import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { WalletProvider } from '@/components/wallet/WalletProvider';
import { PaymentModal } from '@/components/x402/PaymentModal';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'x402 Platform - Pay-per-use Robot Services',
  description: 'Automated payment platform for robot services using x402 protocol',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <WalletProvider>
          {children}
          <PaymentModal />
        </WalletProvider>
      </body>
    </html>
  );
}
