import BuildingLayer from './layer/BuildingLayer'
import ModelLayer from './layer/ModelLayer'

import {
  State
} from '@/script/editor/utils/store'
class Model_js {
  constructor() {
    // this.center = [113.658247, 34.774313]
    this.center = [120.433512, 31.324123]

    // this.center = [0, 0]
    this.three = ''
  }
  init() {
    this.addMapbox()
  }

  addMapbox() {
    this.map = new mapboxgl.Map({
      container: "mapbox-3d",
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
      this.buildingLayer = new BuildingLayer()
      this.modelLayer = new ModelLayer()
      this.map.addLayer(this.buildingLayer);
      this.map.addLayer(this.modelLayer);
      this.map.resize()
    });
  }

  getData(data) {
    let geoBox = data.object.geoBox
    let lonlat = [(geoBox.maxx + geoBox.minx) / 2, (geoBox.maxy + geoBox.miny) / 2]
    this.map.flyTo({
      center: lonlat,
    });
    // console.log('----------------------------------')
    let forms = data.object.forms
    for (let i = 0; i < forms.length; i++) {
      let form = forms[i]
      // console.log(form, 'js----map--------')
      if (form.type == 23) {
        this.buildingLayer.addGeometry(data)
        this.modelLayer.remove()
      } else if (form.type == 50) {
        this.buildingLayer.remove()
        this.modelLayer.addModel(data, form)
      } else if (form.type == 21) {
        let list =  State.getSobjectByParents(data.object.id);
        if (list.length > 0) {
          list = list.filter(el => State.sobjects[el.id]).map(el => State.sobjects[el.id])
          this.modelLayer.remove()
          this.buildingLayer.addBuilding(data, list)
        }
     
      }
    }
    // console.log('----------------------------------')

  }
}
let model_js = new Model_js()
export default model_js
