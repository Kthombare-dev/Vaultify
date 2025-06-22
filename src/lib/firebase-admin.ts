import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

function validateEnvironmentVariables() {
  const requiredVars = [
    'FIREBASE_PROJECT_ID',
    'FIREBASE_PRIVATE_KEY_ID',
    'FIREBASE_PRIVATE_KEY',
    'FIREBASE_CLIENT_EMAIL',
    'FIREBASE_CLIENT_ID',
    'FIREBASE_CLIENT_CERT_URL'
  ];

  const missingVars = requiredVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
  }
}

function formatPrivateKey(key: string | undefined): string {
  if (!key) throw new Error('FIREBASE_PRIVATE_KEY is undefined');
  
  // Handle both formats of line breaks that Vercel might use
  if (key.includes('\\n')) {
    return key.replace(/\\n/g, '\n');
  }
  
  // If the key is already properly formatted or uses actual line breaks
  return key;
}

const firebaseAdminConfig = {
  type: 'service_account',
  project_id: process.env.FIREBASE_PROJECT_ID,
  private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
  private_key: formatPrivateKey(process.env.FIREBASE_PRIVATE_KEY),
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  client_id: process.env.FIREBASE_CLIENT_ID,
  auth_uri: 'https://accounts.google.com/o/oauth2/auth',
  token_uri: 'https://oauth2.googleapis.com/token',
  auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
  client_x509_cert_url: process.env.FIREBASE_CLIENT_CERT_URL,
};

export function initAdmin() {
  try {
    if (getApps().length === 0) {
      validateEnvironmentVariables();
      
      console.log('Initializing Firebase Admin with config:', {
        projectId: firebaseAdminConfig.project_id,
        clientEmail: firebaseAdminConfig.client_email,
        privateKeyId: firebaseAdminConfig.private_key_id,
        hasPrivateKey: !!firebaseAdminConfig.private_key,
        privateKeyLength: firebaseAdminConfig.private_key?.length
      });

      initializeApp({
        credential: cert(firebaseAdminConfig),
      });

      // Initialize Firestore to verify connection
      const db = getFirestore();
      console.log('Firebase Admin initialized successfully');
      return db;
    }
    return getFirestore();
  } catch (error) {
    console.error('Error initializing Firebase Admin:', error);
    if (error instanceof Error) {
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      });
    }
    throw error;
  }
} 