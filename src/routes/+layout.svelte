<script>
	import '../app.css';
	import NavBar from './NavBar.svelte';
	import Footer from './Footer.svelte';
	import { SvelteToast } from '@zerodevx/svelte-toast';

	const options = {
		duration: 2000, // duration of progress bar tween to the `next` value
		initial: 1, // initial progress bar value
		next: 0, // next progress value
		pausable: false, // pause progress bar tween on mouse hover
		dismissable: true, // allow dismiss with close button
		reversed: false, // insert new toast to bottom of stack
		intro: { x: 256, y: -64 }, // toast intro fly animation settings
		theme: {}, // css var overrides
		classes: ['log'] // user-defined classes
	};
</script>

<svelte:head>
	<style>
		@import url('https://fonts.googleapis.com/css2?family=Inter&family=Nunito+Sans:opsz@6..12&family=Nunito:wght@500&display=swap');
	</style>
</svelte:head>

<div class="app flex min-h-screen flex-col">
	<NavBar />
	<!-- <SvelteToast {options} /> -->
	<div class="wrap">
		<SvelteToast {options} />
	</div>
	<main class="mx-auto box-border flex w-full max-w-7xl flex-1 flex-col p-5">
		<slot />
	</main>
	<Footer />
</div>

<style>
	.wrap {
		--toastContainerTop: 0.5rem;
		--toastContainerRight: 0.5rem;
		--toastContainerBottom: auto;
		--toastContainerLeft: 0.5rem;
		--toastWidth: 100%;
		--toastMinHeight: 2rem;
		--toastPadding: 0 0.5rem;
		--toastBorderRadius: 0.2rem;
		font-size: 0.875rem;
	}
	@media (min-width: 40rem) {
		.wrap {
			--toastContainerRight: auto;
			--toastContainerLeft: calc(50vw - 10rem);
			--toastWidth: 20rem;
		}
	}

	:global(.log.success) {
		--toastBarBackground: #2f855a;
	}
	:global(.log.info) {
		--toastBarBackground: #2041d6;
	}
	:global(.log.error) {
		--toastBarBackground: #d62020ce;
	}
	:global(.log.warn) {
		--toastBarBackground: #d62020;
	}
</style>
