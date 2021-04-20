# Approach

*This information is for developers/curious, arguing why certain design decisions were taken.*


## Role of `package/`

By separating the distributable package to its own folder, we can keep its `package.json` (which gets published) to a minimum.

This also allows separate `README` files for the repo (how to develop it) and the published package (how to use it).


<!-- not that important
## Vite over Rollup

[Vite](https://vitejs.dev/guide/introduction.html#why-native-esm) won the  contest over `npm run dev` by:

- being able to magically resolve ES modules (the components) to an HTML file
- having static content replacement 

The first feature means that our sample folder can reach the components via node packaging "peekholes" (`export` restrictions apply), instead of accessing the file system, where also private files are visible. This is great since it makes the demo test the packaging!

>Note: Though/if we don't have automated tests right now, those can be built on top of the sample.

The second feature is useful for passing the Firebase auth values. It eliminates the demo HTML having some `fetch` logic and injecting parameters to `aside-keys` tag. ☠️
-->

## Not requiring a Firebase project

There is no need for the developer to install `firebase-tools` (the Firebase CLI) or have a Firebase project.

We do all development using emulation.


## Initialization from a web app

Haven't found an obvious "best way" for this. Let's try in some apps and see what likes/dislikes are.

<!-- shy away/needs revise?
### If sharing a Firebase app

- Component needs to wait until the main web app has initialized its Firebase
- This means `onMount` is not usable, or alternatively the web app would need to dynamically create and inject `aside-keys` instead of having it in the HTML template (can be done with if/else blocks in web frameworks, but still..)

Pros:

- kind of clear responsibilities. 
- Firebase auth values (API key, auth domain) don't need to be passed to the component

### If having our own Firebase app

- Component still needs to be passed API key and auth domain
- Sometimes these may be available as static HTML (or injected by a framework), but eg. Vite doesn't do that in development workflow.  Means the JavaScript will need to inject the values, later.

   - The component could take injection of such values as a go-ahead.

Pros:

- no need for artificial `start()` method (not an established use pattern)

### Verdict

It's not clear.

Current (5-Feb-2021) implementation is with the `.start()` but we could try the second approach..
-->
