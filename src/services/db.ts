import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit, 
  onSnapshot,
  serverTimestamp,
  increment
} from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import { OperationType, FirestoreErrorInfo, Question, Comment, UserProfile, SchoolEvent } from '../types';

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
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

// User Services
export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const path = `users/${uid}`;
  try {
    const docSnap = await getDoc(doc(db, 'users', uid));
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as any;
    }
    return null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
    return null;
  }
}

export async function createUserProfile(profile: Partial<UserProfile>) {
  const path = `users/${profile.uid}`;
  try {
    await setDoc(doc(db, 'users', profile.uid!), {
      ...profile,
      points: 0,
      createdAt: serverTimestamp(),
      role: profile.role || 'student'
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

// Question Services
export async function createQuestion(question: Partial<Question>) {
  const path = 'questions';
  try {
    const newDocRef = doc(collection(db, 'questions'));
    await setDoc(newDocRef, {
      ...question,
      likesCount: 0,
      commentsCount: 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return newDocRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export function subscribeQuestions(callback: (questions: Question[]) => void) {
  const q = query(collection(db, 'questions'), orderBy('createdAt', 'desc'), limit(50));
  return onSnapshot(q, (snapshot) => {
    const questions = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Question));
    callback(questions);
  }, (error) => {
    handleFirestoreError(error, OperationType.LIST, 'questions');
  });
}

// Event Services
export function subscribeEvents(callback: (events: SchoolEvent[]) => void) {
  const q = query(collection(db, 'events'), orderBy('date', 'asc'), limit(10));
  return onSnapshot(q, (snapshot) => {
    const events = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as SchoolEvent));
    callback(events);
  }, (error) => {
    handleFirestoreError(error, OperationType.LIST, 'events');
  });
}

export async function likeQuestion(questionId: string) {
  const path = `questions/${questionId}`;
  try {
    await updateDoc(doc(db, 'questions', questionId), {
      likesCount: increment(1)
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}
