/**
 * User Service (Placeholder - Phase 1)
 * Business logic and data management placeholders for User Module:
 * - User profile
 * - Cart management
 * - Order placement & tracking
 * - Browsing shops and products
 */

export const getUserProfile = async (userId) => {
  console.log(`[userService] getUserProfile placeholder for: ${userId}`);
  return Promise.resolve(null);
};

export const updateUserProfile = async (userId, data) => {
  console.log(`[userService] updateUserProfile placeholder for: ${userId}`, data);
  return Promise.resolve();
};

export const getUserOrders = async (userId) => {
  console.log(`[userService] getUserOrders placeholder for: ${userId}`);
  return Promise.resolve([]);
};

export const placeOrder = async (orderData) => {
  console.log('[userService] placeOrder placeholder', orderData);
  return Promise.resolve({ orderId: 'placeholder-order-id' });
};

export default {
  getUserProfile,
  updateUserProfile,
  getUserOrders,
  placeOrder,
};
