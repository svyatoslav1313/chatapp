import { Check, Monitor, Moon, Sun } from "lucide-react";
import { ACCENTS, useTheme } from "../../utils/theme";
import styles from "./ThemeToggle.module.scss";

const OPTIONS = [
  { value: "system", label: "System", Icon: Monitor },
  { value: "light", label: "Light", Icon: Sun },
  { value: "dark", label: "Dark", Icon: Moon },
];

export const ThemeToggle = ({ className = "" }) => {
  const { theme, setPreference } = useTheme();
  const nextTheme = theme === "dark" ? "light" : "dark";
  const label = `Switch to ${nextTheme} theme`;

  return (
    <button
      type="button"
      className={`${styles.toggle} ${className}`}
      title={label}
      aria-label={label}
      onClick={() => setPreference(nextTheme)}
    >
      {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
};

export const ThemeSwitcher = () => {
  const { preference, setPreference } = useTheme();

  return (
    <div className={styles.switcher} role="radiogroup" aria-label="Theme">
      {OPTIONS.map(({ value, label, Icon }) => (
        <button
          key={value}
          type="button"
          role="radio"
          aria-checked={preference === value}
          className={`${styles.option} ${
            preference === value ? styles.optionActive : ""
          }`}
          onClick={() => setPreference(value)}
        >
          <Icon size={16} />
          <span>{label}</span>
        </button>
      ))}
    </div>
  );
};

export const AccentPicker = () => {
  const { accent, setAccent } = useTheme();

  return (
    <div className={styles.accents} role="radiogroup" aria-label="Accent color">
      {ACCENTS.map(({ value, label }) => (
        <button
          key={value}
          type="button"
          role="radio"
          aria-checked={accent === value}
          aria-label={label}
          title={label}
          data-accent={value}
          className={`${styles.swatch} ${
            accent === value ? styles.swatchActive : ""
          }`}
          onClick={() => setAccent(value)}
        >
          {accent === value && <Check size={16} />}
        </button>
      ))}
    </div>
  );
};
