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
            metadata: {
                cartItems: JSON.stringify(items),
            }
        });

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

            // 1. Odkodowujemy przemycony koszyk z metadanych
            const cartItems = session.metadata?.cartItems ? JSON.parse(session.metadata.cartItems) : [];

            // 2. Wyciągamy same ID produktów z koszyka
            const productIds = cartItems.map((item: any) => item.productId);

            // 3. Pobieramy obecne dane tych produktów z bazy, aby zachować je w historii
            const productsFromDb = await this.prisma.product.findMany({
                where: { id: { in: productIds } },
            });

            // 4. Parujemy koszyk z danymi z bazy
            const orderItemsData = cartItems.map((cartItem: any) => {
                const product = productsFromDb.find(p => p.id === cartItem.productId);

                return {
                    productId: cartItem.productId,
                    quantity: cartItem.quantity,
                    // Zapisujemy "migawkę" historyczną:
                    nameAtPurchase: product?.name || 'Produkt usunięty/Nieznany',
                    priceAtPurchase: product?.price || 0,
                };
            });

            // 5. ZAPIS RELACYJNY DO BAZY DANYCH
            const newOrder = await this.prisma.order.create({
                data: {
                    stripeSessionId: session.id,
                    customerEmail: session.customer_details?.email || 'brak-emaila@sklep.pl',
                    totalAmount: session.amount_total, // Dopasowane do Twojego schematu (totalAmount)
                    status: 'PAID', // Dopasowane do Twojego Enuma

                    // Zapisujemy powiązane pozycje zamówienia
                    items: {
                        create: orderItemsData,
                    },
                },
                include: {
                    items: true,
                }
            });

            console.log('-------------------------------------------');
            console.log(`✅ ZAMÓWIENIE ZAPISANE PERFEKCYJNIE!`);
            console.log(`🆔 ID Zamówienia: ${newOrder.id}`);
            console.log(`💵 Wartość całkowita: ${newOrder.totalAmount / 100} PLN`);
            console.log(`📦 Zapisanych pozycji (OrderItem): ${newOrder.items.length}`);
            console.log('-------------------------------------------');
        }

        return { received: true };
    }
}