import mongoose, { Mongoose } from 'mongoose';

// --- FIX START ---
// Extend the NodeJS global type to include our mongoose cached connection
declare global {
  var mongoose: {
    promise: Promise<Mongoose> | null;
    conn: Mongoose | null;
  };
}
// --- FIX END ---


/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  // Read MONGODB_URI inside the function so it gets the value after dotenv loads
  const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/iiit-kalyani-gymkhana';
  
  console.log('[dbConnect] MONGODB_URI:', MONGODB_URI);

  if (!MONGODB_URI) {
    throw new Error(
      'Please define the MONGODB_URI environment variable inside .env.local'
    );
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }
  
  try {
    cached.conn = await cached.promise;
  } catch (e) {
    // If the connection fails, reset the promise so we can try again.
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default dbConnect;
