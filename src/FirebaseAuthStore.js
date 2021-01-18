/*
* src/FirebaseAuthStore.js
*
* A Svelte readable store about the currently logged in user (or lack thereof).
*/
import {readable} from "svelte/store"

import firebase from 'firebase/app'
if (!firebase.auth) throw Error("'firebase.auth' not initialized")    // caller should do it by importing 'firebase/auth'

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

let existing;   // created by first subscriber

function fbUserStoreGen() {
  if (!existing) {
    existing = gen();
  }
  return existing;
}

/*** nah??
// Promise of:
//  Readable<userInfo | null>
//
// Resolves once the signed in/out state is known, providing a 'Readable' that further reflects that state (like a stream,
// really).
//
const fbUserStoreProm = new Promise( (resolve,reject) => {
  const store = unfilteredStoreGen()

  const unsub = store.subscribe( v => {    // (undefined | null | { email, uid, ... })
    if (v !== undefined) {
      resolve(store)
      unsub();
    }
  })
})
***/

export {
  fbUserStoreGen
}
