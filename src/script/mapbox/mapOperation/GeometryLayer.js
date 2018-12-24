import PublicLayer from '../../OneSIS/SObjectSceneManager/LayerManager/CustomLayer/PublicLayer'


import getColor from '@/script/OneSIS/SObjectSceneManager/LayerManager/CustomLayer/manage/getColor'
import otypeList from '@/script/OneSIS/SObjectSceneManager/LayerManager/CustomLayer/manage/otypeList'

import SObject from '@/script/OneSIS/SObjectSceneManager/LayerManager/CustomLayer/SObject'
import {
  BuildingLayer,
  ModelLayer,
  PipelineLayer,
  OtherLayer
} from '@/script/OneSIS/SObjectSceneManager/LayerManager/CustomLayer/AllLayer'

class GeometryLayer extends PublicLayer{
  constructor(map) {
    super()
    this.id = '3d-building'
    this.lonlat = [120.432183,31.322479]
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
  }
  add(sobject) {
    
    if (!this.allSObjectGroup[sobject.id]) {
      this.allSObjectGroup[sobject.id] = new THREE.Group()
      this.group.add(this.allSObjectGroup[sobject.id])
    } else {

    }
    let nodes = sobject.nodes
    for (let i in nodes) {
      let node = nodes[i];
      // console.log(node,'node')
      this.allSObjectGroup[sobject.id].add(this.cGeometry[node.type].create(this.lonlat, sobject, node))
    }
    if(!sobject.show){
      this.allSObjectGroup[sobject.id].visible = false
    }
  }
  start(data){
    let lonlat = [(data.geoBox.maxx + data.geoBox.minx) / 2, (data.geoBox.maxy + data.geoBox.miny) / 2];
    for(let i in this.allLayer){
      let layer = this.allLayer[i]
      layer.remove()
      layer.setLonLat(this.lonlat)
    }
    this.recursion([data])
  }
  recursion(list,floor){
    for (let i = 0; i < list.length; i++) {
      let object = list[i]
      let sobject = new SObject(object)
      if (!sobject.floor) {
        sobject.floor = floor ? floor : null
      }
      this.SObjectList.push(sobject)
      if (sobject.layer) {
        this.add(sobject)
      }
      if (object.children.length > 0) {
        this.recursion(object.children, sobject.floor)
      }
    }
  }
}
export default GeometryLayer
