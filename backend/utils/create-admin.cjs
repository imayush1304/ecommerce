/**
 * create-admin.cjs — Creates an admin user then seeds products
 * Usage: node utils/create-admin.cjs
 */
const path = require('path');
const dotenv = require('dotenv');
dotenv.config({ path: path.join(__dirname, '../config/config.env') });

const mongoose = require('mongoose');
const User = require('../models/userModel');

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.DB_LOCAL_URI);
    console.log('✅ MongoDB connected');

    const existing = await User.findOne({ email: 'admin@vipstore.com' });
    if (existing) {
      if (existing.role !== 'admin') {
        existing.role = 'admin';
        await existing.save({ validateBeforeSave: false });
        console.log('✅ Existing user promoted to admin');
      } else {
        console.log('ℹ Admin user already exists');
      }
      process.exit(0);
    }

    const admin = await User.create({
      name: 'Admin',
      email: 'admin@vipstore.com',
      password: 'Admin123',   // 8 chars — matches userModel maxlength
      role: 'admin',
      avatar: '',
    });

    console.log(`✅ Admin created: ${admin.email} / password: Admin123`);
    process.exit(0);
  } catch (err) {
    console.error('❌ ERROR:', err.message);
    process.exit(1);
  }
};

createAdmin();
