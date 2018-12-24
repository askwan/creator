import getColor from '../SObjectSceneManager/LayerManager/CustomLayer/manage/getColor'
import otypeList from '../SObjectSceneManager/LayerManager/CustomLayer/manage/otypeList'

import SObject from '../SObjectSceneManager/LayerManager/CustomLayer/SObject'
import {
  BuildingLayer,
  ModelLayer,
  PipelineLayer,
  OtherLayer
} from '../SObjectSceneManager/LayerManager/CustomLayer/AllLayer'
class MapboxGL {
  constructor(data) {
    this.container=data.id
    this.center = data.center
    this.SObjectList = []
    this.allLayer = {
      'pipelineLayer': new PipelineLayer(),
      'otherLayer': new OtherLayer(),
      'modelLayer': new ModelLayer(),
      'buildingLayer': new BuildingLayer(),
    }
    this.init(data)
  }
  init(data) {
    getColor.setList(data.styleList);
    otypeList.setlist(data.otypes);

    this.addMapbox()
  }
  addMapbox() {
    this.map = new mapboxgl.Map({
      container: this.container,
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
          }
        },
        layers: [{
          id: 'raster-tiles',
          type: 'raster',
          source: 'raster-tiles',
          minzoom: 0,
          maxzoom: 22
        }],
      },
      center: this.center,
      zoom: 16,
    });

    this.map.on("load", () => {
      console.log("mapbox地图加载完");
      for (let i in this.allLayer) {
        let layer = this.allLayer[i]
        this.map.addLayer(layer)
      }
      this.map.resize()
    });
  }
  start(data) {
    let lonlat = [(data.geoBox.maxx + data.geoBox.minx) / 2, (data.geoBox.maxy + data.geoBox.miny) / 2]
    this.map.flyTo({
      center: lonlat,
    });
    for (let i in this.allLayer) {
      let layer = this.allLayer[i]
      layer.remove()
      layer.setLonLat(lonlat)
    }
    this.recursion([data])
  }
  recursion(list, floor) {
    for (let i = 0; i < list.length; i++) {
      let object = list[i]
      let sobject = new SObject(object)
      if (!sobject.floor) {
        sobject.floor = floor ? floor : null
      }
      this.SObjectList.push(sobject)
      if (sobject.layer) {
        this.allLayer[sobject.layer].add(sobject)
      }
      if (object.children.length > 0) {
        this.recursion(object.children, sobject.floor)
      }
    }
  }
}
export default MapboxGL