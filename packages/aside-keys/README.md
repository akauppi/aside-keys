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

A web project that [can consume](https://caniuse.com/es6-module) native ES modules. The project is not considering supporting legacy browsers, but you can likely modify the code to do so if you need to.

Firebase or [Google Identity Platform](https://cloud.google.com/identity-platform) project, and the following authentication values:

- API key
- auth domain

You get these from eg. the [Firebase console](https://console.firebase.google.com) > project > application > General.

>Security note:
>
>While the auth values are not exactly secrets (people having access to your web site will be able to sniff them out), it is recommended by Google not to store them in public version control repos.


## Using in your project

```
$ npm install @akauppi/aside-keys
```

In your browser code:

```
import "@akauppi/aside-keys"
```

This needs some ES resolver (eg. Vite; see the module's [GitHub repo](http://github.com/akauppi/aside-keys) for a sample) to resolve the node packages to browser JavaScript modules.

Once the import has happened, the browser knows how to deal with `aside-keys` tag in your HTML.

### HTML

```
<aside-keys [api-key auth-domain]>
  <h1>Hello - please log in!</h1>
</aside-keys>
```

This is your custom element. You provide it the `api-key` and `auth-domain` values (more about them below) either statically with proper values, or by setting them later with `.setAttribute`.

Once both the values exist, the component identifies towards Firebase authentication. If there is no user currently signed in, a sign-in panel slides in.

The HTML you place in the slot (between the `aside-keys` start and end tags) is completely up to you. You should not be misleading to the user, of course, but somehow indicate what the panel is about.

### CSS

The component *does not style itself*. You provide the style to it using [CSS ::part](https://developer.mozilla.org/en-US/docs/Web/CSS/::part) (MDN Web Docs).

>CSS `::part` allows the user of a web component to provide themes for the component, but only to parts that the component has specifically exposed. This allows the dance between the component and its context to be done right, and simple.

`aside-keys` exposes the `frame` "part" for this purpose.

The looks of the above snapshot were made by:

<details>
  <summary>Sample CSS from [`index-glassy.html`](https://github.com/akauppi/aside-keys/blob/master/demo/index-glassy.html)</summary>
  
  ```
  /*
  * Styling the web component using '::part'.
  *
  * Safari note:
  *	  'backdrop-filter' is supported with prefix (versions 9..14) -> https://caniuse.com/css-backdrop-filter
  */
  aside-keys::part(frame) {
    background: rgba(255, 255, 255, 0.3);
    /* semi-transparent background */
	backdrop-filter: blur(1em);
	-webkit-backdrop-filter: blur(1em);

	/* enable to get a thin border
	border-left: 1px solid rgba(190,190,190,0.6);
	border-bottom: 1px solid rgba(190,190,190,0.6);
	*/
	border-radius: 1em 0 0 1em;
	box-shadow: 6px 6px 3px rgba(0, 0, 0, 0.2);

	margin-top: 10px;
  }

  @supports not ((backdrop-filter: blur(0)) or (-webkit-backdrop-filter: blur(0))) {
    aside-keys::part(frame) {
      background: rgba(255, 255, 255, 0.9);
      /* more opaque */
	}
  }
  ```
</details> 



### JavaScript

><font color=red>Disclaimer: The software is ALPHA and the way the `onUser` and `signOut` methods are exposed may be changed. Please advice, whether' you'd prefer them as importable module-level functions or element properties/events.

>Here, we go with module imports.
</font>

The `aside-keys` component works as a singleton - it makes sense to have only one of them per web app.

With this in mind, additional features are provided via importing from the module, like so:

```
import { onUser, signOut } from '@akauppi/aside-keys`
```


#### `onUser( callback )`

This provides the user change notifications to your application, without needing to deal with the Firebase auth API.

The prototype is:

```
(null | firebase.User) => ()
```

See -> [`firebase.User`](https://firebase.google.com/docs/reference/js/firebase.User) (Firebase JavaScript API docs)


#### `signOut()`

Calling this signs an active user out, causing the `aside-keys` panel to re-emerge. 

This is simply a call to Firebase `auth().signOut()` and you can do that just as well. The intention is that you would not need to know about the Firebase auth API, but it may be overkill...


## Inside look 🔬

The visual aspect is completely separate from the code handling the sign in/out activities. If you sign in a user using other means than the component, the component should be fine with this. :)

### Visual & layout

Top right is a typical location for sign-in information, around 2021. Many web services show one's active profile there, so we adopted this corner. It's not customizable.

>Note: For mobile phone, sliding from below may be a better take. Let's consider this if the component gets traction. [Google One Tap for Web](https://developers.google.com/identity/one-tap/web) uses bottom of the screen.


## References

- [Learn about using and managing API keys for Firebase](https://firebase.google.com/docs/projects/api-keys) (Firebase docs)
- Google Identity Platform: [Using API keys](https://cloud.google.com/docs/authentication/api-keys) (Google Cloud docs)
- [Styling in the Shadow DOM With CSS Shadow Parts](https://css-tricks.com/styling-in-the-shadow-dom-with-css-shadow-parts/) (blog, Oct 2020)
