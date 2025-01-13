import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, signOut, User } from "firebase/auth";
import React, { useEffect, useState } from "react";
import styles from './style.module.css'; // Importation du module CSS

// Configuration Firebase
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialisation de Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [user, setUser] = useState<User | null>(null);  // Spécification du type User de Firebase
  const [error, setError] = useState<string | null>(null);

  // Vérifie si un utilisateur est connecté dès le début
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user); // Met à jour l'état de l'utilisateur lorsqu'il est connecté
      } else {
        setUser(null); // Réinitialise l'état si l'utilisateur est déconnecté
      }
    });

    // Nettoyage à la désactivation du composant
    return () => unsubscribe();
  }, []);

  // Fonction de connexion avec email et mot de passe
  const handleEmailPasswordSignIn = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      setUser(result.user);
      console.log("Utilisateur connecté :", result.user);

      // Récupérer le token d'ID de l'utilisateur
      const idToken = await result.user.getIdToken();

      // Envoyer le token au backend pour validation
      const response = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: idToken }),
      });

      const data = await response.json();
      if (data.success) {
        // Connexion réussie
        console.log('Utilisateur validé côté backend');
      } else {
        // Erreur du côté du backend
        setError('Erreur de validation avec le backend');
      }
    } catch (error) {
      console.error("Erreur lors de la connexion :", error);
      setError('Erreur lors de la connexion');
    }
  };

  // Déconnexion
  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        setUser(null); // Réinitialise l'état de l'utilisateur après la déconnexion
        console.log("Utilisateur déconnecté");

        // Facultatif: Effacer manuellement les cookies ou autres données si nécessaire
        document.cookie = "firebaseAuth="; // Supprime un cookie spécifique Firebase (si vous en avez un)
      })
      .catch((error) => {
        console.error("Erreur lors de la déconnexion :", error);
        setError('Erreur lors de la déconnexion');
      });
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
            <h1 className={styles.welcomeMessage}>Welcome in Our Chat</h1>
            <button className={styles.logoutButton} onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <h1 className={styles.h1}>Casual Chat</h1>
            <h3 className={styles.h3}>Have a good rest by chatting</h3>
            <h3 className={styles.h3}>
              with friends at home
            </h3>

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
