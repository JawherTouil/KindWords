import React from 'react';
import ReactDOM from 'react-dom/client';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import App from './App';

const theme = createTheme({
  palette: {
    primary: {
      main: '#8B5CF6', // Violet
      light: '#A78BFA',
      dark: '#7C3AED',
    },
    secondary: {
      main: '#C4B5FD', // Light violet
      light: '#DDD6FE',
      dark: '#8B5CF6',
    },
    background: {
      default: '#F5F3FF', // Very light violet
      paper: '#FFFFFF',
    },
    text: {
      primary: '#4C1D95', // Dark violet
      secondary: '#6D28D9', // Medium violet
    },
  },
  typography: {
    fontFamily: '"Segoe UI", "Roboto", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      color: '#4C1D95',
    },
    h3: {
      fontWeight: 600,
      color: '#6D28D9',
    },
  },
  shape: {
    borderRadius: 12,
  },
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </React.StrictMode>
);
