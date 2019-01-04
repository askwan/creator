import SObject from '@/script/OneSIS/SObjectSceneManager/LayerManager/CustomLayer/SObject'
import {
  BuildingLayer,
  ModelLayer,
  PipelineLayer,
  OtherLayer
} from '@/script/OneSIS/SObjectSceneManager/LayerManager/CustomLayer/AllLayer'

class MapGL {
  constructor(map) {
    this.id = '3d-building'
    this.lonlat = [120.432183, 31.322479]
    this.map = map;
    this.SObjectList = []
    this.allLayer = {
      'pipelineLayer': new PipelineLayer(),
      'otherLayer': new OtherLayer(),
      'modelLayer': new ModelLayer(),
      'buildingLayer': new BuildingLayer(),
    }
    this.minzoom = 16;
    this.maxzoom = 22;
    this.init()
  }
  init() {
    for (let i in this.allLayer) {
      let layer = this.allLayer[i]
      this.map.addLayer(layer)
    }
  }

  start(data) {
    for (let i in this.allLayer) {
      let layer = this.allLayer[i]
      layer.remove()
      layer.setLonLat(this.lonlat)
    }
    if (data.children.length > 0) {
      this.recursion(data.children)
    }
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
  remove() {
    for (let i in this.allLayer) {
      let layer = this.allLayer[i]
      layer.remove()
    }
  }
}
export default MapGL
