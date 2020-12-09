const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();
const regex = /perro/gi;

exports.replaceDogs = functions.firestore
  .document("/rooms/{room}/messages/{message}")
  .onCreate((snapshot, context) => {
    const original = snapshot.data().message;
    const replaced = original.replace(regex, "gato");

    if (original === replaced) {
      return null; // Infinite loop protection
    }

    return snapshot.ref.update({ message: replaced }); // Always return something
  });

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.helloWorld = functions.https.onRequest((request, response) => {
  functions.logger.info("Hello logs!", { structuredData: true });
  response.send("Hello from Firebase!");
});
