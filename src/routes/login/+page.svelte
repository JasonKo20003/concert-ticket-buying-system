<script>
	import { enhance } from '$app/forms';
	import { Button, Label, Input, Alert } from 'flowbite-svelte';

	// export let data;
	export let form;
</script>

<div class="flex justify-center">
	<form class="flex flex-col space-y-6 min-w-[400px]" method="POST" use:enhance>
		<h3 class="text-xl font-medium text-gray-900 dark:text-white">Sign in to our platform</h3>

		<Label class="space-y-2">
			<span>Username</span>
			<Input type="text" name="username" placeholder="Your username" required />
		</Label>
		<Label class="space-y-2">
			<span>Password</span>
			<Input type="password" name="password" placeholder="••••••••" required />
		</Label>

		<Button type="submit" class="w-full">Login to your account</Button>

		{#if form?.incorrect}
			<Alert>
				<p class="error">Invalid credentials!</p>
			</Alert>
		{/if}

		<div class="text-sm font-medium text-gray-500 dark:text-gray-300">
			Not registered? <a
				href="/register"
				class="text-primary-700 hover:underline dark:text-primary-500"
			>
				Create account
			</a>
		</div>
	</form>
</div>
