<svelte:options tag="aside-keys" />

<script>
	import { onMount } from 'svelte'

	export let options;		// string from following: "google", ... with white space in between

	const optionsSet = new Set(options.split(' '));		// [ "google", ... ]

	function show() {

	}

	function vanish() {
		alert(12)
	}

	onMount( () => {
		show()		// slide the login

		//REMOVE??
		//const elBtn = root.querySelector('button')
		//elBtn.addEventListener('click', () => alert(55))
	})

</script>

<aside part="frame">
	<slot />

	<button onclick="console.debug('!!!'); alert()">Vanish me!</button>

	<!--
	<p></p>

	<table>
		<tr>
			<td>1</td>
			<td>2</td>
			<td>3</td>
			<td>4</td>
			<td>5</td>
			<td>6</td>
			<td>7</td>
			<td>8</td>
			<td>9</td>
			<td>10</td>
		</tr>
	</table>
	-->
</aside>

<style>
	aside {
		position: fixed;
		top: 0;
		right: -10em;

		width: 20em;

		padding: 1em;
		margin: 0.5em;
		border: 1px solid red;
	}

	/*
	td {
		width: 1em;
		height: 10px;
		border-left: 1px solid orange;
	}*/
</style>
