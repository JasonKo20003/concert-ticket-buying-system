<script>
	import { Card, ButtonGroup, Button } from 'flowbite-svelte';
	import { ChevronLeftOutline, ChevronRightOutline } from 'flowbite-svelte-icons';
	import moment from 'moment';

	export let data;
	const { shows, page, totalPages } = data;

	function goToPage(pageNumber) {
		// Navigate to the current page with the new page number
		window.location.href = `?page=${pageNumber}`;
	}
</script>

<div class="container">
	<!-- <h2>Show Listings</h2> -->
	<div class="grid grid-cols-3 gap-4">
		{#each shows as show}
			<div class="space-y-4">
				<Card href="/seatings/{show.id}">
					<h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
						{show.name}
					</h5>
					<p class="mb-3 font-normal text-gray-700 dark:text-gray-400 leading-tight">
						{show.description}
					</p>
					<div class="text-gray-600 dark:text-gray-400 text-sm">
						<p>Start Time: {moment(show.start_time).format('YYYY-MM-DD HH:mm')}</p>
						<p>Location: {show.location}</p>
						<p>Price per Ticket: ${show.price_per_ticket.toFixed(2)}</p>
					</div>
				</Card>
			</div>
		{/each}
	</div>
	<div class="flex justify-center mt-5">
		<ButtonGroup>
			{#if page > 1}
				<Button class="page-item" on:click={() => goToPage(page - 1)} aria-label="Previous">
					<ChevronLeftOutline />
				</Button>
			{/if}
			{#each Array(totalPages) as _, i (i)}
				<Button disabled={i + 1 === page} on:click={() => goToPage(i + 1)}>
					{i + 1}
				</Button>
			{/each}
			{#if page < totalPages}
				<Button class="page-link" on:click={() => goToPage(page + 1)} aria-label="Next">
					<ChevronRightOutline />
				</Button>
			{/if}
		</ButtonGroup>
	</div>
</div>
