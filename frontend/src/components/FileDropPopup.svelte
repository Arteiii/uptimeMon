<script context="module" lang="ts">
	import { isImportPopUpVisible, entries } from '../routes/+page.svelte';
	import { mainPageData } from '../lib/mainPageDataStore';
	import * as DataManager from '../lib/dataManager';
</script>

<script lang="ts">
	import { onMount } from 'svelte';
	import { readable, writable } from 'svelte/store';

	// Store to manage the dropped files
	export const droppedFiles = writable<File[]>([]);

	// Store to manage the extracted data
	export const extractedData = writable<{ hostname: string; ip: string }[]>([]);

	// Function to handle the file drop event
	export function handleFileDrop(event: DragEvent) {
		event.preventDefault();

		const files = event.dataTransfer?.files;
		if (files) {
			droppedFiles.set([...Array.from(files)]);

			// Process each dropped file
			Array.from(files).forEach(async (file) => {
				const textContent = await readFile(file);
				const lines = textContent.split('\n');

				// Extract relevant information (hostname and obm IP) from each line
				const extractedInfo = lines.map((line) => {
					const columns = line.split('|');
					const hostname = columns[0]?.trim() || '';
					const obmIP = columns[3]?.trim() || '';
					return { hostname, obmIP };
				});

				// Update the extracted data store
				extractedData.update((data) => [...data, ...extractedInfo]);
			});
		}
	}

	// Function to read the content of a file
	async function readFile(file: File): Promise<string> {
		return new Promise((resolve) => {
			const reader = new FileReader();
			reader.onload = (event) => {
				const content = event.target?.result as string;
				resolve(content);
			};
			reader.readAsText(file);
		});
	}

	// Function to handle text pasted from clipboard
	function handleClipboardPaste() {
		navigator.clipboard.readText().then((text) => {
			// Clear existing data
			DataManager.clearEntries();

			// Do something with the copied text
			console.log('Pasted text:', text);

			// Process the pasted text and update the extracted data store
			DataManager.addEntriesFromText(text);
			const extractedInfo = DataManager.getEntries();

			// Update the data using the DataManager module
			extractedData.set(extractedInfo);
		});
	}
	function addAndClose() {
		// Reset extracted data when closing the popup
		extractedData.set([]);
		isImportPopUpVisible.set(false);

		// Add the processed data to the main page store
		const processedData = DataManager.getEntries();
		entries.update((data) => [...data, ...processedData]);
	}

	// Function to handle the closing of the popup
	function closePopup() {
		// Reset extracted data when closing the popup
		extractedData.set([]);
		isImportPopUpVisible.set(false);
	}

	// Function to prevent the default behavior of the drop event
	function preventDefault(event: Event) {
		event.preventDefault();
	}

	onMount(() => {
		// Add event listeners for drag-and-drop
		document.addEventListener('dragover', preventDefault);
		document.addEventListener('drop', handleFileDrop);

		return () => {
			// Remove event listeners when the component is unmounted
			document.removeEventListener('dragover', preventDefault);
			document.removeEventListener('drop', handleFileDrop);
		};
	});
</script>

{#if $isImportPopUpVisible}
	<div
		class="fixed top-0 left-0 w-full h-full bg-black opacity-50 z-40"
		on:click={closePopup}
	></div>
	<div
		class="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-4 bg-white border border-gray-300 rounded z-50"
	>
		<h2 class="mb-4 text-2xl font-bold">Drag and Drop Files or Paste Text</h2>
		<div
			role="button"
			aria-label="Drop area for files"
			tabindex="0"
			class="p-4 border border-dashed border-gray-300 rounded cursor-pointer mb-4"
			on:click={closePopup}
			on:keydown={(event) => {
				if (event.key === 'Enter' || event.key === 'Spacebar' || event.key === ' ') {
					closePopup();
				}
			}}
		>
			<p class="text-gray-600">Drop files here...</p>
		</div>
		<div
			role="button"
			aria-label="Paste area for text"
			tabindex="0"
			class="p-4 border border-dashed border-gray-300 rounded cursor-pointer mb-4"
			on:click={handleClipboardPaste}
			on:keydown={(event) => {
				if (event.key === 'Enter' || event.key === 'Spacebar' || event.key === ' ') {
					handleClipboardPaste();
				}
			}}
		>
			<p class="text-gray-600">Paste text here...</p>
		</div>
		<ul class="list-disc pl-4">
			{#each $extractedData as { hostname, ip } (hostname)}
				<li class="text-gray-800">{hostname} - IP: {ip}</li>
			{/each}
		</ul>
		<button
			class="mt-4 bg-green-500 text-white px-4 py-2 rounded cursor-pointer"
			on:click={closePopup}
		>
			Close
		</button>
		<button
			class="mt-4 rounded px-4 py-2 cursor-pointer"
			on:click={addAndClose}
			disabled={$extractedData.length === 0}
		>
			Add
		</button>
	</div>
{/if}

<style>
	.popup {
		@apply fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-4 bg-white border border-gray-300 z-50;
	}

	.overlay {
		@apply fixed top-0 left-0 w-full h-full bg-black opacity-50 z-40;
	}

	.drop-area {
		@apply p-2 border border-gray-300 cursor-pointer;
	}

	.interactive-button {
		@apply mt-4 bg-blue-500 text-white px-4 py-2 rounded cursor-pointer;
	}

	/* New styles for button */
	.extracted-data-button {
		@apply mt-4 bg-green-500 text-white px-4 py-2 rounded cursor-pointer;
	}

	/* Add this style for a greyed out button */
	:disabled {
		background-color: #cccccc;
		cursor: not-allowed;
	}

	/* Add this style for a red hover effect */
	:disabled:hover {
		background-color: #e53e3e;
	}
</style>
