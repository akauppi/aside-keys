# Track

## Svelte animations not working with custom elements (aka web components)

- [Transitions on WebComponents not working](https://github.com/sveltejs/svelte/issues/4735) 
  - closed, because of being duplicate, but has workarounds
- [Transitions in custom Elements](https://github.com/sveltejs/svelte/issues/1825)
  - with proposed [PR](https://github.com/sveltejs/svelte/pull/4998)


## Svelte: custom components with `hyph-ened` attributes

- [Allow hyphenated properties to be defined in a component](https://github.com/sveltejs/svelte/issues/3852)
  - once shipping, remove the `$$props` use


## Svelte: setting props of web components

- [Prop initialization in web/standalone components](https://github.com/sveltejs/svelte/issues/2227)

  This is more severe than it looks. And it looks severe...
  
  In our case, passing a prop to a web-component-within-web-component seems fully impossible. Strange.

  - PR [#5139](https://github.com/sveltejs/svelte/pull/5139)
