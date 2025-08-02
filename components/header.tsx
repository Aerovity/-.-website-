"use client"

import Image from "next/image"
import { ShoppingBag, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

interface HeaderProps {
  language: "en" | "fr"
  toggleLanguage: () => void
}

export default function Header({ language, toggleLanguage }: HeaderProps) {
  const router = useRouter()

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-gray-800">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Brand - Clickable */}
          <button
            onClick={() => document.getElementById("home")?.scrollIntoView({ behavior: "smooth" })}
            className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
          >
            <Image src="/images/new-crow-logo.png" alt="カラス. Logo" width={40} height={40} className="invert" />
            <span className="text-2xl font-bold text-white">カラス.</span>
          </button>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#home" className="text-gray-300 hover:text-white transition-colors">
              Home
            </a>
            <a href="#collection" className="text-gray-300 hover:text-white transition-colors">
              Collection
            </a>
            <a href="#about" className="text-gray-300 hover:text-white transition-colors">
              About
            </a>
            <a href="#contact" className="text-gray-300 hover:text-white transition-colors">
              Contact
            </a>
            <button onClick={toggleLanguage} className="text-gray-300 hover:text-white transition-colors underline">
              {language === "en" ? "FR" : "EN"}
            </button>
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" className="text-white hover:bg-gray-800">
              <ShoppingBag className="h-5 w-5" />
            </Button>

            <Button
              className="relative overflow-hidden bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 text-white border border-gray-600 px-6 py-2 transition-all duration-300"
              onClick={() => router.push("/auth")}
            >
              <span className="relative z-10">{language === "en" ? "Get Started" : "Commencer"}</span>
            </Button>

            <Button variant="ghost" size="icon" className="md:hidden text-white hover:bg-gray-800">
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
