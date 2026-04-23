'use client'; // Mówimy Next.js: To działa w przeglądarce, może używać useState!

import { useState } from 'react';
import { ProductVariant } from '@/types/product';

interface AddToCartFormProps {
    variants: ProductVariant[];
}

export default function AddToCartForm({ variants }: AddToCartFormProps) {
    const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
        variants.length > 0 ? variants[0] : null
    );

    const handleAddToCart = () => {
        if (!selectedVariant) return;

        console.log('Dodano do koszyka wariant:', selectedVariant.id);
        alert(`Dodano do koszyka: Wariant ${selectedVariant.name}`);
    };

    if (variants.length === 0) {
        return <p className="text-red-500 font-bold mt-6">Produkt chwilowo niedostępny</p>;
    }

    return (
        <div className="mt-8">
            <h3 className="text-sm font-medium text-gray-900 mb-4">Wybierz wariant:</h3>

            <div className="grid grid-cols-3 gap-3 mb-8">
                {variants.map((variant) => (
                    <button
                        key={variant.id}
                        onClick={() => setSelectedVariant(variant)}
                        className={`border rounded-lg py-3 px-4 text-sm font-medium transition-colors ${
                            selectedVariant?.id === variant.id
                                ? 'border-blue-600 bg-blue-50 text-blue-700'
                                : 'border-gray-200 text-gray-900 hover:bg-gray-50'
                        }`}
                    >
                        {variant.name}
                    </button>
                ))}
            </div>

            <div className="flex items-center justify-between mb-8">
        <span className="text-3xl font-extrabold text-gray-900">
            {selectedVariant ? (selectedVariant.price / 100).toFixed(2) : '0.00'} PLN
        </span>
                {selectedVariant && selectedVariant.stock < 5 && (
                    <span className="text-sm text-orange-500 font-medium">
                Zostało tylko {selectedVariant.stock} szt.
            </span>
                )}
                </div>

                <button
                    onClick={handleAddToCart}
                    className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition duration-200 shadow-lg shadow-blue-200"
                >
                    Dodaj do koszyka
                </button>
        </div>
    );
}