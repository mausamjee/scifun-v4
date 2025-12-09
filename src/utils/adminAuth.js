import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';

/**
 * Check if a user has admin role
 * @param {string} uid - User ID
 * @returns {Promise<boolean>} - True if user is admin
 */
export async function checkAdminRole(uid) {
  if (!uid) return false;
  
  try {
    const adminDoc = await getDoc(doc(db, 'admins', uid));
    if (adminDoc.exists()) {
      return adminDoc.data().role === 'admin';
    }
    
    // Also check in users collection for role field
    const userDoc = await getDoc(doc(db, 'users', uid));
    if (userDoc.exists()) {
      const userData = userDoc.data();
      return userData.role === 'admin';
    }
    
    return false;
  } catch (error) {
    console.error('Error checking admin role:', error);
    return false;
  }
}

/**
 * Create an admin user in Firestore
 * Call this function once to set up an admin user
 * @param {string} uid - User ID
 * @param {string} email - Admin email
 */
export async function createAdminUser(uid, email) {
  try {
    const { setDoc } = await import('firebase/firestore');
    await setDoc(doc(db, 'admins', uid), {
      email,
      role: 'admin',
      createdAt: new Date().toISOString()
    });
    
    // Also update user document
    await setDoc(doc(db, 'users', uid), {
      role: 'admin'
    }, { merge: true });
    
    return true;
  } catch (error) {
    console.error('Error creating admin user:', error);
    return false;
  }
}

