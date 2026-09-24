/**
 * demo_seeder.cjs — CommonJS seed script
 * Usage: node utils/demo_seeder.cjs
 */
const path = require('path');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '../config/config.env') });

const Product = require('../models/productModel');
const User = require('../models/userModel');

const CATEGORIES = [
    'Electronics', 'Mobile Phones', 'Laptops', 'Accessories',
    'Sports', 'Home', 'Clothing', 'Footwear', 'Headphones'
];

const BRANDS = ['Sony', 'Apple', 'Samsung', 'Nike', 'Adidas', 'LG', 'Dell', 'HP', 'Bose'];
const ADJECTIVES = ['Pro', 'Ultra', 'Max', 'Lite', 'Plus', 'Elite', 'Premium', 'Basic'];

// List of actual image files available in frontend/public/images/products
const LOCAL_IMAGES = [
    '/images/products/1.jpg', '/images/products/2.jpg', '/images/products/3.jpg', '/images/products/4.jpg', 
    '/images/products/5.jpg', '/images/products/6.jpg', '/images/products/7.jpg', '/images/products/8.jpg', 
    '/images/products/cookwareset.jpg', '/images/products/earbuds.webp', '/images/products/headphone.webp',
    '/images/products/hoodie.webp', '/images/products/iphone-product.webp', '/images/products/oppos21.webp', 
    '/images/products/shirt.webp', '/images/products/shoe1.webp', '/images/products/shoe2.webp', 
    '/images/products/tshirt.webp', '/images/products/tv.webp', '/images/products/watch.jpg'
];

const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const getRandomItem = (arr) => arr[getRandomInt(0, arr.length - 1)];

// Maps each category to a short product-type noun for clean names
const CATEGORY_NOUN = {
    'Electronics':   'Electronics',
    'Mobile Phones': 'Phone',
    'Laptops':       'Laptop',
    'Accessories':   'Accessory',
    'Sports':        'Sports',
    'Home':          'Home',
    'Clothing':      'Apparel',
    'Footwear':      'Footwear',
    'Headphones':    'Headphones',
};

const generateProducts = (adminUserId) => {
    const products = [];
    for (let i = 1; i <= 100; i++) {
        const brand = getRandomItem(BRANDS);
        const category = getRandomItem(CATEGORIES);
        const adj = getRandomItem(ADJECTIVES);
        const noun = CATEGORY_NOUN[category] || category;
        const name = `${brand} ${noun} ${adj} ${i}`;
        
        // Random price between 500 and 150000
        const price = Math.round(getRandomInt(5, 1500) * 100);
        
        // Pick a real image path from the local directory
        const realImage = getRandomItem(LOCAL_IMAGES);

        products.push({
            name,
            price,
            description: `Experience the premium quality of the ${name}. Crafted for excellence in the ${category} category, brought to you by ${brand}.`,
            ratings: (Math.random() * 2 + 3).toFixed(1), // Random between 3.0 and 5.0
            images: [{ image: realImage }],
            category,
            seller: brand,
            stock: getRandomInt(0, 100),
            numOfReviews: getRandomInt(0, 250),
            reviews: [],
            user: adminUserId,
            createdAt: Date.now()
        });
    }
    return products;
};

const seedDemoProducts = async () => {
    try {
        console.log('🔗 Connecting to MongoDB...');
        await mongoose.connect(process.env.DB_LOCAL_URI);
        console.log('✅ MongoDB connected');

        // Find admin user
        const adminUser = await User.findOne({ role: 'admin' });
        if (!adminUser) {
            throw new Error('No admin user found in DB. Run create-admin first or register a user and make them admin.');
        }

        console.log(`🧹 Clearing ${await Product.countDocuments()} existing products...`);
        await Product.deleteMany({});

        console.log(`🌱 Generating 100 demo products with REAL images...`);
        const finalProducts = generateProducts(adminUser._id);

        console.log(`💾 Inserting products to DB...`);
        await Product.insertMany(finalProducts);
        
        console.log(`✅ ${finalProducts.length} PRODUCTS SEEDED SUCCESSFULLY`);
        process.exit(0);
    } catch (err) {
        console.error('\n❌ SEED ERROR:', err.message);
        process.exit(1);
    }
};

seedDemoProducts();
