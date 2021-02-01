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
