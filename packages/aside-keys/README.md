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

A web project that can consume native ES modules.

[Caniuse: ES6 modules](https://caniuse.com/es6-module): 92.27%


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
<aside-keys>
  <h1>Hello - please log in!</h1>
</aside-keys>
```

This is your custom element. It's initially hidden, until it gets knowledge from Firebase JavaScript library whether there is an active user or not. If not, it slides a login UI on screen.

The HTML you place in the slot (between the beginning and end tags) is completely up to you. :)


### Initialization

The component trusts your application to initialize Firebase - it likely needs it for something else than just authentication - and call its `.start()` method, once ready:

```
import firebase from 'firebase/app'
import '@firebase/auth'

...
firebase.initialize(config)
...
keysEl.start();		// after Firebase initialization
```

>Note: There are design alternatives; see `APPROACH.md` in the source repo if you would feel more comfortable with another kind of initialization. The author can be reached via GitHub Issues.

You can get `keysEl` with various ways, depending on the front-end framework (eg. Svelte `bind:this`). With plain HTML, you can use `document.querySelector('aside-keys')`.

### CSS

The component *does not style itself*. You provide the style to it using [CSS ::part](https://developer.mozilla.org/en-US/docs/Web/CSS/::part) (MDN Web Docs).

>CSS `::part` allows the user of a web component to provide themes for the component, but only to parts that the component has specifically exposed. This allows the dance between the component and its context to be done right, and simple. `aside-keys` exposes the `frame` "part" for this purpose.
>
>- [Styling in the Shadow DOM With CSS Shadow Parts](https://css-tricks.com/styling-in-the-shadow-dom-with-css-shadow-parts/) (blog, Oct 2020)

The looks of the above snapshot are made by:

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



## Behaviour

When placed in the DOM, the `aside-keys` component listens to Firebase authentication. If an active user exists, it is kept hidden. If a user signs out (or wasn't there to begin with), the component slides in from the right of the screen.

Top right is a typical location for sign-in information, around 2021. Eg. Google Docs show one's active profile there, so we adopted this corner. It's not customizable.

Once the component sees the user logged in (likely because they pressed the "Sign in" button provided by the component itself), it slides off screen.


## API

### Slot

You can feed in any HTML to be shown as part of the login dialog, by providing it within the `aside-keys` tag. You should not be misleading to the user, of course, but somehow indicate what the pane is about.

This allows eg. for localization of the text, without the component needing to support localization.

### Methods

#### `.start()`

Signals to the component that Firebase default application is initialized. It will slide in the side panel after this, unless a user is already signed in.

#### `.signOut()`

The component provides this method, to sign an active user out (causing the `aside-keys` pane to re-emerge). This is simply a call to `firebase.auth().signOut()` and you can do that just as well. The intention is that you would not need to know about the Firebase auth API, but it may be overkill...

>Also wanted to see, whether methods work for web components. They do.


### Events

You can tap into the `firebase.auth().onAuthStateChanged()` if you want to, and listen to authentication changes through there.

Or you can listen to the events coming from the `aside-keys` web component:

<font color=red>tbd. DETAILS!!!</font>


That was all about using `aside-keys` - hope you find the component useful. Feedback and problem reports are welcome at [GitHub Issues](https://github.com/akauppi/aside-keys/issues).


## References

- [Learn about using and managing API keys for Firebase](https://firebase.google.com/docs/projects/api-keys) (Firebase docs)
- Google Identity Platform: [Using API keys](https://cloud.google.com/docs/authentication/api-keys) (Google Cloud docs)
