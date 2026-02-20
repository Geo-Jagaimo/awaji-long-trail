<script lang="ts">
	import maplibregl from 'maplibre-gl';
	import { onMount } from 'svelte';

	import {
		FullScreenControl,
		GeolocateControl,
		GeoJSONSource,
		GlobeControl,
		LineLayer,
		MapLibre,
		NavigationControl,
		RasterDEMTileSource,
		ScaleControl,
		Terrain,
		TerrainControl
	} from 'svelte-maplibre-gl';

	let map: maplibregl.Map | undefined = $state.raw();
	let trailData: any = $state(null);

	onMount(async () => {
		const response = await fetch('/geojson/ita.geojson');
		trailData = await response.json();
	});
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
			<TerrainControl source="mapterhorn-dem" position="top-right" />

			<RasterDEMTileSource
				id="mapterhorn-dem"
				tiles={['https://tiles.mapterhorn.com/{z}/{x}/{y}.webp']}
				encoding="terrarium"
				tileSize={512}
				maxzoom={12}
			>
				<Terrain exaggeration={1.2} />
			</RasterDEMTileSource>

			{#if trailData}
				<GeoJSONSource id="trail-source" data={trailData}>
					<LineLayer
						id="trail-line"
						layout={{
							'line-join': 'round',
							'line-cap': 'round'
						}}
						paint={{
							'line-color': '#ff6b35',
							'line-width': 3,
							'line-opacity': 0.8
						}}
					/>
				</GeoJSONSource>
			{/if}
		</MapLibre>
	</div>
</div>
