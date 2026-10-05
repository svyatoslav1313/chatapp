import { useContext, useState } from "react";
import {
  AlertCircle,
  ArrowLeft,
  AtSign,
  Check,
  Lock,
  LogOut,
  Mail,
  Palette,
  ShieldCheck,
  User,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../Context/AuthContext";
import styles from "./SettingsPage.module.scss";
import { UserContext } from "../../Context/UserContext";
import {
  AccentPicker,
  ThemeSwitcher,
} from "../../components/ThemeToggle/ThemeToggle";

const SECTIONS = [
  { key: "profile", label: "Profile", Icon: User },
  { key: "account", label: "Account", Icon: ShieldCheck },
  { key: "appearance", label: "Appearance", Icon: Palette },
];

const FormActions = ({ label, saved, error }) => (
  <div className={styles.actions}>
    <button type="submit" className={styles.saveBtn}>
      {saved ? (
        <>
          <Check size={16} /> Saved!
        </>
      ) : (
        label
      )}
    </button>
    {error && (
      <div className={styles.error}>
        <AlertCircle size={16} className={styles.errorIcon} />
        <span>{error}</span>
      </div>
    )}
  </div>
);

export const SettingsPage = () => {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);
  const { changeName, changeNickname, changeEmail, changePassword } =
    useContext(UserContext);

  const [name, setName] = useState(user?.name || "");
  const [nickname, setNickname] = useState(user?.nickname || "");
  const [email, setEmail] = useState(user?.email || "");
  const [emailPass, setEmailPass] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [savedSections, setSavedSections] = useState({});
  const [activeSection, setActiveSection] = useState("profile");

  const [nameError, setNameError] = useState("");
  const [nicknameError, setNicknameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const markSaved = (sectionKey) => {
    setSavedSections((current) => ({
      ...current,
      [sectionKey]: true,
    }));

    window.setTimeout(() => {
      setSavedSections((current) => ({
        ...current,
        [sectionKey]: false,
      }));
    }, 2000);
  };

  const handleNameSave = async (event) => {
    event.preventDefault();
    setNameError("");

    try {
      await changeName(name);
      markSaved("name"); // Сработает только если changeName не выбросил ошибку
    } catch (error) {
      setNameError(error.response?.data?.message);
    }
  };

  const handleNicknameSave = async (event) => {
    event.preventDefault();
    setNicknameError("");

    try {
      await changeNickname(nickname);
      markSaved("nickname");
    } catch (error) {
      setNicknameError(error.response?.data?.message);
    }
  };

  const handleEmailSave = async (event) => {
    event.preventDefault();
    setEmailPass("");
    setEmailError("");

    try {
      await changeEmail(email, emailPass);
      markSaved("email");
    } catch (error) {
      setEmailError(error.response?.data?.message);
    }
  };

  const handlePasswordSave = async (event) => {
    event.preventDefault();
    setPassword("");
    setNewPassword("");
    setPasswordError("");

    try {
      await changePassword(password, newPassword);
      markSaved("password");
    } catch (error) {
      setPasswordError(error.response?.data?.message);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <div className={styles.page}>
      <header className={styles.topbar}>
        <div className={styles.topbarInner}>
          <button
            type="button"
            className={styles.backButton}
            title="Back to chats"
            aria-label="Back to chats"
            onClick={() => navigate("/main")}
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className={styles.title}>Settings</h1>
        </div>
      </header>

      <div className={styles.shell}>
        <aside className={styles.nav}>
          <div className={styles.profile}>
            <div className={styles.avatar}>
              {user?.name?.[0]?.toUpperCase() || "?"}
            </div>
            <div className={styles.profileText}>
              <span className={styles.profileName}>{user?.name}</span>
              <span className={styles.profileEmail}>{user?.email}</span>
            </div>
          </div>

          <div className={styles.tabs} role="tablist" aria-label="Settings">
            {SECTIONS.map(({ key, label, Icon }) => (
              <button
                key={key}
                type="button"
                role="tab"
                aria-selected={activeSection === key}
                className={`${styles.tab} ${
                  activeSection === key ? styles.tabActive : ""
                }`}
                onClick={() => setActiveSection(key)}
              >
                <Icon size={18} />
                <span>{label}</span>
              </button>
            ))}
          </div>
        </aside>

        <main className={styles.content}>
          {activeSection === "profile" && (
            <section className={styles.section}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>Profile</h2>
                <p className={styles.sectionHint}>
                  How other people see you in chats and search.
                </p>
              </div>

              <div className={styles.block}>
                <div className={styles.blockInfo}>
                  <h3 className={styles.blockTitle}>Name</h3>
                  <p className={styles.blockHint}>
                    Shown next to your messages.
                  </p>
                </div>
                <form onSubmit={handleNameSave} className={styles.blockBody}>
                  <div className={styles.inputWrapper}>
                    <User size={16} className={styles.icon} />
                    <input
                      type="text"
                      aria-label="Name"
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      className={styles.input}
                      required
                    />
                  </div>
                  <FormActions
                    label="Save Name"
                    saved={savedSections.name}
                    error={nameError}
                  />
                </form>
              </div>

              <div className={styles.block}>
                <div className={styles.blockInfo}>
                  <h3 className={styles.blockTitle}>Nickname</h3>
                  <p className={styles.blockHint}>
                    People find you by it in search.
                  </p>
                </div>
                <form
                  onSubmit={handleNicknameSave}
                  className={styles.blockBody}
                >
                  <div className={styles.inputWrapper}>
                    <AtSign size={16} className={styles.icon} />
                    <input
                      type="text"
                      aria-label="Nickname"
                      value={nickname}
                      onChange={(event) => setNickname(event.target.value)}
                      className={styles.input}
                      required
                    />
                  </div>
                  <FormActions
                    label="Save Nickname"
                    saved={savedSections.nickname}
                    error={nicknameError}
                  />
                </form>
              </div>
            </section>
          )}

          {activeSection === "account" && (
            <section className={styles.section}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>Account</h2>
                <p className={styles.sectionHint}>
                  Your sign-in details and session.
                </p>
              </div>

              <div className={styles.block}>
                <div className={styles.blockInfo}>
                  <h3 className={styles.blockTitle}>Email address</h3>
                  <p className={styles.blockHint}>
                    Confirm the change with your current password.
                  </p>
                </div>
                <form onSubmit={handleEmailSave} className={styles.blockBody}>
                  <div className={styles.field}>
                    <label className={styles.label}>Email Address</label>
                    <div className={styles.inputWrapper}>
                      <Mail size={16} className={styles.icon} />
                      <input
                        type="email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        className={styles.input}
                        required
                      />
                    </div>
                  </div>
                  <div className={styles.field}>
                    <label className={styles.label}>Current Password</label>
                    <div className={styles.inputWrapper}>
                      <Lock size={16} className={styles.icon} />
                      <input
                        type="password"
                        placeholder="••••••••"
                        value={emailPass}
                        onChange={(event) => setEmailPass(event.target.value)}
                        className={styles.input}
                      />
                    </div>
                  </div>
                  <FormActions
                    label="Save Email"
                    saved={savedSections.email}
                    error={emailError}
                  />
                </form>
              </div>

              <div className={styles.block}>
                <div className={styles.blockInfo}>
                  <h3 className={styles.blockTitle}>Password</h3>
                  <p className={styles.blockHint}>
                    Enter your current password, then a new one.
                  </p>
                </div>
                <form
                  onSubmit={handlePasswordSave}
                  className={styles.blockBody}
                >
                  <div className={styles.field}>
                    <label className={styles.label}>Current Password</label>
                    <div className={styles.inputWrapper}>
                      <Lock size={16} className={styles.icon} />
                      <input
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        className={styles.input}
                      />
                    </div>
                  </div>
                  <div className={styles.field}>
                    <label className={styles.label}>New Password</label>
                    <div className={styles.inputWrapper}>
                      <Lock size={16} className={styles.icon} />
                      <input
                        type="password"
                        placeholder="••••••••"
                        value={newPassword}
                        onChange={(event) => setNewPassword(event.target.value)}
                        className={styles.input}
                      />
                    </div>
                  </div>
                  <FormActions
                    label="Save Password"
                    saved={savedSections.password}
                    error={passwordError}
                  />
                </form>
              </div>

              <div className={styles.block}>
                <div className={styles.blockInfo}>
                  <h3 className={styles.blockTitle}>Session</h3>
                  <p className={styles.blockHint}>
                    Sign out of your account on this device.
                  </p>
                </div>
                <div className={styles.blockBody}>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className={styles.logoutBtn}
                  >
                    <LogOut size={16} />
                    <span>Log Out</span>
                  </button>
                </div>
              </div>
            </section>
          )}

          {activeSection === "appearance" && (
            <section className={styles.section}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>Appearance</h2>
                <p className={styles.sectionHint}>
                  Saved in this browser only.
                </p>
              </div>

              <div className={styles.block}>
                <div className={styles.blockInfo}>
                  <h3 className={styles.blockTitle}>Theme</h3>
                  <p className={styles.blockHint}>
                    System follows your device setting.
                  </p>
                </div>
                <div className={styles.blockBody}>
                  <ThemeSwitcher />
                </div>
              </div>

              <div className={styles.block}>
                <div className={styles.blockInfo}>
                  <h3 className={styles.blockTitle}>Accent color</h3>
                  <p className={styles.blockHint}>
                    Used for buttons, links and your messages.
                  </p>
                </div>
                <div className={styles.blockBody}>
                  <AccentPicker />
                </div>
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  );
};
