import { useState, useEffect } from 'react';
import { imageApi } from '@/features/product/api/product';

interface ProductImageProps {
  imageId: string;
  alt: string;
  className?: string;
}

export function ProductImage({ imageId, alt, className }: ProductImageProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let mounted = true;

    const fetchImageUrl = async () => {
      try {
        console.log('Fetching image for ID:', imageId);
        const response = await imageApi.getById(imageId);
        console.log('Image API response:', response);
        if (mounted) {
          setImageUrl(response.image_url);
          setIsLoading(false);
        }
      } catch (err) {
        console.error('Image fetch error:', err);
        if (mounted) {
          setError(true);
          setIsLoading(false);
        }
      }
    };

    fetchImageUrl();

    return () => {
      mounted = false;
    };
  }, [imageId]);

  if (isLoading) {
    return (
      <div className={`bg-bg-secondary animate-pulse ${className}`} />
    );
  }

  if (error || !imageUrl) {
    return (
      <div className={`bg-bg-secondary flex items-center justify-center text-text-muted ${className}`}>
        <span>이미지 로드 실패</span>
      </div>
    );
  }

  return (
    <img
      src={imageUrl}
      alt={alt}
      className={className}
      onLoad={() => console.log('Image loaded successfully:', imageUrl)}
      onError={(e) => console.error('Image load error:', imageUrl, e)}
    />
  );
}
