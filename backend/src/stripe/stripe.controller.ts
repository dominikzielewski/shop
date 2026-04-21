import { Controller, Post, Body } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { CreateCheckoutDto } from './dto/create-checkout.dto';

@Controller('stripe')
export class StripeController {
  constructor(private readonly stripeService: StripeService) {}

  @Post('checkout')
  createCheckout(@Body() createCheckoutDto: CreateCheckoutDto) {
    return this.stripeService.createCheckoutSession(createCheckoutDto.items);
  }
}