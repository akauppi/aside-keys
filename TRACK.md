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


## Svelte: web components readiness (aka 'custom elements')

- [issues with `feature: custom element`](https://github.com/sveltejs/svelte/labels/feature%3A%20custom%20element)

  - 17-Jan-21: 41 open

## Svelte: ability to have normal (private) components, used by a web component

- [Feature: allow components to opt out of custom elements build](https://github.com/sveltejs/svelte/issues/4228)

  Would benefit from it.
  
  
  