<script>
	import { enhance } from '$app/forms';
	import { Button, Label, Input } from 'flowbite-svelte';

	export let data;
</script>

<div class="flex justify-center">
	<form class="flex flex-col space-y-6 min-w-[400px]" action="?/register" method="post" use:enhance>
		<h3 class="text-xl font-medium text-gray-900 dark:text-white">Create your account</h3>
		<Label class="space-y-2">
			<span>Username</span>
			<Input type="text" name="username" placeholder="your username" required />
		</Label>
		<Label class="space-y-2">
			<span>Email</span>
			<Input type="email" name="email" placeholder="your email" required />
		</Label>
		<Label class="space-y-2">
			<span>Password</span>
			<Input type="password" name="password" placeholder="••••••••" required />
		</Label>
		<Label class="space-y-2">
			<span>Confirm Password</span>
			<Input type="password" name="confirm_password" placeholder="••••••••" required />
		</Label>
		<Button type="submit" class="w-full">Create your account</Button>
		<div class="text-sm font-medium text-gray-500 dark:text-gray-300">
			Already registered? <a
				href="/login"
				class="text-primary-700 hover:underline dark:text-primary-500"
			>
				Login
			</a>
		</div>
	</form>
</div>
