import { ReactNode, useEffect, useMemo, useState } from 'react';
import {
  AspectRatio,
  Box,
  type BoxProps,
  Card as MantineCard,
  Center,
  Image,
  Skeleton,
  Stack,
  Text,
} from '@mantine/core';
import { useTranslation } from '@/shared/i18n';

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
  emptyLabel?: string;
  w?: BoxProps['w'];
  h?: BoxProps['h'];
  style?: BoxProps['style'];
}

export function CardImage({ src, alt, aspectRatio = 'square', className = '', onError, emptyLabel, w, h, style }: CardImageProps) {
  const t = useTranslation();
  const [isLoading, setIsLoading] = useState(Boolean(src));
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setIsLoading(Boolean(src));
    setHasError(false);
  }, [src]);

  const ratio = useMemo(() => {
    if (aspectRatio === 'square') return 1;
    if (aspectRatio === 'video') return 16 / 9;
    return undefined;
  }, [aspectRatio]);

  const label = emptyLabel ?? t.product.noImage;

  const content = (
    <Box
      pos="relative"
      className={className}
      w={w}
      h={h}
      style={{ borderRadius: 'var(--mantine-radius-md)', overflow: 'hidden', ...style }}
    >
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
        <Center
          h="100%"
          w="100%"
          style={{
            backgroundColor: 'var(--color-bg-box)',
            color: 'var(--color-text-primary)',
          }}
        >
          <Stack align="center" gap={6}>
            <Text size="xl" fw={700} lh={1}>
              📦
            </Text>
            <Text size="sm" fw={600} style={{ opacity: 0.7 }}>
              {label}
            </Text>
          </Stack>
        </Center>
      )}
    </Box>
  );

  if (ratio) {
    return (
      <AspectRatio ratio={ratio} w={w}>
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
