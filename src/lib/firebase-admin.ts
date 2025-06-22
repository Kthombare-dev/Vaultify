import { getApps, initializeApp, cert } from "firebase-admin/app";
import type { ServiceAccount } from "firebase-admin";

export function initializeFirebaseAdmin() {
  try {
    // Check if already initialized
    if (getApps().length > 0) {
      console.log("Firebase Admin already initialized");
      return;
    }

    console.log("Starting Firebase Admin initialization...");
    
    const serviceAccountStr = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
    if (!serviceAccountStr) {
      console.error("FIREBASE_SERVICE_ACCOUNT_KEY is missing in environment variables");
      throw new Error("FIREBASE_SERVICE_ACCOUNT_KEY is not defined in environment variables");
    }

    let serviceAccount: ServiceAccount;
    try {
      serviceAccount = JSON.parse(serviceAccountStr);
      console.log("Successfully parsed service account JSON. Project ID:", serviceAccount.projectId);
      
      // Log available fields for debugging
      console.log("Available service account fields:", Object.keys(serviceAccount));
      
      // Validate required fields
      const requiredFields = ['projectId', 'clientEmail', 'privateKey'];
      const missingFields = requiredFields.filter(field => !serviceAccount[field as keyof ServiceAccount]);
      
      if (missingFields.length > 0) {
        console.error("Missing required fields in service account:", missingFields);
        throw new Error(`Service account is missing required fields: ${missingFields.join(', ')}`);
      }

      console.log("All required fields present in service account");
    } catch (error) {
      console.error("Failed to parse service account JSON:", error);
      throw new Error("Failed to parse FIREBASE_SERVICE_ACCOUNT_KEY. Make sure it's a valid JSON string");
    }

    console.log("Initializing Firebase Admin with project ID:", serviceAccount.projectId);
    
    initializeApp({
      credential: cert(serviceAccount),
      databaseURL: process.env.FIREBASE_DATABASE_URL || `https://${serviceAccount.projectId}.firebaseio.com`,
    });

    console.log("Firebase Admin successfully initialized");
  } catch (error) {
    console.error("Error in Firebase Admin initialization:", error);
    throw error;
  }
} 