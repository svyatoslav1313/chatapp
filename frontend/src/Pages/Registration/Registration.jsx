import { Link } from "react-router-dom";
import styles from "./Registration.module.scss";
import { useContext, useState } from "react";
import { AuthContext } from "../../Context/AuthContext";
import { AlertCircle, CheckCircle } from "lucide-react";

export const Registration = () => {
  const { registration } = useContext(AuthContext);
  const [name, setName] = useState("");
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [serverResponse, setServerResponse] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [generalError, setGeneralError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    setPassword("");
    setFieldErrors({});
    setGeneralError("");

    registration(name, nickname, email, password)
      .then((res) => setServerResponse(res.message))
      .catch((error) => {
        const responseData = error.response?.data;

        if (
          responseData?.errors &&
          Object.keys(responseData.errors).length > 0
        ) {
          setFieldErrors(responseData.errors);

          return;
        }

        if (responseData?.message) {
          setGeneralError(responseData.message);
        }
      });
  };

  return (
    <div className={styles.regContainer}>
      <div className={styles.regCard}>
        <div className={styles.regLogoContainer}>{/* <Logo /> */}</div>
        <h1 className={styles.regTitle}>Create an account</h1>
        <p className={styles.regSubtitle}>
          Enter your email below to create your account
        </p>
        <form className={styles.regForm} onSubmit={handleSubmit}>
          <div className={styles.fieldGroup}>
            <input
              type="text"
              value={name}
              placeholder="Name Surname"
              className={`${styles.regInput} ${fieldErrors.name ? styles.inputError : ""}`}
              onChange={(e) => {
                setName(e.target.value);
                // Опционально: убираем ошибку поля при вводе
                setFieldErrors((prev) => ({ ...prev, name: null }));
              }}
            />
            {fieldErrors.name && (
              <span className={styles.fieldErrorMessage}>
                {fieldErrors.name}
              </span>
            )}
          </div>

          <div className={styles.fieldGroup}>
            <input
              type="text"
              value={nickname}
              placeholder="Nickname"
              className={`${styles.regInput} ${fieldErrors.nickname ? styles.inputError : ""}`}
              onChange={(e) => {
                setNickname(e.target.value);
                setFieldErrors((prev) => ({ ...prev, nickname: null }));
              }}
            />
            {fieldErrors.nickname && (
              <span className={styles.fieldErrorMessage}>
                {fieldErrors.nickname}
              </span>
            )}
          </div>

          <div className={styles.fieldGroup}>
            <input
              type="email"
              value={email}
              placeholder="name@example.com"
              className={`${styles.regInput} ${fieldErrors.email ? styles.inputError : ""}`}
              onChange={(e) => {
                setEmail(e.target.value);
                setFieldErrors((prev) => ({ ...prev, email: null }));
              }}
            />
            {fieldErrors.email && (
              <span className={styles.fieldErrorMessage}>
                {fieldErrors.email}
              </span>
            )}
          </div>

          <div className={styles.fieldGroup}>
            <input
              type="password"
              value={password}
              placeholder="**********"
              className={`${styles.regInput} ${fieldErrors.password ? styles.inputError : ""}`}
              onChange={(e) => {
                setPassword(e.target.value);
                setFieldErrors((prev) => ({ ...prev, password: null }));
              }}
            />
            {fieldErrors.password && (
              <span className={styles.fieldErrorMessage}>
                {fieldErrors.password}
              </span>
            )}
          </div>

          <button type="submit" className={styles.regButtonPrimary}>
            Create Account
          </button>

          {generalError && (
            <div className={styles.error}>
              <AlertCircle size={16} className={styles.errorIcon} />
              <span>{generalError}</span>
            </div>
          )}
        </form>

        <div className={styles.regSeparator}>
          <div className={styles.regLine}></div>
        </div>

        <p className={styles.signInLinkContainer}>
          Already have an account?{" "}
          <Link to="/login" className={styles.signInLink}>
            Sign In
          </Link>
        </p>
      </div>
      {serverResponse && (
        <div className={styles.responseContainer}>
          <CheckCircle />
          <span>{serverResponse}</span>
        </div>
      )}
    </div>
  );
};
