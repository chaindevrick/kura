import {
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  getDocs,
  addDoc,
  QueryConstraint,
} from 'firebase/firestore';
import { db } from './firebase';

// Collection names
export const USERS_COLLECTION = 'users';
export const TRANSACTIONS_COLLECTION = 'transactions';
export const BUDGETS_COLLECTION = 'budgets';

// User document operations
export const createUserDoc = async (userId: string, userData: Record<string, any>) => {
  try {
    await setDoc(doc(db, USERS_COLLECTION, userId), userData, { merge: true });
  } catch (error) {
    console.error('Error creating user document:', error);
    throw error;
  }
};

export const getUserDoc = async (userId: string) => {
  try {
    const docSnap = await getDoc(doc(db, USERS_COLLECTION, userId));
    return docSnap.exists() ? docSnap.data() : null;
  } catch (error) {
    console.error('Error getting user document:', error);
    throw error;
  }
};

export const updateUserDoc = async (userId: string, updates: Record<string, any>) => {
  try {
    await updateDoc(doc(db, USERS_COLLECTION, userId), updates);
  } catch (error) {
    console.error('Error updating user document:', error);
    throw error;
  }
};

// Generic collection operations
export const addDocument = async (collectionName: string, data: Record<string, any>) => {
  try {
    const docRef = await addDoc(collection(db, collectionName), data);
    return docRef.id;
  } catch (error) {
    console.error(`Error adding document to ${collectionName}:`, error);
    throw error;
  }
};

export const getDocument = async (collectionName: string, docId: string) => {
  try {
    const docSnap = await getDoc(doc(db, collectionName, docId));
    return docSnap.exists() ? docSnap.data() : null;
  } catch (error) {
    console.error(`Error getting document from ${collectionName}:`, error);
    throw error;
  }
};

export const updateDocument = async (
  collectionName: string,
  docId: string,
  updates: Record<string, any>
) => {
  try {
    await updateDoc(doc(db, collectionName, docId), updates);
  } catch (error) {
    console.error(`Error updating document in ${collectionName}:`, error);
    throw error;
  }
};

export const deleteDocument = async (collectionName: string, docId: string) => {
  try {
    await deleteDoc(doc(db, collectionName, docId));
  } catch (error) {
    console.error(`Error deleting document from ${collectionName}:`, error);
    throw error;
  }
};

export const queryDocuments = async (
  collectionName: string,
  constraints: QueryConstraint[]
) => {
  try {
    const q = query(collection(db, collectionName), ...constraints);
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error(`Error querying ${collectionName}:`, error);
    throw error;
  }
};

// Example: Get transactions for a user
export const getUserTransactions = async (userId: string) => {
  return queryDocuments(TRANSACTIONS_COLLECTION, [where('userId', '==', userId)]);
};

// Example: Get budgets for a user
export const getUserBudgets = async (userId: string) => {
  return queryDocuments(BUDGETS_COLLECTION, [where('userId', '==', userId)]);
};
