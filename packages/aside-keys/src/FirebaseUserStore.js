/*
* src/FirebaseUserStore.js
*
* A Svelte readable store about the currently logged in user (or lack thereof).
*
* Available for applications (well, Svelte applications). The idea is that they would not need to be exposed to Firebase auth API.
*
* Usage:
*   Subscribe to the exposed 'Readable' only after 'firebase.initializeApp()' has been called.
*/
import {readable} from "svelte/store"

// Note: Firebase is expected to be initialized by "upstairs" before calling 'fbUserStoreGen'.
//    Also, "upstairs" should 'import firebase/auth' (we do see if they have).
//
import firebase from 'firebase/app'
import '@firebase/auth';

if (!firebase.auth) throw Error("'firebase.auth' not found!")

// Readable store of:
//  - undefined: initial value, signin/signout status unknown (but has been asked from Firebase)
//  - { email, uid, ... }: active user
//  - null: no active user
//
// We only need one store per web app. ES module allows us an easy way to create a singleton, since each module is
// loaded only once.
//
const firebaseUserStore = readable(
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
  }
)

export {
  firebaseUserStore
}

