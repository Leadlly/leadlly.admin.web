"use client";

import { useState, useCallback, useRef } from "react";
import { getPresignedUploadUrl } from "@/actions/upload_actions";

export interface UploadedFile {
  title: string;
  fileUrl: string;
  fileType: string;
  previewUrl: string;
  key: string;
}

interface UseFileUploadOptions {
  folder?: string;
  maxSizeMB?: number;
  accept?: string;
  onSuccess?: (file: UploadedFile) => void;
  onError?: (message: string) => void;
}

export function useFileUpload(options: UseFileUploadOptions = {}) {
  const { folder = "attachments", maxSizeMB = 30, onSuccess, onError } = options;

  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const triggerFileSelect = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const uploadFile = useCallback(
    async (file: File) => {
      if (file.size > maxSizeMB * 1024 * 1024) {
        const msg = `File size exceeds ${maxSizeMB}MB limit`;
        onError?.(msg);
        return null;
      }

      setIsUploading(true);
      setUploadProgress(0);

      try {
        const previewUrl = URL.createObjectURL(file);
        const ext = file.name.split(".").pop() || "file";

        setUploadedFile({
          title: file.name,
          fileUrl: "",
          fileType: ext,
          previewUrl,
          key: "",
        });

        setUploadProgress(10);

        const presignedRes = await getPresignedUploadUrl({
          fileName: file.name,
          fileType: file.type,
          folder,
        });

        if (!presignedRes.success || !presignedRes.putUrl) {
          throw new Error(presignedRes.message || "Failed to get upload URL");
        }

        setUploadProgress(30);

        const uploadRes = await fetch(presignedRes.putUrl, {
          method: "PUT",
          body: file,
          headers: {
            "Content-Type": file.type,
          },
        });

        if (!uploadRes.ok) {
          throw new Error("Failed to upload file to storage");
        }

        setUploadProgress(100);

        const uploaded: UploadedFile = {
          title: file.name,
          fileUrl: presignedRes.fileUrl!,
          fileType: ext,
          previewUrl,
          key: presignedRes.key!,
        };

        setUploadedFile(uploaded);
        onSuccess?.(uploaded);
        return uploaded;
      } catch (error: unknown) {
        const msg = error instanceof Error ? error.message : "Upload failed";
        onError?.(msg);
        setUploadedFile(null);
        return null;
      } finally {
        setIsUploading(false);
      }
    },
    [folder, maxSizeMB, onSuccess, onError]
  );

  const handleFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      await uploadFile(file);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    },
    [uploadFile]
  );

  const removeFile = useCallback(() => {
    if (uploadedFile?.previewUrl) {
      URL.revokeObjectURL(uploadedFile.previewUrl);
    }
    setUploadedFile(null);
    setUploadProgress(0);
  }, [uploadedFile]);

  return {
    uploadedFile,
    isUploading,
    uploadProgress,
    fileInputRef,
    triggerFileSelect,
    handleFileChange,
    removeFile,
    uploadFile,
  };
}
