import { Product } from '@/types/product';
import AddToCartForm from '@/components/AddToCartForm';

async function getProduct(id: string): Promise<Product> {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${id}`, {
        cache: 'no-store',
    });

    if (!res.ok) throw new Error('Nie udało się pobrać produktu');
    return res.json();
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = await params;

    const product = await getProduct(resolvedParams.id);

    return (
        <main className="container mx-auto px-4 py-12 max-w-5xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">

                <div className="bg-gray-50 rounded-3xl p-8 flex items-center justify-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={product.image}
                        alt={product.name}
                        className="w-full max-w-md object-contain rounded-2xl shadow-sm"
                    />
                </div>

                <div className="flex flex-col justify-center">
                    <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
                        {product.name}
                    </h1>
                    <p className="text-lg text-gray-600 leading-relaxed mb-8">
                        {product.description || 'Ten produkt nie posiada jeszcze opisu.'}
                    </p>

                    <AddToCartForm variants={product.variants} />

                </div>
            </div>
        </main>
    );
}