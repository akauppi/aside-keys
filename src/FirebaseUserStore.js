/*
* src/FirebaseUserStore.js
*
* A Svelte readable store about the currently logged in user (or lack thereof).
*
* Usage:
*   Subscribe to the exposed 'Readable' only after 'firebase.initializeApp()' has been called.
*
*   We benefit from the ES module's singularity (only loaded once and shareable by all). It is *QUESTIONABLE*
*   to do any initializations in an ES module's main, but... let's try.
*/
import {readable} from "svelte/store"

// Note: Firebase is expected to be initialized by "upstairs" before calling 'fbUserStoreGen'.
//    Also, "upstairs" should 'import firebase/auth' (we do see if they have).
//
import firebase from 'firebase/app'
if (!firebase.auth) throw Error("'firebase.auth' not imported")    // enough to do it once (in component main)

// Readable store of:
//  - undefined: initial value, signin/signout status unknown (but has been asked from Firebase)
//  - { email, uid, ... }: active user
//  - null: no active user
//
const gen = _ => readable(
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

/*** disabled
let cached;   // created by first subscriber

function firebaseUserReadableGen() {    // () => { subscribe: ... }
  if (!cached) {
    cached = gen();
  }
  return cached;
}

export {
  firebaseUserReadableGen   // 'firebase.initializeApp' *must* be called before this
}
***/

const firebaseUserStore = gen();    // we only need one

export {
  firebaseUserStore
}

