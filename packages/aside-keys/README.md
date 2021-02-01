# aside-keys

<!-- packages/aside/README.md
- visible in npm registry
- for users; explains how to import and use the package
-->

![](.images/aside-keys.png)

Allows signing in with [Firebase authentication](https://firebase.google.com/products/auth).

<img src=".images/firebaseui-free.svg" width=70% style="margin: -30px 0 -40px" />

A modern alternative to the traditional Firebase UI library - that's no longer needed. <font size="+3">🕺</font>

## Features

- Themable - your application gives the CSS.
- For browsers with native ES module support.
- Modern, light and only concerned with web.
- Supports Firebase and Google Identity Platform[^1]

[^1]: Other serverless platforms would be interesting; maybe as their own component.


<!-- 
## Playground

tbd. place testing link in the GitHub description, once deployed
-->


## Requirements

A web project that can consume native ES modules. We don't distribute the component as a traditional bundle.

[Caniuse: ES6 modules](https://caniuse.com/es6-module): 92.27%


## Importing

```
$ npm install @akauppi/aside-keys
```

In your browser code:

```
import "@akauppi/aside-keys"
```

This gives you an `aside-keys` web component to use in the HTML.

```
<aside-keys api-key="..." auth-domain="...">
  <h1>Hello - please log in!</h1>
</aside-keys>
```

The `api-key` and `auth-domain` are Firebase auth values you get from the Firebase console.

You can also use [Google Identity Platform](https://cloud.google.com/identity-platform) which is somewhat of a big brother to Firebase. It uses the same Firebase auth JavaScript SDK as Firebase but adds certain features:

- SAML 

You may already be using either Firebase or Google Identity Platform. If not, check the [About Google Identity Platform](#AboutGoogleIdentityPlatform) section and [References](#References).

<!-- tbd. test internal links in GitHub & npm registry 
-->


## Behaviour

When placed in the DOM, the `aside-keys` component listens to Firebase authentication. If an active user exists, it is kept hidden. If a user signs out (or wasn't there to begin with), the component slides in from the right of the screen.

Top right is a typical location for sign-in information, around 2021. Eg. Google Docs show one's active profile there, so we adopted this corner. It's not customizable.

Once the component sees the user logged in (likely because they pressed the "Sign in" button provided by the component itself), it slides off screen.


## Styling

The styling in the above screenshot is done by [this CSS](https://github.com/akauppi/aside-keys/blob/master/public/index-glassy.html#L32-L57) in `index-glassy.html`. The component *does not style itself*. You provide the style to it using [CSS ::part](https://developer.mozilla.org/en-US/docs/Web/CSS/::part) (MDN Web Docs).

>CSS `::part` allows the user of a web component to provide themes for the component, but only to parts that the component has specifically exposed. This allows the dance between the component and its context to be done right, and simple. `aside-keys` exposes the `frame` "part" for this purpose.
>
>- [Styling in the Shadow DOM With CSS Shadow Parts](https://css-tricks.com/styling-in-the-shadow-dom-with-css-shadow-parts/) (blog, Oct 2020)



## API

### Attributes

Provide the `api-key` and `auth-domain` values as attributes. 

>Note: Using a web framework (Vue.js, Svelte, ...) you can inject the values for the attributes statically, from build constants, so that you don't need to burn them into the version control.
>
>The details differ by your build toolchain. With Vite, for example, you can use `import.meta.env.VITE_...` values that are read from `.env` files.<sub>[link](https://vitejs.dev/guide/env-and-mode.html#env-files)</sub>


### Slot

You can feed in any HTML to be shown as part of the login dialog, by providing it within the `aside-keys` tag. You should not be misleading to the user, of course, but somehow indicate what the pane is about.

This allows eg. for localization of the text, without the component needing to support localization.

### Methods

#### `.signOut()`

The component provides a `.signOut` method that your web application can call, to sign an active user out (causing the `aside-keys` pane to re-emerge). This is simply a call to `firebase.auth().signOut()` and you can do that just as well. The intention is that you would not need to know about the Firebase auth API, but it may be overkill...

>Also wanted to see, whether methods work for web components. They do.

- [Sample on using '.signOut'](https://github.com/akauppi/aside-keys/blob/master/public/index-glassy.html#L61-L66) with `index-glassy.html`.


### Events

You can tap into the `firebase.auth().onAuthStateChanged()` if you want to, and listen to authentication changes through there.

Or you can listen to the events coming from the `aside-keys` web component:

<font color=red>tbd. DETAILS!!!</font>


That was all about using `aside-keys` - hope you find the component useful. Feedback and problem reports are welcome at [GitHub Issues](https://github.com/akauppi/aside-keys/issues).


## About Google Identity Platform

Google Identity Platform and Firebase have a special relation. You can see GIdP as a superset of Firebase; they share the authentication API, JavaScript client and project identifiers. When you create a Google Identity Platform project, it automatically creates also a Firebase project, by the same id.

### The application

The auth values (API key and auth domain) needed by the `aside-keys` tag are not secret - but not quite public, either. They identify a web "application" for GIdP / Firebase which means:

- description of your application so that people authenticating know who is asking for their identity
- other details regarding legal frameworks, e.g. GDPR

You'll end up filling such information when filing for an application, either via the GIdP or Firebase console. We won't go into the details here - just helping you see the connection. 🙂

### Auth values - Firebase point of view

Firebase recommends not storing the API key and auth domain in version control, but is otherwise relaxed about them. It seems there's less powers for those when created as part of the Firebase workflow.

### Auth values - Google Identity Platform point of view

Here, there are more strong words and Google recommends (well, insists!) that you  restrict the powers of the API key, when using it for identification.

You do it by:

1. Google Cloud console > `APIs & Services` > `Credentials` > `API Keys` > `Browser key (auto created by Firebase)` (click)
2. `API Restrictions` > `Restrict key` > `[x] Identity Toolkit API`

This should make the Google dialog green, indicating all is well.

### Costs

Use of identity platform is free (as of Jan 2021) up to 49 999 monthly active users. 😊


## References

- [Learn about using and managing API keys for Firebase](https://firebase.google.com/docs/projects/api-keys) (Firebase docs)
- Google Identity Platform: [Using API keys](https://cloud.google.com/docs/authentication/api-keys) (Google Cloud docs)
