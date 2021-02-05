/*
* src/FirebaseUserStoreGen.js
*
* A Svelte readable store about the currently logged in user (or lack thereof).
*
* Usage:
*   <<
*     ...
*     firebase.initializeApp(...);
*
*     ...
*     firebaseUserStore(firebase).subscribe( v => { ... } );
*   <<
*/
import {readable} from "svelte/store"

let cached;

// Returns a readable store of:
//  - undefined: initial value, signin/signout status unknown (but has been asked from Firebase)
//  - { email, uid, ... }: active user
//  - null: no active user
//
// We only need one store per web app. Caches them.
//
const firebaseUserStoreGen = firebase => {
  if (!firebase?.auth) {
    throw new Error("Firebase not properly provided; need 'firebase.auth'.")
  }

  // Q: Is there a better way to make singletons, with ES modules and Svelte? #advice
  return cached || (cached = readable(
    undefined, // initial state
    (set) => {    // "called when the store gets its first subscriber"

      const unsub = firebase.auth().onAuthStateChanged( (user) => {
        if (user) {   // signed in
          const { email } = user;
          // ...
          console.log(`user ${email} is signed in`);
          set(user)   // expose everything we got from Firebase
        } else {    // signed out
          console.log("user is signed out");
          set(null)
        }
      });

      return /*stop*/ () => {  // "called when the last subscriber unsubscribes"
        unsub()
      }
    })
  );
}

export {
  firebaseUserStoreGen
}
