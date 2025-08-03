import { createClient } from '@/utils/supabase/client'
import { Product, ProductWithDetails } from './types'

// Input validation function for product IDs
function validateProductId(productId: string): boolean {
  // UUID v4 format validation
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
  return uuidRegex.test(productId)
}

export async function getProducts(): Promise<ProductWithDetails[]> {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      product_images (*),
      product_sizes (*),
      product_3d_models (*)
    `)
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching products:', error)
    return []
  }

  // Transform the data to match our interface
  return (data || []).map(product => ({
    ...product,
    images: product.product_images || [],
    sizes: product.product_sizes || [],
    models: product.product_3d_models || []
  }))
}

export async function getProductWithDetails(productId: string): Promise<ProductWithDetails | null> {
  // Validate product ID
  if (!productId || !validateProductId(productId)) {
    console.error('Invalid product ID format:', productId)
    return null
  }

  const supabase = createClient()
  
  // Fetch product with all related data
  const { data: product, error: productError } = await supabase
    .from('products')
    .select(`
      *,
      product_images (*),
      product_sizes (*),
      product_3d_models (*)
    `)
    .eq('id', productId)
    .eq('is_active', true)
    .single()

  if (productError || !product) {
    console.error('Error fetching product:', productError)
    return null
  }

  // Transform the data to match our interface
  return {
    ...product,
    images: product.product_images || [],
    sizes: product.product_sizes || [],
    models: product.product_3d_models || []
  }
}

export function formatPrice(price: number, currency: string = 'DZD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(price)
}

export function getPrimaryImage(images: any[]): string {
  const primaryImage = images.find(img => img.is_primary)
  if (primaryImage) {
    return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/product-images/${primaryImage.image_url}`
  }
  return images.length > 0 
    ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/product-images/${images[0].image_url}`
    : '/placeholder.svg'
}

export function getImageUrl(imageUrl: string): string {
  if (!imageUrl) {
    return '/placeholder.svg'
  }
  
  if (imageUrl.startsWith('http')) {
    return imageUrl
  }
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/product-images/${imageUrl}`
} 