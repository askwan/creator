

import osm from '../../psde/form/osm'
import psde from '../../psde'

import {createOsmNode,
  createOsmWay,
  createWay,
  createOsmRelation,
  createRelation,
  getAttributeTag} from './util'

import { State } from '../store'
import {getEditor} from '@/script/operate'

const TAG = {
  21:{
    tag:'n'
  },
  22:{
    tag:'w'
  },
  23:{
    tag:'w'
  },
  24:{
    tag:'r'
  }
}

function parseObjectToOsm (jsonObjects, callback) {
  if (jsonObjects.status !== 200) return callback('error',[])

  let jsonObjectsList = jsonObjects.data.list
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
  let ways = entities.filter(el=>el.type=='way');
  ways.forEach(way=>State.ways[way.id]=way);
  callback(null, entities)
}

function parseObject (entities, sobject) {
  let tags = getAttributeTag(sobject)
  // 循环形态列表
  if (!sobject.forms) return [];

  


  let otypeIds = State.otypeIds;
  let otype = otypeIds.find(el=>el==sobject.otype.id);
  if(!otype) return [];
  
  for (let i = 0; i < sobject.forms.length; i++) {
    let form = sobject.forms[i];
    let geom = form.geom;
    if (!geom) {
      if(form.geomref) {
        form.geomref = TAG[form.geotype].tag+form.geomref;
      }
      continue
    }
    if (form.geotype == osm.SORTINDEX_EXT_NODE) {
      // 编辑节点
      if (geom.id) {
        let oNode = createOsmNode(geom, tags, sobject,'point');
        entities.push(oNode);
        form.geom = oNode.id;
        form.geomref = 'n'+form.geomref;
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
      form.geom = way.id;
      form.geomref = 'w'+form.geomref;
    }else if ((form.geotype == osm.SORTINDEX_EXT_AREA)) {
      let nodeids = []
      if(geom.nodes.length==0) continue;
      for (let i = 0; i < geom.nodes.length; i++) {
        let node = geom.nodes[i]
        let oNode = createOsmNode(node, {}, sobject)
        nodeids.push(oNode.id)
        entities.push(oNode)
        form.geom = oNode.id;
        // form.geomref = "n"+form.geomref
      }
      let way = createWay(nodeids, geom.id, Object.assign({area: 'yes'},tags), sobject);
      way.uuid = geom.uuid;
      way.vid = geom.vid;
      entities.push(way)
      form.geom = way.id;
      form.geomref = "w"+form.geomref
    }else if (form.geotype == osm.SORTINDEX_EXT_RELATION) {
      let obj = createOsmRelation(form.geom,tags,sobject,entities);
      entities = obj.lists;

      entities.push(obj.entity)
      form.geom = obj.entity.id;
      form.geomref = 'r'+form.geomref;
      State.cacheRelation(obj.entity);
    }
  }
  let sobj = new psde.SObject()
  sobj.copyObject(sobject);
  State.sobjects[sobj.id] = sobj;

  let context = getEditor().idContext;

  // context.features().setFeature(sobject);

  // let hidden = State.hiddenObjects();
  // let hideObj = hidden.find(el=>el==sobject.id);
  // if(hideObj) {
    
  // }
  return entities;
}





export default parseObjectToOsm
