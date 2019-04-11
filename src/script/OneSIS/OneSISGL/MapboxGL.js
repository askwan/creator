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
    this.changed = false

    this.selectData = ''


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
  start(data, selectData) {
    this.selectData = selectData
    this.recursion([data], null, true)
  }
  recursion(list, floor, onece) {
    for (let i = 0; i < list.length; i++) {
      let object = list[i]
      // console.log('-----------------------------')
      let sobject
      if (onece) {
        sobject = new SObject(object, this.selectData)
      } else {
        sobject = new SObject(object)
      }
      let lonlat = []
      let have = false
      for (let t = 0; t < sobject.layer.length; t++) {
        if (sobject.layer[t] == 'modelLayer') {
          have = true
        }
      }
      if (have) {
        for (let q = 0; q < sobject.forms.length; q++) {
          if (sobject.forms[q].type == 50 && sobject.forms[q].style.length > 0) {
            let obj = {
              scale: sobject.forms[q].style[0].scale
            }
            EventAll.fire(MapEvent.setScale, obj)
            lonlat = [sobject.forms[q].geom.x, sobject.forms[q].geom.y]
          }
        }
        this.modelSobject = true
        this.OperationLayer.setShow(true)
      } else {
        lonlat = sobject.lonlat
        this.modelSobject = false
        this.OperationLayer.setShow(false)
      }
      if (onece) {
        for (let i in this.allLayer) {
          let layer = this.allLayer[i]
          layer.remove()
          layer.setLonLat(lonlat)
        }
        this.map.flyTo({
          center: lonlat,
          pitch: 45,
          maxDuration: 100
        });
        if (this.modelSobject) {
          this.OperationLayer.remove()
          this.OperationLayer.setLonLat(lonlat)
          this.OperationLayer.add()
          this.OperationLayer.setZoom(this.map.getZoom())
        }

      }
      if (!sobject.floor) {
        sobject.floor = floor ? floor : null
      }
      this.SObjectList.push(sobject)
      if (sobject.layer) {
        for (let q = 0; q < sobject.layer.length; q++) {
          // console.log(sobject.layer,333333)
          this.allLayer[sobject.layer[q]].add(sobject)
        }
      }
      if (object.children.length > 0) {
        this.recursion(object.children, sobject.floor, false)
      }
    }
  }
  getModelSobject() {
    return this.modelSobject
  }
}
export default MapboxGL
