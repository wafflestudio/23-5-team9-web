import { useState, useRef, ChangeEvent } from 'react';
import { Button } from '@/shared/ui';
import { useTranslation } from '@/shared/i18n';
import { imageApi } from '@/features/product/api/product';
import type { ImageResponse } from '@/shared/api/types';

interface UploadedImage {
  id: string;
  url: string;
  isUploading?: boolean;
}

interface ImageUploaderProps {
  images: UploadedImage[];
  onImagesChange: (images: UploadedImage[]) => void;
  maxImages?: number;
}

export default function ImageUploader({
  images,
  onImagesChange,
  maxImages = 5,
}: ImageUploaderProps) {
  const t = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileSelect = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const remainingSlots = maxImages - images.length;
    const filesToUpload = Array.from(files).slice(0, remainingSlots);

    if (filesToUpload.length === 0) {
      alert(t.image.maxImagesReached);
      return;
    }

    setIsUploading(true);

    try {
      const uploadPromises = filesToUpload.map(async (file) => {
        const response: ImageResponse = await imageApi.upload(file);
        return {
          id: response.id,
          url: response.image_url,
        };
      });

      const uploadedImages = await Promise.all(uploadPromises);
      onImagesChange([...images, ...uploadedImages]);
    } catch {
      alert(t.image.uploadFailed);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemoveImage = (imageId: string) => {
    onImagesChange(images.filter((img) => img.id !== imageId));
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-sm font-medium text-text-secondary">
          {t.image.productImages}
        </span>
        <span className="text-xs text-text-muted">
          ({images.length}/{maxImages})
        </span>
      </div>

      <div className="flex flex-wrap gap-3">
        {/* Uploaded images */}
        {images.map((image) => (
          <div
            key={image.id}
            className="relative w-24 h-24 rounded-lg overflow-hidden border border-border-medium group"
          >
            <img
              src={image.url}
              alt="Product"
              className="w-full h-full object-cover"
            />
            <button
              type="button"
              onClick={() => handleRemoveImage(image.id)}
              className="absolute top-1 right-1 w-6 h-6 bg-black/60 rounded-full text-white text-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
              ×
            </button>
          </div>
        ))}

        {/* Add image button */}
        {images.length < maxImages && (
          <button
            type="button"
            onClick={handleButtonClick}
            disabled={isUploading}
            className="w-24 h-24 rounded-lg border-2 border-dashed border-border-medium hover:border-primary flex flex-col items-center justify-center gap-1 text-text-muted hover:text-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUploading ? (
              <span className="text-xs">{t.image.uploading}</span>
            ) : (
              <>
                <span className="text-2xl">+</span>
                <span className="text-xs">{t.image.addImage}</span>
              </>
            )}
          </button>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileSelect}
        className="hidden"
      />

      {images.length === 0 && (
        <p className="mt-2 text-xs text-text-muted">{t.image.noImages}</p>
      )}
    </div>
  );
}

export type { UploadedImage };
