import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import 'dotenv/config'; // Gwarantuje, że skrypt widzi zmienne z pliku .env

// W Prisma 7 musimy jawnie utworzyć adapter z naszym linkiem do bazy
const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL!
});

// I przekazać go do klienta
const prisma = new PrismaClient({ adapter });

async function main() {
    console.log('🌱 Rozpoczynam zasilanie bazy danych...');

    // Opcjonalne czyszczenie:
    // await prisma.product.deleteMany();

    const products = [
        {
            name: 'Koszulka TypeScript',
            description: 'Wysokiej jakości bawełniana koszulka z logo TS',
            price: 9900,
        },
        {
            name: 'Kubek Programisty (NestJS)',
            description: 'Zwiększa produktywność o 200%',
            price: 4500,
        },
        {
            name: 'Zestaw naklejek Prisma',
            description: '5 holograficznych naklejek',
            price: 1500,
        }
    ];

    for (const productData of products) {
        const product = await prisma.product.create({
            data: productData,
        });
        console.log(`✅ Dodano produkt: ${product.name}`);
    }

    console.log('🎉 Zasilanie zakończone sukcesem!');
}

main()
    .catch((e) => {
        console.error('❌ Wystąpił błąd:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });