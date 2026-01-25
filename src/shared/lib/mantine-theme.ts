import { createTheme, MantineColorsTuple, CSSVariablesResolver } from '@mantine/core';

// Brand color palette (orange)
const brand: MantineColorsTuple = [
  '#fff7ed', // 0 - primary-light
  '#ffedd5', // 1 - primary-light-hover
  '#fed7aa', // 2
  '#fdba74', // 3
  '#fb923c', // 4
  '#ff6f0f', // 5 - brand (primary) - main color
  '#e65f00', // 6 - brand-hover
  '#c2410c', // 7
  '#9a3412', // 8
  '#7c2d12', // 9
];

// Slate palette for text colors
const slate: MantineColorsTuple = [
  '#f8fafc', // 0 - slate-50
  '#f1f5f9', // 1 - slate-100
  '#e2e8f0', // 2 - slate-200
  '#cbd5e1', // 3 - slate-300
  '#94a3b8', // 4 - slate-400
  '#64748b', // 5 - slate-500 (secondary text)
  '#475569', // 6 - slate-600
  '#334155', // 7 - slate-700 (body text)
  '#1e293b', // 8 - slate-800 (primary text)
  '#0f172a', // 9 - slate-900 (heading text)
];

// Gray palette for borders and muted elements
const neutral: MantineColorsTuple = [
  '#fafafa', // 0 - gray-50
  '#f4f4f5', // 1 - gray-100
  '#e4e4e7', // 2 - gray-200
  '#d4d4d8', // 3 - gray-300
  '#a1a1aa', // 4 - gray-400 (muted)
  '#71717a', // 5 - gray-500
  '#52525b', // 6 - gray-600
  '#3f3f46', // 7 - gray-700
  '#27272a', // 8 - gray-800
  '#18181b', // 9 - gray-900
];

export const theme = createTheme({
  primaryColor: 'brand',
  primaryShade: 5,
  colors: {
    brand,
    slate,
    neutral,
  },
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  defaultRadius: 'md',
  cursorType: 'pointer',
  other: {
    // Semantic color mappings for easy reference
    textHeading: 'var(--mantine-color-slate-9)',
    textPrimary: 'var(--mantine-color-slate-8)',
    textBody: 'var(--mantine-color-slate-7)',
    textSecondary: 'var(--mantine-color-slate-5)',
    textMuted: 'var(--mantine-color-neutral-4)',
  },
  components: {
    Button: {
      defaultProps: {
        radius: 'lg',
      },
      styles: {
        root: {
          fontWeight: 700,
          transition: 'all 150ms ease',
          '&:active': {
            transform: 'scale(0.98)',
          },
        },
      },
    },
    TextInput: {
      defaultProps: {
        radius: 'md',
      },
    },
    PasswordInput: {
      defaultProps: {
        radius: 'md',
      },
    },
    Select: {
      defaultProps: {
        radius: 'md',
      },
    },
    Modal: {
      defaultProps: {
        radius: 'lg',
        centered: true,
      },
    },
    Badge: {
      defaultProps: {
        radius: 'md',
      },
    },
    Card: {
      defaultProps: {
        radius: 'md',
        withBorder: true,
      },
      styles: {
        root: {
          transition: 'transform 200ms ease',
          '&:hover': {
            transform: 'translateY(-2px)',
          },
        },
      },
    },
    Anchor: {
      defaultProps: {
        underline: 'hover',
      },
    },
  },
});

// CSS Variables Resolver for dark mode support
export const cssVariablesResolver: CSSVariablesResolver = (theme) => ({
  variables: {
    '--app-text-heading': theme.colors.slate[9],
    '--app-text-primary': theme.colors.slate[8],
    '--app-text-body': theme.colors.slate[7],
    '--app-text-secondary': theme.colors.slate[5],
    '--app-text-muted': theme.colors.neutral[4],
    '--app-border-light': theme.colors.neutral[2],
    '--app-border-medium': theme.colors.neutral[4],
  },
  light: {
    '--app-bg-page': '#ffffff',
    '--app-bg-box': theme.colors.gray[1],
  },
  dark: {
    '--app-bg-page': '#1a1a1a',
    '--app-bg-box': '#262626',
    '--app-text-heading': '#ffffff',
    '--app-text-primary': '#f5f5f5',
    '--app-text-body': '#e0e0e0',
    '--app-text-secondary': '#b3b3b3',
    '--app-text-muted': '#808080',
    '--app-border-light': '#404040',
    '--app-border-medium': '#525252',
  },
});
