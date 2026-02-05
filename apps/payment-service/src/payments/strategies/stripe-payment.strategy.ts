import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { PaymentStrategy, PaymentResult, RefundResult } from '../interfaces/payment-strategy.interface';

@Injectable()
export class StripePaymentStrategy implements PaymentStrategy {
    private stripe: Stripe;

    constructor(private configService: ConfigService) {
        const stripeKey = this.configService.get<string>('STRIPE_SECRET_KEY');
        this.stripe = new Stripe(stripeKey, {
            apiVersion: '2026-01-28.clover',
        });
    }

    async processPayment(amount: number, currency: string, metadata: any): Promise<PaymentResult> {
        try {
            const paymentIntent = await this.stripe.paymentIntents.create({
                amount: Math.round(amount * 100), // Convert to cents
                currency: currency.toLowerCase(),
                metadata,
                automatic_payment_methods: {
                    enabled: true,
                },
            });

            return {
                success: paymentIntent.status === 'succeeded' || paymentIntent.status === 'processing',
                paymentId: paymentIntent.id,
                status: paymentIntent.status,
            };
        } catch (error) {
            return {
                success: false,
                paymentId: '',
                status: 'failed',
                error: error.message,
            };
        }
    }

    async refundPayment(paymentId: string, amount: number, currency: string): Promise<RefundResult> {
        try {
            const refund = await this.stripe.refunds.create({
                payment_intent: paymentId,
                amount: Math.round(amount * 100),
            });

            return {
                success: refund.status === 'succeeded',
                refundId: refund.id,
            };
        } catch (error) {
            return {
                success: false,
                refundId: '',
                error: error.message,
            };
        }
    }

    verifyWebhook(payload: any, signature: string): boolean {
        try {
            const webhookSecret = this.configService.get<string>('STRIPE_WEBHOOK_SECRET');
            this.stripe.webhooks.constructEvent(payload, signature, webhookSecret);
            return true;
        } catch (error) {
            return false;
        }
    }
}
