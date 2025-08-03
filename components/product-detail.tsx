"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react"
import ThreeDViewer from "@/components/three-d-viewer"
import { getProductWithDetails, formatPrice, getImageUrl } from "@/lib/products"
import { ProductWithDetails } from "@/lib/types"

interface ProductDetailProps {
  productId: string
  onBack: () => void
  language: "en" | "fr"
}

export default function ProductDetail({ productId, onBack, language }: ProductDetailProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [selectedSize, setSelectedSize] = useState<string>("")
  const [showThreeD, setShowThreeD] = useState(false)
  const [product, setProduct] = useState<ProductWithDetails | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchProduct() {
      try {
        const productData = await getProductWithDetails(productId)
        setProduct(productData)
      } catch (error) {
        console.error('Error fetching product:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [productId])

  if (loading) {
    return (
      <div className="min-h-screen pt-20 pb-10">
        <div className="container mx-auto px-4">
          <Button variant="ghost" onClick={onBack} className="mb-8 text-white hover:bg-gray-800">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {language === "en" ? "Back to Collection" : "Retour à la Collection"}
          </Button>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-4">
              <div className="w-full h-96 lg:h-[500px] bg-gray-800 animate-pulse rounded-lg" />
              <div className="flex space-x-2">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="w-20 h-20 bg-gray-800 animate-pulse rounded-md" />
                ))}
              </div>
            </div>
            <div className="space-y-6">
              <div>
                <div className="h-8 bg-gray-800 animate-pulse rounded mb-2" />
                <div className="h-10 bg-gray-800 animate-pulse rounded" />
              </div>
              <div className="h-24 bg-gray-800 animate-pulse rounded" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen pt-20 pb-10">
        <div className="container mx-auto px-4">
          <Button variant="ghost" onClick={onBack} className="mb-8 text-white hover:bg-gray-800">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {language === "en" ? "Back to Collection" : "Retour à la Collection"}
          </Button>
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg">
              {language === "en" ? "Product not found." : "Produit introuvable."}
            </p>
          </div>
        </div>
      </div>
    )
  }



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
      noImages: "No images available",
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
      noImages: "Aucune image disponible",
    },
  }

  const t = content[language]

  // Create a map of sizes for easier access
  const sizeMap = product.sizes.reduce((acc, size) => {
    acc[size.size] = size.stock_quantity
    return acc
  }, {} as Record<string, number>)

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
                <ThreeDViewer 
                  productName={product.name} 
                  modelUrl={product.models.length > 0 ? product.models[0].model_url : undefined}
                />
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
                  {product.images.length > 0 ? (
                    <div className="relative w-full h-96 lg:h-[500px] rounded-lg overflow-hidden">
                      <Image
                        src={getImageUrl(product.images[currentImageIndex]?.image_url) || "/placeholder.svg"}
                        alt={`${product.name} - Image ${currentImageIndex + 1}`}
                        fill
                        className="object-contain bg-gray-900"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                    </div>
                  ) : (
                    <div className="w-full h-96 lg:h-[500px] bg-gray-800 rounded-lg flex items-center justify-center">
                      <p className="text-gray-400">{t.noImages}</p>
                    </div>
                  )}

                  {/* Navigation Arrows */}
                  {product.images.length > 1 && (
                    <>
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
                    </>
                  )}
                </div>

                {/* Thumbnail Images */}
                {product.images.length > 0 && (
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
                          src={getImageUrl(image.image_url) || "/placeholder.svg"}
                          alt={`Thumbnail ${index + 1}`}
                          fill
                          className="object-cover"
                          sizes="80px"
                        />
                      </button>
                    ))}
                  </div>
                )}

                {/* 3D View Button */}
                {product.models.length > 0 && (
                  <Button onClick={() => setShowThreeD(true)} className="w-full bg-gray-800 hover:bg-gray-700 text-white">
                    {t.viewIn3D}
                  </Button>
                )}
              </>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">{product.name}</h1>
              <div className="flex items-center gap-4 mb-4">
                {product.category && (
                  <span className="text-sm text-gray-400 bg-gray-800 px-3 py-1 rounded-full">
                    {product.category}
                  </span>
                )}
                {product.brand && (
                  <span className="text-sm text-gray-400 bg-gray-800 px-3 py-1 rounded-full">
                    {product.brand}
                  </span>
                )}
              </div>
              <p className="text-3xl font-bold text-white">{formatPrice(product.price, product.currency)}</p>
            </div>

            {product.description && (
              <p className="text-gray-300 text-lg leading-relaxed">{product.description}</p>
            )}

            {/* Size Selection */}
            {product.sizes.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">{t.selectSize}</h3>
                <div className="grid grid-cols-4 gap-3">
                  {product.sizes.map((size) => (
                    <Button
                      key={size.id}
                      variant={selectedSize === size.size ? "default" : "outline"}
                      onClick={() => setSelectedSize(size.size)}
                      disabled={size.stock_quantity === 0}
                      className={`h-12 ${
                        selectedSize === size.size ? "bg-white text-black" : "border-gray-600 text-white hover:bg-gray-800"
                      } ${size.stock_quantity === 0 ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                      <div className="text-center">
                        <div className="font-semibold">{size.size}</div>
                        <div className="text-xs">
                          {size.stock_quantity} {t.left}
                        </div>
                      </div>
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Stock Info */}
            {product.sizes.length > 0 && (
              <Card className="bg-gray-900 border-gray-700">
                <CardContent className="p-4">
                  <h4 className="text-white font-semibold mb-2">{t.stockAvailability}</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    {product.sizes.map((size) => (
                      <div key={size.id} className="flex justify-between text-gray-300">
                        <span>Size {size.size}:</span>
                        <span className={size.stock_quantity > 5 ? "text-green-400" : size.stock_quantity > 0 ? "text-yellow-400" : "text-red-400"}>
                          {size.stock_quantity} {t.available}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Order Button */}
            <Button
              size="lg"
              disabled={!selectedSize || product.sizes.length === 0}
              className="w-full bg-white text-black hover:bg-gray-200 text-lg py-6"
            >
              {selectedSize ? `${t.addToCart} - ${formatPrice(product.price, product.currency)}` : t.selectASize}
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
