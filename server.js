const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Get all products
app.get('/api/products', async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' }
    });
    
    const formattedProducts = products.map(product => ({
      ...product,
      sizes: product.sizes ? JSON.parse(product.sizes) : undefined,
      colors: product.colors ? JSON.parse(product.colors) : undefined
    }));
    
    res.json(formattedProducts);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Get product by ID
app.get('/api/products/:id', async (req, res) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: parseInt(req.params.id) }
    });
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    const formattedProduct = {
      ...product,
      sizes: product.sizes ? JSON.parse(product.sizes) : undefined,
      colors: product.colors ? JSON.parse(product.colors) : undefined
    };
    
    res.json(formattedProduct);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

// Create new product
app.post('/api/products', async (req, res) => {
  try {
    const { name, description, price, image, category, sizes, colors } = req.body;
    
    const product = await prisma.product.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        image,
        category,
        sizes: sizes ? JSON.stringify(sizes) : null,
        colors: colors ? JSON.stringify(colors) : null
      }
    });
    
    const formattedProduct = {
      ...product,
      sizes: product.sizes ? JSON.parse(product.sizes) : undefined,
      colors: product.colors ? JSON.parse(product.colors) : undefined
    };
    
    res.status(201).json(formattedProduct);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ error: 'Failed to create product' });
  }
});

// Update product
app.put('/api/products/:id', async (req, res) => {
  try {
    const { name, description, price, image, category, sizes, colors } = req.body;
    
    const updateData = { name, description, price: parseFloat(price), image, category };
    if (sizes !== undefined) {
      updateData.sizes = JSON.stringify(sizes);
    }
    if (colors !== undefined) {
      updateData.colors = JSON.stringify(colors);
    }
    
    const product = await prisma.product.update({
      where: { id: parseInt(req.params.id) },
      data: updateData
    });
    
    const formattedProduct = {
      ...product,
      sizes: product.sizes ? JSON.parse(product.sizes) : undefined,
      colors: product.colors ? JSON.parse(product.colors) : undefined
    };
    
    res.json(formattedProduct);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ error: 'Failed to update product' });
  }
});

// Delete product
app.delete('/api/products/:id', async (req, res) => {
  try {
    await prisma.product.delete({
      where: { id: parseInt(req.params.id) }
    });
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

// Seed products
app.post('/api/seed', async (req, res) => {
  try {
    const existingProducts = await prisma.product.count();
    if (existingProducts > 0) {
      return res.json({ message: 'Products already seeded' });
    }

    const initialProducts = [
      {
        name: 'SXNCTUARY Logo T-Shirt',
        description: 'Premium cotton t-shirt with glowing logo design',
        price: 29.99,
        image: '🎽',
        category: 'clothing',
        sizes: ['S', 'M', 'L', 'XL'],
        colors: ['Black', 'Dark Green']
      },
      {
        name: 'Digital Dreams Hoodie',
        description: 'Comfortable hoodie featuring album artwork',
        price: 49.99,
        image: '🧥',
        category: 'clothing',
        sizes: ['S', 'M', 'L', 'XL'],
        colors: ['Black', 'Navy']
      },
      {
        name: 'Hacker Cap',
        description: 'Futuristic baseball cap with LED accent',
        price: 24.99,
        image: '🧢',
        category: 'accessories',
        sizes: ['One Size'],
        colors: ['Black']
      },
      {
        name: 'Glow Stickers Pack',
        description: 'Set of 10 glow-in-the-dark stickers',
        price: 9.99,
        image: '✨',
        category: 'accessories',
        sizes: ['One Size'],
        colors: ['Mixed']
      },
      {
        name: 'Digital Dreams Vinyl',
        description: 'Limited edition vinyl record with digital download',
        price: 34.99,
        image: '💿',
        category: 'music',
        sizes: ['12"'],
        colors: ['Clear Green']
      },
      {
        name: 'USB Drive Collection',
        description: '16GB USB with exclusive tracks and artwork',
        price: 19.99,
        image: '💾',
        category: 'music',
        sizes: ['16GB'],
        colors: ['Black']
      }
    ];

    for (const product of initialProducts) {
      await prisma.product.create({
        data: {
          ...product,
          sizes: JSON.stringify(product.sizes),
          colors: JSON.stringify(product.colors)
        }
      });
    }

    res.json({ message: 'Products seeded successfully' });
  } catch (error) {
    console.error('Error seeding products:', error);
    res.status(500).json({ error: 'Failed to seed products' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 