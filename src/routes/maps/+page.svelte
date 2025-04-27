<script lang='ts'>
    import maplibregl from 'maplibre-gl'
  
    import {
      FullScreenControl,
      GeoJSONSource,
      GeolocateControl,
      GlobeControl,
      MapLibre,
      NavigationControl,
      ScaleControl,
    } from 'svelte-maplibre-gl'
  
    let map: maplibregl.Map | undefined = $state.raw()
  
    const fetchPostData = async (id: string) => {
      try {
        const res = await fetch(`/api/posts/${id}`)
        if (!res.ok)
          throw new Error('Failed to fetch post data')
        return await res.json()
      }
      catch (error) {
        console.error(error)
        return null
      }
    }
  
    const handleTagPopup = (e: maplibregl.MapLayerMouseEvent) => {
      const num = e.features?.[0]?.properties.num
      if (num === undefined)
        return
      new maplibregl.Popup().setLngLat(e.lngLat).setHTML(`<p>${num}</p>`).addTo(map!)
    }
  
    const handlePopup = async (e: maplibregl.MapLayerMouseEvent) => {
      const id = e.features?.[0]?.properties.contentId
      if (!id)
        return
  
      const post = await fetchPostData(id)
  
      if (post) {
        new maplibregl.Popup()
          .setLngLat(e.lngLat)
          .setHTML(
            `
            <div>
              <h2 class="text-xl">${post.title}</h2>
              <img src="${post.eyecatch.url}" alt="${post.title}" class="w-full h-auto" />
            </div>
            `,
          )
          .addTo(map!)
      }
      else {
        new maplibregl.Popup()
          .setLngLat(e.lngLat)
          .setHTML('<p>データの取得に失敗しました。</p>')
          .addTo(map!)
      }
    }
  </script>
  
  <svelte:head>
    <link
      href='https://fonts.googleapis.com/css2?family=Zen+Maru+Gothic:wght@400;500;700&display=swap'
      rel='stylesheet'
    />
  </svelte:head>
  
  <div class='flex h-screen w-full'>
    <div class='ml-auto w-full bg-[#f8f8f8] px-[12px] py-[12px] mt-32 h-[calc(100vh-8rem)]'>
      <MapLibre
        bind:map
        class='h-[100%] min-h-[300px] rounded-2xl border-8 border-[#f8f8f8]'
        style='https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json'
        zoom={13}
        minZoom={3}
        maxZoom={18}
        center={{ lng: 134.875, lat: 34.31 }}
      >
        <FullScreenControl position='top-left' />
        <GeolocateControl position='top-right' />
        <NavigationControl />
        <ScaleControl />
        <GlobeControl />
      </MapLibre>
    </div>
  </div>
  