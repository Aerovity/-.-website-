'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { ArrowLeft, Upload, X, Image as ImageIcon, Box, Package } from 'lucide-react'
import Image from 'next/image'
import SpotlightButton from '@/components/spotlight-button'

interface Product {
  id: string
  name: string
  description: string
  price: number
  currency: string
  category: string
  brand: string
  is_active: boolean
}

interface ProductSize {
  size: string
  stock_quantity: number
}

interface ProductImage {
  id: string
  image_url: string
  is_primary: boolean
  image_order: number
}

interface ProductFormProps {
  product?: Product | null
  onSave: () => void
  onCancel: () => void
}

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL']
const CATEGORIES = ['T-Shirts', 'Hoodies', 'Jackets', 'Pants', 'Shoes', 'Accessories']
const BRANDS = ['Karasu', 'Nike', 'Adidas', 'Puma', 'Under Armour', 'Custom']

export default function ProductForm({ product, onSave, onCancel }: ProductFormProps) {
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: product?.name || '',
    description: product?.description || '',
    price: product?.price || 0,
    currency: product?.currency || 'DZD',
    category: product?.category || '',
    brand: product?.brand || '',
    is_active: product?.is_active ?? true
  })
  
  const [sizes, setSizes] = useState<ProductSize[]>([])
  const [images, setImages] = useState<ProductImage[]>([])
  const [uploadingImages, setUploadingImages] = useState(false)
  const [uploadingModel, setUploadingModel] = useState(false)
  const [modelUrl, setModelUrl] = useState('')
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  useEffect(() => {
    if (product?.id) {
      fetchProductData()
    }
  }, [product?.id])

  const fetchProductData = async () => {
    if (!product?.id) return

    try {
      // Fetch sizes
      const { data: sizesData } = await supabase
        .from('product_sizes')
        .select('*')
        .eq('product_id', product.id)
        .order('size')

      if (sizesData) {
        setSizes(sizesData.map(s => ({ size: s.size, stock_quantity: s.stock_quantity })))
      }

      // Fetch images
      const { data: imagesData } = await supabase
        .from('product_images')
        .select('*')
        .eq('product_id', product.id)
        .order('image_order')

      if (imagesData) {
        setImages(imagesData)
      }

      // Fetch 3D model
      const { data: modelData } = await supabase
        .from('product_3d_models')
        .select('*')
        .eq('product_id', product.id)
        .single()

      if (modelData) {
        setModelUrl(modelData.model_url)
      }
    } catch (error) {
      console.error('Error fetching product data:', error)
    }
  }

  const handleInputChange = (field: string, value: string | number | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSizeChange = (size: string, quantity: number) => {
    setSizes(prev => {
      const existing = prev.find(s => s.size === size)
      if (existing) {
        return prev.map(s => s.size === size ? { ...s, stock_quantity: quantity } : s)
      } else {
        return [...prev, { size, stock_quantity: quantity }]
      }
    })
  }

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) return
    if (images.length >= 8) {
      setMessage({ type: 'error', text: 'Maximum 8 images allowed' })
      return
    }

    setUploadingImages(true)
    try {
      const files = Array.from(event.target.files)
      const uploadedImages: ProductImage[] = []

      for (const file of files) {
        const fileExt = file.name.split('.').pop()
        const fileName = `${Date.now()}-${Math.random()}.${fileExt}`
        
        const { error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(fileName, file)

        if (uploadError) throw uploadError

        const { data: { publicUrl } } = supabase.storage
          .from('product-images')
          .getPublicUrl(fileName)

        uploadedImages.push({
          id: Date.now().toString(),
          image_url: fileName,
          is_primary: images.length === 0 && uploadedImages.length === 0,
          image_order: images.length + uploadedImages.length
        })
      }

      setImages(prev => [...prev, ...uploadedImages])
      setMessage({ type: 'success', text: 'Images uploaded successfully!' })
      setTimeout(() => setMessage(null), 3000)
    } catch (error) {
      setMessage({ type: 'error', text: 'Error uploading images' })
      setTimeout(() => setMessage(null), 5000)
    } finally {
      setUploadingImages(false)
    }
  }

  const handleModelUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) return

    setUploadingModel(true)
    try {
      const file = event.target.files[0]
      const fileExt = file.name.split('.').pop()
      const fileName = `model-${Date.now()}.${fileExt}`
      
      const { error: uploadError } = await supabase.storage
        .from('product-models')
        .upload(fileName, file)

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('product-models')
        .getPublicUrl(fileName)

      setModelUrl(fileName)
      setMessage({ type: 'success', text: '3D model uploaded successfully!' })
      setTimeout(() => setMessage(null), 3000)
    } catch (error) {
      setMessage({ type: 'error', text: 'Error uploading 3D model' })
      setTimeout(() => setMessage(null), 5000)
    } finally {
      setUploadingModel(false)
    }
  }

  const removeImage = (imageId: string) => {
    setImages(prev => prev.filter(img => img.id !== imageId))
  }

  const setPrimaryImage = (imageId: string) => {
    setImages(prev => prev.map(img => ({
      ...img,
      is_primary: img.id === imageId
    })))
  }

  const handleSubmit = async () => {
    if (!formData.name || !formData.price || !formData.category || !formData.brand) {
      setMessage({ type: 'error', text: 'Please fill in all required fields' })
      setTimeout(() => setMessage(null), 5000)
      return
    }

    setLoading(true)
    try {
      let productId = product?.id

      if (productId) {
        // Update existing product
        const { error } = await supabase
          .from('products')
          .update({
            name: formData.name,
            description: formData.description,
            price: formData.price,
            currency: formData.currency,
            category: formData.category,
            brand: formData.brand,
            is_active: formData.is_active
          })
          .eq('id', productId)

        if (error) throw error
      } else {
        // Create new product
        const { data, error } = await supabase
          .from('products')
          .insert({
            name: formData.name,
            description: formData.description,
            price: formData.price,
            currency: formData.currency,
            category: formData.category,
            brand: formData.brand,
            is_active: formData.is_active
          })
          .select()
          .single()

        if (error) throw error
        productId = data.id
      }

      // Save sizes
      if (productId) {
        // Delete existing sizes
        await supabase
          .from('product_sizes')
          .delete()
          .eq('product_id', productId)

        // Insert new sizes
        if (sizes.length > 0) {
          const { error: sizesError } = await supabase
            .from('product_sizes')
            .insert(sizes.map(size => ({
              product_id: productId,
              size: size.size,
              stock_quantity: size.stock_quantity
            })))

          if (sizesError) throw sizesError
        }

        // Save images
        if (images.length > 0) {
          // Delete existing images
          await supabase
            .from('product_images')
            .delete()
            .eq('product_id', productId)

          // Insert new images
          const { error: imagesError } = await supabase
            .from('product_images')
            .insert(images.map(img => ({
              product_id: productId,
              image_url: img.image_url,
              is_primary: img.is_primary,
              image_order: img.image_order
            })))

          if (imagesError) throw imagesError
        }

        // Save 3D model
        if (modelUrl) {
          // Delete existing model
          await supabase
            .from('product_3d_models')
            .delete()
            .eq('product_id', productId)

          // Insert new model
          const { error: modelError } = await supabase
            .from('product_3d_models')
            .insert({
              product_id: productId,
              model_url: modelUrl,
              model_type: 'glb'
            })

          if (modelError) throw modelError
        }
      }

      setMessage({ type: 'success', text: 'Product saved successfully!' })
      setTimeout(() => {
        setMessage(null)
        onSave()
      }, 2000)
    } catch (error) {
      console.error('Error saving product:', error)
      setMessage({ type: 'error', text: 'Error saving product' })
      setTimeout(() => setMessage(null), 5000)
    } finally {
      setLoading(false)
    }
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
          <Button variant="ghost" onClick={onCancel} className="text-white hover:bg-gray-800/50">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
          <h1 className="text-xl font-bold text-white">
            {product ? 'Edit Product' : 'Add New Product'}
          </h1>
        </header>

        {/* Main Content */}
        <div className="container mx-auto px-6 py-8">
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Message Display */}
            {message && (
              <div className={`p-4 rounded-lg border ${
                message.type === 'success' 
                  ? 'bg-green-900/20 border-green-700 text-green-200' 
                  : 'bg-red-900/20 border-red-700 text-red-200'
              }`}>
                {message.text}
              </div>
            )}

            {/* Basic Information */}
            <Card className="bg-gray-900/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Basic Information</CardTitle>
                <CardDescription className="text-gray-400">
                  Product details and pricing
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-medium text-gray-300">
                      Product Name *
                    </Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="bg-gray-800/30 border-gray-600/50 text-white placeholder:text-gray-500"
                      placeholder="Enter product name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="brand" className="text-sm font-medium text-gray-300">
                      Brand *
                    </Label>
                    <select
                      value={formData.brand}
                      onChange={(e) => handleInputChange('brand', e.target.value)}
                      className="w-full h-10 bg-gray-800/30 border border-gray-600/50 text-white rounded-md px-3 focus:border-gray-500 focus:ring-1 focus:ring-gray-500"
                    >
                      <option value="">Select brand</option>
                      {BRANDS.map(brand => (
                        <option key={brand} value={brand}>{brand}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category" className="text-sm font-medium text-gray-300">
                      Category *
                    </Label>
                    <select
                      value={formData.category}
                      onChange={(e) => handleInputChange('category', e.target.value)}
                      className="w-full h-10 bg-gray-800/30 border border-gray-600/50 text-white rounded-md px-3 focus:border-gray-500 focus:ring-1 focus:ring-gray-500"
                    >
                      <option value="">Select category</option>
                      {CATEGORIES.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="price" className="text-sm font-medium text-gray-300">
                      Price (DZD) *
                    </Label>
                    <Input
                      id="price"
                      type="number"
                      value={formData.price}
                      onChange={(e) => handleInputChange('price', parseFloat(e.target.value) || 0)}
                      className="bg-gray-800/30 border-gray-600/50 text-white placeholder:text-gray-500"
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-sm font-medium text-gray-300">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    className="bg-gray-800/30 border-gray-600/50 text-white placeholder:text-gray-500 min-h-[100px]"
                    placeholder="Enter product description..."
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="is_active"
                    checked={formData.is_active}
                    onChange={(e) => handleInputChange('is_active', e.target.checked)}
                    className="rounded border-gray-600 bg-gray-800 text-blue-600 focus:ring-blue-500"
                  />
                  <Label htmlFor="is_active" className="text-sm font-medium text-gray-300">
                    Active (visible in store)
                  </Label>
                </div>
              </CardContent>
            </Card>

            {/* Size and Stock Management */}
            <Card className="bg-gray-900/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Size & Stock Management</CardTitle>
                <CardDescription className="text-gray-400">
                  Set stock quantities for each size
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                  {SIZES.map(size => (
                    <div key={size} className="space-y-2">
                      <Label className="text-sm font-medium text-gray-300 text-center block">
                        {size}
                      </Label>
                      <Input
                        type="number"
                        value={sizes.find(s => s.size === size)?.stock_quantity || 0}
                        onChange={(e) => handleSizeChange(size, parseInt(e.target.value) || 0)}
                        className="bg-gray-800/30 border-gray-600/50 text-white text-center"
                        min="0"
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Product Images */}
            <Card className="bg-gray-900/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Product Images</CardTitle>
                <CardDescription className="text-gray-400">
                  Upload up to 8 images (first image will be primary)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <Button
                      variant="outline"
                      onClick={() => document.getElementById('image-upload')?.click()}
                      disabled={uploadingImages || images.length >= 8}
                      className="bg-gray-800/50 border-gray-600 text-white hover:bg-gray-700/50"
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      {uploadingImages ? 'Uploading...' : 'Upload Images'}
                    </Button>
                    <span className="text-sm text-gray-400">
                      {images.length}/8 images
                    </span>
                  </div>

                  <input
                    id="image-upload"
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />

                  {images.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {images.map((image, index) => (
                        <div key={image.id} className="relative group">
                          <div className="aspect-square bg-gray-800 rounded-lg overflow-hidden">
                            <Image
                              src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/product-images/${image.image_url}`}
                              alt={`Product image ${index + 1}`}
                              width={200}
                              height={200}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setPrimaryImage(image.id)}
                              className="bg-gray-800/50 border-gray-600 text-white hover:bg-gray-700/50"
                            >
                              {image.is_primary ? 'Primary' : 'Set Primary'}
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => removeImage(image.id)}
                              className="bg-red-900/50 border-red-600 text-red-400 hover:bg-red-800/50"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                          {image.is_primary && (
                            <div className="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                              Primary
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* 3D Model */}
            <Card className="bg-gray-900/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">3D Model</CardTitle>
                <CardDescription className="text-gray-400">
                  Upload a 3D model file (GLB format recommended)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <Button
                      variant="outline"
                      onClick={() => document.getElementById('model-upload')?.click()}
                      disabled={uploadingModel}
                      className="bg-gray-800/50 border-gray-600 text-white hover:bg-gray-700/50"
                    >
                                             <Box className="mr-2 h-4 w-4" />
                      {uploadingModel ? 'Uploading...' : 'Upload 3D Model'}
                    </Button>
                    {modelUrl && (
                      <span className="text-sm text-green-400">✓ Model uploaded</span>
                    )}
                  </div>

                  <input
                    id="model-upload"
                    type="file"
                    accept=".glb,.gltf"
                    onChange={handleModelUpload}
                    className="hidden"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Save Button */}
            <div className="flex justify-end space-x-4">
              <Button
                variant="outline"
                onClick={onCancel}
                className="bg-gray-800/50 border-gray-600 text-white hover:bg-gray-700/50"
              >
                Cancel
              </Button>
              <SpotlightButton
                onClick={handleSubmit}
                disabled={loading}
                className="px-8"
              >
                {loading ? 'Saving...' : (product ? 'Update Product' : 'Create Product')}
              </SpotlightButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 