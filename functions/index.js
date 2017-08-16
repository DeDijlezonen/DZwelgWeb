const functions = require('firebase-functions');
var admin = require("firebase-admin");

//var serviceAccount = require("dzwelg-dev-firebase-adminsdk-twu6z-5c19432620.json");

admin.initializeApp(functions.config().firebase);

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
//   databaseURL: "https://dzwelg-dev.firebaseio.com/"
// });

// Create and Deploy Your First Cloud Functions
// https://firebase.google.com/docs/functions/write-firebase-functions

exports.deleteUser = functions.https.onRequest((request, response) => {
  const token = request.query.idToken;
  console.log("recieved token: " + token);
  admin.auth().verifyIdToken(token)
    .then(function(decodedToken) {
      var uid = decodedToken.uid;
      console.log("UID from token: " + uid);

      const deleteUid = request.query.uid;
      console.log("UID to delete (from params): " + deleteUid);
      admin.auth().deleteUser(deleteUid)
        .then(function() {
          console.log("Successfully deleted user");
          response.status(200).send("klaar!");
        })
        .catch(function(error) {
          console.log("Error deleting user:", error);
          response.status(400).send(error);
        });
    }).catch(function(error) {
      console.log("fout bij verificatie token: " + error);
  });
});

exports.deleteUserFromDB = functions.auth.user().onDelete(event => {
  const uid = event.data.uid;
  const email = event.data.email;
  admin.database().ref("gebruikers").child(uid).remove();
  console.log("deleted " + email + " from db");
});
