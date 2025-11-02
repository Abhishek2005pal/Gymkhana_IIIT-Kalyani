import { config } from 'dotenv';
import { resolve } from 'path';

// Load .env.local file FIRST before any other imports
config({ path: resolve(__dirname, '../.env.local') });

import mongoose from 'mongoose';
import dbConnect from '../lib/dbConnect';
import ClubModel from '../models/club.model';
import EventModel from '../models/event.model';
import UserModel from '../models/user.model';

const seedDatabase = async () => {
  try {
    console.log('Connecting to MongoDB...');
    console.log('MongoDB URI:', process.env.MONGODB_URI?.replace(/:[^:@]+@/, ':****@'));
    
    await dbConnect();
    console.log('✅ Database connected successfully!');

    console.log('\nClearing existing data...');
    await ClubModel.deleteMany({});
    await EventModel.deleteMany({});
    await UserModel.deleteMany({});
    console.log('✅ Existing data cleared');

    console.log('\nSeeding users...');
    // Use .create() instead of .insertMany() to trigger password hashing
    const admin = await UserModel.create({
      name: 'Admin',
      email: 'admin@iiitkalyani.ac.in',
      password: 'admin@123',
      role: 'admin',
    });

    const alice = await UserModel.create({
      name: 'Alice',
      email: 'alice@example.com',
      password: 'password123',
      role: 'coordinator',
    });
    
    const bob = await UserModel.create({
      name: 'Bob',
      email: 'bob@example.com',
      password: 'password123',
      role: 'student',
    });

    const charlie = await UserModel.create({
      name: 'Charlie',
      email: 'charlie@example.com',
      password: 'password123',
      role: 'student',
      studentId: 'STU001',
    });

    const diana = await UserModel.create({
      name: 'Diana',
      email: 'diana@example.com',
      password: 'password123',
      role: 'student',
      studentId: 'STU002',
    });
    
    console.log('✅ Users seeded successfully!');
    console.log('   - Admin:', admin._id, '(admin@iiitkalyani.ac.in / admin@123)');
    console.log('   - Alice (coordinator):', alice._id);
    console.log('   - Bob (student):', bob._id);
    console.log('   - Charlie (student):', charlie._id);
    console.log('   - Diana (student):', diana._id);

    console.log('\nSeeding clubs...');
    const debatingSociety = await ClubModel.create({
      name: 'Debating Society',
      description: 'A club for passionate debaters and public speakers.',
      coordinator: alice._id,
      members: [alice._id, bob._id, charlie._id],
    });

    const musicClub = await ClubModel.create({
      name: 'Music Club',
      description: 'For all music lovers, from classical to rock.',
      coordinator: alice._id,
      members: [alice._id, diana._id],
    });

    const dramaClub = await ClubModel.create({
      name: 'Drama Club',
      description: 'Bringing stories to life on stage.',
      coordinator: alice._id,
      members: [alice._id, bob._id],
    });

    const photographyClub = await ClubModel.create({
      name: 'Photography Club',
      description: 'Capture moments and create art.',
      coordinator: alice._id,
      members: [alice._id, charlie._id, diana._id],
    });

    const outdoorGamesClub = await ClubModel.create({
      name: 'Outdoor Games Club',
      description: 'For sports enthusiasts who love outdoor activities like cricket, football, volleyball, badminton, and more. Stay fit, have fun, and build team spirit!',
      coordinator: alice._id,
      members: [alice._id, bob._id, charlie._id, diana._id],
    });

    const indoorGamesClub = await ClubModel.create({
      name: 'Indoor Games Club',
      description: 'Enjoy chess, table tennis, carrom, board games, and other indoor sports. Perfect for strategic thinkers and game lovers!',
      coordinator: alice._id,
      members: [alice._id, bob._id],
    });

    console.log('✅ Clubs seeded successfully!');
    console.log('   - Debating Society:', debatingSociety._id);
    console.log('   - Music Club:', musicClub._id);
    console.log('   - Drama Club:', dramaClub._id);
    console.log('   - Photography Club:', photographyClub._id);
    console.log('   - Outdoor Games Club:', outdoorGamesClub._id);
    console.log('   - Indoor Games Club:', indoorGamesClub._id);

    console.log('\nSeeding events...');
    
    const event1 = await EventModel.create({
      title: 'Annual Debate Championship',
      description: 'The most anticipated debating event of the year. Join us for intense debates!',
      date: new Date('2025-11-15T10:00:00Z'),
      club: debatingSociety._id,
      location: 'Main Auditorium',
      status: 'approved',
      registeredUsers: [bob._id, charlie._id],
      registrationLimit: 50,
    });

    const event2 = await EventModel.create({
      title: 'Battle of the Bands',
      description: 'A fierce competition to find the best band on campus. All genres welcome!',
      date: new Date('2025-11-20T18:00:00Z'),
      club: musicClub._id,
      location: 'Amphitheatre',
      status: 'approved',
      registeredUsers: [diana._id],
      registrationLimit: 100,
    });

    const event3 = await EventModel.create({
      title: 'Thespian Night',
      description: 'An evening of captivating theatrical performances.',
      date: new Date('2025-11-25T19:00:00Z'),
      club: dramaClub._id,
      location: 'Drama Hall',
      status: 'approved',
      registeredUsers: [bob._id, charlie._id, diana._id],
      registrationLimit: 75,
    });

    const event4 = await EventModel.create({
      title: 'Photography Exhibition',
      description: 'Showcase your best shots! Annual photography exhibition.',
      date: new Date('2025-12-01T15:00:00Z'),
      club: photographyClub._id,
      location: 'Art Gallery',
      status: 'approved',
      registeredUsers: [charlie._id, diana._id],
    });

    const event5 = await EventModel.create({
      title: 'Signature Day 2026',
      description: `SIGNATURE DAY 2025 ✨
Celebrating the Graduates of 2026!

🗓 23rd October | 3:00 PM onwards
📍 Webel IT Phase 1 - Parking Area

💫 Signature Boards • Fun Games • Music
🎁 Souvenirs: Mugs & Wristbands
🏆 3 Mini Events - Winners get Lenovo 15.6' Laptop Backpacks!
👕 T-Shirts provided by the club
🍔 Refreshments available

And the celebration continues with…
🎶 SMC MUSICAL NIGHT - An evening of melodies, vibes & memories under the sky! 🌌

Let's end the day on a high note - with music, laughter, and unforgettable moments! ❤

-Team Students' Gymkhana`,
      date: new Date('2025-10-23T15:00:00+05:30'),
      club: debatingSociety._id,
      location: 'IIIT Kalyani Phase 1, Webel IT Phase 1 - Parking Area',
      status: 'approved',
      registeredUsers: [],
      registrationLimit: 200,
    });

    console.log('✅ Events seeded successfully!');
    console.log('   - Annual Debate Championship:', event1._id);
    console.log('   - Battle of the Bands:', event2._id);
    console.log('   - Thespian Night:', event3._id);
    console.log('   - Photography Exhibition:', event4._id);
    console.log('   - Signature Day 2026:', event5._id);

    await mongoose.connection.close();
    console.log('\n✅ Database connection closed.');
    console.log('\n🎉 Seeding completed successfully!');
  } catch (error) {
    console.error('\n❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
