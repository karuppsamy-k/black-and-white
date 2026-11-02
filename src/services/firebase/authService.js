import { auth } from './firebaseConfig';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import {
  getCustomerByMobile,
  createCustomerProfile,
  getCustomerProfile,
  getShopkeeperByMobile,
  createShopkeeperProfile,
  getShopkeeperProfile,
} from './firestoreService';

/**
 * Firebase Authentication Service
 *
 * Secure Mobile + Password Architecture:
 * Mobile numbers are securely mapped to internal Firebase Auth identifiers:
 * `${mobile}.${role}@blackandwhite.auth`
 *
 * Firebase Auth natively handles salted cryptographic hashing, brute-force throttling,
 * and JWT session tokens.
 *
 * Passwords and hashes are NEVER stored in Firestore.
 */

// Helper: Normalize 10-digit Indian mobile number
export const cleanMobileNumber = (mobile) => {
  if (!mobile) return '';
  return mobile.toString().replace(/\D/g, '').slice(-10);
};

// Helper: Validate Indian 10-digit mobile number format
export const isValidMobileNumber = (mobile) => {
  const clean = cleanMobileNumber(mobile);
  return /^[6-9]\d{9}$/.test(clean);
};

// Helper: Map mobile number and role to internal Firebase Auth email
export const mobileToAuthEmail = (mobile, role = 'customer') => {
  const clean = cleanMobileNumber(mobile);
  return `${clean}.${role}@blackandwhite.auth`;
};

// Check if Firebase is operating with placeholder credentials
const isPlaceholderFirebase = () => {
  const apiKey = import.meta.env.VITE_FIREBASE_API_KEY;
  return !apiKey || apiKey.includes('your_api_key') || apiKey === '';
};

// Fallback session key for dev environments
const SESSION_STORAGE_KEY = 'bw_active_auth_session';

export const getStoredSession = () => {
  try {
    const raw = localStorage.getItem(SESSION_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const setStoredSession = (user) => {
  try {
    if (user) {
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(SESSION_STORAGE_KEY);
    }
  } catch (err) {
    console.warn('Session save error:', err);
  }
};

/**
 * -------------------------------------------------------------
 * Customer Authentication
 * -------------------------------------------------------------
 */

export const registerCustomer = async ({ fullName, mobileNumber, password, confirmPassword }) => {
  if (!fullName || !fullName.trim()) {
    throw new Error('Please enter your full name.');
  }

  const cleanMobile = cleanMobileNumber(mobileNumber);
  if (!isValidMobileNumber(cleanMobile)) {
    throw new Error('Please enter a valid 10-digit Indian mobile number (e.g. 9876543210).');
  }

  if (!password || password.length < 6) {
    throw new Error('Password must be at least 6 characters long.');
  }

  if (password !== confirmPassword) {
    throw new Error('Passwords do not match. Please re-enter.');
  }

  // 1. Prevent duplicate registrations by checking Firestore
  const existing = await getCustomerByMobile(cleanMobile);
  if (existing) {
    throw new Error('This mobile number is already registered as a customer. Please sign in instead.');
  }

  const authEmail = mobileToAuthEmail(cleanMobile, 'customer');
  let uid = `cust-${cleanMobile}-${Date.now().toString(36)}`;

  // 2. Firebase Auth Account Creation
  if (!isPlaceholderFirebase()) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, authEmail, password);
      uid = userCredential.user.uid;
    } catch (firebaseErr) {
      if (firebaseErr.code === 'auth/email-already-in-use') {
        throw new Error('This mobile number is already registered in our authentication system. Please sign in.');
      }
      throw new Error(firebaseErr.message || 'Authentication service error during registration.');
    }
  }

  // 3. Store Customer Profile in Firestore (NO PASSWORD STORED)
  const profile = await createCustomerProfile(uid, {
    fullName,
    mobileNumber: cleanMobile,
  });

  setStoredSession(profile);
  return profile;
};

export const loginCustomer = async ({ mobileNumber, password }) => {
  const cleanMobile = cleanMobileNumber(mobileNumber);
  if (!isValidMobileNumber(cleanMobile)) {
    throw new Error('Please enter a valid 10-digit Indian mobile number.');
  }

  if (!password) {
    throw new Error('Please enter your password.');
  }

  // 1. Check if customer exists in Firestore
  const customer = await getCustomerByMobile(cleanMobile);
  if (!customer) {
    throw new Error('No customer account found with this mobile number. Please register first.');
  }

  // 2. Check account status
  if (customer.accountStatus === 'Inactive') {
    throw new Error('Your customer account has been deactivated by the administrator. Please contact support.');
  }

  // 3. Authenticate with Firebase Auth
  const authEmail = mobileToAuthEmail(cleanMobile, 'customer');
  if (!isPlaceholderFirebase()) {
    try {
      await signInWithEmailAndPassword(auth, authEmail, password);
    } catch (firebaseErr) {
      if (firebaseErr.code === 'auth/invalid-credential' || firebaseErr.code === 'auth/wrong-password') {
        throw new Error('Invalid mobile number or password. Please verify your credentials.');
      }
      throw new Error(firebaseErr.message || 'Authentication failed. Please try again.');
    }
  }

  setStoredSession(customer);
  return customer;
};

/**
 * -------------------------------------------------------------
 * Shopkeeper Authentication
 * -------------------------------------------------------------
 */

export const registerShopkeeper = async (data) => {
  const { fullName, mobileNumber, password, confirmPassword, shopName, email, city, fssai, gstin } = data;

  if (!fullName || !fullName.trim()) throw new Error('Please enter proprietor full name.');
  if (!shopName || !shopName.trim()) throw new Error('Please enter sweet shop trade name.');

  const cleanMobile = cleanMobileNumber(mobileNumber);
  if (!isValidMobileNumber(cleanMobile)) {
    throw new Error('Please enter a valid 10-digit registered mobile number.');
  }

  if (!password || password.length < 6) {
    throw new Error('Password must be at least 6 characters long.');
  }

  if (password !== confirmPassword) {
    throw new Error('Passwords do not match. Please re-enter.');
  }

  if (!fssai || !fssai.trim()) {
    throw new Error('FSSAI license number is required for sweet shop verification.');
  }

  // 1. Prevent duplicate shopkeeper registrations
  const existing = await getShopkeeperByMobile(cleanMobile);
  if (existing) {
    throw new Error('A shopkeeper account is already registered with this mobile number.');
  }

  const authEmail = mobileToAuthEmail(cleanMobile, 'shopkeeper');
  let uid = `sk-${cleanMobile}-${Date.now().toString(36)}`;

  // 2. Create Firebase Auth user
  if (!isPlaceholderFirebase()) {
    try {
      const cred = await createUserWithEmailAndPassword(auth, authEmail, password);
      uid = cred.user.uid;
    } catch (firebaseErr) {
      if (firebaseErr.code === 'auth/email-already-in-use') {
        throw new Error('This mobile number is already registered in our authentication system.');
      }
      throw new Error(firebaseErr.message || 'Authentication error during shopkeeper registration.');
    }
  }

  // 3. Store in Firestore shopkeepers collection with Pending approval
  const profile = await createShopkeeperProfile(uid, {
    fullName,
    mobileNumber: cleanMobile,
    shopName,
    email,
    city,
    fssai,
    gstin,
  });

  return profile;
};

export const loginShopkeeper = async ({ mobileNumber, password }) => {
  const cleanMobile = cleanMobileNumber(mobileNumber);
  if (!isValidMobileNumber(cleanMobile)) {
    throw new Error('Please enter a valid 10-digit registered mobile number.');
  }

  if (!password) {
    throw new Error('Please enter your password.');
  }

  // 1. Fetch shopkeeper record from Firestore
  const shopkeeper = await getShopkeeperByMobile(cleanMobile);
  if (!shopkeeper) {
    throw new Error('No merchant account registered with this mobile number. Please register your shop first.');
  }

  // 2. Authenticate with Firebase Auth
  const authEmail = mobileToAuthEmail(cleanMobile, 'shopkeeper');
  if (!isPlaceholderFirebase()) {
    try {
      await signInWithEmailAndPassword(auth, authEmail, password);
    } catch (firebaseErr) {
      if (firebaseErr.code === 'auth/invalid-credential' || firebaseErr.code === 'auth/wrong-password') {
        throw new Error('Invalid mobile number or password.');
      }
      throw new Error(firebaseErr.message || 'Authentication failed. Please verify credentials.');
    }
  }

  // 3. Enforce Strict Account & Approval Status Checks:
  if (shopkeeper.approvalStatus === 'Pending') {
    const err = new Error('Your shopkeeper account is pending administrator approval. You will receive access once your FSSAI license is verified.');
    err.code = 'PENDING_APPROVAL';
    throw err;
  }

  if (shopkeeper.approvalStatus === 'Rejected') {
    const err = new Error('Your shopkeeper registration application has been rejected by administrators. Please contact merchant support.');
    err.code = 'REJECTED';
    throw err;
  }

  if (shopkeeper.accountStatus === 'Inactive') {
    const err = new Error('Your shopkeeper account has been deactivated. Please contact administrator.');
    err.code = 'DEACTIVATED';
    throw err;
  }

  setStoredSession(shopkeeper);
  return shopkeeper;
};

/**
 * -------------------------------------------------------------
 * Admin Authentication
 * -------------------------------------------------------------
 */

export const loginAdmin = async ({ email, password }) => {
  if (!email || !password) {
    throw new Error('Please enter admin email and passkey.');
  }

  if (!isPlaceholderFirebase()) {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (_firebaseErr) {
      throw new Error('Invalid administrator credentials.');
    }
  }

  const adminUser = {
    uid: 'admin-super-001',
    fullName: 'Super Administrator',
    email,
    role: 'admin',
    accountStatus: 'Active',
  };

  setStoredSession(adminUser);
  return adminUser;
};

/**
 * -------------------------------------------------------------
 * Session & Logout
 * -------------------------------------------------------------
 */

export const logoutUser = async () => {
  if (!isPlaceholderFirebase()) {
    try {
      await signOut(auth);
    } catch (e) {
      console.warn('Sign out error:', e);
    }
  }
  setStoredSession(null);
  return true;
};

export const subscribeToAuthChanges = (callback) => {
  if (!isPlaceholderFirebase()) {
    return onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Look up profile in Firestore
        const cust = await getCustomerProfile(firebaseUser.uid);
        if (cust) {
          callback(cust);
          return;
        }
        const sk = await getShopkeeperProfile(firebaseUser.uid);
        if (sk) {
          callback(sk);
          return;
        }
      }
      callback(getStoredSession());
    });
  }

  // Fallback observer
  callback(getStoredSession());
  return () => {};
};

export default {
  cleanMobileNumber,
  isValidMobileNumber,
  mobileToAuthEmail,
  registerCustomer,
  loginCustomer,
  registerShopkeeper,
  loginShopkeeper,
  loginAdmin,
  logoutUser,
  subscribeToAuthChanges,
  getStoredSession,
  setStoredSession,
};
