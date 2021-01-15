<svelte:options tag="aside-keys" />

<script>
	import { onMount } from 'svelte'
	import { slideFixed } from './tools/slideFixed'

	// tbd. Allow the tag to give 'easing=...' as strings :)   ..or custom CSS field??
	import { backOut } from 'svelte/easing'

	const validOpts = new Set(["google"])

	//PROPS
	export let options;		// string from following: "google", ... with white space in between
	// /PROPS

	const optionsSet = new Set(options.split(' '));		// [ "google", ... ]
	if (optionsSet.size === 0) {
		throw new Error(`No 'options' provided. Please provided at least one of: ${ validOpts.join(', ') }`)
	}

	const bads = [...optionsSet].filter( v => !validOpts.has(v) )

	if (bads.length > 0) {
		throw new Error(`Unexpected option(s): ${ bads.join(', ') }`)
	}

	let visible;		// changing this activates the 'slideFixed' animation

	function show() {
		visible = true;
	}

	function vanish() {
		visible = false;
	}

	onMount( () => {
		show()		// slide the login
	})

</script>

{#if visible}
	<aside part="frame" transition:slideFixed={{ duration: 600, easing: backOut }} >
		<slot />
		<button on:click={ vanish }>Vanish me!</button>
	</aside>
{/if}

<style>
	aside {
		position: fixed;
		top: 0;
		/* 'right' is animated by 'slideFixed' */

		width: 21.5em;
		padding: 1em;

		/*border: 1px solid red;*/
		border-radius: 1em;

		/* Negative right margin allows easings that bounce over the end to be used, without a gap showing up between the
		* pane and the edge of the viewport (it "eats" some from the 'width').
	  */
		margin-right: -3em;
	}
</style>
