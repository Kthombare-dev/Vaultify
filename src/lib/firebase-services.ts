import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  getDocs,
  orderBy
} from 'firebase/firestore';
import {
  ref,
  uploadBytes,
  getDownloadURL,
} from 'firebase/storage';
import { db, storage } from './firebase';

// Type for the paper data structure
export interface PaperData {
  id?: string;
  subjectName: string;
  subjectCode: string;
  semester: string;
  academicYear: string;
  branch: string;
  customBranch?: string;
  paperType: string;
  customPaperType?: string;
  description?: string;
  tags?: string;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  uploadedAt?: { seconds: number; nanoseconds: number };
  downloadCount: number;
}

export type PaperDataToSave = Omit<PaperData, 'id' | 'uploadedAt' | 'downloadCount'>;

/**
 * Uploads a file to a specific path in Firebase Storage.
 * @param file The file to upload.
 * @param path The path in storage to upload the file to.
 * @returns A promise that resolves with the public download URL of the file.
 */
export const uploadFile = async (file: File, path: string): Promise<string> => {
  try {
    const storageRef = ref(storage, path);
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw new Error('Failed to upload file.');
  }
};

/**
 * Saves the paper details document to the 'papers' collection in Firestore.
 * @param paperData The paper data to save.
 * @returns A promise that resolves with the ID of the newly created document.
 */
export const savePaperDetails = async (paperData: PaperDataToSave): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, 'papers'), {
      ...paperData,
      uploadedAt: serverTimestamp(),
    });
    console.log('Document written with ID: ', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error saving paper details:', error);
    throw new Error('Failed to save paper details.');
  }
};

/**
 * Fetches all paper documents from the 'papers' collection in Firestore.
 * @returns A promise that resolves with an array of paper data.
 */
export const getAllPapers = async (): Promise<PaperData[]> => {
  try {
    const papersCollection = collection(db, 'papers');
    const q = query(papersCollection, orderBy('uploadedAt', 'desc'));
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    } as PaperData));
  } catch (error) {
    console.error('Error fetching papers:', error);
    throw new Error('Failed to fetch papers.');
  }
}; 