"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { getProducts, getPrimaryImage, formatPrice } from "@/lib/products"
import { ProductWithDetails } from "@/lib/types"

interface ProductGridProps {
  language: "en" | "fr"
}

export default function ProductGrid({ language }: ProductGridProps) {
  const [products, setProducts] = useState<ProductWithDetails[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchProducts() {
      try {
        const productsData = await getProducts()
        setProducts(productsData)
      } catch (error) {
        console.error('Error fetching products:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  if (loading) {
    return (
      <section id="collection" className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              {language === "en" ? "Our Collection" : "Notre Collection"}
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              {language === "en"
                ? "Discover our limited edition Japanese-inspired streetwear designs"
                : "Découvrez nos designs streetwear d'inspiration japonaise en édition limitée"}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="bg-black border-gray-800 animate-pulse">
                <CardContent className="p-0">
                  <div className="w-full h-80 bg-gray-900" />
                  <div className="p-6">
                    <div className="h-6 bg-gray-900 rounded mb-2" />
                    <div className="h-8 bg-gray-900 rounded" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="collection" className="py-20 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            {language === "en" ? "Our Collection" : "Notre Collection"}
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            {language === "en"
              ? "Discover our limited edition Japanese-inspired streetwear designs"
              : "Découvrez nos designs streetwear d'inspiration japonaise en édition limitée"}
          </p>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg">
              {language === "en" ? "No products available at the moment." : "Aucun produit disponible pour le moment."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {products.map((product) => (
              <Link key={product.id} href={`/${product.id}`}>
                <Card className="bg-black border-gray-800 hover:border-gray-600 transition-all duration-300 cursor-pointer group">
                  <CardContent className="p-0">
                    <div className="relative overflow-hidden">
                      <Image
                        src={getPrimaryImage(product.images || [])}
                        alt={product.name}
                        width={400}
                        height={400}
                        className="w-full h-96 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>

                    <div className="p-6">
                      <h3 className="text-xl font-semibold text-white mb-2">{product.name}</h3>
                      <div className="flex items-center justify-between mb-2">
                        {product.category && (
                          <span className="text-sm text-gray-400 bg-gray-900 px-2 py-1 rounded">
                            {product.category}
                          </span>
                        )}
                        {product.brand && (
                          <span className="text-sm text-gray-400 bg-gray-900 px-2 py-1 rounded">
                            {product.brand}
                          </span>
                        )}
                      </div>
                      <p className="text-2xl font-bold text-white">{formatPrice(product.price, product.currency)}</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
