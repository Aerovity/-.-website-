"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

interface SpotlightButtonProps {
  onAuthClick: (mode: "login" | "register") => void
  language: "en" | "fr"
}

export default function SpotlightButton({ onAuthClick, language }: SpotlightButtonProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [showOptions, setShowOptions] = useState(false)

  return (
    <div className="relative">
      <Button
        className="relative overflow-hidden bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 text-white border border-gray-600 px-6 py-2 transition-all duration-300"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => setShowOptions(!showOptions)}
      >
        <span className="relative z-10">{language === "en" ? "Get Started Now" : "Commencer Maintenant"}</span>

        {/* Spotlight effect */}
        <div
          className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 transition-transform duration-700 ${
            isHovered ? "translate-x-full" : "-translate-x-full"
          }`}
        />
      </Button>

      {/* Dropdown Options */}
      {showOptions && (
        <div className="absolute top-full mt-2 right-0 bg-gray-900 border border-gray-700 rounded-lg shadow-xl z-50 min-w-[120px]">
          <Button
            variant="ghost"
            className="w-full text-left justify-start text-white hover:bg-gray-800 rounded-t-lg"
            onClick={() => {
              onAuthClick("login")
              setShowOptions(false)
            }}
          >
            {language === "en" ? "Login" : "Connexion"}
          </Button>
          <Button
            variant="ghost"
            className="w-full text-left justify-start text-white hover:bg-gray-800 rounded-b-lg"
            onClick={() => {
              onAuthClick("register")
              setShowOptions(false)
            }}
          >
            {language === "en" ? "Register" : "S'inscrire"}
          </Button>
        </div>
      )}
    </div>
  )
}
