// Firebase Services - Direct Firebase implementation
import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where,
  orderBy,
  serverTimestamp,
  DocumentData,
  QueryDocumentSnapshot,
  Timestamp,
  Firestore,
  and
} from 'firebase/firestore';
import { 
  ref, 
  uploadBytes, 
  getDownloadURL,
  UploadResult,
  FirebaseStorage
} from 'firebase/storage';
import { db, storage } from './firebase';

// Types
export interface PaperDataToSave {
  subjectName: string;
  subjectCode: string;
  semester: string;
  academicYear: string;
  branch: string;
  paperType: string;
  description?: string;
  tags?: string;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  customBranch?: string;
  customPaperType?: string;
}

export interface PaperData extends PaperDataToSave {
  id: string;
  uploadedAt: Timestamp | null;
}

// Upload file to storage
export const uploadFile = async (file: File, path: string): Promise<string> => {
  if (!storage) {
    throw new Error('Firebase Storage is not initialized');
  }

  try {
    const fileRef = ref(storage, path);
    const uploadResult = await uploadBytes(fileRef, file);
    return await getDownloadURL(uploadResult.ref);
  } catch (error) {
    console.error('Error uploading file:', error);
    throw new Error('Failed to upload file');
  }
};

// Save paper details to Firestore
export const savePaperDetails = async (paperData: PaperDataToSave): Promise<string> => {
  if (!db) {
    throw new Error('Firebase Firestore is not initialized');
  }

  try {
    const docRef = await addDoc(collection(db, 'papers'), {
      ...paperData,
      uploadedAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error saving paper details:', error);
    throw new Error('Failed to save paper details');
  }
};

// Get all papers from Firestore
export const getAllPapers = async (): Promise<PaperData[]> => {
  if (!db) {
    throw new Error('Firebase Firestore is not initialized');
  }

  try {
    const papersQuery = query(
      collection(db, 'papers'),
      orderBy('uploadedAt', 'desc')
    );
    
    const querySnapshot = await getDocs(papersQuery);
    const papers: PaperData[] = [];
    
    querySnapshot.forEach((doc: QueryDocumentSnapshot<DocumentData>) => {
      const data = doc.data();
      papers.push({
        id: doc.id,
        subjectName: data.subjectName,
        subjectCode: data.subjectCode,
        semester: data.semester,
        academicYear: data.academicYear,
        branch: data.branch,
        paperType: data.paperType,
        description: data.description || '',
        tags: data.tags || '',
        fileName: data.fileName,
        fileUrl: data.fileUrl,
        fileSize: data.fileSize,
        customBranch: data.customBranch,
        customPaperType: data.customPaperType,
        uploadedAt: data.uploadedAt,
      });
    });
    
    return papers;
  } catch (error) {
    console.error('Error fetching papers:', error);
    throw new Error('Failed to fetch papers');
  }
};

// Search papers by query
export const searchPapers = async (searchQuery: string): Promise<PaperData[]> => {
  try {
    const allPapers = await getAllPapers();
    const query = searchQuery.toLowerCase();
    
    return allPapers.filter(paper => 
      paper.subjectName.toLowerCase().includes(query) ||
      paper.subjectCode.toLowerCase().includes(query) ||
      (paper.description || '').toLowerCase().includes(query) ||
      (paper.tags || '').toLowerCase().includes(query)
    );
  } catch (error) {
    console.error('Error searching papers:', error);
    throw new Error('Failed to search papers');
  }
};

// Filter papers by criteria
export const filterPapers = async (filters: {
  branch?: string;
  semester?: string;
  academicYear?: string;
  paperType?: string;
}): Promise<PaperData[]> => {
  try {
    const allPapers = await getAllPapers();
    
    return allPapers.filter(paper => {
      if (filters.branch && paper.branch !== filters.branch) return false;
      if (filters.semester && paper.semester !== filters.semester) return false;
      if (filters.academicYear && paper.academicYear !== filters.academicYear) return false;
      if (filters.paperType && paper.paperType !== filters.paperType) return false;
      return true;
    });
  } catch (error) {
    console.error('Error filtering papers:', error);
    throw new Error('Failed to filter papers');
  }
};

// Check if a paper already exists
export const checkDuplicatePaper = async (paperData: {
  subjectCode: string;
  academicYear: string;
  paperType: string;
}): Promise<boolean> => {
  if (!db) {
    throw new Error('Firebase Firestore is not initialized');
  }

  try {
    const papersQuery = query(
      collection(db, 'papers'),
      and(
        where('subjectCode', '==', paperData.subjectCode),
        where('academicYear', '==', paperData.academicYear),
        where('paperType', '==', paperData.paperType)
      )
    );
    
    const querySnapshot = await getDocs(papersQuery);
    return !querySnapshot.empty;
  } catch (error) {
    console.error('Error checking for duplicate paper:', error);
    throw new Error('Failed to check for duplicate paper');
  }
};

// Get storage type info (always Firebase)
export const getStorageType = (): 'firebase' => 'firebase'; 