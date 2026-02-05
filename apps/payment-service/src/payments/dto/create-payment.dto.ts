import { IsString, IsNumber, IsEnum, Min, IsOptional } from 'class-validator';
import { PaymentProvider } from '@eventflow/shared-types';

export class CreatePaymentDto {
    @IsString()
    bookingId: string;

    @IsString()
    userId: string;

    @IsNumber()
    @Min(0.01)
    amount: number;

    @IsString()
    @IsOptional()
    currency?: string;

    @IsEnum(PaymentProvider)
    provider: PaymentProvider;

    @IsOptional()
    metadata?: any;
}
