import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const options = {};

let client;
let clientPromise;

if (!uri) {
  // During build, Next.js might not have access to .env.local for static analysis.
  // We return a promise that will reject if it's actually used at runtime without a URI.
  if (process.env.NODE_ENV === 'production') {
    clientPromise = Promise.reject(new Error('MONGODB_URI is not defined in the environment.'));
  } else {
    // In development or if it's really missing, it will still error out but maybe later.
    clientPromise = Promise.resolve(null); 
  }
} else {
  if (process.env.NODE_ENV === 'development') {
    if (!global._mongoClientPromise) {
      client = new MongoClient(uri, options);
      global._mongoClientPromise = client.connect();
    }
    clientPromise = global._mongoClientPromise;
  } else {
    client = new MongoClient(uri, options);
    clientPromise = client.connect();
  }
}

export default clientPromise;
