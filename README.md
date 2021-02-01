# Gears and Keys ⚙️ 🔩 🗝

<!-- Root README: 
- visible in GitHub
- for developers; explains how to build and test the project
-->

A collection of web components, for a modern (ES modules) web app.

This is like the stuff that collects in the pockets - keys, screw drivers, what not.

|Component|Used for|
|---|---|---|
|[`aside-keys`](packages/aside-keys/README.md)|Authenticate with Firebase|


<!-- 
## Playground

tbd. place testing link in the GitHub description, once deployed

..or maybe make a 'playground' link, above?
-->

## Scope <font size="+2">🔍🐜</font>

||||
|---|---|---|
|Evergreen browsers|<font color=green>&check; IN</font>|IE11 out|
|Firebase|<font color=green>&check; IN</font>|server out|
|Social login|<font color=green>&check; IN</font>|handling passwords out|

## Approach

Keep the code **simple**.


## Requirements

- node

### Google Identity Platform cloud application

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

>The `init.json` is used by the sample HTML to read auth values, so they don't need to be stored in version control. This is slightly more complicated than in an actual web project, where you can likely pass build parameters that get injected directly to the `api-key` and `auth-domain` attributes. We wanted to keep the sample plain HTML and this is the best mechanism we came up with.

Note that the degree of secrecy concerning those values is arguable. On the one side, they are visible for anyone using your web app. On the other, Google recommends *not* keeping them in version control.

It also seems that whether you create the values via Firebase or Google Identity Platform might affect this. If you use the latter, restrict their powers to authentication only by:

1. Google Cloud console > `APIs & Services` > `Credentials` > `API Keys` > `Browser key (auto created by Firebase)` (click)
2. `API Restrictions` > `Restrict key` > `[x] Identity Toolkit API`

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

## References

- [Svelte Web Component - 5.4kB](https://medium.com/@gogakoreli/svelte-web-component-5-4kb-4afe46590d99) (blog, Apr 2020)
  - The repo is based on this article
- [Styling in the Shadow DOM With CSS Shadow Parts](https://css-tricks.com/styling-in-the-shadow-dom-with-css-shadow-parts/) (blog, Oct 2020)
- [Who’s there? Implementing Identity Platform for Web](https://medium.com/@ThatJenPerson/whos-there-implementing-identity-platform-for-web-c210c6839d3b) (blog, Jul 2019)

### GIdP/Firebase Auth values

- [Learn about using and managing API keys for Firebase](https://firebase.google.com/docs/projects/api-keys) (Firebase docs)
- Google Identity Platform: [Using API keys](https://cloud.google.com/docs/authentication/api-keys) (Google Cloud docs)
