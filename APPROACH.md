# Approach

*This information is for developers/curious, arguing why certain design decisions were taken.*


## `packages/` and central build

The repo balances between centralized and distributed. On the one hand, we want to keep development easy. On the other, we wish to have the components clearly separated from each other, helping handling of their lifespan (creation; versioning; publishing; expiry).

To do this:

- as far as `npm publish` is concerned, the components each have their own package
- building is currently a WIP (work-in-progress) area. Trying an approach where the component builds itself but development always happens at the root level

<!-- disabled
This avoids eg. duplication of build files. We aim for being able to develop ~ a dozen components simultaneously.
-->

This basically means:

||centralized|independent|
|---|---|---|
|build|both||
|test/demo|◉|◎|
|versioning|◎|◉|
|npm install|◎|◉|
|testing|tbd.||
|publishing|tbd.||
|GitHub Issues|◉|◎|

The idea is that as a developer, one can remain at the root directory.

### Alternatives

We could have just one `package.json` and handle the differentiation in `exports`.

This would have the down side that:

- `README` would be only one.
- updates to components you don't necessarily use would trigger version updates to users of all other components, as well
- expiring or otherwise making any breaking changes to *any* component would cause a major version bump on them all; essentially breaking semantic versioning

This mechanism only makes sense if you aim at shipping a bundle of components, aware of each other and documented together. Our components are expected to be useful individuals. 😉


## Vite over Rollup

[Vite](https://vitejs.dev/guide/introduction.html#why-native-esm) won the  contest over `npm run dev` by:

- being able to magically resolve ES modules (the components) to an HTML file
- having static content replacement 

The first feature means that our demo folder can reach the components via node packaging "peekholes" (`export` restrictions apply), instead of accessing the file system, where also private files are visible. This is great since it makes the demo test the packaging!

>Note: Though/if we don't have automated tests right now, those can be built on top of the demo pages (or similar test specific HTML).

The second feature is useful for passing the Firebase auth values. It eliminates the demo HTML having some `fetch` logic and injecting parameters to `aside-keys` tag. ☠️


## Building at subpackages

Svelte specific details are kept in the subpackages. The alternative would have been to bridge Svelte with Vite at the root level. This is [possible](https://codechips.me/svelte-with-vitejs-typescript-tailwind/), but didn't want to go that route.

By keeping Svelte away from the root, the demos truly test that the web components are usable - via `npm` imports to their main export (not a Svelte file inside). We wanted this.


## Not requiring Firebase CLI

Though the auth component uses Firebase, there is no need for the developer to install `firebase-tools` (the JavaScript SDK).

*If* we had it, fetching the active project's access values could be done automatically. But that's marginal.


## Initialization from a web app

Haven't found an obvious "best way" for this. Let's try in some apps and see what likes/dislikes are.

The first question is whether to reuse the web app's Firebase "app" - or to have a completely separate one for authentication purposes. Both will likely work - the author thinks FirebaseUI library uses the "separate app" approach.

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

