const admin = require('firebase-admin');

// Initialize with individual environment variables
const project_id = process.env.FIREBASE_PROJECT_ID;
const client_email = process.env.FIREBASE_CLIENT_EMAIL;
let private_key = process.env.FIREBASE_PRIVATE_KEY;

if (private_key) {
  // Ensure escaped newlines are converted to actual newlines
  private_key = private_key.replace(/\\n/g, '\n');
}

if (!admin.apps.length) {
  if (project_id && client_email && private_key) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: project_id,
        clientEmail: client_email,
        privateKey: private_key
      }),
    });
    console.log('✅ Firebase Admin initialized with project:', project_id);
  } else {
    console.warn('⚠️ Firebase Admin NOT initialized. Please check FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY in .env');
  }
}

module.exports = admin;
