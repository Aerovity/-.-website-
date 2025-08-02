"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import SpotlightButton from "@/components/spotlight-button"

interface HeroSectionProps {
  onAuthClick: (mode: "login" | "register") => void
  language: "en" | "fr"
}

export default function HeroSection({ onAuthClick, language }: HeroSectionProps) {
  return (
    <section id="home" className="relative min-h-screen flex items-end justify-center overflow-hidden pb-32">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image src="/images/hero.png" alt="Samurai Hero" fill className="object-cover object-center" priority />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto mb-20">
        <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-2xl mx-auto">
          {language === "en"
            ? "Embrace the spirit of the samurai with our exclusive Japanese-inspired streetwear collection"
            : "Embrassez l'esprit du samouraï avec notre collection exclusive de streetwear d'inspiration japonaise"}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button
            size="lg"
            className="bg-white text-black hover:bg-gray-200 px-8 py-3 text-lg"
            onClick={() => document.getElementById("collection")?.scrollIntoView({ behavior: "smooth" })}
          >
            {language === "en" ? "Explore Collection" : "Explorer la Collection"}
          </Button>

          <SpotlightButton onAuthClick={onAuthClick} language={language} />
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse" />
        </div>
      </div>
    </section>
  )
}
