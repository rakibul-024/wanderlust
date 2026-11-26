import { MongoClient, type Db } from "mongodb";

const DB_NAME = "wanderlustDB";

interface CachedMongo {
  client: MongoClient;
  db: Db;
}

const globalWithMongo = globalThis as typeof globalThis & {
  __wanderlustMongo?: CachedMongo;
};

function getMongo(): CachedMongo {
  const cached = globalWithMongo.__wanderlustMongo;
  if (cached) return cached;

  const client = new MongoClient(process.env.MONGODB_URL ?? "");
  const fresh: CachedMongo = { client, db: client.db(DB_NAME) };
  globalWithMongo.__wanderlustMongo = fresh;
  return fresh;
}

const mongo = getMongo();

export const client = mongo.client;
export const db = mongo.db;
