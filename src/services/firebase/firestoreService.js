import { db } from './firebaseConfig';
import {
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  getDocs,
  query,
  where,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';

/**
 * Cloud Firestore Service
 * Strict schemas for:
 * - users (Customers)
 * - shopkeepers (Merchants)
 * - admins (Superadministrators)
 *
 * Passwords and authentication credentials are NEVER stored in Firestore.
 */

export const COLLECTIONS = {
  USERS: 'users',
  SHOPKEEPERS: 'shopkeepers',
  ADMINS: 'admins',
  PRODUCTS: 'products',
  ORDERS: 'orders',
};

// Prepared Collection References
export const usersCollectionRef = collection(db, COLLECTIONS.USERS);
export const shopkeepersCollectionRef = collection(db, COLLECTIONS.SHOPKEEPERS);
export const adminsCollectionRef = collection(db, COLLECTIONS.ADMINS);
export const productsCollectionRef = collection(db, COLLECTIONS.PRODUCTS);
export const ordersCollectionRef = collection(db, COLLECTIONS.ORDERS);

// Check if Firebase is operating with placeholder credentials
const isPlaceholderFirebase = () => {
  const apiKey = import.meta.env.VITE_FIREBASE_API_KEY;
  return !apiKey || apiKey.includes('your_api_key') || apiKey === '';
};

// Local storage fallback helpers for testing when Firebase credentials are placeholders
const LOCAL_STORAGE_KEYS = {
  USERS: 'bw_firestore_users',
  SHOPKEEPERS: 'bw_firestore_shopkeepers',
  ADMINS: 'bw_firestore_admins',
};

const getLocalCollection = (key) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

const saveLocalCollection = (key, items) => {
  try {
    localStorage.setItem(key, JSON.stringify(items));
  } catch (err) {
    console.warn('LocalStorage save error:', err);
  }
};

// Initialize initial seed records in local fallback if empty
const initFallbackIfEmpty = () => {
  const shopkeepers = getLocalCollection(LOCAL_STORAGE_KEYS.SHOPKEEPERS);
  if (shopkeepers.length === 0) {
    const initialShopkeepers = [
      {
        uid: 'sk-madurai-101',
        fullName: 'Sundaram Iyer',
        mobileNumber: '9842111222',
        shopName: 'Madurai Meenakshi Sweets',
        email: 'meenakshi.sweets@gmail.com',
        city: 'Madurai',
        role: 'shopkeeper',
        approvalStatus: 'Approved',
        accountStatus: 'Active',
        fssai: '12421008000451',
        createdAt: new Date('2026-01-10').toISOString(),
      },
      {
        uid: 'sk-nellai-102',
        fullName: 'Nellaiappan V.',
        mobileNumber: '9443033444',
        shopName: 'Tirunelveli Irutu Kadai Halwa',
        email: 'nellai.halwa@gmail.com',
        city: 'Tirunelveli',
        role: 'shopkeeper',
        approvalStatus: 'Approved',
        accountStatus: 'Active',
        fssai: '12419011000122',
        createdAt: new Date('2026-01-15').toISOString(),
      },
      {
        uid: 'sk-cbe-103',
        fullName: 'Palanisamy G.',
        mobileNumber: '9842377889',
        shopName: 'Kovai Kadalai Mittai Mills',
        email: 'kovai.mittai@gmail.com',
        city: 'Coimbatore',
        role: 'shopkeeper',
        approvalStatus: 'Pending',
        accountStatus: 'Inactive',
        fssai: '12426009000118',
        createdAt: new Date('2026-02-01').toISOString(),
      },
    ];
    saveLocalCollection(LOCAL_STORAGE_KEYS.SHOPKEEPERS, initialShopkeepers);
  }

  const users = getLocalCollection(LOCAL_STORAGE_KEYS.USERS);
  if (users.length === 0) {
    const initialCustomers = [
      {
        uid: 'cust-karuppu-001',
        fullName: 'Karuppasamy',
        mobileNumber: '9876543210',
        role: 'customer',
        accountStatus: 'Active',
        createdAt: new Date('2026-01-05').toISOString(),
      },
      {
        uid: 'cust-shalini-002',
        fullName: 'Shalini S.',
        mobileNumber: '9443211223',
        role: 'customer',
        accountStatus: 'Active',
        createdAt: new Date('2026-01-20').toISOString(),
      },
    ];
    saveLocalCollection(LOCAL_STORAGE_KEYS.USERS, initialCustomers);
  }
};

// Initialize fallback seed if needed
if (typeof window !== 'undefined') {
  initFallbackIfEmpty();
}

/**
 * -------------------------------------------------------------
 * Customer Profile Operations (users collection)
 * -------------------------------------------------------------
 */

export const getCustomerByMobile = async (mobileNumber) => {
  const clean = mobileNumber.replace(/\D/g, '').slice(-10);

  if (!isPlaceholderFirebase()) {
    try {
      const q = query(usersCollectionRef, where('mobileNumber', '==', clean));
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        const docSnap = snapshot.docs[0];
        return { uid: docSnap.id, ...docSnap.data() };
      }
      return null;
    } catch (e) {
      console.warn('[Firestore] Error in getCustomerByMobile, falling back to local store:', e.message);
    }
  }

  // Fallback
  const users = getLocalCollection(LOCAL_STORAGE_KEYS.USERS);
  return users.find((u) => u.mobileNumber === clean) || null;
};

export const createCustomerProfile = async (uid, data) => {
  const cleanMobile = data.mobileNumber.replace(/\D/g, '').slice(-10);
  const profile = {
    uid,
    fullName: data.fullName.trim(),
    mobileNumber: cleanMobile,
    role: 'customer',
    accountStatus: 'Active',
    createdAt: new Date().toISOString(),
  };

  if (!isPlaceholderFirebase()) {
    try {
      await setDoc(doc(db, COLLECTIONS.USERS, uid), {
        ...profile,
        serverTimestamp: serverTimestamp(),
      });
    } catch (e) {
      console.warn('[Firestore] Error in createCustomerProfile, persisting locally:', e.message);
    }
  }

  // Always update local storage mirror
  const users = getLocalCollection(LOCAL_STORAGE_KEYS.USERS);
  const filtered = users.filter((u) => u.uid !== uid && u.mobileNumber !== cleanMobile);
  filtered.push(profile);
  saveLocalCollection(LOCAL_STORAGE_KEYS.USERS, filtered);

  return profile;
};

export const getCustomerProfile = async (uid) => {
  if (!isPlaceholderFirebase()) {
    try {
      const snap = await getDoc(doc(db, COLLECTIONS.USERS, uid));
      if (snap.exists()) {
        return { uid: snap.id, ...snap.data() };
      }
    } catch (e) {
      console.warn('[Firestore] Error in getCustomerProfile:', e.message);
    }
  }

  const users = getLocalCollection(LOCAL_STORAGE_KEYS.USERS);
  return users.find((u) => u.uid === uid) || null;
};

export const getAllCustomers = async () => {
  if (!isPlaceholderFirebase()) {
    try {
      const q = query(usersCollectionRef, orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      const list = [];
      snapshot.forEach((d) => list.push({ uid: d.id, ...d.data() }));
      if (list.length > 0) return list;
    } catch (e) {
      console.warn('[Firestore] Error in getAllCustomers, using local storage:', e.message);
    }
  }

  return getLocalCollection(LOCAL_STORAGE_KEYS.USERS);
};

export const updateCustomerStatus = async (uid, accountStatus) => {
  if (!isPlaceholderFirebase()) {
    try {
      await updateDoc(doc(db, COLLECTIONS.USERS, uid), { accountStatus });
    } catch (e) {
      console.warn('[Firestore] Error updating customer status:', e.message);
    }
  }

  const users = getLocalCollection(LOCAL_STORAGE_KEYS.USERS);
  const updated = users.map((u) => (u.uid === uid ? { ...u, accountStatus } : u));
  saveLocalCollection(LOCAL_STORAGE_KEYS.USERS, updated);
  return true;
};

/**
 * -------------------------------------------------------------
 * Shopkeeper Profile Operations (shopkeepers collection)
 * -------------------------------------------------------------
 */

export const getShopkeeperByMobile = async (mobileNumber) => {
  const clean = mobileNumber.replace(/\D/g, '').slice(-10);

  if (!isPlaceholderFirebase()) {
    try {
      const q = query(shopkeepersCollectionRef, where('mobileNumber', '==', clean));
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        const docSnap = snapshot.docs[0];
        return { uid: docSnap.id, ...docSnap.data() };
      }
      return null;
    } catch (e) {
      console.warn('[Firestore] Error in getShopkeeperByMobile:', e.message);
    }
  }

  const shopkeepers = getLocalCollection(LOCAL_STORAGE_KEYS.SHOPKEEPERS);
  return shopkeepers.find((s) => s.mobileNumber === clean) || null;
};

export const createShopkeeperProfile = async (uid, data) => {
  const cleanMobile = data.mobileNumber.replace(/\D/g, '').slice(-10);
  const profile = {
    uid,
    fullName: data.fullName.trim(),
    mobileNumber: cleanMobile,
    shopName: data.shopName.trim(),
    email: data.email ? data.email.trim() : '',
    city: data.city || 'Madurai',
    role: 'shopkeeper',
    approvalStatus: 'Pending',
    accountStatus: 'Inactive',
    fssai: data.fssai || '',
    gstin: data.gstin || '',
    createdAt: new Date().toISOString(),
  };

  if (!isPlaceholderFirebase()) {
    try {
      await setDoc(doc(db, COLLECTIONS.SHOPKEEPERS, uid), {
        ...profile,
        serverTimestamp: serverTimestamp(),
      });
    } catch (e) {
      console.warn('[Firestore] Error in createShopkeeperProfile:', e.message);
    }
  }

  const shopkeepers = getLocalCollection(LOCAL_STORAGE_KEYS.SHOPKEEPERS);
  const filtered = shopkeepers.filter((s) => s.uid !== uid && s.mobileNumber !== cleanMobile);
  filtered.push(profile);
  saveLocalCollection(LOCAL_STORAGE_KEYS.SHOPKEEPERS, filtered);

  return profile;
};

export const getShopkeeperProfile = async (uid) => {
  if (!isPlaceholderFirebase()) {
    try {
      const snap = await getDoc(doc(db, COLLECTIONS.SHOPKEEPERS, uid));
      if (snap.exists()) {
        return { uid: snap.id, ...snap.data() };
      }
    } catch (e) {
      console.warn('[Firestore] Error in getShopkeeperProfile:', e.message);
    }
  }

  const shopkeepers = getLocalCollection(LOCAL_STORAGE_KEYS.SHOPKEEPERS);
  return shopkeepers.find((s) => s.uid === uid) || null;
};

export const getAllShopkeepers = async () => {
  if (!isPlaceholderFirebase()) {
    try {
      const q = query(shopkeepersCollectionRef, orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      const list = [];
      snapshot.forEach((d) => list.push({ uid: d.id, ...d.data() }));
      if (list.length > 0) return list;
    } catch (e) {
      console.warn('[Firestore] Error in getAllShopkeepers:', e.message);
    }
  }

  return getLocalCollection(LOCAL_STORAGE_KEYS.SHOPKEEPERS);
};

export const updateShopkeeperApproval = async (uid, approvalStatus, _accountStatus = 'Active') => {
  const newAccountStatus = approvalStatus === 'Approved' ? 'Active' : 'Inactive';

  if (!isPlaceholderFirebase()) {
    try {
      await updateDoc(doc(db, COLLECTIONS.SHOPKEEPERS, uid), {
        approvalStatus,
        accountStatus: newAccountStatus,
      });
    } catch (e) {
      console.warn('[Firestore] Error in updateShopkeeperApproval:', e.message);
    }
  }

  const shopkeepers = getLocalCollection(LOCAL_STORAGE_KEYS.SHOPKEEPERS);
  const updated = shopkeepers.map((s) =>
    s.uid === uid ? { ...s, approvalStatus, accountStatus: newAccountStatus } : s
  );
  saveLocalCollection(LOCAL_STORAGE_KEYS.SHOPKEEPERS, updated);
  return true;
};

export const updateShopkeeperStatus = async (uid, accountStatus) => {
  if (!isPlaceholderFirebase()) {
    try {
      await updateDoc(doc(db, COLLECTIONS.SHOPKEEPERS, uid), { accountStatus });
    } catch (e) {
      console.warn('[Firestore] Error in updateShopkeeperStatus:', e.message);
    }
  }

  const shopkeepers = getLocalCollection(LOCAL_STORAGE_KEYS.SHOPKEEPERS);
  const updated = shopkeepers.map((s) => (s.uid === uid ? { ...s, accountStatus } : s));
  saveLocalCollection(LOCAL_STORAGE_KEYS.SHOPKEEPERS, updated);
  return true;
};

export default {
  COLLECTIONS,
  usersCollectionRef,
  shopkeepersCollectionRef,
  adminsCollectionRef,
  productsCollectionRef,
  ordersCollectionRef,
  getCustomerByMobile,
  createCustomerProfile,
  getCustomerProfile,
  getAllCustomers,
  updateCustomerStatus,
  getShopkeeperByMobile,
  createShopkeeperProfile,
  getShopkeeperProfile,
  getAllShopkeepers,
  updateShopkeeperApproval,
  updateShopkeeperStatus,
};
