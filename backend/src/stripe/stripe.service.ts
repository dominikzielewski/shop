import 'dotenv/config';
import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import Stripe from 'stripe';
import {CreateCheckoutDto} from "./dto/create-checkout.dto";

@Injectable()
export class StripeService {
    private stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
        apiVersion: '2026-03-25.dahlia',
    });

    constructor(private prisma: PrismaService) {}

    async createCheckoutSession(dto: CreateCheckoutDto) {
        const { items, ...customerData } = dto;
        const lineItems: any[] = [];
        const orderItemsData = [];
        let totalAmount = 0;

        for (const item of items) {
            const variant = await this.prisma.productVariant.findUnique({
                where: { id: item.variantId },
                include: { product: true },
            });

            if (!variant) throw new BadRequestException(`Wariant o ID ${item.variantId} nie istnieje.`);

            const fullName = `${variant.product.name} - ${variant.name}`;

            lineItems.push({
                price_data: {
                    currency: 'pln',
                    product_data: { name: fullName },
                    unit_amount: variant.price,
                },
                quantity: item.quantity,
            });

            // @ts-ignore
            orderItemsData.push({
                productVariantId: variant.id,
                quantity: item.quantity,
                nameAtPurchase: fullName,
                priceAtPurchase: variant.price,
            });

            totalAmount += variant.price * item.quantity;
        }

        const session = await this.stripe.checkout.sessions.create({
            payment_method_types: ['card', 'blik', 'p24'],
            line_items: lineItems,
            mode: 'payment',
            customer_email: customerData.email,
            success_url: 'http://localhost:3000/success?session_id={CHECKOUT_SESSION_ID}',
            cancel_url: 'http://localhost:3000/cart',
        });

        await this.prisma.order.create({
            data: {
                stripeSessionId: session.id,
                totalAmount: totalAmount,
                paymentStatus: 'PENDING',
                shippedStatus: false,

                email: customerData.email,
                firstName: customerData.firstName,
                lastName: customerData.lastName,
                phone: customerData.phone,
                country: customerData.country,
                city: customerData.city,
                postalCode: customerData.postalCode,
                address: customerData.address,

                items: {
                    create: orderItemsData,
                },
            },
        });

        console.log('-------------------------------------------');
        console.log(`✅ PŁATNOŚĆ UTWORZONA (OCZEKUJE NA PLATNOSC)!`);
        console.log(`🆔 ID Zamówienia: ${session.id}`);
        console.log(`👤 Klient: ${customerData.firstName} ${customerData.lastName}`);
        console.log('-------------------------------------------');

        return { url: session.url };
    }

    async handleWebhook(signature: string, payload: Buffer) {
        let event;

        try {
            event = this.stripe.webhooks.constructEvent(
                payload,
                signature,
                process.env.STRIPE_WEBHOOK_SECRET!
            );
        } catch (err) {
            console.error(`❌ Błąd podpisu Webhooka:`, err.message);
            throw new BadRequestException(`Webhook Error: ${err.message}`);
        }

        if (event.type === 'checkout.session.completed') {
            const session = event.data.object as any;

            const updatedOrder = await this.prisma.order.update({
                where: {
                    stripeSessionId: session.id
                },
                data: {
                    paymentStatus: 'PAID'
                },
            });

            console.log('-------------------------------------------');
            console.log(`✅ PŁATNOŚĆ ZAKSIĘGOWANA!`);
            console.log(`🆔 ID Zamówienia: ${updatedOrder.id}`);
            console.log(`👤 Klient: ${updatedOrder.firstName} ${updatedOrder.lastName}`);
            console.log('-------------------------------------------');
        }

        return { received: true };
    }
}