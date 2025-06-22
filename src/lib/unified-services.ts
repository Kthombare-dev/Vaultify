// Firebase Services - Direct Firebase implementation
import { PaperDataToSave, PaperData } from './firebase-services';

// Re-export types
export type { PaperDataToSave, PaperData };

// Re-export all Firebase functions directly
export {
  uploadFile,
  savePaperDetails,
  getAllPapers,
  searchPapers,
  filterPapers
} from './firebase-services';

// Get storage type info (always Firebase)
export const getStorageType = (): 'firebase' => 'firebase'; 