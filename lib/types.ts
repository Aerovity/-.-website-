export interface Product {
  id: string
  name: string
  description: string | null
  price: number
  currency: string
  category: string | null
  brand: string | null
  created_at: string
  updated_at: string
  is_active: boolean
  created_by: string | null
}

export interface ProductImage {
  id: string
  product_id: string
  image_url: string
  image_order: number
  is_primary: boolean
  created_at: string
}

export interface ProductSize {
  id: string
  product_id: string
  size: string
  stock_quantity: number
  created_at: string
  updated_at: string
}

export interface Product3DModel {
  id: string
  product_id: string
  model_url: string
  model_type: string
  created_at: string
}

export interface ProductWithDetails extends Product {
  images: ProductImage[]
  sizes: ProductSize[]
  models: Product3DModel[]
} 