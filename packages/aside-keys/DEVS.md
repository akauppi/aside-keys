# Developer notes

## Remember to `npm run build`!

When doing npm development with ES modules, one does not normally need to consider a build step. Just `npm link` a project and your downstream projects see any changes, as they happen.

Not here. The Svelte compilation step must happen before the changes are seen at the using component. So:

1. make changes
2. `npm run build`
3. test at the consuming project :)

>Note: This only matters if you `npm link` to here. Doing development within the repo is handled by the watch commands.
