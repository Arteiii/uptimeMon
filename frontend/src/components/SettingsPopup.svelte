<script context="module" lang="ts">
	import { isSettingsPopupVisible } from '../routes/+page.svelte';
	import { settings } from '../lib/settings';
</script>

<script>
	function handleSaveSettings() {
		// closeSettingsPopup();

		$isSettingsPopupVisible = false;
	}
</script>

{#if $isSettingsPopupVisible}
	<div class="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
		<div class="bg-white p-6 rounded shadow-lg w-96">
			<h2 class="text-2xl font-bold mb-4">Settings</h2>

			<!-- Refresh Rate Setting -->
			<div class="mb-4">
				<label class="block text-sm font-medium text-gray-700">Refresh Rate (ms)</label>
				<input
					type="number"
					bind:value={$settings.refreshRate}
					class="mt-1 p-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
				/>
			</div>

			<!-- API Config Setting -->
			<div class="mb-4">
				<label class="block text-sm font-medium text-gray-700">API Endpoint</label>
				<input
					type="text"
					bind:value={$settings.apiConfig.endpoint}
					class="mt-1 p-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
				/>
			</div>

			<div class="mb-6">
				<label class="block text-sm font-medium text-gray-700">API Key</label>
				<input
					type="text"
					bind:value={$settings.apiConfig.apiKey}
					class="mt-1 p-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
				/>
			</div>

			<!-- Save and Cancel Buttons -->
			<div class="flex justify-end">
				<button
					class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 mr-2"
					on:click={handleSaveSettings}
				>
					Save
				</button>
				<button
					class="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
					on:click={() => ($isSettingsPopupVisible = false)}
				>
					Cancel
				</button>
			</div>
		</div>
	</div>
{/if}

<style>
	/* Add your custom styles for the settings popup */
</style>
