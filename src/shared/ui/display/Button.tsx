import {
  Button as MantineButton,
  type ButtonProps as MantineButtonProps,
} from '@mantine/core';
import type React from 'react';

type AppButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
type AppButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps
  extends Omit<MantineButtonProps, 'variant' | 'size' | 'fullWidth' | 'color'> {
  variant?: AppButtonVariant;
  size?: AppButtonSize;
  fullWidth?: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

const variantToMantine: Record<AppButtonVariant, MantineButtonProps['variant']> = {
  primary: 'filled',
  secondary: 'light',
  outline: 'outline',
  ghost: 'subtle',
};

const variantToColor: Record<AppButtonVariant, MantineButtonProps['color']> = {
  primary: 'orange',
  secondary: 'gray',
  outline: 'orange',
  ghost: 'gray',
};

export function Button({
  variant = 'primary',
  size = 'md',
  fullWidth,
  radius,
  ...props
}: ButtonProps) {
  return (
    <MantineButton
      variant={variantToMantine[variant]}
      color={variantToColor[variant]}
      size={size}
      fullWidth={fullWidth}
      radius={radius ?? 'md'}
      {...props}
    />
  );
}
