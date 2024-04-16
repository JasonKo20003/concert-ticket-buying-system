<script>
	// Store
	import {
		Navbar,
		NavBrand,
		NavLi,
		NavUl,
		NavHamburger,
		Dropdown,
		DropdownDivider,
		DropdownItem
	} from 'flowbite-svelte';
	import { UserOutline, ChevronDownOutline } from 'flowbite-svelte-icons';
	import { page } from '$app/stores';
	import { linear } from 'svelte/easing';
	import { afterUpdate } from 'svelte';

	$: activeUrl = $page.url.pathname;

	$: user = $page.data.user;

	const links = [
		{ name: 'Home', path: '/' }
		// { name: 'About', path: '/about' },
		// { name: 'Our Services', path: '/services' },
		// { name: 'Contact Us', path: '/contact' }
	];

	/**
	 * @type {Object[]}
	 */
	let userSubLinks = [];

	$: {
		if (user) {
			if (user.role === 'admin') {
				userSubLinks = [{ name: 'Manage shows', path: '/admin/shows' }];
			} else {
				userSubLinks = [{ name: 'My shows', path: '/account' }];
			}
		}
	}
</script>

<Navbar class="mx-auto max-w-7xl">
	<NavBrand href="/">
		<div class="logo px-1">
			<div class="flex flex-col items-center">
				<span class="text-xl font-bold">Ticket</span>
				<span class="text-sm font-bold">Hub</span>
			</div>
		</div>
	</NavBrand>
	<NavHamburger />
	<NavUl {activeUrl} class="md:text-md">
		{#each links as link}
			{#if !user || user.role != 'admin'}
				<NavLi href={link.path} class="flex flex-row space-x-1">
					<span>{link.name}</span>
				</NavLi>
			{/if}
		{/each}
		{#if !user}
			<NavLi href="login" class="flex flex-row space-x-1">
				<UserOutline />
				<span>Login</span>
			</NavLi>
		{:else}
			<NavLi class="flex flex-row space-x-1 cursor-pointer items-center">
				<UserOutline />
				<span>{user.email}</span><ChevronDownOutline
					class="w-3 h-3 ml-2 text-primary-800 dark:text-white inline"
				/>
			</NavLi>
			<Dropdown class="w-44 z-20">
				{#each userSubLinks as link}
					<DropdownItem href={link.path}>{link.name}</DropdownItem>
				{/each}
				<DropdownDivider />

				<form action="/logout" method="POST">
					<button type="submit" class="w-full">
						<DropdownItem>Sign out</DropdownItem>
					</button>
				</form>
			</Dropdown>
		{/if}
	</NavUl>
</Navbar>

<style>
</style>
