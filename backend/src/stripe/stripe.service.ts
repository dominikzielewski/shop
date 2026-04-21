import 'dotenv/config';
import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import Stripe from 'stripe';
import { CheckoutItemDto } from './dto/checkout-item.dto';

@Injectable()
export class StripeService {
    private stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
        apiVersion: '2026-03-25.dahlia',
    });

    constructor(private prisma: PrismaService) {}

    async createCheckoutSession(items: CheckoutItemDto[]) {    const lineItems: any[] = [];

        for (const item of items) {
            const product = await this.prisma.product.findUnique({
                where: { id: item.productId },
            });

            if (!product) {
                throw new BadRequestException(`Produkt o ID ${item.productId} nie istnieje.`);
            }

            lineItems.push({
                price_data: {
                    currency: 'pln',
                    product_data: {
                        name: product.name,
                        description: product.description || undefined,
                    },
                    unit_amount: product.price,
                },
                quantity: item.quantity,
            });
        }

        const session = await this.stripe.checkout.sessions.create({
            payment_method_types: ['card', 'blik', 'p24'],
            line_items: lineItems,
            mode: 'payment',
            success_url: 'http://localhost:3000/success?session_id={CHECKOUT_SESSION_ID}',
            cancel_url: 'http://localhost:3000/cart',
        });

        return { url: session.url };
    }
}