"use client"

import Image from "next/image"
import { ShoppingBag, Menu, User, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { createClient } from "@/utils/supabase/client"
import { type User as SupabaseUser } from "@supabase/supabase-js"

interface HeaderProps {
  language: "en" | "fr"
  toggleLanguage: () => void
}

export default function Header({ language, toggleLanguage }: HeaderProps) {
  const router = useRouter()
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()
    
    // Get initial session
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setUser(session?.user ?? null)
      setLoading(false)
    }

    getSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null)
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
  }

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

            {!loading && (
              <>
                {user ? (
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-white hover:bg-gray-800"
                      onClick={() => router.push("/account")}
                      title="Account"
                    >
                      <User className="h-5 w-5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-white hover:bg-gray-800"
                      onClick={handleSignOut}
                      title="Sign Out"
                    >
                      <LogOut className="h-5 w-5" />
                    </Button>
                  </div>
                ) : (
                  <Button
                    className="relative overflow-hidden bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 text-white border border-gray-600 px-6 py-2 transition-all duration-300"
                    onClick={() => router.push("/auth")}
                  >
                    <span className="relative z-10">{language === "en" ? "Get Started" : "Commencer"}</span>
                  </Button>
                )}
              </>
            )}

            <Button variant="ghost" size="icon" className="md:hidden text-white hover:bg-gray-800">
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
