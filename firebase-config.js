const admin = require("firebase-admin");

const serviceAccount = require("../serveur-express/AccountService/ServiceAccountKey.json");

admin.initializeApp({
    credential:admin.credential.cert(serviceAccount),
    databaseURL:"https://loginchat-6cd5c-default-rtdb.firebaseio.com/",
});

module.exports =admin;