

import osm from '../../psde/form/osm'
import psde from '../../psde'

import {createOsmNode,
  createOsmWay,
  createWay,
  createOsmRelation,
  createRelation,
  getAttributeTag} from './util'

import { State } from '../store'

var jsonObjectsList
const TYPE = {
  node:1,
  way:2,
  relation:3
}

function parseObjectToOsm (jsonObjects, callback) {
  if (jsonObjects.status !== 200) return

  jsonObjectsList = jsonObjects.data.list
  let entities = []

  for (let i = 0; i < jsonObjectsList.length; i++) {
    let arr = [];
    arr = parseObject(arr, jsonObjectsList[i]);
    arr.forEach(el=>{
      let k = entities.findIndex(ev=>ev.id==el.id);
      if(k>=0){
        entities.splice(k,1,el);
      }else{
        entities.push(el);
      }
    })
  }
  entities.sort((a,b)=>TYPE[a.type]>TYPE[b.type]);
  let ways = entities.filter(el=>el.type=='way');
  ways.forEach(way=>State.ways[way.id]=way);
  callback(null, entities)
}

function parseObject (entities, sobject) {
  let tags = getAttributeTag(sobject)
  // 循环形态列表
  if (!sobject.forms) return [];
  for (let i = 0; i < sobject.forms.length; i++) {
    let form = sobject.forms[i];
    let geom = form.geom;
    if (!geom) {
      continue
    }
    if (form.geotype == osm.SORTINDEX_EXT_NODE) {
      // 编辑节点
      if (geom.id) {
        let oNode = createOsmNode(geom, tags, sobject,'point');
        entities.push(oNode);
        form.geom = oNode.id;
      }
    } else if ((form.geotype == osm.SORTINDEX_EXT_WAY)) {
      let nodeids = []
      if(geom.nodes.length==0) continue;
      for (let i = 0; i < geom.nodes.length; i++) {
        let node = geom.nodes[i]
        let oNode = createOsmNode(node, {}, sobject)
        nodeids.push(oNode.id)
        entities.push(oNode)
      }
      let way = createWay(nodeids, geom.id, tags, sobject);
      way.uuid = geom.uuid;
      way.vid = geom.vid;
      entities.push(way)
      form.geom = way.id
    }else if ((form.geotype == osm.SORTINDEX_EXT_AREA)) {
      let nodeids = []
      if(geom.nodes.length==0) continue;
      for (let i = 0; i < geom.nodes.length; i++) {
        let node = geom.nodes[i]
        let oNode = createOsmNode(node, {}, sobject)
        nodeids.push(oNode.id)
        entities.push(oNode)
        form.geom = oNode.id
      }
      let way = createWay(nodeids, geom.id, Object.assign({area: 'yes'},tags), sobject);
      way.uuid = geom.uuid;
      way.vid = geom.vid;
      entities.push(way)
      form.geom = way.id
    }else if (form.geotype == osm.SORTINDEX_EXT_RELATION) {
      let obj = createOsmRelation(form.geom,tags,sobject,entities);
      entities = obj.lists;

      entities.push(obj.entity)
      form.geom = obj.entity.id;
      State.cacheRelation(obj.entity);
    }
  }
  let sobj = new psde.SObject()
  sobj.copyObject(sobject);
  State.sobjects[sobj.id] = sobj;
  return entities;
}





export default parseObjectToOsm
