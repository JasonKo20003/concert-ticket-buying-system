<script>
	import { Card, ButtonGroup, Button } from 'flowbite-svelte';
	import { ChevronLeftOutline, ChevronRightOutline } from 'flowbite-svelte-icons';

	export let data;
	const { tickets, page, totalPages } = data;
	console.log(tickets);

	function goToPage(pageNumber) {
		// Navigate to the current page with the new page number
		window.location.href = `?page=${pageNumber}`;
	}

	let currentDate = new Date();
	function isStale(showDate) {
		return new Date(showDate) < currentDate;
	}
</script>

<div class="container">
	<!-- <h2>Show Listings</h2> -->
	<div class="grid grid-cols-2 gap-4 place-content-center">
		{#each tickets as ticket}
			<div class="space-y-4">
				<Card
					size="md"
					horizontal
					class={isStale(ticket.start_time) ? 'bg-gray-200' : 'hover:brightness-90'}
					img="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/QR_code_for_mobile_English_Wikipedia.svg/800px-QR_code_for_mobile_English_Wikipedia.svg.png"
				>
					<div class="flex justify-between">
						<div class="text-gray-600 dark:text-gray-400 text-xs">
							<p>NO: {ticket.id}</p>
						</div>
					</div>
					<h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
						{ticket.show_name}
					</h5>
					<h3 class="mb-2 text-md font-bold tracking-tight text-gray-900 dark:text-white">
						{ticket.location}
						{ticket.seat_number}
					</h3>
					<div class="text-gray-600 dark:text-gray-400">
						<p>{ticket.start_time}</p>
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
