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

/**
 * Verwijderd gebruiker a.d.h.v. hun uid
 *
 * POST actie met parameters:
 *  uid - Firebase uid van te verwijderen gebruiker
 *  token - Token van aangemelde gebruiker (te verkrijgen met getToken())
 *          voor codevoorbeeld, zie: https://firebase.google.com/docs/auth/admin/verify-id-tokens#retrieve_id_tokens_on_clients
 */
exports.deleteUser = functions.https.onRequest((request, response) => {
  // token uit request halen
  const token = request.query.idToken;
  console.log("recieved token: " + token);

  // nakijken of token tot een geldige gebruiker behoort
  admin.auth().verifyIdToken(token)
    .then(function(decodedToken) {
      var uid = decodedToken.uid;
      console.log("UID from token: " + uid);

      // uid van te verwijderen gebruiker uit request halen
      const deleteUid = request.query.uid;
      console.log("UID to delete (from params): " + deleteUid);

      // gebruiker (proberen te) verwijderen
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
      console.log("Fout bij verificatie token: " + error);
  });
});

/**
 * Idem als deleteUser, maar met meer logging
 *
 * POST actie met parameters:
 *  uid - Firebase uid van te verwijderen gebruiker
 *  token - Token van aangemelde gebruiker (te verkrijgen met getToken())
 *          voor codevoorbeeld, zie: https://firebase.google.com/docs/auth/admin/verify-id-tokens#retrieve_id_tokens_on_clients
 */
exports.deleteUserWithDebug = functions.https.onRequest((request, response) => {
  console.log("method: " + request.method);
  console.log("header: ");
  console.log(request.header);
  console.log("query:");
  console.log(request.query);
  console.log("body:");
  console.log(request.body);
  console.log("token from body; " + request.body.idToken)

  // token uit request halen
  const token = request.query.idToken;
console.log("recieved token: " + token);

// nakijken of token tot een geldige gebruiker behoort
admin.auth().verifyIdToken(token)
  .then(function(decodedToken) {
    var uid = decodedToken.uid;
    console.log("UID from token: " + uid);

    // uid van te verwijderen gebruiker uit request halen
    const deleteUid = request.query.uid;
    console.log("UID to delete (from params): " + deleteUid);

    // gebruiker (proberen te) verwijderen
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
  console.log("Fout bij verificatie token: " + error);
});
});

/**
 * Verwijderd gebruiker uit database. Wordt automatisch uitgevoerd als een Firebase gebruiker wordt verwijderd
 *  (op die manier blijft de database in sync met Firebase controlepaneel)
 */
exports.deleteUserFromDB = functions.auth.user().onDelete(event => {
  const uid = event.data.uid;
  const email = event.data.email;
  admin.database().ref("gebruikers").child(uid).remove();
  console.log("deleted " + email + " from db");
});

exports.cleanDirtyTransactions = functions.https.onRequest((request, response) => {
  admin.database().ref("transacties_dirty").once('value', function (snapshot) {
    snapshot.child('eventNaam').remove();
    snapshot.child('totaal').remove();
    snapshot.forEach(function (childSnapshot) {
      console.log(childSnapshot.val());
    });
  });

  response.status(200).send("klaar!");
});
