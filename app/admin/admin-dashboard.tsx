'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { type User } from '@supabase/supabase-js'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { ArrowLeft, Plus, Package, Users, DollarSign, TrendingUp } from 'lucide-react'
import { useRouter } from 'next/navigation'
import ProductForm from './product-form'
import SpotlightButton from '@/components/spotlight-button'

interface Product {
  id: string
  name: string
  price: number
  currency: string
  category: string
  brand: string
  is_active: boolean
  created_at: string
  _count?: {
    images: number
    sizes: number
  }
}

interface DashboardStats {
  totalProducts: number
  activeProducts: number
  totalRevenue: number
  totalCategories: number
}

export default function AdminDashboard({ user }: { user: User | null }) {
  const router = useRouter()
  const supabase = createClient()
  const [products, setProducts] = useState<Product[]>([])
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    activeProducts: 0,
    totalRevenue: 0,
    totalCategories: 0
  })
  const [loading, setLoading] = useState(true)
  const [showProductForm, setShowProductForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)

  useEffect(() => {
    fetchProducts()
    fetchStats()
  }, [])

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          _count:product_images(count),
          sizes:product_sizes(count)
        `)
        .order('created_at', { ascending: false })

      if (error) throw error
      setProducts(data || [])
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      // Get total products
      const { count: totalProducts } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })

      // Get active products
      const { count: activeProducts } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true)

      // Get unique categories
      const { data: categories } = await supabase
        .from('products')
        .select('category')
        .not('category', 'is', null)

      const uniqueCategories = new Set(categories?.map(p => p.category)).size

      setStats({
        totalProducts: totalProducts || 0,
        activeProducts: activeProducts || 0,
        totalRevenue: 0, // You can calculate this based on orders
        totalCategories: uniqueCategories
      })
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product)
    setShowProductForm(true)
  }

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return

    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId)

      if (error) throw error
      
      fetchProducts()
      fetchStats()
    } catch (error) {
      console.error('Error deleting product:', error)
    }
  }

  const handleProductSaved = () => {
    setShowProductForm(false)
    setEditingProduct(null)
    fetchProducts()
    fetchStats()
  }

  if (showProductForm) {
    return (
      <ProductForm 
        product={editingProduct}
        onSave={handleProductSaved}
        onCancel={() => {
          setShowProductForm(false)
          setEditingProduct(null)
        }}
      />
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900/50 via-black to-gray-900/50" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.02)_0%,transparent_50%)]" />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="flex items-center justify-between p-6">
          <Button variant="ghost" onClick={() => router.push("/")} className="text-white hover:bg-gray-800/50">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Store
          </Button>
          <div className="text-right">
            <p className="text-sm text-gray-400">Welcome, {user?.email}</p>
            <p className="text-xs text-gray-500">Administrator</p>
          </div>
        </header>

        {/* Main Content */}
        <div className="container mx-auto px-6 py-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">Admin Dashboard</h1>
            <p className="text-gray-400">Manage your store products and inventory</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="bg-gray-900/50 border-gray-700">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <Package className="h-8 w-8 text-blue-400" />
                  <div>
                    <p className="text-sm text-gray-400">Total Products</p>
                    <p className="text-2xl font-bold text-white">{stats.totalProducts}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/50 border-gray-700">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <TrendingUp className="h-8 w-8 text-green-400" />
                  <div>
                    <p className="text-sm text-gray-400">Active Products</p>
                    <p className="text-2xl font-bold text-white">{stats.activeProducts}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/50 border-gray-700">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <DollarSign className="h-8 w-8 text-yellow-400" />
                  <div>
                    <p className="text-sm text-gray-400">Revenue</p>
                    <p className="text-2xl font-bold text-white">{stats.totalRevenue} DZD</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/50 border-gray-700">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <Users className="h-8 w-8 text-purple-400" />
                  <div>
                    <p className="text-sm text-gray-400">Categories</p>
                    <p className="text-2xl font-bold text-white">{stats.totalCategories}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Products Section */}
          <Card className="bg-gray-900/50 border-gray-700">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-white">Products</CardTitle>
                  <CardDescription className="text-gray-400">
                    Manage your store products
                  </CardDescription>
                </div>
                                 <SpotlightButton
                   onClick={() => setShowProductForm(true)}
                   className="w-full h-12"
                 >
                   <Plus className="mr-2 h-4 w-4" />
                   Add Product
                 </SpotlightButton>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">
                  <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto"></div>
                  <p className="text-gray-400 mt-2">Loading products...</p>
                </div>
              ) : products.length === 0 ? (
                <div className="text-center py-8">
                  <Package className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                  <p className="text-gray-400">No products yet</p>
                                     <SpotlightButton
                     onClick={() => setShowProductForm(true)}
                     className="mt-4 w-full h-12"
                   >
                     <Plus className="mr-2 h-4 w-4" />
                     Add Your First Product
                   </SpotlightButton>
                </div>
              ) : (
                <div className="space-y-4">
                  {products.map((product) => (
                    <div
                      key={product.id}
                      className="flex items-center justify-between p-4 bg-gray-800/30 rounded-lg border border-gray-700"
                    >
                      <div className="flex-1">
                        <h3 className="text-white font-medium">{product.name}</h3>
                        <p className="text-gray-400 text-sm">
                          {product.brand} • {product.category}
                        </p>
                        <p className="text-blue-400 font-medium">
                          {product.price} {product.currency}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          product.is_active 
                            ? 'bg-green-900/50 text-green-400' 
                            : 'bg-red-900/50 text-red-400'
                        }`}>
                          {product.is_active ? 'Active' : 'Inactive'}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditProduct(product)}
                          className="bg-gray-800/50 border-gray-600 text-white hover:bg-gray-700/50"
                        >
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteProduct(product.id)}
                          className="bg-red-900/50 border-red-600 text-red-400 hover:bg-red-800/50"
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 