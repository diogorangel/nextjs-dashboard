// File: lib/db-utils.ts - This file uses the client

import { clientPromise } from "@/lib/mongodb"; // Correctly imports the named export
import { MongoClient } from "mongodb";

export async function checkConnectionStatus() {
  let isConnected = false;
  try {
    // 1. Await the cached client connection promise
    const mongoClient: MongoClient = await clientPromise;

    // 2. Perform a lightweight health check (ping)
    await mongoClient.db("admin").command({ ping: 1 });
    isConnected = true;
    console.log("Successfully connected and pinged MongoDB.");

  } catch (e) {
    console.error("MongoDB connection check failed:", e);
    isConnected = false;
  }

  return isConnected;
}