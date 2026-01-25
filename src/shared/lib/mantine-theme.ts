import { createTheme, MantineColorsTuple } from '@mantine/core';

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

export const theme = createTheme({
  primaryColor: 'brand',
  primaryShade: 5,
  colors: {
    brand,
  },
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  defaultRadius: 'md',
  cursorType: 'pointer',
  components: {
    Button: {
      defaultProps: {
        radius: 'lg',
      },
      classNames: {
        root: 'font-bold transition-all active:scale-[0.98]',
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
  },
});
