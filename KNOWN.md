# Known issues

## Two Svelte warnings

The way we link two element methods to module exports is unconventional and causes the following warnings:

```
[aside-keys] (!) Plugin svelte: Src has unused export property 'onUser'. If it is for external reference only, please consider using `export const onUser`
[aside-keys] src/index.svelte
[aside-keys] 135: 
```

Is there a better way to do this in #svelte?

