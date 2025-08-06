"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Trash2, Minus, Plus, ArrowLeft, ShoppingBag } from "lucide-react"
import { createClient } from "@/utils/supabase/client"
import { type User as SupabaseUser } from "@supabase/supabase-js"
import { CartItem } from "@/lib/types"
import { getCartItems, updateCartItemQuantity, removeFromCart, calculateCartTotal } from "@/lib/cart"
import { formatPrice, getImageUrl } from "@/lib/products"

export default function CartPage() {
  const router = useRouter()
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [updatingItems, setUpdatingItems] = useState<Set<string>>(new Set())

  useEffect(() => {
    const supabase = createClient()
    
    // Get initial session
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setUser(session?.user ?? null)
      setLoading(false)
      
      if (session?.user) {
        fetchCartItems(session.user.id)
      }
    }

    getSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null)
        setLoading(false)
        
        if (session?.user) {
          fetchCartItems(session.user.id)
        } else {
          setCartItems([])
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const fetchCartItems = async (userId: string) => {
    try {
      const items = await getCartItems(userId)
      setCartItems(items)
    } catch (error) {
      console.error('Error fetching cart items:', error)
    }
  }

  const handleQuantityChange = async (cartItemId: string, newQuantity: number) => {
    if (newQuantity <= 0) return

    setUpdatingItems(prev => new Set(prev).add(cartItemId))
    
    try {
      const result = await updateCartItemQuantity(cartItemId, newQuantity)
      if (result.success && user) {
        await fetchCartItems(user.id)
      }
    } catch (error) {
      console.error('Error updating quantity:', error)
    } finally {
      setUpdatingItems(prev => {
        const newSet = new Set(prev)
        newSet.delete(cartItemId)
        return newSet
      })
    }
  }

  const handleRemoveItem = async (cartItemId: string) => {
    try {
      const result = await removeFromCart(cartItemId)
      if (result.success && user) {
        await fetchCartItems(user.id)
      }
    } catch (error) {
      console.error('Error removing item:', error)
    }
  }

  const handleCheckout = () => {
    router.push('/checkout')
  }

  if (loading) {
    return (
      <div className="min-h-screen pt-20 pb-10">
        <div className="container mx-auto px-4">
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
            <p className="text-gray-400 mt-4">Loading...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    router.push('/auth')
    return null
  }

  const total = calculateCartTotal(cartItems)

  return (
    <div className="min-h-screen pt-20 pb-10">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" onClick={() => router.back()} className="text-white hover:bg-gray-800">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-6 w-6 text-white" />
            <h1 className="text-3xl font-bold text-white">Shopping Cart</h1>
          </div>
        </div>

        {cartItems.length === 0 ? (
          <div className="text-center py-20">
            <ShoppingBag className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-white mb-2">Your cart is empty</h2>
            <p className="text-gray-400 mb-6">Add some products to get started!</p>
            <Button onClick={() => router.push('/')} className="bg-white text-black hover:bg-gray-200">
              Continue Shopping
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <Card key={item.id} className="bg-gray-900 border-gray-700">
                  <CardContent className="p-6">
                    <div className="flex gap-4">
                      {/* Product Image */}
                      <div className="relative w-24 h-24 flex-shrink-0">
                        {item.product?.images && item.product.images.length > 0 ? (
                          <Image
                            src={getImageUrl(item.product.images[0].image_url)}
                            alt={item.product.name}
                            fill
                            className="object-cover rounded-md"
                            sizes="96px"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-800 rounded-md flex items-center justify-center">
                            <span className="text-gray-400 text-xs">No image</span>
                          </div>
                        )}
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-white mb-1 truncate">
                          {item.product?.name || 'Product not found'}
                        </h3>
                        <p className="text-gray-400 text-sm mb-2">Size: {item.size}</p>
                        <p className="text-white font-semibold">
                          {item.product ? formatPrice(item.product.price * item.quantity, item.product.currency) : 'N/A'}
                        </p>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex flex-col items-end gap-2">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                            disabled={updatingItems.has(item.id) || item.quantity <= 1}
                            className="h-8 w-8 p-0 border-gray-600 text-white hover:bg-gray-700"
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="text-white font-semibold min-w-[2rem] text-center">
                            {updatingItems.has(item.id) ? '...' : item.quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                            disabled={updatingItems.has(item.id)}
                            className="h-8 w-8 p-0 border-gray-600 text-white hover:bg-gray-700"
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>

                        {/* Remove Button */}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveItem(item.id)}
                          className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="bg-gray-900 border-gray-700 sticky top-24">
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold text-white mb-4">Order Summary</h2>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-gray-300">
                      <span>Subtotal ({cartItems.length} items)</span>
                      <span>{formatPrice(total, 'DZD')}</span>
                    </div>
                    <div className="flex justify-between text-gray-300">
                      <span>Delivery Fee</span>
                      <span>700 DZD</span>
                    </div>
                    <div className="border-t border-gray-700 pt-3">
                      <div className="flex justify-between text-white font-semibold text-lg">
                        <span>Total</span>
                        <span>{formatPrice(total + 700, 'DZD')}</span>
                      </div>
                    </div>
                  </div>

                  <Button 
                    onClick={handleCheckout}
                    className="w-full bg-white text-black hover:bg-gray-200 text-lg py-3"
                    disabled={cartItems.length === 0}
                  >
                    Proceed to Checkout
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 