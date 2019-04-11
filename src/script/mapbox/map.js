// import { psdeHost } from '../editor/psde/config'
import {
  psdeHost,
  styleServer,
  psdeBaseUrl
} from '@/script/server'

import {
  vm,
  operate
} from '@/script/operate'
import _debounce from 'lodash-es/debounce'

import axios from 'axios'

import vectorSelect from './VectorSelect'
import Operation from './mapOperation/Operation'
import getColor from '../OneSIS/SObjectSceneManager/LayerManager/CustomLayer/manage/getColor'

// 全局mapbox地图对象
let mapboxMap = {}
let marker = null
let user = JSON.parse(sessionStorage.getItem('user'));

function createMapboxMap(container, options, callback) {
  let map = createMap(container, options);
  if (!map) return null;
  // psdeBaseUrl + `/dae/geoservice/rest/v0.1.0/datastore/slave/geoservice/vectortile?row={y}&cols={x}&level={z}&code=3857&serviceType=VectorTile${str}`,
  axios.get(psdeBaseUrl + '/dae/geoservice/geoservice/rest/v0.1.0/datastore/slave/geoservice/stylePreview/sourceLayers').then(function (res) {
    for (let i = 0; i < res.data.length; i++) {
      let layer = res.data[i]
      try {
        if (layer.type) {
          map.addLayer(layer)
        }
      } catch (error) {
        
      }
    }

    if (callback) {
      callback();
    }

  })
  mapboxMap = map

  return map
}

function createMap(container, options) {
  let defaultOptions = {
    // uids:id
  };
  if (!options.sdomains) return null
  Object.assign(defaultOptions, options);
  let str = '';
  for (let key in defaultOptions) {
    str += `&${key}=${defaultOptions[key]}`
  }
  // console.log('时空域', str)
  let map = new mapboxgl.Map({
    container: container,
    style: {
      version: 8,
      'sprite': 'http://116.62.28.103:8000/creator/static/mapbox/sprite',
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
            // psdeHost + `/service/query?row={y}&cols={x}&level={z}&code=3857&serviceType=VectorTile${str}`,
            psdeBaseUrl + `/dae/geoservice/geoservice/rest/v0.1.0/datastore/slave/geoservice/vectortile?row={y}&cols={x}&level={z}&code=3857&serviceType=VectorTile${str}`,
            // "http://192.168.1.133:8088/rest/v0.1.0/datastore/slave/geoservice" + `/vectortile?row={y}&cols={x}&level={z}&code=3857&serviceType=VectorTile${str}`
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
    center: options.center||[103.6249284647, 34.7472541716],
    zoom: 12
  })

  map.on('load', () => {
    styleServer.getStyles({
      orderType: "ID",
      descOrAsc: true,
    }).then(res => {
      getColor.setList(res.data.list);
    })
    let operation = new Operation(map)
    map.on('moveend', (e) => {
      // let featuresBuilding = map.queryRenderedFeatures({
      //   layers: ['l5193']
      // });
      let featuresBuilding = map.queryRenderedFeatures();
      let lv = e.target.transform._zoom;

      // console.log(lv, featuresBuilding)
      if (lv >= 17) {
        featuresBuilding.forEach(feature => {
          if (feature.properties.internal) {
            // console.log(lv, feature)
            let bbox = feature.properties.BBOX
            operation.moveend(bbox);
          }
        });
        // operation.moveend();
      } else {
        operation.remove();
      }
    });
    map.on('click', (e) => {
      // console.log(123,e)
    })


  })
  map.addControl(new mapboxgl.NavigationControl(), 'bottom-right')
  map.addControl(new mapboxgl.ScaleControl({
    maxWidth: 80,
    unit: 'metric'
  }))

  let moveEvent = function (e) {
    // console.log(e);
    // console.log(map.getBounds())
    vm.$emit(operate.mapStatus, {
      posi: map.getCenter(),
      zoom: Math.round(map.getZoom())
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

function addMarker(data) {
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

function flyTo(x, y, z, level = 16) {
  mapboxMap.flyTo({
    center: [x, y],
    zoom: level,
    speed: 2,
    curve: 1,
    easing(t) {
      return t
    }
  })
}

function fitBbox(bbox){
  let box = [[bbox.minx,bbox.miny],[bbox.maxx,bbox.maxy]];
  mapboxMap.fitBounds(box);
}

function changeSdomain(sdomain){
  let str = `&sdomains=${sdomain.id}`;
  let style = {
      version: 8,
      'sprite': 'http://116.62.28.103:8000/creator/static/mapbox/sprite',
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
            // psdeHost + `/service/query?row={y}&cols={x}&level={z}&code=3857&serviceType=VectorTile${str}`,
            psdeBaseUrl + `/dae/geoservice/rest/v0.1.0/datastore/slave/geoservice/vectortile?row={y}&cols={x}&level={z}&code=3857&serviceType=VectorTile${str}`,
            // "http://192.168.1.133:8088/rest/v0.1.0/datastore/slave/geoservice" + `/vectortile?row={y}&cols={x}&level={z}&code=3857&serviceType=VectorTile${str}`
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
    };

  let source = {
    'type': 'vector',
    'tiles': [
      psdeBaseUrl + `/dae/geoservice/rest/v0.1.0/datastore/slave/geoservice/vectortile?row={y}&cols={x}&level={z}&code=3857&serviceType=VectorTile${str}`,
    ],
    'minzoom': 4,
    'maxzoom': 20
  }
  
  let center = getCenter(sdomain.geoBox);

  mapboxMap.setCenter([center.x, center.y], mapboxMap.getZoom());
  // mapboxMap.setStyle(style);
  mapboxMap.remove();
  mapboxMap.setStyle(style);
  // mapboxMap.addSource('vector-tiles',source);
}

function getCenter(bbox){
    let center = {};
    center.x = (bbox.minx + bbox.maxx) / 2;
    center.y = (bbox.miny + bbox.maxy) / 2;
    center.z = (bbox.minz + bbox.maxz) / 2;
    return center;
}

export {
  createMapboxMap,
  mapboxMap,
  addMarker,
  flyTo,
  changeSdomain,
  getCenter,
  fitBbox
}
