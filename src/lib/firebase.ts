import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  doc,
  getDocs,
  setDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
  Unsubscribe,
} from 'firebase/firestore';
import { TourPackage, SiteConfig } from '../types';
const resolvedConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || '',
};

// Initialize Firebase App safely (singleton)
const app = !getApps().length ? initializeApp(resolvedConfig) : getApp();

export const db = getFirestore(app);

export interface FirestoreBooking {
  id: string;
  packageSlug: string;
  packageTitle: string;
  fullName: string;
  phone: string;
  email?: string;
  travelDate: string;
  travelersCount: number;
  specialRequests?: string;
  totalEstimatedBDT: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: any;
}

/**
 * Subscribe to packages collection in real-time
 */
export function subscribeToPackages(onUpdate: (packages: TourPackage[]) => void): Unsubscribe {
  try {
    const packagesRef = collection(db, 'packages');
    return onSnapshot(
      packagesRef,
      (snapshot) => {
        if (!snapshot.empty) {
          const cloudPackages: TourPackage[] = [];
          snapshot.forEach((docSnap) => {
            cloudPackages.push(docSnap.data() as TourPackage);
          });
          onUpdate(cloudPackages);
        }
      },
      (error) => {
        console.warn('Firestore packages real-time sync note:', error.message);
      }
    );
  } catch (err) {
    console.warn('Could not establish packages snapshot listener:', err);
    return () => {};
  }
}

/**
 * Save or update a single package in Firestore
 */
export async function savePackageToFirestore(pkg: TourPackage): Promise<void> {
  const docRef = doc(db, 'packages', pkg.id);
  await setDoc(docRef, { ...pkg, updatedAt: serverTimestamp() }, { merge: true });
}

/**
 * Delete a package from Firestore
 */
export async function deletePackageFromFirestore(pkgId: string): Promise<void> {
  const docRef = doc(db, 'packages', pkgId);
  await deleteDoc(docRef);
}

/**
 * Seed initial sample packages into Firestore
 */
export async function seedDefaultPackagesToFirestore(defaultPackages: TourPackage[]): Promise<number> {
  let count = 0;
  for (const pkg of defaultPackages) {
    const docRef = doc(db, 'packages', pkg.id);
    await setDoc(docRef, { ...pkg, updatedAt: serverTimestamp() }, { merge: true });
    count++;
  }
  return count;
}

/**
 * Subscribe to site configuration in real-time
 */
export function subscribeToSiteConfig(onUpdate: (config: SiteConfig) => void): Unsubscribe {
  try {
    const configDocRef = doc(db, 'site_config', 'main');
    return onSnapshot(
      configDocRef,
      (docSnap) => {
        if (docSnap.exists()) {
          onUpdate(docSnap.data() as SiteConfig);
        }
      },
      (error) => {
        console.warn('Firestore site_config sync note:', error.message);
      }
    );
  } catch (err) {
    console.warn('Could not establish config snapshot listener:', err);
    return () => {};
  }
}

/**
 * Save site configuration to Firestore
 */
export async function saveSiteConfigToFirestore(newConfig: SiteConfig): Promise<void> {
  const docRef = doc(db, 'site_config', 'main');
  await setDoc(docRef, { ...newConfig, updatedAt: serverTimestamp() }, { merge: true });
}

/**
 * Submit a customer booking to Firestore
 */
export async function submitBookingToFirestore(bookingData: Omit<FirestoreBooking, 'id' | 'createdAt' | 'status'>): Promise<string> {
  const bookingId = `book-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
  const docRef = doc(db, 'bookings', bookingId);
  
  await setDoc(docRef, {
    ...bookingData,
    id: bookingId,
    status: 'pending',
    createdAt: serverTimestamp(),
  });

  return bookingId;
}

/**
 * Fetch all bookings for admin dashboard
 */
export async function fetchBookingsFromFirestore(): Promise<FirestoreBooking[]> {
  try {
    const bookingsRef = collection(db, 'bookings');
    const snapshot = await getDocs(bookingsRef);
    const bookings: FirestoreBooking[] = [];
    snapshot.forEach((docSnap) => {
      bookings.push(docSnap.data() as FirestoreBooking);
    });
    // Sort newest first
    return bookings.sort((a, b) => (b.id > a.id ? 1 : -1));
  } catch (err) {
    console.warn('Failed to fetch bookings from Firestore:', err);
    return [];
  }
}

/**
 * Update booking status (confirmed / cancelled)
 */
export async function updateBookingStatusInFirestore(bookingId: string, status: 'pending' | 'confirmed' | 'cancelled'): Promise<void> {
  const docRef = doc(db, 'bookings', bookingId);
  await setDoc(docRef, { status, updatedAt: serverTimestamp() }, { merge: true });
}
