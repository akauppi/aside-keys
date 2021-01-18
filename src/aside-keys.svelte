<svelte:options tag="aside-keys" />

<script>
	import {onMount, tick} from 'svelte'
	import {slideFixed} from './tools/slideFixed'

	// tbd. Allow the tag to give 'easing=...' as strings :)   ..or custom CSS field??
	import {backOut} from 'svelte/easing'
	import OneTap from "./OneTap.svelte";

	/*** nah?
	const validProviders = new Set([
		"onetap",		// Google One Tap for Web
	])

	//PROPS
	export let providers = "onetap";		// eg. "abc def"
	// /PROPS

	const providersSet = new Set(providers.split(' '));		// [ "google", ... ]
	if (providersSet.size === 0) {
		throw new Error(`No 'providers' provided. Please provide at least one of: ${validProviders.join(', ')}`)
	}

	const bad = [...providersSet].filter(v => !validProviders.has(v))

	if (bad.length > 0) {
		throw new Error(`Unexpected 'providers': ${bad.join(', ')}`)
	}
	***/

	/* SVELTE NOTE:
	*		It seems mapping 'a-b' (attribute) to 'aB' (property) would be on the radar. Follow -> https://github.com/sveltejs/svelte/issues/3852
	*
	* 	Note that the use of '$$props' takes away warnings about unrelated misuse of attributes (we'd like the warnings).
	*
	* ANOTHER SVELTE NOTE: ‼️❗️️️
	* 	Getting *any* prop with just 'let abc' within a web component does not seem to work. '$$props' does. (Svelte 3.31.2)
  */
	//let onetapClient;		// e.g. "1016...-...1a3lt.apps.googleusercontent.com"
	const onetapClient = $$props['onetap-client'];		// works; until Svelte does the conversion

	let aaa;											// does NOT work!
	const aaa2 = $$props["aaa"];	// works

	console.log("!!!1", { onetapClient, aaa, aaa2 })		// { "...", undefined, "aaa" }

	let visible;		// changing this activates the 'slideFixed' animation

	function show() {
		visible = true;
	}

	function vanish() {
		visible = false;
	}

	onMount(async () => {
		show()		// slide the login

		console.log("!!!", { aaa })		// also here, 'aaa' is undefined!

		await tick();		// inspired by -> https://github.com/sveltejs/svelte/issues/2227
		console.log("!!!2", { aaa })		// ..still undefined
	})

</script>

{#if visible}
	<aside part="frame" transition:slideFixed={{ duration: 600, easing: backOut }} >
		<slot />
		{#if onetapClient}
			<OneTap client={ onetapClient } />
		{/if}
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
