<script>
	import { enhance } from '$app/forms';
	import { Card, ButtonGroup, Button } from 'flowbite-svelte';
	import {
		UsersOutline,
		EditOutline,
		TrashBinOutline,
		ChevronLeftOutline,
		ChevronRightOutline,
		PlusOutline,
		ExclamationCircleOutline
	} from 'flowbite-svelte-icons';
	import { page } from '$app/stores';
	import { toast } from '@zerodevx/svelte-toast';
	import moment from 'moment';

	export let data;
	$: shows = data.shows;
	$: pageNum = data.page;
	$: totalPages = data.totalPages;

	/**
	 * @type {null | Number}
	 */
	let deletedId = null;

	/**
	 * @type {HTMLDialogElement}
	 */
	export let dialog;

	function goToPage(pageNumber) {
		// Navigate to the current page with the new page number
		window.location.href = `?page=${pageNumber}`;
	}
</script>

<div class="container">
	<div class="flex justify-right mb-5">
		<form method="POST" action="?/new" use:enhance>
			<Button class="btn btn-primary mt-3" type="submit"
				><PlusOutline /><span>Create A Show</span></Button
			>
		</form>
	</div>
	<dialog bind:this={dialog} class="z-50 shadow-2xl rounded-lg p-5">
		<div class="text-center">
			<ExclamationCircleOutline class="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200" />
			<h3 class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
				Are you sure you want to delete?
			</h3>
			<div class="flex flex-row justify-center space-x-4">
				<form
					method="POST"
					action="?/delete"
					use:enhance={({ formData }) => {
						dialog.close();
						return async ({ result, update }) => {
							await update();
							toast.push('The show has been deleted', {
								classes: $page.status == 200 ? ['success'] : ['error']
							});
						};
					}}
				>
					<input type="hidden" name="id" value={deletedId} />
					<Button autofocus color="red" type="submit">Delete</Button>
				</form>
				<Button color="alternative" on:click={() => dialog.close()}>Cancel</Button>
			</div>
		</div>
	</dialog>
	<div class="grid grid-cols-3 gap-4">
		{#each shows as show}
			<div class="space-y-4">
				<Card class={!show.enabled ? 'bg-gray-300 hover:brightness-90 ' : 'hover:brightness-90'}>
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
					<div class="flex justify-end space-x-2 mt-2">
						<Button href="/admin/seatings/{show.id}"><UsersOutline /></Button>
						<Button href="/admin/edit/{show.id}"><EditOutline /></Button>
						<Button
							on:click={(e) => {
								e.preventDefault();
								deletedId = show.id;
								dialog.showModal();
							}}><TrashBinOutline /></Button
						>
					</div>
				</Card>
			</div>
		{/each}
	</div>
	<div class="flex justify-center mt-5">
		<ButtonGroup>
			{#if pageNum > 1}
				<Button class="page-item" on:click={() => goToPage(pageNum - 1)} aria-label="Previous">
					<ChevronLeftOutline />
				</Button>
			{/if}
			{#each Array(totalPages) as _, i (i)}
				<Button disabled={i + 1 === pageNum} on:click={() => goToPage(i + 1)}>
					{i + 1}
				</Button>
			{/each}
			{#if pageNum < totalPages}
				<Button class="page-link" on:click={() => goToPage(pageNum + 1)} aria-label="Next">
					<ChevronRightOutline />
				</Button>
			{/if}
		</ButtonGroup>
	</div>
</div>

<style>
	dialog::backdrop {
		background-color: rgb(0, 0, 0, 0.8);
	}
</style>
