import { useContext, useState } from "react";
import styles from "./AuthenticationPage.module.scss";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../Context/AuthContext";

export const AuthenticationPage = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    login(email, password)
      .then(() => navigate("/main"))
      .catch((error) => setError(error));
  };

  return (
    <div className={styles.authContainer}>
      <div className={styles.authCard}>
        <h1 className={styles.authTitle}>Welcome back</h1>
        <p className={styles.authSubtitle}>Login to your account</p>
        <form className={styles.authForm} onSubmit={handleSubmit}>
          <input
            type="email" // Use email type to hint browser autofill
            value={email}
            placeholder="name@example.com"
            className={styles.authInput}
            onChange={(e) => setEmail(e.target.value)}
            required // Optional: Add HTML5 validation
          />
          <input
            type="password" // Use email type to hint browser autofill
            value={password}
            placeholder="*********"
            className={styles.authInput}
            onChange={(e) => setPassword(e.target.value)}
            required // Optional: Add HTML5 validation
          />
          <button type="submit" className={styles.authButtonPrimary}>
            Sign In with Email
          </button>
        </form>

        <div className={styles.separator}>
          <div className={styles.line}></div>
        </div>

        <p className={styles.signUpLinkContainer}>
          Don't have an account?{" "}
          <Link to="/registration" className={styles.signUpLink}>
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};
