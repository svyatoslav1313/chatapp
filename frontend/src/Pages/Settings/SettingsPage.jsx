import { useContext, useState } from "react";
import {
  AlertCircle,
  ArrowLeft,
  AtSign,
  Check,
  Lock,
  LogOut,
  Mail,
  Settings,
  User,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../Context/AuthContext";
import styles from "./SettingsPage.module.scss";
import { UserContext } from "../../Context/UserContext";

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
      <div className={styles.shell}>
        <header className={styles.header}>
          <button
            type="button"
            className={styles.backButton}
            onClick={() => navigate("/main")}
          >
            <ArrowLeft size={16} />
            Back to chats
          </button>

          <div className={styles.headerCopy}>
            <span className={styles.kicker}>
              <Settings size={14} />
              Account
            </span>
            <h1 className={styles.title}>Settings</h1>
            <p className={styles.subtitle}>
              Manage your profile details and password.
            </p>
          </div>
        </header>

        <div className={styles.card}>
          <div className={styles.body}>
            <div className={styles.section}>
              <span className={styles.sectionLabel}>Profile Info</span>

              <form onSubmit={handleNameSave} className={styles.fieldGroup}>
                <div className={styles.field}>
                  <label className={styles.label}>Name</label>
                  <div className={styles.inputWrapper}>
                    <User size={16} className={styles.icon} />
                    <input
                      type="text"
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      className={styles.input}
                      required
                    />
                  </div>
                </div>
                <div className={styles.actions}>
                  <button type="submit" className={styles.saveBtn}>
                    {savedSections.name ? (
                      <>
                        <Check size={16} /> Saved!
                      </>
                    ) : (
                      "Save Name"
                    )}
                  </button>
                  {nameError && (
                    <div className={styles.error}>
                      <AlertCircle size={16} className={styles.errorIcon} />
                      <span>{nameError}</span>
                    </div>
                  )}
                </div>
              </form>

              <form onSubmit={handleNicknameSave} className={styles.fieldGroup}>
                <div className={styles.field}>
                  <label className={styles.label}>Nickname</label>
                  <div className={styles.inputWrapper}>
                    <AtSign size={16} className={styles.icon} />
                    <input
                      type="text"
                      value={nickname}
                      onChange={(event) => setNickname(event.target.value)}
                      className={styles.input}
                      required
                    />
                  </div>
                </div>
                <div className={styles.actions}>
                  <button type="submit" className={styles.saveBtn}>
                    {savedSections.nickname ? (
                      <>
                        <Check size={16} /> Saved!
                      </>
                    ) : (
                      "Save Nickname"
                    )}
                  </button>
                  {nicknameError && (
                    <div className={styles.error}>
                      <AlertCircle size={16} className={styles.errorIcon} />
                      <span>{nicknameError}</span>
                    </div>
                  )}
                </div>
              </form>

              <form onSubmit={handleEmailSave} className={styles.fieldGroup}>
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
                <div className={styles.field} style={{ marginTop: "1rem" }}>
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
                <div className={styles.actions}>
                  <button type="submit" className={styles.saveBtn}>
                    {savedSections.email ? (
                      <>
                        <Check size={16} /> Saved!
                      </>
                    ) : (
                      "Save Email"
                    )}
                  </button>
                  {emailError && (
                    <div className={styles.error}>
                      <AlertCircle size={16} className={styles.errorIcon} />
                      <span>{emailError}</span>
                    </div>
                  )}
                </div>
              </form>
            </div>

            <hr className={styles.divider} />

            <form onSubmit={handlePasswordSave} className={styles.section}>
              <span className={styles.sectionLabel}>Change Password</span>

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
              <div className={styles.actions}>
                <button type="submit" className={styles.saveBtn}>
                  {savedSections.password ? (
                    <>
                      <Check size={16} /> Saved!
                    </>
                  ) : (
                    "Save Password"
                  )}
                </button>
                {passwordError && (
                  <div className={styles.error}>
                    <AlertCircle size={16} className={styles.errorIcon} />
                    <span>{passwordError}</span>
                  </div>
                )}
              </div>
            </form>
          </div>

          <hr className={styles.divider} />

          <footer className={styles.footer}>
            <button
              type="button"
              onClick={handleLogout}
              className={styles.logoutBtn}
            >
              <LogOut size={16} />
              <span>Log Out</span>
            </button>
          </footer>
        </div>
      </div>
    </div>
  );
};
