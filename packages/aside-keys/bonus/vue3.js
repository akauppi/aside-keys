/*
* Sample code: represent the active user as a Vue.js 3 'ref'.
*/
import firebase from 'firebase/app'
import '@firebase/auth'

import { ref } from 'vue'

const userRef = ref();   // '.value' is 'undefined' until auth has been established

const unsub = firebase.auth().onAuthStateChanged( (user) => {
  userRef.value = user;
});

// Note: Vue.js does not provide a means to know when the listening of a 'ref' would end. Thus, you might well need to
//    provide both the Ref and the unsub function to the caller.
//
return [userRef, unsub];
