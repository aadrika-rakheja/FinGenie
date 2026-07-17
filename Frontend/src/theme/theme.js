const THEME_TOKENS = {
  dark: {
    bg: '#0a0f1e',
    surface: '#131c30',
    surfaceAlt: '#0f1728',
    surfaceRaised: '#182236',
    border: 'rgba(148,163,184,0.14)',
    borderStrong: 'rgba(148,163,184,0.24)',
    text: '#f1f5f9',
    textMuted: '#8b96ab',
    textFaint: '#5c6780',
    primary: '#2dd4bf',
    primarySoft: 'rgba(45,212,191,0.12)',
    success: '#34d399',
    successSoft: 'rgba(52,211,153,0.12)',
    warning: '#f59e0b',
    warningSoft: 'rgba(245,158,11,0.12)',
    danger: '#f97a76',
    dangerSoft: 'rgba(249,122,118,0.12)',
    shadow: '0 20px 60px -20px rgba(0,0,0,0.55)',
  },
  light: {
    bg: '#f6f7fc',
    surface: '#ffffff',
    surfaceAlt: '#f1f3fb',
    surfaceRaised: '#ffffff',
    border: '#e4e8f5',
    borderStrong: '#d6dcf0',
    text: '#0b1c30',
    textMuted: '#64748b',
    textFaint: '#94a3b8',
    primary: '#0d9488',
    primarySoft: 'rgba(13,148,136,0.10)',
    success: '#059669',
    successSoft: 'rgba(5,150,105,0.10)',
    warning: '#d97706',
    warningSoft: 'rgba(217,119,6,0.10)',
    danger: '#e2564f',
    dangerSoft: 'rgba(226,86,79,0.10)',
    shadow: '0 20px 50px -24px rgba(30,41,59,0.18)',
  },
};

const THEME_STORAGE_KEY = 'fin-genie-theme';

export function resolveTheme(theme) {
  if (theme === 'dark' || theme === 'light') {
    return theme;
  }

  if (typeof window === 'undefined') {
    return 'light';
  }

  const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
  return storedTheme === 'dark' || storedTheme === 'light' ? storedTheme : 'light';
}

export function getThemeTokens(theme) {
  const resolvedTheme = resolveTheme(theme);
  return THEME_TOKENS[resolvedTheme] ?? THEME_TOKENS.light;
}

export function isDarkTheme(theme) {
  return resolveTheme(theme) === 'dark';
}

export function applyTheme(theme) {
  const resolvedTheme = resolveTheme(theme);

  if (typeof document !== 'undefined') {
    document.documentElement.classList.toggle('dark', resolvedTheme === 'dark');
    document.documentElement.classList.toggle('light', resolvedTheme === 'light');
    document.documentElement.setAttribute('data-theme', resolvedTheme);
  }

  if (typeof window !== 'undefined') {
    window.localStorage.setItem(THEME_STORAGE_KEY, resolvedTheme);
  }

  return resolvedTheme;
}

export const themeTokens = THEME_TOKENS;
