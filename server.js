require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const FormData = require('form-data');

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Configure multer for temporary file storage
const storage = multer.memoryStorage();

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: function (req, file, cb) {
    // Accept only image files
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// ImgBB API key (you'll need to get a free API key from https://api.imgbb.com/)
const IMGBB_API_KEY = process.env.IMGBB_API_KEY || 'a4b8cbc7d5d18b5952be1bbfad0c1ae7'; // Replace with your actual API key

// Function to upload image to ImgBB
async function uploadToImgBB(imageBuffer, filename) {
  try {
    const formData = new FormData();
    formData.append('image', imageBuffer, {
      filename: filename,
      contentType: 'image/jpeg'
    });

    const response = await axios.post(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, formData, {
      headers: {
        ...formData.getHeaders(),
      },
    });

    if (response.data.success) {
      return response.data.data.url;
    } else {
      throw new Error('Failed to upload to ImgBB');
    }
  } catch (error) {
    console.error('Error uploading to ImgBB:', error);
    throw error;
  }
}

// Upload images endpoint
app.post('/api/upload', upload.array('images', 4), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }
    
    const uploadedUrls = [];
    
    for (const file of req.files) {
      try {
        const imageUrl = await uploadToImgBB(file.buffer, file.originalname);
        uploadedUrls.push(imageUrl);
      } catch (error) {
        console.error(`Error uploading ${file.originalname}:`, error);
        return res.status(500).json({ error: `Failed to upload ${file.originalname}` });
      }
    }
    
    res.json({ 
      success: true, 
      files: uploadedUrls.map(url => ({ url })),
      message: `${uploadedUrls.length} file(s) uploaded successfully`
    });
  } catch (error) {
    console.error('Error uploading files:', error);
    res.status(500).json({ error: 'Failed to upload files' });
  }
});

// Get all products
app.get('/api/products', async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' }
    });
    
    const formattedProducts = products.map(product => ({
      ...product,
      images: product.images ? JSON.parse(product.images) : [],
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
      images: product.images ? JSON.parse(product.images) : [],
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
    const { name, description, price, images, category, sizes, colors } = req.body;
    
    const product = await prisma.product.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        images: JSON.stringify(images),
        category,
        sizes: sizes ? JSON.stringify(sizes) : null,
        colors: colors ? JSON.stringify(colors) : null
      }
    });
    
    const formattedProduct = {
      ...product,
      images: product.images ? JSON.parse(product.images) : [],
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
    const { name, description, price, images, category, sizes, colors } = req.body;
    
    const updateData = { name, description, price: parseFloat(price), category };
    if (images !== undefined) {
      updateData.images = JSON.stringify(images);
    }
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
      images: product.images ? JSON.parse(product.images) : [],
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
        images: [],
        category: 'clothing',
        sizes: ['S', 'M', 'L', 'XL'],
        colors: ['Black', 'Dark Green']
      },
      {
        name: 'Digital Dreams Hoodie',
        description: 'Comfortable hoodie featuring album artwork',
        price: 49.99,
        images: [],
        category: 'clothing',
        sizes: ['S', 'M', 'L', 'XL'],
        colors: ['Black', 'Navy']
      },
      {
        name: 'Hacker Cap',
        description: 'Futuristic baseball cap with LED accent',
        price: 24.99,
        images: [],
        category: 'accessories',
        sizes: ['One Size'],
        colors: ['Black']
      },
      {
        name: 'Glow Stickers Pack',
        description: 'Set of 10 glow-in-the-dark stickers',
        price: 9.99,
        images: [],
        category: 'accessories',
        sizes: ['One Size'],
        colors: ['Mixed']
      },
      {
        name: 'Digital Dreams Vinyl',
        description: 'Limited edition vinyl record with digital download',
        price: 34.99,
        images: [],
        category: 'music',
        sizes: ['12"'],
        colors: ['Clear Green']
      },
      {
        name: 'USB Drive Collection',
        description: '16GB USB with exclusive tracks and artwork',
        price: 19.99,
        images: [],
        category: 'music',
        sizes: ['16GB'],
        colors: ['Black']
      }
    ];

    for (const product of initialProducts) {
      await prisma.product.create({
        data: {
          ...product,
          images: JSON.stringify(product.images),
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

// Content management endpoints
app.get('/api/content', async (req, res) => {
  try {
    const content = await prisma.content.findMany();
    res.json(content);
  } catch (error) {
    console.error('Error fetching content:', error);
    res.status(500).json({ error: 'Failed to fetch content' });
  }
});

app.post('/api/content', async (req, res) => {
  try {
    const { id, value } = req.body;
    
    // Upsert content (create if doesn't exist, update if it does)
    const content = await prisma.content.upsert({
      where: { id },
      update: { value },
      create: { id, value }
    });
    
    res.json(content);
  } catch (error) {
    console.error('Error saving content:', error);
    res.status(500).json({ error: 'Failed to save content' });
  }
});

// Seed content
app.post('/api/seed-content', async (req, res) => {
  try {
    const existingContent = await prisma.content.count();
    if (existingContent > 0) {
      return res.json({ message: 'Content already seeded' });
    }

    const initialContent = [
      { id: 'hero-title', value: 'SXNCTUARY' },
      { id: 'hero-subtitle', value: 'Drum\'n\'Bass Producer' },
      { id: 'hero-description', value: 'Pushing the boundaries of drum\'n\'bass with futuristic soundscapes, innovative production techniques, and cutting-edge technology.' },
      { id: 'latest-release-name', value: 'RUNNERS' },
      { id: 'latest-release-description', value: 'My latest drum\'n\'bass track' },
      { id: 'latest-release-image', value: '/IMG_3220.jpg' },
      { id: 'merch-title', value: 'SXNCTUARY Merch' },
      { id: 'merch-subtitle', value: 'Official merchandise featuring futuristic designs and premium quality' },
      { id: 'footer-description', value: 'Pushing the boundaries of electronic music with futuristic soundscapes and innovative production.' }
    ];

    for (const content of initialContent) {
      await prisma.content.create({
        data: content
      });
    }

    res.json({ message: 'Content seeded successfully' });
  } catch (error) {
    console.error('Error seeding content:', error);
    res.status(500).json({ error: 'Failed to seed content' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 