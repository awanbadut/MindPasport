import { MongoClient, Db } from "mongodb";

// Singleton MongoDB client untuk Next.js serverless (Vercel)
// Menggunakan global cache agar koneksi tidak dibuat ulang di setiap request

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.warn("[MongoDB] MONGODB_URI tidak dikonfigurasi — fitur audit log dinonaktifkan.");
}

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

let clientPromise: Promise<MongoClient> | null = null;

if (MONGODB_URI) {
  if (process.env.NODE_ENV === "development") {
    if (!global._mongoClientPromise) {
      const client = new MongoClient(MONGODB_URI);
      global._mongoClientPromise = client.connect();
    }
    clientPromise = global._mongoClientPromise;
  } else {
    const client = new MongoClient(MONGODB_URI);
    clientPromise = client.connect();
  }
}

export async function getMongoDb(): Promise<Db | null> {
  if (!clientPromise) return null;
  try {
    const client = await clientPromise;
    return client.db("mindpassport");
  } catch (err) {
    console.error("[MongoDB] Gagal connect:", err);
    return null;
  }
}

export default clientPromise;
