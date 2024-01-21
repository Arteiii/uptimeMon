<script context="module" lang="ts">
	import { writable } from 'svelte/store';
</script>

<script lang="ts">
	import HostEntry from '$components/HostEntry.svelte';
	import { onMount } from 'svelte';

	const entries = writable<{ ip: string; hostname: string }[]>([]);
	let ip = '';
	let hostname = '';

	function addEntry(ip: string, hostname: string) {
		entries.update((arr) => [...arr, { ip, hostname }]);
		// Clear input fields
		ip = '';
		hostname = '';
	}

	onMount(() => {
		// Simulate adding some entries initially
	});
</script>

<h1>IP Ping Monitor</h1>

<div>
	<label for="ipInput">IP Address:</label>
	<input bind:value={ip} placeholder="Enter IP Address" class="border-gray-300" />
	<label for="hostnameInput">Hostname:</label>
	<input bind:value={hostname} placeholder="Enter Hostname" class="border-gray-300" />
	<button on:click={() => addEntry(ip, hostname)} class="bg-blue-500 text-white">Add Entry</button>
</div>

<table>
	<thead>
		<tr>
			<th class="bg-gray-200">IP Address</th>
			<th class="bg-gray-200">Hostname</th>
			<th class="bg-gray-200">Ping Status</th>
		</tr>
	</thead>
	<tbody>
		{#each $entries as { ip, hostname } (ip)}
			<tr>
				<td>{ip}</td>
				<td>{hostname}</td>
				<td><HostEntry {ip} {hostname} /></td>
			</tr>
		{/each}
	</tbody>
</table>

<style>
	/* Use Tailwind CSS utility classes here */
	h1 {
		@apply text-3xl font-bold mb-6;
	}

	div {
		@apply mb-6;
	}

	input,
	button {
		@apply px-4 py-2 mr-2 border rounded focus:outline-none;
	}

	table {
		@apply w-full border-collapse;
	}

	th,
	td {
		@apply p-2 border;
	}
</style>
