import { ReactNode, useMemo, useState } from 'react';
import {
  AspectRatio,
  Box,
  Card as MantineCard,
  Center,
  Image,
  Skeleton,
  Text,
} from '@mantine/core';

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
}

export function Card({ children, className = '', onClick, hoverable = true }: CardProps) {
  return (
    <MantineCard
      className={className}
      withBorder
      radius="md"
      padding="md"
      onClick={onClick}
      style={{
        cursor: onClick ? 'pointer' : undefined,
        transition: hoverable ? 'transform 200ms ease' : undefined,
      }}
    >
      {children}
    </MantineCard>
  );
}

interface CardImageProps {
  src?: string | null;
  alt: string;
  aspectRatio?: 'square' | 'video' | 'auto';
  className?: string;
  onError?: () => void;
}

export function CardImage({ src, alt, aspectRatio = 'square', className = '', onError }: CardImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const ratio = useMemo(() => {
    if (aspectRatio === 'square') return 1;
    if (aspectRatio === 'video') return 16 / 9;
    return undefined;
  }, [aspectRatio]);

  const content = (
    <Box pos="relative" className={className} style={{ borderRadius: 'var(--mantine-radius-md)', overflow: 'hidden' }}>
      {isLoading && src && (
        <Skeleton visible h="100%" w="100%" style={{ position: 'absolute', inset: 0, zIndex: 1 }} />
      )}

      {src && !hasError ? (
        <Image
          src={src}
          alt={alt}
          fit="cover"
          h="100%"
          w="100%"
          radius="md"
          onLoad={() => setIsLoading(false)}
          onError={() => {
            setIsLoading(false);
            setHasError(true);
            try {
              onError?.();
            } catch {}
          }}
        />
      ) : (
        <Center h="100%" w="100%" bg="var(--mantine-color-body)">
          <Text c="dimmed" fz={24}>
            🖼️
          </Text>
        </Center>
      )}
    </Box>
  );

  if (ratio) {
    return (
      <AspectRatio ratio={ratio}>
        {content}
      </AspectRatio>
    );
  }

  return content;
}

interface CardContentProps {
  children: ReactNode;
  className?: string;
}

export function CardContent({ children, className = '' }: CardContentProps) {
  return <Box className={className}>{children}</Box>;
}

interface CardTitleProps {
  children: ReactNode;
  className?: string;
}

export function CardTitle({ children, className = '' }: CardTitleProps) {
  return (
    <Text fw={600} lineClamp={2} className={className}>
      {children}
    </Text>
  );
}

interface CardMetaProps {
  children: ReactNode;
  className?: string;
}

export function CardMeta({ children, className = '' }: CardMetaProps) {
  return (
    <Text size="xs" c="dimmed" className={className}>
      {children}
    </Text>
  );
}
