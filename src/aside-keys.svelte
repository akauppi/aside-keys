<svelte:options tag="aside-keys" />

<script>
	import { onMount } from 'svelte'
	import { slideFixed } from './tools/slideFixed'

	//PROPS
	export let options;		// string from following: "google", ... with white space in between
	// /PROPS

	const optionsSet = new Set(options.split(' '));		// [ "google", ... ]

	const validOpts = new Set(["google"])
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
	<aside part="frame" transition:slideFixed={{ duration: 600 }} >
		<slot />
		<button on:click={ vanish }>Vanish me!</button>
	</aside>
{/if}

<style>
	aside {
		position: fixed;
		top: 0;
		/* 'right' is animated by 'slideFixed' */
		right: -350px;
		margin: 0;

		width: 20em;
		padding: 1em;

		/*border: 1px solid red;*/
		border-radius: 1em;
	}
</style>
