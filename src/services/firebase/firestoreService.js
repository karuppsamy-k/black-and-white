import { db } from './firebaseConfig';
import {
  collection,
  doc,
  getDoc,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
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
 * - products (Artisan Sweets & Snacks)
 * - orders (Customer Deliveries)
 *
 * Passwords and authentication credentials are NEVER stored in Firestore.
 * Production launch state: Collections start empty and populate with real user activity.
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
  PRODUCTS: 'bw_firestore_products',
  ORDERS: 'bw_firestore_orders',
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
      return list;
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
 * Shopkeeper / Shop Profile Operations (shopkeepers collection)
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
    id: uid,
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
    tagline: data.tagline || 'Artisan South Indian Sweets & Savouries',
    location: data.location || `${data.city || 'Madurai'}, Tamil Nadu`,
    deliveryTime: data.deliveryTime || '30-45 mins',
    rating: 5.0,
    reviewsCount: 0,
    categories: ['Sweets', 'Savouries'],
    image: data.image || 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=500&auto=format&fit=crop&q=80',
    banner: data.banner || 'https://images.unsplash.com/photo-1544025162-d76694265947?w=1000&auto=format&fit=crop&q=80',
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
        return { uid: snap.id, id: snap.id, ...snap.data() };
      }
    } catch (e) {
      console.warn('[Firestore] Error in getShopkeeperProfile:', e.message);
    }
  }

  const shopkeepers = getLocalCollection(LOCAL_STORAGE_KEYS.SHOPKEEPERS);
  return shopkeepers.find((s) => s.uid === uid || s.id === uid) || null;
};

export const getAllShopkeepers = async () => {
  if (!isPlaceholderFirebase()) {
    try {
      const q = query(shopkeepersCollectionRef, orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      const list = [];
      snapshot.forEach((d) => list.push({ uid: d.id, id: d.id, ...d.data() }));
      return list;
    } catch (e) {
      console.warn('[Firestore] Error in getAllShopkeepers:', e.message);
    }
  }

  return getLocalCollection(LOCAL_STORAGE_KEYS.SHOPKEEPERS);
};

// Customer-facing verified sweet shops
export const getAllShops = async () => {
  const all = await getAllShopkeepers();
  return all.filter((s) => s.approvalStatus === 'Approved' && s.accountStatus === 'Active');
};

export const getShopById = async (shopId) => {
  return await getShopkeeperProfile(shopId);
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

/**
 * -------------------------------------------------------------
 * Products Operations (products collection)
 * -------------------------------------------------------------
 */

export const getAllProducts = async () => {
  if (!isPlaceholderFirebase()) {
    try {
      const q = query(productsCollectionRef, orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      const list = [];
      snapshot.forEach((d) => list.push({ id: d.id, ...d.data() }));
      return list;
    } catch (e) {
      console.warn('[Firestore] Error in getAllProducts:', e.message);
    }
  }

  return getLocalCollection(LOCAL_STORAGE_KEYS.PRODUCTS);
};

export const getProductsByShop = async (shopId) => {
  if (!isPlaceholderFirebase()) {
    try {
      const q = query(productsCollectionRef, where('shopId', '==', shopId));
      const snapshot = await getDocs(q);
      const list = [];
      snapshot.forEach((d) => list.push({ id: d.id, ...d.data() }));
      return list;
    } catch (e) {
      console.warn('[Firestore] Error in getProductsByShop:', e.message);
    }
  }

  const products = getLocalCollection(LOCAL_STORAGE_KEYS.PRODUCTS);
  return products.filter((p) => p.shopId === shopId);
};

export const getProductById = async (productId) => {
  if (!isPlaceholderFirebase()) {
    try {
      const snap = await getDoc(doc(db, COLLECTIONS.PRODUCTS, productId));
      if (snap.exists()) {
        return { id: snap.id, ...snap.data() };
      }
    } catch (e) {
      console.warn('[Firestore] Error in getProductById:', e.message);
    }
  }

  const products = getLocalCollection(LOCAL_STORAGE_KEYS.PRODUCTS);
  return products.find((p) => p.id === productId) || null;
};

export const createProduct = async (productData) => {
  const newProduct = {
    ...productData,
    price: Number(productData.price) || 0,
    stock: Number(productData.stock) || 0,
    status: (Number(productData.stock) || 0) > 0 ? 'In Stock' : 'Out of Stock',
    createdAt: new Date().toISOString(),
  };

  let createdId = `prod-${Date.now()}`;

  if (!isPlaceholderFirebase()) {
    try {
      const docRef = await addDoc(productsCollectionRef, {
        ...newProduct,
        serverTimestamp: serverTimestamp(),
      });
      createdId = docRef.id;
    } catch (e) {
      console.warn('[Firestore] Error adding product to Firestore:', e.message);
    }
  }

  const completeProduct = { id: createdId, ...newProduct };
  const products = getLocalCollection(LOCAL_STORAGE_KEYS.PRODUCTS);
  products.unshift(completeProduct);
  saveLocalCollection(LOCAL_STORAGE_KEYS.PRODUCTS, products);

  return completeProduct;
};

export const updateProduct = async (productId, data) => {
  if (!isPlaceholderFirebase()) {
    try {
      await updateDoc(doc(db, COLLECTIONS.PRODUCTS, productId), data);
    } catch (e) {
      console.warn('[Firestore] Error updating product:', e.message);
    }
  }

  const products = getLocalCollection(LOCAL_STORAGE_KEYS.PRODUCTS);
  const updated = products.map((p) => (p.id === productId ? { ...p, ...data } : p));
  saveLocalCollection(LOCAL_STORAGE_KEYS.PRODUCTS, updated);
  return true;
};

export const deleteProduct = async (productId) => {
  if (!isPlaceholderFirebase()) {
    try {
      await deleteDoc(doc(db, COLLECTIONS.PRODUCTS, productId));
    } catch (e) {
      console.warn('[Firestore] Error deleting product:', e.message);
    }
  }

  const products = getLocalCollection(LOCAL_STORAGE_KEYS.PRODUCTS);
  const filtered = products.filter((p) => p.id !== productId);
  saveLocalCollection(LOCAL_STORAGE_KEYS.PRODUCTS, filtered);
  return true;
};

/**
 * -------------------------------------------------------------
 * Orders Operations (orders collection)
 * -------------------------------------------------------------
 */

export const getAllOrders = async () => {
  if (!isPlaceholderFirebase()) {
    try {
      const q = query(ordersCollectionRef, orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      const list = [];
      snapshot.forEach((d) => list.push({ id: d.id, ...d.data() }));
      return list;
    } catch (e) {
      console.warn('[Firestore] Error in getAllOrders:', e.message);
    }
  }

  return getLocalCollection(LOCAL_STORAGE_KEYS.ORDERS);
};

export const getOrdersByCustomer = async (customerId) => {
  if (!isPlaceholderFirebase()) {
    try {
      const q = query(ordersCollectionRef, where('customerId', '==', customerId));
      const snapshot = await getDocs(q);
      const list = [];
      snapshot.forEach((d) => list.push({ id: d.id, ...d.data() }));
      return list;
    } catch (e) {
      console.warn('[Firestore] Error in getOrdersByCustomer:', e.message);
    }
  }

  const orders = getLocalCollection(LOCAL_STORAGE_KEYS.ORDERS);
  return orders.filter((o) => o.customerId === customerId);
};

export const getOrdersByShop = async (shopId) => {
  if (!isPlaceholderFirebase()) {
    try {
      const q = query(ordersCollectionRef, where('shopId', '==', shopId));
      const snapshot = await getDocs(q);
      const list = [];
      snapshot.forEach((d) => list.push({ id: d.id, ...d.data() }));
      return list;
    } catch (e) {
      console.warn('[Firestore] Error in getOrdersByShop:', e.message);
    }
  }

  const orders = getLocalCollection(LOCAL_STORAGE_KEYS.ORDERS);
  return orders.filter((o) => o.shopId === shopId);
};

export const getOrderById = async (orderId) => {
  if (!isPlaceholderFirebase()) {
    try {
      const snap = await getDoc(doc(db, COLLECTIONS.ORDERS, orderId));
      if (snap.exists()) {
        return { id: snap.id, ...snap.data() };
      }
    } catch (e) {
      console.warn('[Firestore] Error in getOrderById:', e.message);
    }
  }

  const orders = getLocalCollection(LOCAL_STORAGE_KEYS.ORDERS);
  return orders.find((o) => o.id === orderId) || null;
};

export const createOrder = async (orderData) => {
  const newOrder = {
    ...orderData,
    status: 'Placed',
    createdAt: new Date().toISOString(),
  };

  let createdId = `BW-ORD-${Date.now().toString().slice(-6)}`;

  if (!isPlaceholderFirebase()) {
    try {
      const docRef = await addDoc(ordersCollectionRef, {
        ...newOrder,
        serverTimestamp: serverTimestamp(),
      });
      createdId = docRef.id;
    } catch (e) {
      console.warn('[Firestore] Error creating order in Firestore:', e.message);
    }
  }

  const completeOrder = { id: createdId, ...newOrder };
  const orders = getLocalCollection(LOCAL_STORAGE_KEYS.ORDERS);
  orders.unshift(completeOrder);
  saveLocalCollection(LOCAL_STORAGE_KEYS.ORDERS, orders);

  return completeOrder;
};

export const updateOrderStatus = async (orderId, status) => {
  if (!isPlaceholderFirebase()) {
    try {
      await updateDoc(doc(db, COLLECTIONS.ORDERS, orderId), { status });
    } catch (e) {
      console.warn('[Firestore] Error updating order status:', e.message);
    }
  }

  const orders = getLocalCollection(LOCAL_STORAGE_KEYS.ORDERS);
  const updated = orders.map((o) => (o.id === orderId ? { ...o, status } : o));
  saveLocalCollection(LOCAL_STORAGE_KEYS.ORDERS, updated);
  return true;
};

/**
 * -------------------------------------------------------------
 * Analytics & Summary Statistics (Zero Counts when Launch Empty)
 * -------------------------------------------------------------
 */

export const getAdminStatistics = async () => {
  const [customers, shopkeepers, products, orders] = await Promise.all([
    getAllCustomers(),
    getAllShopkeepers(),
    getAllProducts(),
    getAllOrders(),
  ]);

  const verifiedShops = shopkeepers.filter((s) => s.approvalStatus === 'Approved');
  const pendingApprovals = shopkeepers.filter((s) => s.approvalStatus === 'Pending');
  const grossVolume = orders
    .filter((o) => o.status !== 'Cancelled')
    .reduce((sum, o) => sum + (Number(o.total) || 0), 0);

  return {
    customerCount: customers.length,
    shopCount: verifiedShops.length,
    pendingShopCount: pendingApprovals.length,
    productCount: products.length,
    orderCount: orders.length,
    grossVolume,
    recentOrders: orders.slice(0, 5),
    recentShops: shopkeepers.slice(0, 5),
  };
};

export const getShopkeeperStatistics = async (shopId) => {
  const [products, orders] = await Promise.all([
    getProductsByShop(shopId),
    getOrdersByShop(shopId),
  ]);

  const completedOrders = orders.filter((o) => o.status === 'Delivered');
  const totalRevenue = completedOrders.reduce((sum, o) => sum + (Number(o.total) || 0), 0);
  const pendingOrders = orders.filter((o) => o.status === 'Placed' || o.status === 'Preparing');
  const lowStock = products.filter((p) => Number(p.stock) < 10);

  return {
    totalRevenue,
    orderCount: orders.length,
    completedOrderCount: completedOrders.length,
    pendingOrderCount: pendingOrders.length,
    productCount: products.length,
    lowStockCount: lowStock.length,
    recentOrders: orders.slice(0, 5),
  };
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
  getAllShops,
  getShopById,
  updateShopkeeperApproval,
  updateShopkeeperStatus,
  getAllProducts,
  getProductsByShop,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getAllOrders,
  getOrdersByCustomer,
  getOrdersByShop,
  getOrderById,
  createOrder,
  updateOrderStatus,
  getAdminStatistics,
  getShopkeeperStatistics,
};
