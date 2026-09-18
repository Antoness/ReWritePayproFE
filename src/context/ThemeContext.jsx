import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';

const ColorModeContext = createContext({
  toggleColorMode: () => {},
  mode: 'light',
});

export const useColorMode = () => useContext(ColorModeContext);

export const CustomThemeProvider = ({ children }) => {
  const [mode, setMode] = useState(() => {
    try {
      return localStorage.getItem('paypro_theme_mode') || 'light';
    } catch {
      return 'light';
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('paypro_theme_mode', mode);
    } catch (e) {
      console.error(e);
    }
    if (mode === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [mode]);

  const colorMode = useMemo(
    () => ({
      mode,
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
      },
    }),
    [mode]
  );

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: {
            main: '#6366f1',
            light: '#818cf8',
            dark: '#4f46e5',
          },
          secondary: {
            main: '#a855f7',
          },
          background: {
            default: mode === 'dark' ? '#0b0f19' : '#f8fafc',
            paper: mode === 'dark' ? '#111827' : '#ffffff',
          },
          text: {
            primary: mode === 'dark' ? '#f3f4f6' : '#0f172a',
            secondary: mode === 'dark' ? '#9ca3af' : '#64748b',
          },
          divider: mode === 'dark' ? '#1f2937' : '#e2e8f0',
        },
        typography: {
          fontSize: 13,
          fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
          h1: { fontFamily: 'Outfit, sans-serif' },
          h2: { fontFamily: 'Outfit, sans-serif' },
          h3: { fontFamily: 'Outfit, sans-serif' },
          h4: { fontFamily: 'Outfit, sans-serif' },
          h5: { fontFamily: 'Outfit, sans-serif', fontSize: '1.25rem' },
          h6: { fontFamily: 'Outfit, sans-serif', fontSize: '1.05rem' },
          subtitle1: { fontSize: '0.875rem' },
          subtitle2: { fontSize: '0.8rem' },
          body1: { fontSize: '0.825rem' },
          body2: { fontSize: '0.775rem' },
          caption: { fontSize: '0.7rem' },
          button: {
            textTransform: 'none',
            fontWeight: 600,
            fontSize: '0.8rem',
          },
        },
        shape: {
          borderRadius: 8,
        },
        components: {
          MuiButton: {
            defaultProps: { size: 'small' },
            styleOverrides: {
              root: {
                padding: '5px 16px',
                fontSize: '0.78rem',
                minHeight: 32,
              },
              sizeSmall: {
                padding: '4px 12px',
                fontSize: '0.72rem',
              },
              containedPrimary: {
                background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
                boxShadow: '0 4px 12px rgba(99, 102, 241, 0.2)',
                '&:hover': {
                  boxShadow: '0 6px 16px rgba(99, 102, 241, 0.3)',
                },
              },
            },
          },
          MuiIconButton: {
            defaultProps: { size: 'small' },
            styleOverrides: {
              root: { padding: 6 },
            },
          },
          MuiTextField: {
            defaultProps: { size: 'small', variant: 'outlined' },
            styleOverrides: {
              root: {
                '& .MuiInputBase-root': {
                  fontSize: '0.8rem',
                  minHeight: 36,
                },
              },
            },
          },
          MuiOutlinedInput: {
            defaultProps: { size: 'small' },
            styleOverrides: {
              root: {
                fontSize: '0.8rem',
                borderRadius: 8,
              },
              input: {
                padding: '7px 12px',
                fontSize: '0.8rem',
              },
              notchedOutline: {
                borderColor: mode === 'dark' ? '#374151' : '#e2e8f0',
              },
            },
          },
          MuiInputBase: {
            styleOverrides: {
              root: { fontSize: '0.8rem' },
            },
          },
          MuiInputLabel: {
            defaultProps: { size: 'small' },
            styleOverrides: {
              root: {
                fontSize: '0.78rem',
                fontWeight: 500,
              },
            },
          },
          MuiSelect: {
            defaultProps: { size: 'small' },
            styleOverrides: {
              select: {
                fontSize: '0.8rem',
                padding: '7px 12px',
              },
            },
          },
          MuiMenuItem: {
            styleOverrides: {
              root: {
                fontSize: '0.78rem',
                minHeight: 34,
                padding: '6px 14px',
              },
            },
          },
          MuiTableCell: {
            styleOverrides: {
              root: {
                fontSize: '0.78rem',
                padding: '8px 12px',
                borderColor: mode === 'dark' ? '#1f2937' : '#f1f5f9',
              },
              head: {
                fontWeight: 700,
                fontSize: '0.72rem',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                color: mode === 'dark' ? '#9ca3af' : '#64748b',
                backgroundColor: mode === 'dark' ? '#111827' : '#f8fafc',
              },
            },
          },
          MuiPaper: {
            styleOverrides: {
              root: {
                borderRadius: 10,
                backgroundImage: 'none',
              },
            },
          },
          MuiCard: {
            styleOverrides: {
              root: {
                borderRadius: 10,
                backgroundImage: 'none',
                boxShadow: mode === 'dark' ? '0 1px 3px rgba(0,0,0,0.4)' : '0 1px 3px rgba(0,0,0,0.04)',
              },
            },
          },
          MuiDialogTitle: {
            styleOverrides: {
              root: { fontSize: '1rem', fontWeight: 700, padding: '14px 20px' },
            },
          },
          MuiDialogContent: {
            styleOverrides: {
              root: { padding: '12px 20px' },
            },
          },
          MuiDialogActions: {
            styleOverrides: {
              root: { padding: '10px 20px' },
            },
          },
        },
      }),
    [mode]
  );

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        {children}
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};
