import { createTheme } from '@mui/material/styles';
import { faIR } from '@mui/material/locale';
export const theme = createTheme(
  {
    direction: 'rtl',
    typography: {
      fontFamily: 'Vazirmatn, Tahoma, sans-serif',
      h4: { fontWeight: 800 },
      h5: { fontWeight: 700 },
      button: { fontWeight: 600, textTransform: 'none' },
    },
    palette: {
      primary: { main: '#235c4b' },
      secondary: { main: '#b27638' },
      background: { default: '#f6f7f9', paper: '#fff' },
      text: { primary: '#172b36', secondary: '#687780' },
    },
    shape: { borderRadius: 12 },
    components: {
      MuiButton: {
        defaultProps: { disableElevation: true },
        styleOverrides: { root: { minHeight: 44 } },
      },
      MuiTextField: { defaultProps: { fullWidth: true, size: 'small' } },
      MuiPaper: { styleOverrides: { root: { backgroundImage: 'none' } } },
      MuiCard: { styleOverrides: { root: { border: '1px solid #e4e9eb', boxShadow: 'none' } } },
    },
  },
  faIR,
);
