<script lang="ts">
	import maplibregl from 'maplibre-gl';

	import {
		FullScreenControl,
		GeolocateControl,
		GlobeControl,
		MapLibre,
		NavigationControl,
		ScaleControl
	} from 'svelte-maplibre-gl';

	let map: maplibregl.Map | undefined = $state.raw();
</script>

<svelte:head>
	<link
		href="https://fonts.googleapis.com/css2?family=Zen+Maru+Gothic:wght@400;500;700&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

<div class="flex w-full" style="height: calc(100vh - 5rem);">
	<div class="ml-auto h-full w-full px-2 py-2 lg:px-3 lg:py-3">
		<MapLibre
			bind:map
			class="h-full min-h-[300px] rounded-xl"
			style="https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json"
			zoom={13}
			minZoom={3}
			maxZoom={18}
			center={{ lng: 134.875, lat: 34.31 }}
		>
			<FullScreenControl position="top-left" />
			<GeolocateControl position="top-right" />
			<NavigationControl />
			<ScaleControl />
			<GlobeControl />
		</MapLibre>
	</div>
</div>
