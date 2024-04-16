<script>
	import { page } from '$app/stores';
</script>

<div class="grow flex items-center justify-center">
	<h1 class="text-center text-2xl font-bold">{$page.error?.message}</h1>
</div>
