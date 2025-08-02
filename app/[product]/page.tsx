"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Header from "@/components/header"
import ProductDetail from "@/components/product-detail"
import AuthModal from "@/components/auth-modal"
import Footer from "@/components/footer"

export default function ProductPage() {
  const params = useParams()
  const router = useRouter()
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authMode, setAuthMode] = useState<"login" | "register">("login")
  const [language, setLanguage] = useState<"en" | "fr">("en")

  const productId = Number.parseInt(params.product as string)

  const handleAuthClick = (mode: "login" | "register") => {
    setAuthMode(mode)
    setShowAuthModal(true)
  }

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === "en" ? "fr" : "en"))
  }

  const handleBackToGrid = () => {
    router.push("/")
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Header onAuthClick={handleAuthClick} language={language} toggleLanguage={toggleLanguage} />
      <ProductDetail productId={productId} onBack={handleBackToGrid} language={language} />
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
