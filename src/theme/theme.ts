import { createTheme } from '@mui/material/styles';
import { faIR } from '@mui/material/locale';

/**
 * The embedded FormEngine designer renders its own RSuite-based chrome.
 * These tokens mirror RSuite's light and dark themes so the panel and the
 * designer read as one product: blue primary, neutral grays, 6px radii,
 * compact 14px type and flat surfaces.
 */
export type ThemeMode = 'light' | 'dark';

type PaletteTokens = {
  primary: string;
  primaryDark: string;
  primaryLight: string;
  primarySoft: string;
  primaryContrast: string;
  accent: string;
  accentDark: string;
  accentLight: string;
  text: string;
  textSecondary: string;
  textDisabled: string;
  surface: string;
  canvas: string;
  hover: string;
  border: string;
  borderStrong: string;
  tooltipBg: string;
  tooltipText: string;
  menuShadow: string;
};

const tokens: Record<ThemeMode, PaletteTokens> = {
  light: {
    primary: '#3498ff',
    primaryDark: '#2589f5',
    primaryLight: '#80c4ff',
    primarySoft: '#f2faff',
    primaryContrast: '#ffffff',
    accent: '#37ab3c',
    accentDark: '#22a12a',
    accentLight: '#82cf82',
    text: '#343434',
    textSecondary: '#717273',
    textDisabled: '#b6b7b8',
    surface: '#ffffff',
    canvas: '#f7f7fa',
    hover: '#f2f2f5',
    border: '#e5e5ea',
    borderStrong: '#d9d9d9',
    tooltipBg: '#343434',
    tooltipText: '#ffffff',
    menuShadow: '0 4px 16px rgba(18, 18, 18, 0.08)',
  },
  dark: {
    primary: '#34c3ff',
    primaryDark: '#25b3f5',
    primaryLight: '#80ddff',
    primarySoft: 'rgba(52, 195, 255, 0.16)',
    primaryContrast: '#0f131a',
    accent: '#58b15b',
    accentDark: '#3fab45',
    accentLight: '#8ccf8c',
    text: '#e9ebf0',
    textSecondary: '#a4a9b3',
    textDisabled: '#6a6f76',
    surface: '#1a1d24',
    canvas: '#0f131a',
    hover: 'rgba(255, 255, 255, 0.06)',
    border: '#3c3f43',
    borderStrong: '#5c6066',
    tooltipBg: '#3c3f43',
    tooltipText: '#e9ebf0',
    menuShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
  },
};

export function createAppTheme(mode: ThemeMode) {
  const c = tokens[mode];

  return createTheme(
    {
      direction: 'rtl',
      palette: {
        mode,
        primary: {
          main: c.primary,
          light: c.primaryLight,
          dark: c.primaryDark,
          contrastText: c.primaryContrast,
        },
        secondary: {
          main: c.accent,
          light: c.accentLight,
          dark: c.accentDark,
          contrastText: mode === 'dark' ? '#0f131a' : '#ffffff',
        },
        success: { main: c.accent },
        info: { main: mode === 'dark' ? '#1499ef' : '#2196f3' },
        background: { default: c.canvas, paper: c.surface },
        text: {
          primary: c.text,
          secondary: c.textSecondary,
          disabled: c.textDisabled,
        },
        divider: c.border,
        action: {
          hover: c.hover,
          selected: c.primarySoft,
          focus: mode === 'dark' ? 'rgba(52, 195, 255, 0.24)' : '#e5f4ff',
        },
      },
      typography: {
        fontFamily: 'Vazirmatn, Tahoma, sans-serif',
        fontSize: 14,
        body1: { fontSize: '0.875rem', lineHeight: 1.7 },
        body2: { fontSize: '0.8125rem', lineHeight: 1.7 },
        subtitle1: { fontSize: '0.9375rem', fontWeight: 600 },
        button: { fontSize: '0.875rem', fontWeight: 500, textTransform: 'none' },
        caption: { fontSize: '0.75rem', lineHeight: 1.6 },
        overline: { fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.08em' },
        h4: { fontSize: '1.5rem', fontWeight: 700, lineHeight: 1.5 },
        h5: { fontSize: '1.25rem', fontWeight: 700, lineHeight: 1.5 },
        h6: { fontSize: '1rem', fontWeight: 600, lineHeight: 1.6 },
      },
      shape: { borderRadius: 6 },
      components: {
        MuiCssBaseline: {
          styleOverrides: {
            ':root': { colorScheme: mode },
            body: { backgroundColor: c.canvas, color: c.text },
          },
        },
        MuiButtonBase: { defaultProps: { disableRipple: true } },
        MuiAppBar: {
          defaultProps: { color: 'inherit', elevation: 0, position: 'sticky' },
          styleOverrides: {
            root: {
              zIndex: 10,
              backgroundColor: c.surface,
              backgroundImage: 'none',
              borderBottom: `1px solid ${c.border}`,
              color: c.text,
            },
          },
        },
        MuiToolbar: {
          styleOverrides: {
            root: { minHeight: 64, '@media (min-width: 0px)': { minHeight: 64 } },
          },
        },
        MuiPaper: { styleOverrides: { root: { backgroundImage: 'none' } } },
        MuiButton: {
          defaultProps: { disableElevation: true },
          styleOverrides: {
            root: { borderRadius: 6, minHeight: 36, paddingInline: 16 },
            sizeSmall: { minHeight: 30, paddingInline: 12 },
          },
        },
        MuiTextField: { defaultProps: { fullWidth: true, size: 'small' } },
        MuiInputBase: { styleOverrides: { root: { fontSize: '0.875rem' } } },
        MuiInputLabel: { styleOverrides: { root: { fontSize: '0.875rem' } } },
        MuiOutlinedInput: {
          styleOverrides: {
            root: {
              borderRadius: 6,
              backgroundColor: c.surface,
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: c.borderStrong,
              },
            },
            notchedOutline: { borderColor: c.border },
          },
        },
        MuiCard: {
          styleOverrides: {
            root: {
              border: `1px solid ${c.border}`,
              borderRadius: 6,
              boxShadow: 'none',
            },
          },
        },
        MuiChip: {
          styleOverrides: {
            root: { borderRadius: 6, fontWeight: 500 },
            sizeSmall: { height: 26 },
          },
        },
        MuiAlert: { styleOverrides: { root: { borderRadius: 6 } } },
        MuiMenu: {
          styleOverrides: {
            paper: {
              border: `1px solid ${c.border}`,
              borderRadius: 6,
              boxShadow: c.menuShadow,
            },
          },
        },
        MuiMenuItem: { styleOverrides: { root: { fontSize: '0.875rem', minHeight: 36 } } },
        MuiDrawer: {
          styleOverrides: { paper: { backgroundImage: 'none', backgroundColor: c.surface } },
        },
        MuiTooltip: {
          defaultProps: { arrow: false },
          styleOverrides: {
            tooltip: {
              backgroundColor: c.tooltipBg,
              color: c.tooltipText,
              borderRadius: 6,
              fontSize: '0.75rem',
              paddingBlock: 6,
              paddingInline: 10,
            },
          },
        },
        MuiLink: {
          defaultProps: { underline: 'hover' },
          styleOverrides: { root: { color: c.primary } },
        },
      },
    },
    faIR,
  );
}
