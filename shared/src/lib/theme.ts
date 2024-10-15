import { createTheme, Theme } from '@mui/material/styles';
import { PaperProps } from '@mui/material/Paper';

// 1. Augment MuiPaper to include 'menu' variant
declare module '@mui/material/Paper' {
  interface PaperPropsVariantOverrides {
    menu: true;
  }
}

type ExtendedPaperProps = PaperProps & {
  variant?: 'menu' | PaperProps['variant'];
};

const lightPalette = {
  primary: {
    main: '#4A90E2',
    light: '#A4C8E1',
    dark: '#003D66',
    contrastText: '#fff',
  },
  secondary: {
    main: '#FF6F61',
    light: '#FF9A8B',
    dark: '#C54A3A',
    contrastText: '#fff',
  },
  success: {
    main: '#28a745',
    contrastText: '#fff',
  },
  error: {
    main: '#dc3545',
    contrastText: '#fff',
  },
  background: {
    default: '#F5F7FA',
    paper: '#FFFFFF',
  },
  text: {
    primary: '#333333',
    secondary: '#757575',
  },
};

const darkPalette = {
  primary: {
    main: '#1E1E1E',
    light: '#3A3A3A',
    dark: '#000000',
    contrastText: '#fff',
  },
  secondary: {
    main: '#FF6F61',
    light: '#FF9A8B',
    dark: '#C54A3A',
    contrastText: '#fff',
  },
  success: {
    main: '#28a745',
    contrastText: '#fff',
  },
  error: {
    main: '#dc3545',
    contrastText: '#fff',
  },
  background: {
    default: '#121212',
    paper: '#1E1E1E',
  },
  text: {
    primary: '#ffffff',
    secondary: '#B0B0B0',
  },
};

export const createAppTheme = (mode: 'light' | 'dark'): Theme => {
  const theme = createTheme({
    palette: {
      mode,
      ...(mode === 'light' ? lightPalette : darkPalette),
    },
    typography: {
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
      h1: {
        fontSize: '2rem',
        fontWeight: 700,
        lineHeight: 1.2,
        color: mode === 'light' ? '#333333' : '#ffffff',
        [mode === 'light' ? 'breakpoints.down("sm")' : '']: {
          fontSize: '1.75rem', // Responsive scaling for mobile
        },
      },
      h2: {
        fontSize: '1.75rem',
        fontWeight: 700,
        lineHeight: 1.3,
        color: mode === 'light' ? '#333333' : '#ffffff',
        [mode === 'light' ? 'breakpoints.down("sm")' : '']: {
          fontSize: '1.5rem',
        },
      },
      h3: {
        fontSize: '1.5rem',
        fontWeight: 600,
        lineHeight: 1.4,
        color: mode === 'light' ? '#333333' : '#ffffff',
      },
      body1: {
        fontSize: '1rem',
        [mode === 'light' ? 'breakpoints.down("sm")' : '']: {
          fontSize: '0.9rem', // Responsive for smaller screens
        },
      },
      button: {
        textTransform: 'none', // Avoid automatic uppercase in buttons
        fontWeight: 600,
        fontSize: '1rem',
      },
    },
    spacing: (factor: number) => `${0.25 * factor}rem`,
    breakpoints: {
      values: {
        xs: 0,
        sm: 600,
        md: 960,
        lg: 1280,
        xl: 1920,
      },
    },
    components: {
      MuiPaper: {
        styleOverrides: {
          root: ({ ownerState }: { ownerState: ExtendedPaperProps }) => ({
            ...(ownerState.variant === 'menu' && {
              background: 'transparent',
              boxShadow: 'none',
            }),
            borderRadius: '8px',
          }),
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            background: '#FFFFFF',
            boxShadow: '0 6px 12px rgba(0, 0, 0, 0.1)',
            borderRadius: '8px',
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: '#4A90E2',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: '8px',
            padding: '0.75rem 1.5rem', // Increase button padding for larger touch area
            boxShadow: 'none',
            '&:hover': {
              boxShadow: '0px 4px 8px rgba(0,0,0,0.1)',
            },
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& input': {
              fontSize: '1rem',
            },
            '& label': {
              fontSize: '1.1rem',
            },
            '& fieldset': {
              borderColor: lightPalette.primary.main,
            },
            '&:focus-within fieldset': {
              borderColor: lightPalette.primary.dark,
            },
          },
        },
      },
      MuiTypography: {
        styleOverrides: {
          root: ({ theme }) => ({
            fontSize: '1rem',
            [theme.breakpoints.down('sm')]: {
              fontSize: '0.875rem', // Adjust typography for smaller screens
            },
          }),
        },
      },
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            margin: 0, // Remove default body margin
            padding: 0, // Remove default body padding
            boxSizing: 'border-box', // Ensure box-sizing is border-box globally
          },
        },
      },
    },
    
  });

  return theme;
};

const theme = createAppTheme('light'); // You can toggle between 'light' and 'dark'

export default theme;
