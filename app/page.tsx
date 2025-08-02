"use client"

import { useState } from "react"
import Header from "@/components/header"
import HeroSection from "@/components/hero-section"
import ProductGrid from "@/components/product-grid"
import Footer from "@/components/footer"

export default function HomePage() {
  const [language, setLanguage] = useState<"en" | "fr">("en")

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === "en" ? "fr" : "en"))
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Header language={language} toggleLanguage={toggleLanguage} />
      <HeroSection language={language} />
      <ProductGrid language={language} />
      <Footer language={language} />
    </div>
  )
}
