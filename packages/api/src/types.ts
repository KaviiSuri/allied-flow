export type StorageFolderName = 
  | "technical-documents" 
  | "product-images" 
  | "user-documents" 
  | "company-documents";

export interface FileUploadUrls {
  uploadUrl: string;
  downloadUrl: string;
  storagePath: string;
} 