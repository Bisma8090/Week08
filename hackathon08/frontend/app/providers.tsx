'use client';
import { Provider } from 'react-redux';
import { store } from './store/store';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#6366f1' },
    secondary: { main: '#22d3ee' },
    background: { default: '#0f0f1a', paper: '#1a1a2e' },
  },
  typography: {
    fontFamily: 'Inter, system-ui, sans-serif',
    h4: { fontSize: '2rem', fontWeight: 800, lineHeight: 1.2 },
    h5: { fontSize: '1.5rem', fontWeight: 700, lineHeight: 1.3 },
    h6: { fontSize: '1.2rem', fontWeight: 700, lineHeight: 1.4 },
    subtitle1: { fontSize: '1rem', fontWeight: 600 },
    subtitle2: { fontSize: '0.85rem', fontWeight: 700, letterSpacing: '0.08em' },
    body1: { fontSize: '1rem', lineHeight: 1.7 },
    body2: { fontSize: '0.95rem', lineHeight: 1.7 },
    caption: { fontSize: '0.8rem', lineHeight: 1.5 },
  },
  shape: { borderRadius: 12 },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { textTransform: 'none', fontWeight: 600, fontSize: '0.95rem' },
        sizeLarge: { padding: '10px 24px', fontSize: '1rem' },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { fontWeight: 600, fontSize: '0.8rem' },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: { '& input, & textarea': { fontSize: '0.95rem' } },
      },
    },
  },
});

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </Provider>
  );
}
