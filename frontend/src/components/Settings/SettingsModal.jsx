import { useState } from "react";
import { X, LogOut, User, Lock, Mail, AtSign, Check } from "lucide-react";
import styles from "./SettingsModal.module.scss";

export const SettingsModal = ({ user, isOpen, onClose, onLogout }) => {
  const [name, setName] = useState(user.name || "");
  const [nickname, setNickname] = useState(user.nickname || "");
  const [email, setEmail] = useState(user.email || "");

  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isSaved, setIsSaved] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e) => {
    e.preventDefault();
    // Здесь отправка обновленных данных на бэкенд
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Шапка модалки */}
        <div className={styles.header}>
          <h2 className={styles.title}>Account Settings</h2>
          <button className={styles.closeBtn} onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Тело формы */}
        <form onSubmit={handleSave} className={styles.body}>
          {/* Секция: Личная информация */}
          <div className={styles.section}>
            <span className={styles.sectionLabel}>Profile Info</span>

            <div className={styles.row}>
              <div className={styles.field}>
                <label className={styles.label}>Name</label>
                <div className={styles.inputWrapper}>
                  <User size={16} className={styles.icon} />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={styles.input}
                    required
                  />
                </div>
              </div>
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Nickname</label>
              <div className={styles.inputWrapper}>
                <AtSign size={16} className={styles.icon} />
                <input
                  type="text"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  className={styles.input}
                  required
                />
              </div>
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Email Address</label>
              <div className={styles.inputWrapper}>
                <Mail size={16} className={styles.icon} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={styles.input}
                  required
                />
              </div>
            </div>
          </div>

          <hr className={styles.divider} />

          {/* Секция: Безопасность */}
          <div className={styles.section}>
            <span className={styles.sectionLabel}>Change Password</span>

            <div className={styles.field}>
              <label className={styles.label}>New Password</label>
              <div className={styles.inputWrapper}>
                <Lock size={16} className={styles.icon} />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className={styles.input}
                />
              </div>
            </div>
          </div>

          {/* Кнопка сохранения */}
          <div className={styles.actions}>
            <button type="submit" className={styles.saveBtn}>
              {isSaved ? (
                <>
                  <Check size={16} /> Saved!
                </>
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </form>

        <hr className={styles.divider} />

        {/* Кнопка выхода из аккаунта */}
        <div className={styles.footer}>
          <button type="button" onClick={onLogout} className={styles.logoutBtn}>
            <LogOut size={16} />
            <span>Log Out</span>
          </button>
        </div>
      </div>
    </div>
  );
};
