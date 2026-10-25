'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
} from 'react';

export type ThemeMode = 'light' | 'dark';
type ThemeModeContextValue = { mode: ThemeMode; toggleMode: () => void };
const ThemeModeContext = createContext<ThemeModeContextValue | null>(null);
const THEME_STORAGE_KEY = 'persian-form-panel-theme';
const THEME_CHANGE_EVENT = 'persian-form-panel-theme-change';
let fallbackTheme: ThemeMode = 'light';

function getThemeSnapshot(): ThemeMode {
  try {
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
    return stored === 'light' || stored === 'dark' ? stored : fallbackTheme;
  } catch {
    return fallbackTheme;
  }
}
function getServerThemeSnapshot(): ThemeMode {
  return 'light';
}
function subscribeToTheme(onChange: () => void) {
  window.addEventListener('storage', onChange);
  window.addEventListener(THEME_CHANGE_EVENT, onChange);
  return () => {
    window.removeEventListener('storage', onChange);
    window.removeEventListener(THEME_CHANGE_EVENT, onChange);
  };
}

export function ThemeModeProvider({ children }: { children: React.ReactNode }) {
  const mode = useSyncExternalStore(subscribeToTheme, getThemeSnapshot, getServerThemeSnapshot);
  const toggleMode = useCallback(() => {
    const next = getThemeSnapshot() === 'light' ? 'dark' : 'light';
    fallbackTheme = next;
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      // Theme switching still works for this page when browser storage is unavailable.
    }
    window.dispatchEvent(new Event(THEME_CHANGE_EVENT));
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', mode === 'dark');
    document.documentElement.style.colorScheme = mode;
  }, [mode]);

  const value = useMemo(() => ({ mode, toggleMode }), [mode, toggleMode]);
  return (
    <ThemeModeContext.Provider value={value}>
      <div className="min-h-dvh">{children}</div>
    </ThemeModeContext.Provider>
  );
}

export function useThemeMode() {
  const value = useContext(ThemeModeContext);
  if (!value) throw new Error('useThemeMode must be used inside ThemeModeProvider');
  return value;
}
