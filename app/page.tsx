"use client"

import { useState } from "react"
import Header from "@/components/header"
import HeroSection from "@/components/hero-section"
import ProductGrid from "@/components/product-grid"
import ProductDetail from "@/components/product-detail"
import AuthModal from "@/components/auth-modal"
import Footer from "@/components/footer"

export default function HomePage() {
  const [selectedProduct, setSelectedProduct] = useState<number | null>(null)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authMode, setAuthMode] = useState<"login" | "register">("login")
  const [language, setLanguage] = useState<"en" | "fr">("en")

  const handleProductClick = (productId: number) => {
    setSelectedProduct(productId)
  }

  const handleBackToGrid = () => {
    setSelectedProduct(null)
  }

  const handleAuthClick = (mode: "login" | "register") => {
    setAuthMode(mode)
    setShowAuthModal(true)
  }

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === "en" ? "fr" : "en"))
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Header onAuthClick={handleAuthClick} language={language} toggleLanguage={toggleLanguage} />

      {selectedProduct ? (
        <ProductDetail productId={selectedProduct} onBack={handleBackToGrid} language={language} />
      ) : (
        <>
          <HeroSection onAuthClick={handleAuthClick} language={language} />
          <ProductGrid onProductClick={handleProductClick} language={language} />
        </>
      )}

      <Footer language={language} />
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        mode={authMode}
        onModeChange={setAuthMode}
      />
    </div>
  )
}
