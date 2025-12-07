import { apiClient } from './client';
import {
  PaymentVerification,
  PaymentVerificationResponse,
} from '@/types/payment';

export const paymentsAPI = {
  async verifyPayment(
    data: PaymentVerification
  ): Promise<PaymentVerificationResponse> {
    const response = await apiClient.post<PaymentVerificationResponse>(
      '/payments/verify',
      data
    );
    return response.data;
  },

  async getSessionStatus(sessionId: string): Promise<any> {
    const response = await apiClient.get(`/payments/session/${sessionId}`);
    return response.data;
  },
};
