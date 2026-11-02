import { auth } from './firebaseConfig';

/**
 * Authentication Service (Placeholders - Phase 1)
 * Actual Firebase Auth operations will be implemented in subsequent phases.
 */

// Registration service placeholder
export const registerUser = async (email, password, role = 'user') => {
  // Placeholder: Register new user with email, password, and assigned role using auth
  console.log(`[authService] Registration placeholder called for: ${email} with role: ${role}`, { auth, hasPassword: Boolean(password) });
  return Promise.resolve({ uid: 'placeholder-uid', email, role });
};

// Login service placeholder
export const loginUser = async (email, password) => {
  // Placeholder: Authenticate user credentials using auth
  console.log(`[authService] Login placeholder called for: ${email}`, { auth, hasPassword: Boolean(password) });
  return Promise.resolve({ uid: 'placeholder-uid', email });
};

// Logout service placeholder
export const logoutUser = async () => {
  // Placeholder: Sign out current user using auth
  console.log('[authService] Logout placeholder called', { auth });
  return Promise.resolve();
};

// Authentication state listener placeholder
export const subscribeToAuthChanges = (callback) => {
  // Placeholder: Listen to auth state transitions
  console.log('[authService] Subscribed to auth state changes placeholder', { auth, callback });
  // Return an unsubscribe dummy function
  return () => {
    console.log('[authService] Unsubscribed from auth state changes placeholder');
  };
};

export default {
  auth,
  registerUser,
  loginUser,
  logoutUser,
  subscribeToAuthChanges,
};
