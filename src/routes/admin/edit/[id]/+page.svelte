<script>
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';
	import { toast } from '@zerodevx/svelte-toast';
	import {
		Button,
		Label,
		Input,
		Textarea,
		ButtonGroup,
		InputAddon,
		Checkbox
	} from 'flowbite-svelte';

	import { AngleLeftOutline } from 'flowbite-svelte-icons';

	import { browser } from '$app/environment';

	export let data;

	function goBack() {
		if (browser) window.history.back();
	}
</script>

<div class="flex justify-center">
	<form
		class="flex flex-col space-y-6 min-w-[400px]"
		action="?/update"
		method="post"
		use:enhance={({ formData }) => {
			return async ({ result, update }) => {
				if ($page.status == 200)
					toast.push('The show has been updated', {
						classes: $page.status == 200 ? ['success'] : ['error']
					});
				// selectedSeat = null;
				await update({ reset: false });
			};
		}}
	>
		<h3 class="text-xl font-medium text-gray-900 dark:text-white">Edit Show Details</h3>
		<Input type="hidden" name="id" hidden required value={data.id} />
		<Label class="space-y-2">
			<span>Show Name</span>
			<Input type="text" name="name" placeholder="Show name" required bind:value={data.name} />
		</Label>

		<Label class="space-y-2">
			<span>Number of Seatings</span>
			<Input
				type="number"
				name="seatings"
				placeholder="Number of seatings"
				required
				bind:value={data.seatings}
			/>
		</Label>

		<Label class="space-y-2">
			<span>Start Time</span>
			<Input type="datetime-local" name="start_time" required bind:value={data.start_time} />
		</Label>

		<Label class="space-y-2">
			<span>Description</span>
			<Textarea
				name="description"
				placeholder="Description of the show"
				bind:value={data.description}
				required
			></Textarea>
		</Label>

		<Label class="space-y-2">
			<span>Duration (minutes)</span>
			<Input
				type="number"
				name="duration"
				placeholder="Duration in minutes"
				required
				bind:value={data.duration}
			/>
		</Label>

		<Label class="space-y-2">
			<span>Location</span>
			<Input
				type="text"
				name="location"
				placeholder="Location of the show"
				required
				bind:value={data.location}
			/>
		</Label>
		<Label class="space-y-2">
			<span>Price per Ticket</span>
		</Label>
		<ButtonGroup>
			<InputAddon>$</InputAddon>
			<Input
				type="number"
				name="price_per_ticket"
				placeholder="Price per ticket"
				required
				step="0.01"
				bind:value={data.price_per_ticket}
			/>
		</ButtonGroup>
		<Checkbox name="enabled" bind:checked={data.enabled} bind:value={data.enabled}>Enabled</Checkbox
		>
		<Button type="submit">Update Show</Button>
		<Button outline on:click={goBack}><AngleLeftOutline /></Button>
	</form>
</div>
