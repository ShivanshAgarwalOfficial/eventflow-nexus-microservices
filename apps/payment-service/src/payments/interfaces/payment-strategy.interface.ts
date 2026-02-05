export interface PaymentResult {
    success: boolean;
    paymentId: string;
    status: string;
    error?: string;
}

export interface RefundResult {
    success: boolean;
    refundId: string;
    error?: string;
}

export interface PaymentStrategy {
    processPayment(amount: number, currency: string, metadata: any): Promise<PaymentResult>;
    refundPayment(paymentId: string, amount: number, currency: string): Promise<RefundResult>;
    verifyWebhook?(payload: any, signature: string): boolean;
}
