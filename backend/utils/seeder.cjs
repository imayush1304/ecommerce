/**
 * seeder.cjs — CommonJS seed script
 * Usage: node utils/seeder.cjs
 */
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { v2: cloudinary } = require('cloudinary');

dotenv.config({ path: path.join(__dirname, '../config/config.env') });

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

// Models (require after dotenv so mongoose connects fine)
const Product  = require('../models/productModel');
const User     = require('../models/userModel');

const IMAGES_DIR = path.resolve(__dirname, '../../frontend/public/images/products');

const uploadImage = async (imgRelPath) => {
  // imgRelPath looks like "/images/products/4.jpg" or just a filename
  const fileName = path.basename(imgRelPath);
  const localPath = path.join(IMAGES_DIR, fileName);

  if (!fs.existsSync(localPath)) {
    console.warn(`  ⚠ Image not found locally: ${localPath} — using placeholder URL`);
    return { image: `https://placehold.co/400x300?text=${encodeURIComponent(fileName)}` };
  }

  console.log(`  ☁ Uploading ${fileName} to Cloudinary...`);
  const result = await cloudinary.uploader.upload(localPath, { folder: 'products' });
  return { image: result.secure_url };
};

const seedProducts = async () => {
  try {
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(process.env.DB_LOCAL_URI);
    console.log('✅ MongoDB connected');

    // Find admin user
    const adminUser = await User.findOne({ role: 'admin' });
    if (!adminUser) {
      throw new Error(
        'No admin user found. Register a user first, then set their role to "admin" in MongoDB.'
      );
    }
    console.log(`👤 Using admin: ${adminUser.email}`);

    // Load seed data
    const rawData  = fs.readFileSync(path.resolve(__dirname, '../data/products.json'), 'utf-8');
    const products = JSON.parse(rawData);

    console.log(`🧹 Clearing ${await Product.countDocuments()} existing products...`);
    await Product.deleteMany({});

    console.log(`🌱 Seeding ${products.length} products...`);
    const finalProducts = [];

    for (const [i, product] of products.entries()) {
      console.log(`\n[${i + 1}/${products.length}] ${product.name}`);
      const uploadedImages = [];

      for (const img of product.images) {
        const uploaded = await uploadImage(img.image);
        uploadedImages.push(uploaded);
      }

      finalProducts.push({
        name:         product.name,
        price:        product.price,
        description:  product.description,
        ratings:      product.ratings  || 0,
        images:       uploadedImages,
        category:     product.category,
        seller:       product.seller,
        stock:        product.stock,
        numOfReviews: product.numOfReviews || 0,
        reviews:      [],          // skip reviews so we don't need user ObjectIds
        user:         adminUser._id,
        createdAt:    product.createdAt || Date.now(),
      });
    }

    await Product.insertMany(finalProducts);
    console.log('\n✅ PRODUCTS SEEDED SUCCESSFULLY');
    process.exit(0);
  } catch (err) {
    console.error('\n❌ SEED ERROR:', err.message);
    process.exit(1);
  }
};

seedProducts();
