import { psdeHost } from '../editor/psde/config'
import { vm, operate } from '@/script/operate'
import _debounce from 'lodash-es/debounce'

import axios from 'axios'

import vectorSelect from './VectorSelect'

// 全局mapbox地图对象
let mapboxMap = {}
let marker = null

function createMapboxMap (container,callback) {
  let map = createMap(container)
  axios.get(psdeHost + '/stylePreview/sourceLayers').then(function (res) {
    for (let i = 0; i < res.data.length; i++) {
      let layer = res.data[i]
      if (layer.type) {
        map.addLayer(layer)
      }
    }
    
    if(callback){
      callback();
    }

  })
  mapboxMap = map

  return map
}

function createMap (container) {
  let map = new mapboxgl.Map({
    container: container,
    style: {
      version: 8,
      'sprite': 'http://47.104.96.210/creator/static/mapbox/sprite',
      sources: {
        'raster-tiles': {
          type: 'raster',
          tiles: [
            'http://www.google.cn/maps/vt?lyrs=s@781&gl=cn&x={x}&y={y}&z={z}'
          ],
          tileSize: 256,
          minzoom: 0,
          maxzoom: 22
        },
        'vector-tiles': {
          'type': 'vector',
          'tiles': [
            psdeHost + '/service/query?row={y}&cols={x}&level={z}&code=3857&serviceType=VectorTile'
          ],
          'minzoom': 4,
          'maxzoom': 20
        }
      },
      layers: [{
        id: 'raster-tiles',
        type: 'raster',
        source: 'raster-tiles',
        minzoom: 0,
        maxzoom: 22
      }]
    },
    center: [103.6249284647 , 34.7472541716],
    zoom: 12
  })

  map.addControl(new mapboxgl.NavigationControl(), 'bottom-right')
  map.addControl(new mapboxgl.ScaleControl({
    maxWidth: 80,
    unit: 'metric'
  }))

  let moveEvent = function (e) {
    // console.log(e);
    // console.log(map.getBounds())
    vm.$emit(operate.mapStatus,{
      posi:map.getCenter(),
      zoom:map.getZoom()
    })
    vm.$emit(operate.mapBoxZoom, map.getBounds().toArray())
  }
  let _moveEvent = _debounce(moveEvent, 200)

  map.on('mousemove', _moveEvent)


  vectorSelect.initMap(map)

  let source = map.getSource()
  //   console.log(source,"数据一")
  //   console.log(map, "map")
  return map
}

function addMarker (data) {
  mapboxMap.flyTo({
    center: data,
    zoom: 15,
    speed: 2,
    curve: 1,
    easing(t) {
      return t
    }
  })
  if (marker && marker.remove()) {
    marker.remove()
  }
  marker = new mapboxgl.Marker()
    .setLngLat(data)
    .addTo(mapboxMap)
}

function flyTo(x,y,z,level=16){
  mapboxMap.flyTo({
    center:[x,y],
    zoom: level,
    speed: 2,
    curve: 1,
    easing(t) {
      return t
    }
  })
}

export { createMapboxMap, mapboxMap, addMarker,flyTo }
