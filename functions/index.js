const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();
const { Storage } = require("@google-cloud/storage");

exports.deleteStorageRoom = functions.firestore
  .document("/rooms/{room}")
  .onDelete((snapshot, context) => {
    const folderId = snapshot.id;

    const storage = new Storage();

    const bucket = storage.bucket("vuetalk-f3e07.appspot.com");

    return bucket.deleteFiles({
      prefix: `rooms/${folderId}`
    });
  });
