import getColor from '../SObjectSceneManager/LayerManager/CustomLayer/manage/getColor'
import otypeList from '../SObjectSceneManager/LayerManager/CustomLayer/manage/otypeList'

import SObject from '../SObjectSceneManager/LayerManager/CustomLayer/SObject'
import {
  BuildingLayer,
  ModelLayer,
  PipelineLayer,
  OtherLayer
} from '../SObjectSceneManager/LayerManager/CustomLayer/AllLayer'
import OperationLayer from '../SObjectSceneManager/LayerManager/OperationLayer/layer/OperationLayer'
import {
  MapEvent,
  EventAll
} from '../evented/Event.js'
class MapboxGL {
  constructor(data) {
    this.container = data.id
    this.center = data.center
    this.SObjectList = []
    this.allLayer = {
      'pipelineLayer': new PipelineLayer(),
      'otherLayer': new OtherLayer(),
      'modelLayer': new ModelLayer(),
      'buildingLayer': new BuildingLayer(),
    }
    this.OperationLayer = new OperationLayer()

    this.modelSobject = false
    this.mousedownIs = false
    this.changed=false
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
      this.map.addLayer(this.OperationLayer)
      this.OperationLayer.add()

      this.map.resize()
      // this.map.on('click', (e) => {
      //   this.clickFn(e)
      // })
      this.map.on('mousemove', (e) => {
        this.mousemoveFn(e)
      })
      this.map.on('mouseup', (e) => {
        this.mouseupFn(e)
      })
      this.map.on('mousedown', (e) => {
        this.mousedownFn(e)
      })
      this.map.on('wheel', (e) => {
        this.OperationLayer.setZoom(this.map.getZoom())

      })
    });
  }
  setType(val) {
    this.OperationLayer.setType(val)
  }
  changeSlider(val) {
    this.OperationLayer.changeSlider(val, this.allLayer)
  }
  changeSliderEnd() {
    this.OperationLayer.changeSliderEnd(this.allLayer)
  }
  // clickFn(e) {
  //   console.log('clickFn', e)
  // }
  mousemoveFn(e) {
    // console.log('mousemoveFn', e)

    if (this.mousedownIs) {
      this.OperationLayer.mouseDrag(e, this.allLayer)
    } else {
      this.OperationLayer.mousePick(e)
    }
  }
  mouseupFn(e) {
    // console.log('mouseupFn', e)
    this.mousedownIs = false
    this.OperationLayer.mouseupPick(e, this.allLayer)
  }
  mousedownFn(e) {
    // console.log('mousedownFn', e)
    this.mousedownIs = true
    this.OperationLayer.mousedownPick(e)
  }
  start(data) {
    let lonlat = [(data.geoBox.maxx + data.geoBox.minx) / 2, (data.geoBox.maxy + data.geoBox.miny) / 2]
    if(!this.changed){
      this.map.flyTo({
        center: lonlat,
        pitch: 45,
        maxDuration: 100
      });
    }
    for (let i in this.allLayer) {
      let layer = this.allLayer[i]
      layer.remove()
      layer.setLonLat(lonlat)
    }
    this.OperationLayer.remove()
    this.OperationLayer.setLonLat(lonlat)
    this.OperationLayer.add()
    this.OperationLayer.setZoom(this.map.getZoom())
    this.changed = false;
    this.recursion([data])
  }
  recursion(list, floor) {
    for (let i = 0; i < list.length; i++) {
      let object = list[i]
      let sobject = new SObject(object)
      if (sobject.layer == 'modelLayer') {
        for (let q = 0; q < sobject.forms.length; q++) {
          if (sobject.forms[q].style.length > 0) {
            let obj = {
              scale: sobject.forms[q].style[0].scale
            }
            EventAll.fire(MapEvent.setScale, obj)
          }
        }
        this.modelSobject = true
        this.OperationLayer.setShow(true)
      } else {
        this.modelSobject = false
        this.OperationLayer.setShow(false)
      }
      if (!sobject.floor) {
        sobject.floor = floor ? floor : null
      }
      this.SObjectList.push(sobject)
      if (sobject.layer) {
        for (let q = 0; q < sobject.layer.length; q++) {
          this.allLayer[sobject.layer[q]].add(sobject)
        }
      }
      if (object.children.length > 0) {
        this.recursion(object.children, sobject.floor)
      }
    }
  }
  getModelSobject() {
    return this.modelSobject
  }
}
export default MapboxGL
