# Further plans... 🔭

## SAML authentication

This should be possible via the Google Identity Platform, but needs to be checked in practise.

The author is go for including such a feature - let them know eg. as an issue/PR.


## Firebase auth

Definitely needs to be supported. This repo should work as a replacement for Firebase UI leavers.


## Google Sign-in (only)

[Integrating Google Sign-In into your web app](https://developers.google.com/identity/sign-in/web/sign-in)

This would be a simple adapter for Google-only accounts (no hub like Firebase and Google Identity Platform are).

See [Authenticate Using Google Sign-In with JavaScript](https://firebase.google.com/docs/auth/web/google-signin) (Firebase docs) This does not use Firebase UI.

The way to make Firebase open with this is:

```
firebase.auth().signInWithCredential(credential)
```

