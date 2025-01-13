const express = require("express");
const bodyParser = require("body-parser");
const admin = require("./firebase-config");

const app = express();
app.use(bodyParser.json()); 


app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email et mot de passe requis" });
  }

  try {
    // Vérifiez les informations d'identification avec Firebase Authentication
    const userRecord = await admin.auth().getUserByEmail(email);


    res.status(200).json({
      message: "Connexion réussie",
      user: {
        uid: userRecord.uid,
        email: userRecord.email,
        displayName: userRecord.displayName,
      },
    });
  } catch (error) {
    res.status(401).json({ error: "Échec de la connexion", details: error.message });
  }
});

// Démarrez le serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
