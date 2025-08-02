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
  language: "en" | "fr"
}

const productData = {
  1: {
    name: "Samurai Spirit Tee",
    price: "¥8,900",
    description: {
      en: "Embrace the way of the warrior with this premium cotton tee featuring an authentic samurai design. Crafted with attention to detail and Japanese aesthetics.",
      fr: "Embrassez la voie du guerrier avec ce t-shirt en coton premium présentant un design de samouraï authentique. Conçu avec attention aux détails et à l'esthétique japonaise.",
    },
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
    description: {
      en: "Stay warm in style with this premium hoodie featuring the iconic カラス crow design. Perfect for the modern urban samurai.",
      fr: "Restez au chaud avec style avec ce sweat à capuche premium présentant le design emblématique du corbeau カラス. Parfait pour le samouraï urbain moderne.",
    },
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
    description: {
      en: "Lightweight and breathable tank top with a striking katana design. Perfect for training or casual wear.",
      fr: "Débardeur léger et respirant avec un design katana saisissant. Parfait pour l'entraînement ou le port décontracté.",
    },
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
    description: {
      en: "Premium bomber jacket with embroidered rising sun design. A statement piece for the discerning fashion enthusiast.",
      fr: "Veste bomber premium avec design de soleil levant brodé. Une pièce de déclaration pour l'amateur de mode exigeant.",
    },
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
    description: {
      en: "Comfortable sweatshirt featuring a traditional oni mask design. Blend tradition with modern streetwear.",
      fr: "Sweat-shirt confortable avec un design de masque oni traditionnel. Mélangez tradition et streetwear moderne.",
    },
    images: [
      "/placeholder.svg?height=600&width=600",
      "/placeholder.svg?height=600&width=600",
      "/placeholder.svg?height=600&width=600",
    ],
    sizes: { S: 8, M: 15, L: 11, XL: 4 },
  },
}

export default function ProductDetail({ productId, onBack, language }: ProductDetailProps) {
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

  const content = {
    en: {
      backToCollection: "Back to Collection",
      viewIn3D: "View in 3D",
      backToImages: "Back to Images",
      selectSize: "Select Size",
      stockAvailability: "Stock Availability",
      available: "available",
      addToCart: "Add to Cart",
      selectASize: "Select a Size",
      material: "Material",
      materialValue: "100% Premium Cotton",
      careInstructions: "Care Instructions",
      careValue: "Machine wash cold, tumble dry low",
      origin: "Origin",
      originValue: "Designed in Japan",
      left: "left",
    },
    fr: {
      backToCollection: "Retour à la Collection",
      viewIn3D: "Voir en 3D",
      backToImages: "Retour aux Images",
      selectSize: "Sélectionner la Taille",
      stockAvailability: "Disponibilité du Stock",
      available: "disponible",
      addToCart: "Ajouter au Panier",
      selectASize: "Sélectionner une Taille",
      material: "Matériau",
      materialValue: "100% Coton Premium",
      careInstructions: "Instructions d'Entretien",
      careValue: "Lavage en machine à froid, séchage en tambour à basse température",
      origin: "Origine",
      originValue: "Conçu au Japon",
      left: "restant",
    },
  }

  const t = content[language]

  return (
    <div className="min-h-screen pt-20 pb-10">
      <div className="container mx-auto px-4">
        {/* Back Button */}
        <Button variant="ghost" onClick={onBack} className="mb-8 text-white hover:bg-gray-800">
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t.backToCollection}
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
                  {t.backToImages}
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
                  {t.viewIn3D}
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

            <p className="text-gray-300 text-lg leading-relaxed">{product.description[language]}</p>

            {/* Size Selection */}
            <div>
              <h3 className="text-xl font-semibold text-white mb-4">{t.selectSize}</h3>
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
                      <div className="text-xs">
                        {stock} {t.left}
                      </div>
                    </div>
                  </Button>
                ))}
              </div>
            </div>

            {/* Stock Info */}
            <Card className="bg-gray-900 border-gray-700">
              <CardContent className="p-4">
                <h4 className="text-white font-semibold mb-2">{t.stockAvailability}</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {Object.entries(product.sizes).map(([size, stock]) => (
                    <div key={size} className="flex justify-between text-gray-300">
                      <span>Size {size}:</span>
                      <span className={stock > 5 ? "text-green-400" : stock > 0 ? "text-yellow-400" : "text-red-400"}>
                        {stock} {t.available}
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
              {selectedSize ? `${t.addToCart} - ${product.price}` : t.selectASize}
            </Button>

            {/* Product Details */}
            <div className="space-y-4 pt-6 border-t border-gray-800">
              <div>
                <h4 className="text-white font-semibold mb-2">{t.material}</h4>
                <p className="text-gray-300">{t.materialValue}</p>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-2">{t.careInstructions}</h4>
                <p className="text-gray-300">{t.careValue}</p>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-2">{t.origin}</h4>
                <p className="text-gray-300">{t.originValue}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
