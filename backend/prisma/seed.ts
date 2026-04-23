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
            name: 'Koszulka Programisty',
            description: 'Najlepsza koszulka do pisania w NestJS',
            image: 'https://via.placeholder.com/500',
            variants: {
                create: [
                    { name: 'Rozmiar S', price: 10000, stock: 50 },
                    { name: 'Rozmiar M', price: 12000, stock: 50 },
                    { name: 'Rozmiar L', price: 13000, stock: 50 }
                ]
            }
        },
        {
            name: 'Koszulka RUST',
            description: 'Koszulka programisty RUST',
            image: 'https://via.placeholder.com/500',
            variants: {
                create: [
                    { name: 'Rozmiar S', price: 10000, stock: 50 },
                    { name: 'Rozmiar M', price: 12000, stock: 50 },
                    { name: 'Rozmiar L', price: 13000, stock: 50 }
                ]
            }
        },
        {
            name: 'Koszulka Full Stack Developer',
            description: 'Pochwal sie ze jestes Full Stackiem',
            image: 'https://via.placeholder.com/500',
            variants: {
                create: [
                    { name: 'Rozmiar S', price: 10000, stock: 50 },
                    { name: 'Rozmiar M', price: 12000, stock: 50 },
                    { name: 'Rozmiar L', price: 13000, stock: 50 }
                ]
            }
        },
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