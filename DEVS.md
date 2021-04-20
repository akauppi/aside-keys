# Developer notes


## Reading

- [Overview of Google identity management](https://cloud.google.com/architecture/identity/overview-google-authentication) (Google docs)

  Background on Google's identification, terminology etc.


## Remember to `npm run build`!

If you `npm link` to the `package` folder (from an application using the component), **remember** that the component needs a build step. Either run `npm build` directly, or leave `npm run watch` running.
