import React, { useState } from "react";
import styles from './style.module.css';

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [user, setUser] = useState<{ email: string; displayName?: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Fonction de connexion avec email et mot de passe
  const handleEmailPasswordSignIn = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Connexion réussie
        setUser({ email: data.user.email, displayName: data.user.displayName });
        setError(null);
        console.log('Utilisateur connecté :', data.user);
      } else {
        // Erreur côté serveur
        setError(data.error || 'Erreur lors de la connexion');
      }
    } catch (error) {
      console.error("Erreur lors de la connexion :", error);
      setError('Erreur lors de la connexion');
    }
  };

  // Déconnexion
  const handleLogout = () => {
    setUser(null);
    console.log("Utilisateur déconnecté");
  };

  return (
    <div>
      {/* Navbar */}
      <div className={styles.navBar}>
        <ul className={styles.ul}>
          <li>Home</li>
          <li>Product</li>
          <li>About</li>
          <li>Contact</li>
        </ul>
      </div>

      {/* Section */}
      <div className={styles.section}>
        {user ? (
          <>
            <h1 className={styles.welcomeMessage}>
              Bienvenue, {user.displayName || user.email}
            </h1>
            <button className={styles.logoutButton} onClick={handleLogout}>Se déconnecter</button>
          </>
        ) : (
          <>
            <h1 className={styles.h1}>Casual Chat</h1>
            <h3 className={styles.h3}>Profitez d'une discussion détendue</h3>

            {/* Formulaire de connexion */}
            <form onSubmit={handleEmailPasswordSignIn}>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className={styles.input}
              />
              <input
                type="password"
                placeholder="Mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className={styles.input}
              />
              <button type="submit" className={styles.loginButton}>Se connecter</button>
            </form>

            {error && <p className={styles.error}>{error}</p>}
          </>
        )}
      </div>
    </div>
  );
};

export default Login;
