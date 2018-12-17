import BuildingLayer from '../../script/OneSIS/SObjectSceneManager/LayerManager/CustomLayer/BuildingLayer/BuildingLayer'
// import ModelLayer from '../../script/OneSIS/SObjectSceneManager/LayerManager/CustomLayer/ModelLayer/ModelLayer'
import PipelineLayer from '../../script/OneSIS/SObjectSceneManager/LayerManager/CustomLayer/PipelineLayer/PipelineLayer'

import SObject from '../../script/OneSIS/SObjectSceneManager/LayerManager/CustomLayer/SObject/SObject'

class Model_js {
  constructor() {
    // this.center = [113.658247, 34.774313]
    this.center = [120.433512, 31.324123]
    this.SObjectList = []

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
      this.allLayer = {}

      this.allLayer.buildingLayer = new BuildingLayer()
      // this.allLayer.modelLayer = new ModelLayer()
      this.allLayer.pipelineLayer = new PipelineLayer()

      this.map.addLayer(this.allLayer.buildingLayer);
      // this.map.addLayer(this.allLayer.modelLayer);
      this.map.addLayer(this.allLayer.pipelineLayer);
      this.map.resize()
    });
  }
  getAttributes(list, name) {
    for (let i = 0; i < list.length; i++) {
      let l = list[i]
      if (l.name == name) {
        return l.value
      }
    }
    return null
  }
  recursion(list, floor) {
    for (let i = 0; i < list.length; i++) {
      let object = list[i]
      let sobject = new SObject(object)
      sobject.floor = floor ? floor : null
      this.SObjectList.push(sobject)
      if (object.children.length > 0) {
        if (object.otype.name == '楼层') {
          let num = parseInt(this.getAttributes(object.attributes, "FLOOR"))
          sobject.floor = num ? num : null
          if (sobject.layer) {
            this.allLayer[sobject.layer].add(sobject)
          }
          this.recursion(object.children, num)
        } else {
          this.recursion(object.children)
        }
      } else {
        if (sobject.layer) {
          this.allLayer[sobject.layer].add(sobject)
        }
      }
    }
  }
  getData(data) {
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

    return
    // let geoBox = data.object.geoBox
    // let lonlat = [(geoBox.maxx + geoBox.minx) / 2, (geoBox.maxy + geoBox.miny) / 2]
    // this.map.flyTo({
    //   center: lonlat,
    // });
    // // console.log('----------------------------------')
    // let forms = data.object.forms
    // for (let i = 0; i < forms.length; i++) {
    //   let form = forms[i]
    //   console.log(form, data, 'js----map--------')
    //   let type = form.type
    //   if (type == 50) {
    //     this.buildingLayer.remove()
    //     this.modelLayer.addModel(data, form)
    //   } else if (type == 21 || type == 22 || type == 23) {
    //     this.modelLayer.remove()
    //     this.buildingLayer.addGeometry(data, type)
    //   }
    // }
    // console.log('----------------------------------')

  }

}
let model_js = new Model_js()
export default model_js
