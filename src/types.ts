export type UserRole = 'student' | 'teacher' | 'admin';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  role: UserRole;
  grade?: number;
  class?: number;
  number?: number;
  points: number;
  bio?: string;
  createdAt: any;
}

export interface Question {
  id: string;
  content: string;
  authorId: string;
  authorName: string;
  authorGrade?: number;
  authorClass?: number;
  tags: string[];
  category: string;
  likesCount: number;
  commentsCount: number;
  aiFeedback?: string;
  createdAt: any;
  updatedAt: any;
}

export interface Comment {
  id: string;
  questionId: string;
  content: string;
  authorId: string;
  authorName: string;
  createdAt: any;
}

export interface SchoolEvent {
  id: string;
  title: string;
  date: any;
  description: string;
  type: string;
}

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}
