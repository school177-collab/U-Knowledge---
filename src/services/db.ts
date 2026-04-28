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

// Comment Services
export async function addComment(questionId: string, authorId: string, authorName: string, content: string) {
  const path = `questions/${questionId}/comments`;
  try {
    const commentRef = doc(collection(db, 'questions', questionId, 'comments'));
    await setDoc(commentRef, {
      questionId,
      authorId,
      authorName,
      content,
      createdAt: serverTimestamp(),
    });
    
    // Update question's comment count
    await updateDoc(doc(db, 'questions', questionId), {
      commentsCount: increment(1)
    });
    
    return commentRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export function subscribeComments(questionId: string, callback: (comments: Comment[]) => void) {
  const q = query(collection(db, 'questions', questionId, 'comments'), orderBy('createdAt', 'asc'));
  return onSnapshot(q, (snapshot) => {
    const comments = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Comment));
    callback(comments);
  }, (error) => {
    handleFirestoreError(error, OperationType.LIST, `questions/${questionId}/comments`);
  });
}

// Ranking Services
export async function updateUserProfile(uid: string, data: Partial<UserProfile>) {
  const path = `users/${uid}`;
  try {
    await updateDoc(doc(db, 'users', uid), {
      ...data,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

// Ranking Services
export function subscribeRankings(callback: (rankings: any[]) => void) {
  const q = query(collection(db, 'questions'), orderBy('likesCount', 'desc'), limit(10));
  return onSnapshot(q, (snapshot) => {
    const rankings = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        authorName: data.authorName,
        authorGrade: data.authorGrade,
        authorClass: data.authorClass,
        totalScore: (data.likesCount || 0) + (data.commentsCount || 0)
      };
    });
    callback(rankings);
  });
}
