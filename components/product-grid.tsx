"use client"

import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"

interface ProductGridProps {
  onProductClick: (productId: number) => void
  language: "en" | "fr"
}

const products = [
  {
    id: 1,
    name: "Samurai Spirit Tee",
    price: "¥8,900",
    image: "/placeholder.svg?height=400&width=400",
  },
  {
    id: 2,
    name: "Crow Shadow Hoodie",
    price: "¥12,500",
    image: "/placeholder.svg?height=400&width=400",
  },
  {
    id: 3,
    name: "Katana Strike Tank",
    price: "¥6,800",
    image: "/placeholder.svg?height=400&width=400",
  },
  {
    id: 4,
    name: "Rising Sun Jacket",
    price: "¥18,900",
    image: "/placeholder.svg?height=400&width=400",
  },
  {
    id: 5,
    name: "Oni Mask Sweatshirt",
    price: "¥11,200",
    image: "/placeholder.svg?height=400&width=400",
  },
]

export default function ProductGrid({ onProductClick, language }: ProductGridProps) {
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
          {products.map((product) => (
            <Card
              key={product.id}
              className="bg-gray-900 border-gray-800 hover:border-gray-600 transition-all duration-300 cursor-pointer group"
              onClick={() => onProductClick(product.id)}
            >
              <CardContent className="p-0">
                <div className="relative overflow-hidden">
                  <Image
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    width={400}
                    height={400}
                    className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300" />
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-semibold text-white mb-2">{product.name}</h3>
                  <p className="text-2xl font-bold text-white">{product.price}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
