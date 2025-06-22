import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  orderBy, 
  serverTimestamp,
  DocumentData,
  QueryDocumentSnapshot
} from 'firebase/firestore';
import { 
  ref, 
  uploadBytes, 
  getDownloadURL,
  UploadResult 
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
  uploadedAt: any;
}

// Upload file to Firebase Storage
export const uploadFile = async (file: File, filePath: string): Promise<string> => {
  try {
    const storageRef = ref(storage, filePath);
    const uploadResult: UploadResult = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(uploadResult.ref);
    return downloadURL;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw new Error('Failed to upload file');
  }
};

// Save paper details to Firestore
export const savePaperDetails = async (paperData: PaperDataToSave): Promise<string> => {
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