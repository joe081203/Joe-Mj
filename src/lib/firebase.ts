import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  getDoc, 
  setDoc, 
  collection, 
  query, 
  where, 
  getDocs,
  getDocFromServer,
  onSnapshot,
  deleteDoc
} from 'firebase/firestore';
import { 
  getStorage, 
  ref, 
  uploadBytes, 
  getDownloadURL 
} from 'firebase/storage';
import firebaseConfig from '../../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);

// CRITICAL: Must use firestoreDatabaseId from firebase-applet-config.json
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();

// Configurable Owner / Admin email with fallback to prompt email
export const OWNER_EMAIL = (import.meta.env.VITE_OWNER_EMAIL || 'mjjoe1614@gmail.com').toLowerCase();

export const isOwnerUser = (user: User | null): boolean => {
  if (!user || !user.email) return false;
  return user.email.toLowerCase() === OWNER_EMAIL;
};

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Test connection on boot
export async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firebase client appears offline or connecting.');
    }
  }
}
testConnection();

// Upload Product Image to Firebase Storage (with base64 fallback for sandbox constraints)
export const uploadProductImage = async (file: File, productId: string): Promise<string> => {
  try {
    // Attempt Firebase Storage upload
    const cleanFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const storagePath = `products/${productId}/${Date.now()}_${cleanFileName}`;
    const storageReference = ref(storage, storagePath);
    
    const snapshot = await uploadBytes(storageReference, file);
    const downloadUrl = await getDownloadURL(snapshot.ref);
    return downloadUrl;
  } catch (storageErr) {
    console.warn('Firebase Storage direct upload failed or bucket uninitialized, using responsive data URL:', storageErr);
    
    // Reliable fallback: convert file to compressed image data URL
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (typeof e.target?.result === 'string') {
          resolve(e.target.result);
        } else {
          reject(new Error('Failed to read image file'));
        }
      };
      reader.onerror = () => reject(new Error('Failed to read image file'));
      reader.readAsDataURL(file);
    });
  }
};

// Auth helper functions
export const signInWithGoogle = async (): Promise<User> => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    // Sync user profile to Firestore
    if (result.user) {
      const userRef = doc(db, 'users', result.user.uid);
      const isOwner = result.user.email?.toLowerCase() === OWNER_EMAIL;
      
      await setDoc(userRef, {
        userId: result.user.uid,
        email: result.user.email || '',
        displayName: result.user.displayName || (isOwner ? 'Atelier Owner' : 'LITUS Collector'),
        role: isOwner ? 'admin' : 'customer',
        photoURL: result.user.photoURL || '',
        walletAddress: `0x${result.user.uid.slice(0, 4)}...${result.user.uid.slice(-4)}`,
        createdAt: new Date().toISOString()
      }, { merge: true });
    }
    return result.user;
  } catch (err: any) {
    console.error('Google Auth Error:', err);
    throw err;
  }
};

export const logOutUser = async () => {
  await firebaseSignOut(auth);
};
