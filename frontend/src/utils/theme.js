import { useSyncExternalStore } from "react";

const THEME_KEY = "theme";
const ACCENT_KEY = "accent";
const THEME_COLORS = { light: "#ffffff", dark: "#141417" };
const DEFAULT_ACCENT = "indigo";

// Сами цвета описаны в index.css в правилах [data-accent]
export const ACCENTS = [
  { value: "indigo", label: "Indigo" },
  { value: "blue", label: "Blue" },
  { value: "emerald", label: "Emerald" },
  { value: "rose", label: "Rose" },
  { value: "amber", label: "Amber" },
];

const media = window.matchMedia("(prefers-color-scheme: dark)");
const listeners = new Set();

const readStored = (key) => {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
};

const writeStored = (key, value) => {
  try {
    if (value === null) {
      localStorage.removeItem(key);
    } else {
      localStorage.setItem(key, value);
    }
  } catch {
    // настройка всё равно применится на текущую сессию
  }
};

const readPreference = () => {
  const stored = readStored(THEME_KEY);

  return stored === "light" || stored === "dark" ? stored : "system";
};

const readAccent = () => {
  const stored = readStored(ACCENT_KEY);

  return ACCENTS.some(({ value }) => value === stored)
    ? stored
    : DEFAULT_ACCENT;
};

const resolveTheme = (preference) => {
  if (preference !== "system") {
    return preference;
  }

  return media.matches ? "dark" : "light";
};

let state = {};

const apply = ({ theme, accent }) => {
  document.documentElement.dataset.theme = theme;
  document.documentElement.dataset.accent = accent;
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute("content", THEME_COLORS[theme]);
};

const update = ({ preference, accent }, animate = false) => {
  const next = { preference, accent, theme: resolveTheme(preference) };
  const canAnimate =
    animate &&
    (next.theme !== state.theme || next.accent !== state.accent) &&
    typeof document.startViewTransition === "function" &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  state = next;

  // Плавная смена оформления; длительность задана в index.css
  if (canAnimate) {
    document.startViewTransition(() => apply(next));
  } else {
    apply(next);
  }

  listeners.forEach((listener) => listener());
};

update({ preference: readPreference(), accent: readAccent() });

media.addEventListener("change", () => {
  if (state.preference === "system") {
    update(state, true);
  }
});

export const setThemePreference = (preference) => {
  writeStored(THEME_KEY, preference === "system" ? null : preference);
  update({ ...state, preference }, true);
};

export const setAccent = (accent) => {
  writeStored(ACCENT_KEY, accent === DEFAULT_ACCENT ? null : accent);
  update({ ...state, accent }, true);
};

const subscribe = (listener) => {
  listeners.add(listener);

  return () => listeners.delete(listener);
};

export const useTheme = () => {
  const { preference, theme, accent } = useSyncExternalStore(
    subscribe,
    () => state,
  );

  return {
    preference,
    theme,
    accent,
    setPreference: setThemePreference,
    setAccent,
  };
};
