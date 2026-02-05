import { Controller, Post, Get, Body, Param, ValidationPipe } from '@nestjs/common';
import { PaymentService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';

@Controller('payments')
export class PaymentsController {
    constructor(private readonly paymentService: PaymentService) { }

    @Post()
    async createPayment(@Body(ValidationPipe) dto: CreatePaymentDto) {
        return this.paymentService.createPayment(dto);
    }

    @Get(':id')
    async getPayment(@Param('id') id: string) {
        return this.paymentService.getPayment(id);
    }

    @Get('booking/:bookingId')
    async getPaymentByBooking(@Param('bookingId') bookingId: string) {
        return this.paymentService.getPaymentByBooking(bookingId);
    }

    @Post(':id/refund')
    async refundPayment(@Param('id') id: string, @Body() body: { amount?: number }) {
        return this.paymentService.refundPayment(id, body.amount);
    }
}
