import { Controller, Post, Body, Headers, Req, BadRequestException } from '@nestjs/common';

import type { RawBodyRequest } from '@nestjs/common';
import type { Request } from 'express';

import { StripeService } from './stripe.service';
import { CreateCheckoutDto } from './dto/create-checkout.dto';

@Controller('stripe')
export class StripeController {
    constructor(private readonly stripeService: StripeService) {}

    @Post('checkout')
    createCheckout(@Body() createCheckoutDto: CreateCheckoutDto) {
        return this.stripeService.createCheckoutSession(createCheckoutDto.items);
    }

    @Post('webhook')
    handleWebhook(
        @Headers('stripe-signature') signature: string,
        @Req() req: RawBodyRequest<Request>,
    ) {
        if (!signature) {
            throw new BadRequestException('Brak podpisu Stripe');
        }

        if (!req.rawBody) {
            throw new BadRequestException('Brak surowych danych (raw body)');
        }

        return this.stripeService.handleWebhook(signature, req.rawBody);
    }
}