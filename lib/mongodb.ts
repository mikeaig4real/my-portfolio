import mongoose from 'mongoose';
import config from '@/config';

const MONGODB_URI = config.mongodb.uri;

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongooseCache: MongooseCache | undefined;
}

let cached = global.mongooseCache;

if (!cached) {
  cached = global.mongooseCache = { conn: null, promise: null };
}

let lastMongoFailureTime = 0;
const MONGO_CIRCUIT_BREAKER_COOLDOWN_MS = 30000; // 30s cooldown before retrying an offline/unreachable cluster

export async function connectToDatabase() {
  // If already connected, return cached connection
  if (cached?.conn && mongoose.connection.readyState === 1) {
    return cached.conn;
  }

  // Circuit breaker: If MongoDB failed within the last 30s, fail fast in 0ms and use SQLite fallback
  if (Date.now() - lastMongoFailureTime < MONGO_CIRCUIT_BREAKER_COOLDOWN_MS) {
    throw new Error('MongoDB circuit breaker active (temporary cooldown due to unreachable cluster)');
  }

  if (!cached?.promise) {
    const opts: mongoose.ConnectOptions = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 2000, // Fail fast in 2s instead of default 30s so SQLite fallback triggers instantly
      connectTimeoutMS: 2500,
      socketTimeoutMS: 4000,
    };

    cached!.promise = mongoose.connect(MONGODB_URI, opts).then((mongooseInstance: typeof mongoose) => {
      return mongooseInstance;
    });
  }

  try {
    cached!.conn = await cached!.promise;
    lastMongoFailureTime = 0; // Reset circuit breaker on success
  } catch {
    cached!.promise = null;
    cached!.conn = null;
    lastMongoFailureTime = Date.now(); // Activate circuit breaker
    throw new Error('Failed to connect to MongoDB');
  }

  return cached!.conn;
}
