import { config } from 'dotenv';
import { resolve } from 'path';

// Load environment variables first
config({ path: resolve(__dirname, '../.env.local') });

import dbConnect from '../lib/dbConnect';
import UserModel from '../models/user.model';

async function testLogin() {
  try {
    console.log('Connecting to MongoDB...');
    await dbConnect();
    console.log('✅ Connected!\n');

    // Test user
    const email = 'alice@example.com';
    const password = 'password123';

    console.log(`Finding user: ${email}`);
    const user = await UserModel.findOne({ email });

    if (!user) {
      console.log('❌ User not found!');
      process.exit(1);
    }

    console.log('✅ User found:', {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });

    console.log('\nTesting password comparison...');
    const isValid = await user.comparePassword(password);
    
    if (isValid) {
      console.log('✅ Password is correct!');
    } else {
      console.log('❌ Password is incorrect!');
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

testLogin();
