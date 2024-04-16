<script>
	import { Card, ButtonGroup, Button } from 'flowbite-svelte';
	import { enhance } from '$app/forms';
	import { toast } from '@zerodevx/svelte-toast';
	import { page } from '$app/stores';
	import { AngleLeftOutline } from 'flowbite-svelte-icons';
	import { browser } from '$app/environment';
	export let data;

	let availableSeats = [];
	const rows = ['A', 'B', 'C', 'D', 'E', 'F'];

	let firstHalfSeats = [];
	let secondHalfSeats = [];
	$: {
		availableSeats = data.availableSeats;
		firstHalfSeats = rows.flatMap((row) => [1, 2, 3, 4, 5].map((num) => row + num));
		secondHalfSeats = rows.flatMap((row) => [6, 7, 8, 9, 10].map((num) => row + num));
	}

	let isSeatAvailable = (seatId) => availableSeats.includes(seatId);
	// Generate seat IDs for <=5 and >5
	/**
	 * @type {string | null}
	 */
	let selectedSeat = null;

	// Function to select a seat
	function selectSeat(seatId) {
		if (isSeatAvailable(seatId)) {
			selectedSeat = seatId;
		}
	}

	function goBack() {
		if (browser) window.history.back();
	}
</script>

<div class="container">
	<h3 class="text-xl font-medium text-gray-900 dark:text-white">Select Your Seat</h3>
	<Button disabled color="red" outline class="min-w-full mt-5 mb-10">SCREEN</Button>
	<div class="grid grid-cols-2 gap-4">
		<div class="grid grid-cols-5 gap-4 mx-auto">
			{#each firstHalfSeats as seatId}
				<Button
					outline={selectedSeat !== seatId}
					color={isSeatAvailable(seatId) ? 'green' : 'red'}
					disabled={!isSeatAvailable(seatId)}
					on:click={() => selectSeat(seatId)}
				>
					{seatId}
				</Button>
			{/each}
		</div>
		<div class="grid grid-cols-5 gap-4 mx-auto">
			{#each secondHalfSeats as seatId}
				<Button
					outline={selectedSeat !== seatId}
					color={isSeatAvailable(seatId) ? 'green' : 'red'}
					disabled={!isSeatAvailable(seatId)}
					on:click={() => selectSeat(seatId)}
				>
					{seatId}
				</Button>
			{/each}
		</div>
	</div>
	<div class="flex justify-center">
		<form
			method="POST"
			use:enhance={({ formData }) => {
				formData.append('selected', selectedSeat);
				return async ({ result, update }) => {
					await update();
					selectedSeat = null;
					toast.push('The ticket has been purchased', {
						classes: $page.status == 200 ? ['success'] : ['error']
					});
				};
			}}
		>
			<div class="flex flex-col space-y-2">
				<Button
					id="confirm-seat"
					class="btn btn-primary mt-3"
					type="submit"
					disabled={!selectedSeat}
				>
					Confirm Seat
				</Button>
				<Button outline on:click={goBack}><AngleLeftOutline /></Button>
			</div>
		</form>
	</div>
</div>
