import { S3Client, GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { env } from "@repo/server-config";

const s3Client = new S3Client({
  region: env.AWS_REGION,
  credentials: {
    accessKeyId: env.AWS_ACCESS_KEY_ID,
    secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
  },
});

// Helper function to generate S3 public URL
function getPublicUrl(bucket: string, region: string, key: string): string {
  return `https://${bucket}.s3.${region}.amazonaws.com/${key}`;
}

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
  const urlSafeFileName = encodeURIComponent(fileName);
  // Create a storage path with team and user context
  const storagePath = `${teamId}/${userId}/${folderName}/${Date.now()}-${urlSafeFileName}`;

  // Generate a signed URL for upload (expires in 10 minutes)
  const putCommand = new PutObjectCommand({
    Bucket: env.AWS_S3_BUCKET,
    Key: storagePath,
    ContentType: "application/octet-stream",
  });
  const uploadUrl = await getSignedUrl(s3Client, putCommand, { expiresIn: 600 }); // 10 minutes

  // Generate a permanent public URL for download
  const downloadUrl = getPublicUrl(env.AWS_S3_BUCKET, env.AWS_REGION, storagePath);

  return {
    uploadUrl,
    downloadUrl,
    storagePath,
  };
}
