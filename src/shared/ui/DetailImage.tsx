interface DetailImageProps {
  src: string;
  alt: string;
  className?: string;
}

export function DetailImage({ src, alt, className = '' }: DetailImageProps) {
  return (
    <div className={`mb-6 rounded-xl overflow-hidden border border-border-light/50 ${className}`}>
      <img
        src={src}
        alt={alt}
        className="w-full max-h-[400px] object-contain"
      />
    </div>
  );
}
