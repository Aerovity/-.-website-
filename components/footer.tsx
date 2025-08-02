"use client"

import Image from "next/image"
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from "lucide-react"

interface FooterProps {
  language: "en" | "fr"
}

export default function Footer({ language }: FooterProps) {
  const content = {
    en: {
      about: "About カラス.",
      aboutText: "Premium Japanese-inspired streetwear that blends traditional aesthetics with modern urban style.",
      quickLinks: "Quick Links",
      collection: "Collection",
      about: "About",
      contact: "Contact",
      shipping: "Shipping Info",
      returns: "Returns",
      sizeGuide: "Size Guide",
      followUs: "Follow Us",
      newsletter: "Newsletter",
      newsletterText: "Subscribe to get updates on new releases and exclusive offers",
      subscribe: "Subscribe",
      contact: "Contact Info",
      email: "info@karasu.com",
      phone: "+81 3-1234-5678",
      address: "Tokyo, Japan",
      copyright: "© 2024 カラス. All rights reserved.",
      privacy: "Privacy Policy",
      terms: "Terms of Service",
    },
    fr: {
      about: "À propos de カラス.",
      aboutText:
        "Streetwear premium d'inspiration japonaise qui mélange l'esthétique traditionnelle avec le style urbain moderne.",
      quickLinks: "Liens Rapides",
      collection: "Collection",
      about: "À propos",
      contact: "Contact",
      shipping: "Info Livraison",
      returns: "Retours",
      sizeGuide: "Guide des Tailles",
      followUs: "Suivez-nous",
      newsletter: "Newsletter",
      newsletterText: "Abonnez-vous pour recevoir les mises à jour sur les nouvelles sorties et offres exclusives",
      subscribe: "S'abonner",
      contact: "Informations de Contact",
      email: "info@karasu.com",
      phone: "+81 3-1234-5678",
      address: "Tokyo, Japon",
      copyright: "© 2024 カラス. Tous droits réservés.",
      privacy: "Politique de Confidentialité",
      terms: "Conditions d'Utilisation",
    },
  }

  const t = content[language]

  return (
    <footer className="bg-black/80 backdrop-blur-md border-t border-gray-800 mt-20">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Image src="/images/new-crow-logo.png" alt="カラス. Logo" width={32} height={32} className="invert" />
              <span className="text-xl font-bold text-white">カラス.</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">{t.aboutText}</p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold text-lg">{t.quickLinks}</h3>
            <ul className="space-y-2">
              <li>
                <a href="#collection" className="text-gray-400 hover:text-white transition-colors">
                  {t.collection}
                </a>
              </li>
              <li>
                <a href="#about" className="text-gray-400 hover:text-white transition-colors">
                  {t.about}
                </a>
              </li>
              <li>
                <a href="#contact" className="text-gray-400 hover:text-white transition-colors">
                  {t.contact}
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  {t.shipping}
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  {t.returns}
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  {t.sizeGuide}
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold text-lg">{t.newsletter}</h3>
            <p className="text-gray-400 text-sm">{t.newsletterText}</p>
            <div className="flex">
              <input
                type="email"
                placeholder="Email"
                className="flex-1 bg-gray-800 border border-gray-700 rounded-l-md px-3 py-2 text-white text-sm focus:outline-none focus:border-gray-600"
              />
              <button className="bg-white text-black px-4 py-2 rounded-r-md hover:bg-gray-200 transition-colors text-sm font-medium">
                {t.subscribe}
              </button>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold text-lg">{t.contact}</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-gray-400">
                <Mail className="h-4 w-4" />
                <span className="text-sm">{t.email}</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-400">
                <Phone className="h-4 w-4" />
                <span className="text-sm">{t.phone}</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-400">
                <MapPin className="h-4 w-4" />
                <span className="text-sm">{t.address}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-sm">{t.copyright}</p>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                {t.privacy}
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                {t.terms}
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
