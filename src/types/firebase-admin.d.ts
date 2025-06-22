declare module "firebase-admin/app" {
  export interface Credential {
    // Add credential properties as needed
  }

  export interface AppOptions {
    credential: Credential;
    databaseURL?: string;
  }

  export function getApps(): any[];
  export function initializeApp(options?: AppOptions): any;
  export function cert(serviceAccountConfig: object): Credential;
}

declare module "firebase-admin/firestore" {
  export interface DocumentData {
    [key: string]: any;
  }

  export interface QueryDocumentSnapshot<T = DocumentData> {
    data(): T;
  }

  export interface DocumentReference<T = DocumentData> {
    set(data: Partial<T>): Promise<void>;
    get(): Promise<QueryDocumentSnapshot<T>>;
  }

  export interface CollectionReference<T = DocumentData> {
    doc(documentPath?: string): DocumentReference<T>;
  }

  export interface Firestore {
    collection(collectionPath: string): CollectionReference;
  }

  export function getFirestore(): Firestore;
} 