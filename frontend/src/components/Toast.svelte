<script lang="ts">
	export let message: string;
	export let icon: string;
	export let duration: number;

	let isVisible = true;

	// Hide the toast after a specified duration
	setTimeout(() => {
		isVisible = false;
	}, duration);
</script>

<div
	class="fixed bottom-4 right-4 bg-gray-800 text-white p-4 rounded-md shadow-md"
	class:invisible={!isVisible}
>
	<div class="flex items-center">
		<div class="mr-2">
			{@html icon}
		</div>
		<div>
			<p class="font-semibold">{message}</p>
		</div>
	</div>
</div>
