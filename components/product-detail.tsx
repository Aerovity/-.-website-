"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react"
import ThreeDViewer from "@/components/three-d-viewer"

interface ProductDetailProps {
  productId: number
  onBack: () => void
}

const productData = {
  1: {
    name: "Samurai Spirit Tee",
    price: "¥8,900",
    description:
      "Embrace the way of the warrior with this premium cotton tee featuring an authentic samurai design. Crafted with attention to detail and Japanese aesthetics.",
    images: [
      "/placeholder.svg?height=600&width=600",
      "/placeholder.svg?height=600&width=600",
      "/placeholder.svg?height=600&width=600",
    ],
    sizes: { S: 12, M: 8, L: 15, XL: 6 },
  },
  2: {
    name: "Crow Shadow Hoodie",
    price: "¥12,500",
    description:
      "Stay warm in style with this premium hoodie featuring the iconic カラス crow design. Perfect for the modern urban samurai.",
    images: [
      "/placeholder.svg?height=600&width=600",
      "/placeholder.svg?height=600&width=600",
      "/placeholder.svg?height=600&width=600",
    ],
    sizes: { S: 5, M: 12, L: 9, XL: 3 },
  },
  3: {
    name: "Katana Strike Tank",
    price: "¥6,800",
    description:
      "Lightweight and breathable tank top with a striking katana design. Perfect for training or casual wear.",
    images: [
      "/placeholder.svg?height=600&width=600",
      "/placeholder.svg?height=600&width=600",
      "/placeholder.svg?height=600&width=600",
    ],
    sizes: { S: 20, M: 18, L: 14, XL: 8 },
  },
  4: {
    name: "Rising Sun Jacket",
    price: "¥18,900",
    description:
      "Premium bomber jacket with embroidered rising sun design. A statement piece for the discerning fashion enthusiast.",
    images: [
      "/placeholder.svg?height=600&width=600",
      "/placeholder.svg?height=600&width=600",
      "/placeholder.svg?height=600&width=600",
    ],
    sizes: { S: 3, M: 7, L: 5, XL: 2 },
  },
  5: {
    name: "Oni Mask Sweatshirt",
    price: "¥11,200",
    description:
      "Comfortable sweatshirt featuring a traditional oni mask design. Blend tradition with modern streetwear.",
    images: [
      "/placeholder.svg?height=600&width=600",
      "/placeholder.svg?height=600&width=600",
      "/placeholder.svg?height=600&width=600",
    ],
    sizes: { S: 8, M: 15, L: 11, XL: 4 },
  },
}

export default function ProductDetail({ productId, onBack }: ProductDetailProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [selectedSize, setSelectedSize] = useState<string>("")
  const [showThreeD, setShowThreeD] = useState(false)

  const product = productData[productId as keyof typeof productData]

  if (!product) return null

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % product.images.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length)
  }

  return (
    <div className="min-h-screen pt-20 pb-10">
      <div className="container mx-auto px-4">
        {/* Back Button */}
        <Button variant="ghost" onClick={onBack} className="mb-8 text-white hover:bg-gray-800">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Collection
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            {showThreeD ? (
              <div className="relative">
                <ThreeDViewer productName={product.name} />
                <Button
                  onClick={() => setShowThreeD(false)}
                  className="absolute top-4 right-4 bg-black/50 hover:bg-black/70"
                >
                  Back to Images
                </Button>
              </div>
            ) : (
              <>
                <div className="relative">
                  <Image
                    src={product.images[currentImageIndex] || "/placeholder.svg"}
                    alt={`${product.name} - Image ${currentImageIndex + 1}`}
                    width={600}
                    height={600}
                    className="w-full h-96 lg:h-[500px] object-cover rounded-lg"
                  />

                  {/* Navigation Arrows */}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </Button>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </Button>
                </div>

                {/* Thumbnail Images */}
                <div className="flex space-x-2">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`relative w-20 h-20 rounded-md overflow-hidden border-2 ${
                        currentImageIndex === index ? "border-white" : "border-gray-600"
                      }`}
                    >
                      <Image
                        src={image || "/placeholder.svg"}
                        alt={`Thumbnail ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>

                {/* 3D View Button */}
                <Button onClick={() => setShowThreeD(true)} className="w-full bg-gray-800 hover:bg-gray-700 text-white">
                  View in 3D
                </Button>
              </>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">{product.name}</h1>
              <p className="text-3xl font-bold text-white">{product.price}</p>
            </div>

            <p className="text-gray-300 text-lg leading-relaxed">{product.description}</p>

            {/* Size Selection */}
            <div>
              <h3 className="text-xl font-semibold text-white mb-4">Select Size</h3>
              <div className="grid grid-cols-4 gap-3">
                {Object.entries(product.sizes).map(([size, stock]) => (
                  <Button
                    key={size}
                    variant={selectedSize === size ? "default" : "outline"}
                    onClick={() => setSelectedSize(size)}
                    disabled={stock === 0}
                    className={`h-12 ${
                      selectedSize === size ? "bg-white text-black" : "border-gray-600 text-white hover:bg-gray-800"
                    } ${stock === 0 ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    <div className="text-center">
                      <div className="font-semibold">{size}</div>
                      <div className="text-xs">{stock} left</div>
                    </div>
                  </Button>
                ))}
              </div>
            </div>

            {/* Stock Info */}
            <Card className="bg-gray-900 border-gray-700">
              <CardContent className="p-4">
                <h4 className="text-white font-semibold mb-2">Stock Availability</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {Object.entries(product.sizes).map(([size, stock]) => (
                    <div key={size} className="flex justify-between text-gray-300">
                      <span>Size {size}:</span>
                      <span className={stock > 5 ? "text-green-400" : stock > 0 ? "text-yellow-400" : "text-red-400"}>
                        {stock} available
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Order Button */}
            <Button
              size="lg"
              disabled={!selectedSize}
              className="w-full bg-white text-black hover:bg-gray-200 text-lg py-6"
            >
              {selectedSize ? `Add to Cart - ${product.price}` : "Select a Size"}
            </Button>

            {/* Product Details */}
            <div className="space-y-4 pt-6 border-t border-gray-800">
              <div>
                <h4 className="text-white font-semibold mb-2">Material</h4>
                <p className="text-gray-300">100% Premium Cotton</p>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-2">Care Instructions</h4>
                <p className="text-gray-300">Machine wash cold, tumble dry low</p>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-2">Origin</h4>
                <p className="text-gray-300">Designed in Japan</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
