<script context="module" lang="ts">
	import { writable } from 'svelte/store';
	import HostEntry from '../components/HostEntry.svelte';
	import FileDropPopup from '../components/FileDropPopup.svelte';
	import SettingsPopup from '../components/SettingsPopup.svelte';
	import { onMount } from 'svelte';
	import Icon from '@iconify/svelte';

	export const entries = writable<{ ip: string; hostname: string }[]>([]);
	export const isImportPopUpVisible = writable(false);
	export const isSettingsPopupVisible = writable(false);
</script>

<script lang="ts">
	let ip = '';
	let hostname = '';
	let errorMessage = '';

	function addEntry(ip: string, hostname: string) {
		if (ip.trim() === '' || hostname.trim() === '') {
			errorMessage = 'IP and Hostname cannot be empty';
		} else {
			entries.update((arr) => [...arr, { ip, hostname }]);
			ip = '';
			hostname = '';
			errorMessage = ''; // Reset error message on successful entry
		}
	}

	onMount(() => {
		entries.set([]); //init entries
	});

	function showSettings() {
		$isSettingsPopupVisible = true;
	}

	// Function to trigger the display of extracted data
	function showImportPopUp() {
		$isImportPopUpVisible = true;
	}
</script>

<div class="p-8">
	<h1 class="text-3xl font-bold mb-6">IP Ping Monitor</h1>

	<div class="mb-6">
		<label for="ipInput">IP Address:</label>
		<input
			bind:value={ip}
			placeholder="Enter IP Address"
			class="border-gray-300 px-4 py-2 rounded"
		/>
		<label for="hostnameInput">Hostname:</label>
		<input
			bind:value={hostname}
			placeholder="Enter Hostname"
			class="border-gray-300 px-4 py-2 rounded"
		/>
		<button on:click={() => addEntry(ip, hostname)} class="bg-blue-500 text-white px-4 py-2 rounded"
			>Add Entry</button
		>
		<button on:click={showImportPopUp} class="bg-green-500 text-white ml-2 px-4 py-2 rounded"
			>Import</button
		>

		<!-- Settings Icon -->
		<div class="absolute top-2 right-3 p-4 cursor-pointer" on:click={showSettings}>
			<Icon icon="ion:settings-outline" height={30} />
		</div>
	</div>

	<table class="w-full border-collapse mb-6">
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
	<FileDropPopup />
	<SettingsPopup />
</div>

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

	.bg-green-500 {
		background-color: #34d399;
	}
</style>
