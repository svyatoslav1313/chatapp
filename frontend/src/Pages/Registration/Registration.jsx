import { Link } from "react-router-dom";
import styles from "./Registration.module.scss";
import { useContext, useState } from "react";
import { AuthContext } from "../../Context/AuthContext";
import { CheckCircle } from "lucide-react";

export const Registration = () => {
  const { registration } = useContext(AuthContext);
  const [name, setName] = useState("");
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [serverResponse, setServerResponse] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    registration(name, nickname, email, password)
      .then((res) => setServerResponse(res.message))
      .catch((error) => setError(error));
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
          <input
            type="text"
            value={name}
            placeholder="Name Surname"
            className={styles.regInput}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="text"
            value={nickname}
            placeholder="Nickname"
            className={styles.regInput}
            onChange={(e) => setNickname(e.target.value)}
            required
          />
          <input
            type="email"
            value={email}
            placeholder="name@example.com"
            className={styles.regInput}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            value={password}
            placeholder="**********"
            className={styles.regInput}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className={styles.regButtonPrimary}>
            Create Account
          </button>
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
