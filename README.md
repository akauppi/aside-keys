# aside-keys

>Note: The name of the project will change.

A web component for adding social login to one's modern web application.

<!-- tbd. place testing link in the GitHub description, once deployed
-->

## Scope

||in scope|out of scope|
|---|---|---|
|Browsers|"evergreen"|IE 11|
|Auth frameworks|serverless||
|"Email & pword" authentication|--|out|

The author is needing such a component for a Firebase web project. Other auth frameworks can be considered (file an Issue/PR).

### Simplicity

One of the aims is to keep the code **simple**.

No considerations of platforms other than the web.

### Not knowing one's users' passwords

No consideration of authentication mechanisms that involve asking the user a plain text password.



## Requirements

- node

To use authentication with your own project, you need to create a Google Identity Platform project (which automatically creates a Firebase project of the same id).

You can, however, try the UI before this. We'll get back to creating the project, later.


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
  apiKey: "AIzaSyAd_eTlN_8XgJzB0Y0j0ICM9WmUWOAR5DA",
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

