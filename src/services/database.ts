const API_BASE_URL = 'http://localhost:3001/api'

export interface Product {
  id: number
  name: string
  description: string
  price: number
  images: string[]
  category: string
  sizes?: string[]
  colors?: string[]
}

export interface CreateProductData {
  name: string
  description: string
  price: number
  images: string[]
  category: string
  sizes?: string[]
  colors?: string[]
}

export interface UpdateProductData {
  name?: string
  description?: string
  price?: number
  images?: string[]
  category?: string
  sizes?: string[]
  colors?: string[]
}

export class DatabaseService {
  // Get all products
  static async getAllProducts(): Promise<Product[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/products`)
      if (!response.ok) throw new Error('Failed to fetch products')
      return await response.json()
    } catch (error) {
      console.error('Error fetching products:', error)
      return []
    }
  }

  // Get product by ID
  static async getProductById(id: number): Promise<Product | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/products/${id}`)
      if (!response.ok) return null
      return await response.json()
    } catch (error) {
      console.error('Error fetching product:', error)
      return null
    }
  }

  // Create new product
  static async createProduct(data: CreateProductData): Promise<Product | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      })
      if (!response.ok) throw new Error('Failed to create product')
      return await response.json()
    } catch (error) {
      console.error('Error creating product:', error)
      return null
    }
  }

  // Update product
  static async updateProduct(id: number, data: UpdateProductData): Promise<Product | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      })
      if (!response.ok) throw new Error('Failed to update product')
      return await response.json()
    } catch (error) {
      console.error('Error updating product:', error)
      return null
    }
  }

  // Delete product
  static async deleteProduct(id: number): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/products/${id}`, {
        method: 'DELETE'
      })
      return response.ok
    } catch (error) {
      console.error('Error deleting product:', error)
      return false
    }
  }

  // Seed initial products
  static async seedProducts(): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/seed`, {
        method: 'POST'
      })
      if (response.ok) {
        console.log('Products seeded successfully')
      }
    } catch (error) {
      console.error('Error seeding products:', error)
    }
  }

  // Upload images
  static async uploadImages(files: File[]): Promise<string[]> {
    try {
      const formData = new FormData()
      files.forEach(file => {
        formData.append('images', file)
      })

      const response = await fetch(`${API_BASE_URL}/upload`, {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        throw new Error('Failed to upload images')
      }

      const result = await response.json()
      return result.files.map((file: any) => file.url)
    } catch (error) {
      console.error('Error uploading images:', error)
      throw error
    }
  }
} 