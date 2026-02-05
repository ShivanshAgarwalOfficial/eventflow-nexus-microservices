import { Injectable } from '@nestjs/common';
import { PaymentStrategy, PaymentResult, RefundResult } from '../interfaces/payment-strategy.interface';

@Injectable()
export class MockPaymentStrategy implements PaymentStrategy {
    async processPayment(amount: number, currency: string, metadata: any): Promise<PaymentResult> {
        // Simulate processing delay
        await new Promise(resolve => setTimeout(resolve, 500));

        // Simulate 95% success rate
        const success = Math.random() > 0.05;

        if (success) {
            return {
                success: true,
                paymentId: `mock_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                status: 'succeeded',
            };
        } else {
            return {
                success: false,
                paymentId: '',
                status: 'failed',
                error: 'Mock payment failed (simulated)',
            };
        }
    }

    async refundPayment(paymentId: string, amount: number, currency: string): Promise<RefundResult> {
        // Simulate processing delay
        await new Promise(resolve => setTimeout(resolve, 300));

        return {
            success: true,
            refundId: `refund_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        };
    }

    verifyWebhook(payload: any, signature: string): boolean {
        // Mock webhooks are always valid
        return true;
    }
}
