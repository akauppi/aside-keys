# Gears and Keys ⚙️ 🔩 🗝

A collection of web components, for a modern (ES modules) web app.

This is like the stuff that collects in the pockets - keys, screw drivers, what not.


# aside-keys

![](.images/aside-keys.png)

Allows signing in with [Firebase authentication](https://firebase.google.com/products/auth).

A modern alternative to the traditional Firebase UI library - that's no longer needed. 🕺

<!--
.. short mentions of others here
-->

<!-- 
## Playground

tbd. place testing link in the GitHub description, once deployed
-->

## Scope

||||
|---|---|---|
|Evergreen browsers|<font color=green>&check; IN</font>|IE11 out|
|Firebase|<font color=green>&check; IN</font>|server out|
|Social login|<font color=green>&check; IN</font>|handling passwords out|

### Simplicity

One of the aims is to keep the code **simple**.

No considerations of platforms other than the web.

No consideration of authentication mechanisms that involve asking the user a plain text password.


## Requirements

- node

To use `aside-keys`, you need to create a Google Identity Platform project (which automatically creates a Firebase project of the same id).

In particular:

- get "API key" and "auth domain" from the [Firebase console](https://console.firebase.google.com/). <sub>[instructions](https://firebase.google.com/docs/projects/api-keys)</sub>
  - create a "web app" entry for this
  - create a file `init.json` that carries those keys:

   ```
   {
     "apiKey": "AIza...l8hQ",
     "authDomain": "your...firebaseapp.com"
   }
   ```

Note that the degree of secrecy concerning those values is arguable. On the one side, they are visible for anyone using your web app. On the other, Google recommends *not* keeping them in version control - which is what we follow.

Find your own sweet spot and study the Google documentation carefully.



<!--
Notes on secrecy:

"API keys for Firebase services are ok to include in code or checked-in config files" (regarding _Firebase_)
-->

<!--
Developed on:

macOS 11.1
node 15.x
-->


## Getting started

```
$ npm install
```

```
$ npm run dev 
```

Open a browser at [localhost:5000](http://localhost:5000). 


<!-- tbd. make this 'deploy/README.md'
## Packaging

```
$ npm run build
```
-->

<!--
## Using

tbd. instructions about getting the module
-->


## API documentation

- [`aside-keys`](docs/aside-keys.md)

## Using in your project

### Google Identity Platform

Note: Google Identity Platform and Firebase have a special relation (discussed in the instructions below). You can see GIdP as a superset of Firebase; they share the authentication API, JavaScript client and project identifiers.

To use `aside-keys` in your own project, replace the two strings in `public/config.js` with those of your own.

```
const apiKey = '...'
const authDomain = '...'
```

Alternatively, you can provide the strings directly as `aside-keys` attributes. They are NOT secrets, but have been placed in their own file in this repo for code management reasons (maybe a bad idea?).

You need:

A Google Cloud project with Identity platform and billing enabled.

Instructions:

- [Who’s there? Implementing Identity Platform for Web](https://medium.com/@ThatJenPerson/whos-there-implementing-identity-platform-for-web-c210c6839d3b) (blog, Jul 2019)

Select Google as a provider, not email & password as in the instructions.

>Billing note: Use of identity platform is free (as of Jan 2021) up to 49 999 monthly active users. 😊

**After** you have created the above Google project, visit the [Firebase console](https://console.firebase.google.com).

There is a Firebase project here by the same name as the Google project you created. We need its `appId` and `authDomain`.

- Create a web app

This gives you a [page](https://console.firebase.google.com/u/0/project/YOUR_PROJECT_ID/overview) (replace your project id!) that shows:

```
var firebaseConfig = {
  apiKey: "...",
  authDomain: "idp-try-090121.firebaseapp.com",
  ...
```

Pick those two.

Write them in `public/config.js`.

Test that the UI works.


## References

- [Svelte Web Component - 5.4kB](https://medium.com/@gogakoreli/svelte-web-component-5-4kb-4afe46590d99) (blog, Apr 2020)
  - The repo is based on this article
- [Styling in the Shadow DOM With CSS Shadow Parts](https://css-tricks.com/styling-in-the-shadow-dom-with-css-shadow-parts/) (blog, Oct 2020)

