// Run this once to create admin: node scripts/setupAdmin.js
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

async function setup() {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/royaltyplus');
  const count = await User.countDocuments();
  if (count > 0) {
    console.log('❌ Admin already exists. Skipping.');
    process.exit(0);
  }
  const user = await User.create({
    username: 'admin',
    password: 'Admin@123456',
    role: 'admin',
    email: 'admin@royaltyplus.com',
  });
  console.log('✅ Admin created!');
  console.log('   Username:', user.username);
  console.log('   Password: Admin@123456');
  console.log('   ⚠️  Change password after first login!');
  process.exit(0);
}

setup().catch(err => { console.error(err); process.exit(1); });
