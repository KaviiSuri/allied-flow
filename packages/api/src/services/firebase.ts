import { initializeApp, cert } from "firebase-admin/app";
import { getStorage, getDownloadURL } from "firebase-admin/storage";
import { env } from "@repo/server-config";

// Initialize Firebase Admin with service account
const app = initializeApp({
  credential: cert({
    projectId: env.FIREBASE_PROJECT_ID,
    clientEmail: env.FIREBASE_CLIENT_EMAIL,
    privateKey: env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
  }),
  storageBucket: env.FIREBASE_STORAGE_BUCKET,
});

const storage = getStorage(app);

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

export async function generateUploadUrls(
  fileName: string,
  folderName: StorageFolderName,
  teamId: string,
  userId: string
): Promise<FileUploadUrls> {
  // Create a storage path with team and user context
  const storagePath = `${teamId}/${userId}/${folderName}/${Date.now()}-${fileName}`;
  const file = storage.bucket(env.FIREBASE_STORAGE_BUCKET).file(storagePath);

  // Generate a signed URL for upload (expires in 10 minutes)
  const [uploadUrl] = await file.getSignedUrl({
    version: "v4",
    action: "write",
    expires: Date.now() + 10 * 60 * 1000, // 10 minutes
    contentType: "application/octet-stream",
  });

  // Generate a signed URL for download (expires in 1 hour)
  const downloadUrl = await getDownloadURL(file);

  return {
    uploadUrl,
    downloadUrl,
    storagePath,
  };
}

export async function refreshDownloadUrl(storagePath: string): Promise<string> {
  const file = storage.bucket(env.FIREBASE_STORAGE_BUCKET).file(storagePath);
  const [url] = await file.getSignedUrl({
    version: "v4",
    action: "read",
    expires: Date.now() + 60 * 60 * 1000, // 1 hour
  });
  return url;
}

export async function refreshDownloadUrls(storagePaths: string[]): Promise<Record<string, string>> {
  const urlPromises = storagePaths.map(async (path) => {
    const url = await refreshDownloadUrl(path);
    return [path, url] as const;
  });

  const urlEntries = await Promise.all(urlPromises);
  return Object.fromEntries(urlEntries);
} 