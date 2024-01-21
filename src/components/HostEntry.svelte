<script lang="ts">
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';

	export let ip: string;
	export let hostname: string;

	export const pingStatus = writable<string>('Loading...');
	export const isOnline = writable<boolean>(false);

	onMount(() => {
		ping(ip, (status, online) => {
			pingStatus.set(status);
			isOnline.set(online);
		});
	});

	function ping(ip: string, callback: (status: string, online: boolean) => void) {
		// Simulate a delay
		setTimeout(() => {
			const randomSuccess = Math.random() > 0.3; // 70% success rate
			const status = randomSuccess ? 'Online' : 'Offline';
			const online = randomSuccess;
			callback(status, online);
		}, 1000);
	}
</script>

<div class="container">
	<div>
		<p class="text-lg font-semibold">IP Address: {ip}</p>
		<p class="text-lg">Hostname: {hostname}</p>
		<p class="text-sm mt-2">Ping Status: {$pingStatus}</p>
	</div>
	<div class="flex items-center">
		{#if $isOnline}
			<div class="dot dot-online"></div>
		{:else}
			<div class="dot dot-offline"></div>
		{/if}
		<button
			on:click={() =>
				ping(ip, (status, online) => {
					pingStatus.set(status);
					isOnline.set(online);
				})}>Refresh</button
		>
	</div>
</div>

<style>
	.container {
		@apply p-4 border mb-4 rounded-lg bg-gray-100 flex items-center justify-between;
	}

	.dot {
		@apply w-4 h-4 rounded-full mr-2;
	}

	.dot-online {
		@apply bg-green-500;
	}

	.dot-offline {
		@apply bg-red-500;
	}
</style>
