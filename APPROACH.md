# Approach

*This information is for developers/curious, arguing why certain design decisions were taken.*


## `packages/` and central build

The repo balances between centralized and distributed. On the one hand, we want to keep development easy. On the other, we wish to have the components clearly separated from each other, helping handling of their lifespan (creation; versioning; publishing; expiry).

To do this:
- as far as `npm publish` is concerned, the components each have their own package
- as far as Rollup (build, development) is concerned, the repo works as one

This avoids eg. duplication of build files. We aim for being able to develop ~ a dozen components simultaneously.

This basically means:

||centralized|independent|
|---|---|---|
|build|◉|◎|
|test/demo|◉|◎|
|versioning|◎|◉|
|npm install|◎|◉|

>Where these two worlds touch is Rollup building files directly from `packages/**/src` and into `packages/**/dist`. But that's likely okay. The idea is that as a developer, you wouldn't need to "cd" to inner directories.

### Alternatives

We could have just one `package.json` and handle the differentiation in `exports`.

This would have the down side that:

- `README` would be only one.
- updates to components you don't necessarily use would trigger version updates to users of all other components, as well
- expiring or otherwise making any breaking changes to *any* component would cause a major version bump on them all; essentially breaking semantic versioning

This mechanism only makes sense if you aim at shipping a bundle of components, aware of each other and documented together.


## Vite over Rollup

[Vite](https://vitejs.dev/guide/introduction.html#why-native-esm) won the beauty contest over `npm run dev` by:

- being able to magically serve ES modules (the components) to an HTML file
- having static content replacement 

The first feature means that our demo folder can reach the components via node packaging "peekholes" (`export` restrictions apply), instead of being able to bypass to private files. This makes the demo behave more like a real application, and that's great!

The second feature is useful for passing the Firebase auth values. It eliminates the demo HTML having some `fetch` logic and injecting parameters to `aside-keys` tag.

>Note: Vite was started for Vue.js but has since graduated to be framework agnostic.
