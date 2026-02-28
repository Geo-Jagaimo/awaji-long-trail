<script lang="ts">
	import maplibregl from 'maplibre-gl';
	import mlcontour from 'maplibre-contour';
	import { onMount } from 'svelte';
	import type { Spot } from '$lib/cms/types';

	import {
		FullScreenControl,
		GeolocateControl,
		GeoJSONSource,
		GlobeControl,
		HillshadeLayer,
		LineLayer,
		MapLibre,
		Marker,
		Popup,
		NavigationControl,
		RasterDEMTileSource,
		ScaleControl,
		TerrainControl
	} from 'svelte-maplibre-gl';

	let map: maplibregl.Map | undefined = $state.raw();
	let trailData: GeoJSON.GeoJSON | null = $state(null);
	let spots: Spot[] = $state([]);
	let demSource: InstanceType<typeof mlcontour.DemSource>;

	// upload mode
	let isAdminMode = $state(false);
	let showPasswordDialog = $state(false);
	let password = $state('');
	let showForm = $state(false);
	let submitting = $state(false);
	let errorMessage = $state('');

	// form
	let formTitle = $state('');
	let formDate = $state(new Date().toISOString().split('T')[0]);
	let formDescription = $state('');
	let formLat = $state(0);
	let formLng = $state(0);
	let formFile: File | null = $state(null);

	// selected marker
	let selectedLngLat: { lng: number; lat: number } | null = $state(null);

	// contour
	let contourVisible = $state(false);

	function createContourControl(): maplibregl.IControl {
		let container: HTMLDivElement;
		let button: HTMLButtonElement;
		return {
			onAdd() {
				container = document.createElement('div');
				container.className = 'maplibregl-ctrl maplibregl-ctrl-group';
				button = document.createElement('button');
				button.type = 'button';
				button.ariaLabel = 'toggle contour';
				button.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:100%;height:100%;padding:5px;box-sizing:border-box;"><path d="M4 18l4-4c2-2 4-1 6 0s4 2 6 0l0-2"/><path d="M4 14l4-4c2-2 4-1 6 0s4 2 6 0l0-2"/><path d="M4 10l4-4c2-2 4-1 6 0s4 2 6 0"/></svg>`;
				button.addEventListener('click', () => {
					contourVisible = !contourVisible;
					toggleContourLayers();
					button.style.backgroundColor = contourVisible ? '#e0e0e0' : '';
				});
				container.appendChild(button);
				return container;
			},
			onRemove() {
				container.remove();
			}
		};
	}

	function setupContour() {
		if (!map) return;

		map.addSource('contourSource', {
			type: 'vector',
			tiles: [
				demSource.contourProtocolUrl({
					thresholds: {
						12: [100, 500],
						14: [20, 100]
					},
					elevationKey: 'ele',
					levelKey: 'level',
					contourLayer: 'contours',
					buffer: 1,
					overzoom: 2
				})
			],
			maxzoom: 17
		});

		const firstSymbolLayer = map.getStyle().layers.find((l) => l.type === 'symbol');

		map.addLayer(
			{
				id: 'contour-lines',
				type: 'line',
				source: 'contourSource',
				'source-layer': 'contours',
				paint: {
					'line-color': 'rgb(180, 120, 40)',
					'line-width': ['match', ['get', 'level'], 1, 2.5, 1.2]
				},
				layout: {
					visibility: 'none'
				}
			},
			firstSymbolLayer?.id
		);

		map.addLayer({
			id: 'contour-labels',
			type: 'symbol',
			source: 'contourSource',
			'source-layer': 'contours',
			filter: ['==', ['get', 'level'], 1],
			paint: {
				'text-color': 'rgb(172, 120, 48)',
				'text-halo-color': 'white',
				'text-halo-width': 2
			},
			layout: {
				visibility: 'none',
				'symbol-placement': 'line',
				'text-size': 12,
				'text-field': ['concat', ['number-format', ['get', 'ele'], {}], 'm'],
				'text-font': ['Open Sans Regular', 'Arial Unicode MS Regular']
			}
		});
	}

	function toggleContourLayers() {
		if (!map) return;
		const visibility = contourVisible ? 'visible' : 'none';
		map.setLayoutProperty('contour-lines', 'visibility', visibility);
		map.setLayoutProperty('contour-labels', 'visibility', visibility);
	}

	function createSpotControl(): maplibregl.IControl {
		let container: HTMLDivElement;
		return {
			onAdd() {
				container = document.createElement('div');
				container.className = 'maplibregl-ctrl maplibregl-ctrl-group';
				const button = document.createElement('button');
				button.type = 'button';
				button.ariaLabel = 'add spot';
				button.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" style="width:100%;height:100%;padding:5px;box-sizing:border-box;"><path fill-rule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z" clip-rule="evenodd" /></svg>`;
				button.addEventListener('click', () => {
					showPasswordDialog = true;
				});
				container.appendChild(button);
				return container;
			},
			onRemove() {
				container.remove();
			}
		};
	}

	onMount(async () => {
		// Register contour protocol before map loads tiles
		demSource = new mlcontour.DemSource({
			url: 'https://tiles.mapterhorn.com/{z}/{x}/{y}.webp',
			encoding: 'terrarium',
			maxzoom: 12,
			worker: true
		});
		demSource.setupMaplibre(maplibregl);

		const [trailRes, spotsRes] = await Promise.all([
			fetch('/geojson/ita.geojson'),
			fetch('/api/spots')
		]);
		trailData = await trailRes.json();
		spots = await spotsRes.json();

		if (map) {
			map.addControl(createContourControl(), 'top-right');
			map.addControl(createSpotControl(), 'top-right');

			const addContourLayers = () => {
				setupContour();
			};

			if (map.isStyleLoaded()) {
				addContourLayers();
			} else {
				map.once('load', addContourLayers);
			}
		}
	});

	function handleMapClick(e: maplibregl.MapMouseEvent) {
		if (!isAdminMode) return;
		const { lng, lat } = e.lngLat;
		formLat = Math.round(lat * 1000000) / 1000000;
		formLng = Math.round(lng * 1000000) / 1000000;
		selectedLngLat = { lng: formLng, lat: formLat };
		showForm = true;
	}

	function useCurrentLocation() {
		if (!navigator.geolocation) {
			errorMessage = 'このブラウザでは位置情報を取得できません。';
			return;
		}
		navigator.geolocation.getCurrentPosition(
			(pos) => {
				formLat = Math.round(pos.coords.latitude * 1000000) / 1000000;
				formLng = Math.round(pos.coords.longitude * 1000000) / 1000000;
				selectedLngLat = { lng: formLng, lat: formLat };
				showForm = true;
			},
			() => {
				errorMessage = '位置情報の取得に失敗しました。';
			}
		);
	}

	function handleFileChange(e: Event) {
		const input = e.target as HTMLInputElement;
		formFile = input.files?.[0] ?? null;
	}

	async function uploadImage(): Promise<{ url: string } | null> {
		if (!formFile) return null;
		const formData = new FormData();
		formData.append('password', password);
		formData.append('file', formFile);
		const res = await fetch('/api/upload', { method: 'POST', body: formData });
		if (!res.ok) {
			const data = await res.json();
			throw new Error(data.error || '画像アップロードに失敗しました。');
		}
		return await res.json();
	}

	async function handleSubmit() {
		errorMessage = '';
		submitting = true;
		try {
			let image = undefined;
			if (formFile) {
				const uploaded = await uploadImage();
				if (uploaded) {
					image = { url: uploaded.url };
				}
			}

			const res = await fetch('/api/spots', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					password,
					title: formTitle,
					date: formDate,
					description: formDescription,
					lat: formLat,
					lng: formLng,
					image
				})
			});

			if (!res.ok) {
				const data = await res.json();
				throw new Error(data.error || 'スポットの作成に失敗しました。');
			}

			const spotsRes = await fetch('/api/spots');
			spots = await spotsRes.json();

			resetForm();
		} catch (e) {
			errorMessage = e instanceof Error ? e.message : 'エラーが発生しました。';
		} finally {
			submitting = false;
		}
	}

	function resetForm() {
		showForm = false;
		selectedLngLat = null;
		formTitle = '';
		formDate = new Date().toISOString().split('T')[0];
		formDescription = '';
		formLat = 0;
		formLng = 0;
		formFile = null;
		errorMessage = '';
	}
</script>

<svelte:head>
	<link
		href="https://fonts.googleapis.com/css2?family=Zen+Maru+Gothic:wght@400;500;700&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

<div class="relative flex w-full" style="height: calc(100vh - 5rem);">
	<div class="ml-auto h-full w-full px-2 py-2 lg:px-3 lg:py-3">
		<MapLibre
			bind:map
			class="h-full min-h-[300px] rounded-xl"
			style="https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json"
			zoom={13}
			minZoom={3}
			maxZoom={18}
			center={{ lng: 134.875, lat: 34.31 }}
			onclick={handleMapClick}
		>
			<FullScreenControl position="top-left" />
			<GeolocateControl position="top-right" />
			<NavigationControl />
			<ScaleControl />
			<GlobeControl />
			<RasterDEMTileSource
				tiles={['https://tiles.mapterhorn.com/{z}/{x}/{y}.webp']}
				encoding="terrarium"
				tileSize={512}
				maxzoom={12}
				attribution="<a href='https://mapterhorn.com/attribution/' target='_blank'>Mapterhorn</a>"
			>
				<TerrainControl position="top-right" />
				<HillshadeLayer
					paint={{
						'hillshade-exaggeration': 0.5,
						'hillshade-illumination-anchor': 'map',
						'hillshade-shadow-color': '#3080b0'
					}}
				/>
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

			{#each spots as spot (spot.id)}
				<Marker lnglat={{ lng: spot.lng, lat: spot.lat }} anchor="bottom">
					{#snippet content()}
						<div class="spot-marker">
							<div class="spot-marker-pin">
								{#if spot.image?.url}
									<img src={spot.image.url} alt={spot.title} />
								{:else}
									<div class="spot-marker-placeholder">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											viewBox="0 0 24 24"
											fill="white"
											width="20"
											height="20"
										>
											<path
												fill-rule="evenodd"
												d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z"
												clip-rule="evenodd"
											/>
										</svg>
									</div>
								{/if}
							</div>
							<div class="spot-marker-arrow"></div>
						</div>
					{/snippet}
					<Popup offset={[0, -50]}>
						<div class="max-w-[200px]">
							{#if spot.image?.url}
								<img src={spot.image.url} alt={spot.title} class="mb-1 w-full rounded" />
							{/if}
							<h3 class="text-sm font-bold">{spot.title}</h3>
							<p class="text-xs text-gray-500">{spot.date}</p>
							<p class="mt-1 text-xs">{spot.description}</p>
						</div>
					</Popup>
				</Marker>
			{/each}

			{#if selectedLngLat}
				<Marker lnglat={selectedLngLat} color="#e74c3c" />
			{/if}
		</MapLibre>
	</div>

	<!-- Dialog: enter password -->
	{#if showPasswordDialog}
		<div class="absolute inset-0 z-20 flex items-center justify-center bg-black/30">
			<div class="mx-4 w-full max-w-xs rounded-xl bg-white p-6 shadow-xl">
				<h2 class="mb-4 text-lg font-bold">Authentication</h2>
				{#if errorMessage}
					<div class="mb-3 rounded bg-red-100 px-3 py-2 text-sm text-red-700">
						{errorMessage}
					</div>
				{/if}
				<form
					onsubmit={(e) => {
						e.preventDefault();
						if (!password) {
							errorMessage = 'パスワードを入力してください。';
							return;
						}
						errorMessage = '';
						showPasswordDialog = false;
						isAdminMode = true;
					}}
					class="space-y-3"
				>
					<input
						type="password"
						bind:value={password}
						placeholder="Password"
						class="w-full rounded-lg border px-3 py-2 text-sm"
					/>
					<div class="flex gap-3">
						<button
							type="submit"
							class="flex-1 rounded-lg bg-orange-500 py-2 text-sm font-medium text-white hover:bg-orange-600"
						>
							ログイン
						</button>
						<button
							type="button"
							onclick={() => {
								showPasswordDialog = false;
								password = '';
								errorMessage = '';
							}}
							class="flex-1 rounded-lg border py-2 text-sm font-medium hover:bg-gray-50"
						>
							キャンセル
						</button>
					</div>
				</form>
			</div>
		</div>
	{/if}

	<!-- upload mode toolbar -->
	{#if isAdminMode}
		<div class="pointer-events-none absolute bottom-8 left-1/2 z-10 -translate-x-1/2">
			<div
				class="pointer-events-auto flex items-center gap-3 rounded-xl bg-white px-4 py-3 shadow-lg"
			>
				<button
					onclick={useCurrentLocation}
					class="rounded-lg bg-blue-500 px-3 py-2 text-sm text-white hover:bg-blue-600"
				>
					現在地で追加
				</button>
				<span class="text-xs text-gray-500">または地図をタップ</span>
				<button
					onclick={() => {
						isAdminMode = false;
						resetForm();
						password = '';
					}}
					class="rounded-lg bg-gray-500 px-3 py-2 text-sm text-white hover:bg-gray-600"
				>
					終了
				</button>
			</div>
		</div>
	{/if}

	<!-- upload mode form -->
	{#if showForm}
		<div class="absolute inset-0 z-20 flex items-center justify-center bg-black/30">
			<div class="mx-4 w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
				<h2 class="mb-4 text-lg font-bold">スポットを追加</h2>

				{#if errorMessage}
					<div class="mb-3 rounded bg-red-100 px-3 py-2 text-sm text-red-700">
						{errorMessage}
					</div>
				{/if}

				<form
					onsubmit={(e) => {
						e.preventDefault();
						handleSubmit();
					}}
					class="space-y-3"
				>
					<div>
						<label for="spot-title" class="block text-sm font-medium">タイトル</label>
						<input
							id="spot-title"
							type="text"
							bind:value={formTitle}
							required
							class="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
						/>
					</div>

					<div>
						<label for="spot-date" class="block text-sm font-medium">日付</label>
						<input
							id="spot-date"
							type="date"
							bind:value={formDate}
							required
							class="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
						/>
					</div>

					<div>
						<label for="spot-image" class="block text-sm font-medium">写真</label>
						<input
							id="spot-image"
							type="file"
							accept="image/*"
							onchange={handleFileChange}
							class="mt-1 w-full text-sm"
						/>
					</div>

					<div>
						<label for="spot-description" class="block text-sm font-medium">説明</label>
						<textarea
							id="spot-description"
							bind:value={formDescription}
							required
							rows={3}
							class="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
						></textarea>
					</div>

					<div class="grid grid-cols-2 gap-3">
						<div>
							<label for="spot-lat" class="block text-sm font-medium">緯度</label>
							<input
								id="spot-lat"
								type="number"
								step="0.000001"
								bind:value={formLat}
								required
								class="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
							/>
						</div>
						<div>
							<label for="spot-lng" class="block text-sm font-medium">経度</label>
							<input
								id="spot-lng"
								type="number"
								step="0.000001"
								bind:value={formLng}
								required
								class="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
							/>
						</div>
					</div>

					<div class="flex gap-3 pt-2">
						<button
							type="submit"
							disabled={submitting}
							class="flex-1 rounded-lg bg-orange-500 py-2 text-sm font-medium text-white hover:bg-orange-600 disabled:opacity-50"
						>
							{submitting ? '送信中...' : '追加する'}
						</button>
						<button
							type="button"
							onclick={resetForm}
							class="flex-1 rounded-lg border py-2 text-sm font-medium hover:bg-gray-50"
						>
							キャンセル
						</button>
					</div>
				</form>
			</div>
		</div>
	{/if}
</div>

<style>
	.spot-marker {
		display: flex;
		flex-direction: column;
		align-items: center;
		cursor: pointer;
		filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
	}

	.spot-marker-pin {
		width: 48px;
		height: 48px;
		border-radius: 50%;
		overflow: hidden;
		border: 3px solid white;
		background: #ff6b35;
	}

	.spot-marker-pin img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.spot-marker-placeholder {
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.spot-marker-arrow {
		width: 0;
		height: 0;
		border-left: 8px solid transparent;
		border-right: 8px solid transparent;
		border-top: 10px solid white;
		margin-top: -2px;
	}
</style>
