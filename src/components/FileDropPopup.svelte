<script lang="ts">
	import { onMount } from 'svelte';
	import { readable, writable } from 'svelte/store';

	// Store to manage the visibility of the popup
	export const isPopupVisible = writable(false);

	// Store to manage the dropped files
	export const droppedFiles = writable<File[]>([]);

	// Function to handle the file drop event
	function handleFileDrop(event: DragEvent) {
		event.preventDefault();

		const files = event.dataTransfer?.files;
		if (files) {
			droppedFiles.set([...Array.from(files)]);
		}
	}

	// Function to handle text pasted from clipboard
	function handleClipboardPaste() {
		navigator.clipboard.readText().then((text) => {
			// Do something with the copied text
			console.log('Pasted text:', text);
		});
	}

	// Function to handle the closing of the popup
	function closePopup() {
		isPopupVisible.set(false);
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

{#if $isPopupVisible}
	<div class="overlay" on:click={closePopup}></div>
	<div class="popup">
		<h2 class="mb-4">Drag and Drop Files or Paste Text</h2>
		<div
			role="button"
			aria-label="Drop area for files"
			class="drop-area mb-4 p-2 border border-gray-300"
			on:drop={preventDefault}
			on:dragover={preventDefault}
		>
			<p>Paste text here...</p>
		</div>
		<ul class="list-disc pl-4">
			{#each $droppedFiles as file (file.name)}
				<li>{file.name}</li>
			{/each}
		</ul>
		<button class="mt-4 bg-blue-500 text-white px-4 py-2 rounded" on:click={closePopup}>
			Close
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
		@apply p-2 border border-gray-300;
	}
</style>
