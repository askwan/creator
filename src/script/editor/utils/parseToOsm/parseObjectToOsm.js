

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

    arr = parseObject(arr, State.findVersionObj(jsonObjectsList[i]));
    arr.forEach(el=>{
      let k = entities.findIndex(ev=>ev.id==el.id);
      if(k>=0){
        if(JSON.stringify(entities[k].tags)=='{}'){
          entities.splice(k,1,el)
        }else{

        }
      }else{
        entities.push(el);
      }
      // entities.push(el);
    })
  }
  let ways = entities.filter(el=>el.type=='way');
  ways.forEach(way=>State.ways[way.id]=way);
  // console.log(entities);
  // console.log(entities);
  // let a = entities.find(el=>el.id=="n744181256220");
  // if(a){
  //   console.log(a)
  // }
  // let b = entities.find(el=>el.id=="n744181256197");
  // let c = entities.find(el=>el.id=="n744181256196");
  // if(b) console.log(b);
  // if(c) console.log(c);
  // callback(null,[]);
  callback(null, entities)
}

function parseObject (entities, sobject) {
  let tags = getAttributeTag(sobject);
  let context = getEditor().idContext;
  // 循环形态列表
  if (!sobject.forms) return [];
  // console.log(sobject)

  // if(sobject.id==7849140314112){
  //   console.log(JSON.stringify(sobject),'sobject')
  // }

  if(!State.otypes[sobject.otype.id]){
    return [];
  }
  sobject.otype = State.otypes[sobject.otype.id];


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
        form.geomref = form.geom;
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
      // form.geomref = 'w'+form.geomref;
      form.geomref = form.geom
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
        form.geomref = form.geom;
      }
      let way = createWay(nodeids, geom.id, Object.assign({area: 'yes'},tags), sobject);
      way.uuid = geom.uuid;
      way.vid = geom.vid;
      entities.push(way)
      form.geom = way.id;
      // form.geomref = "w"+form.geomref
      form.geomref = form.geom;
    }else if (form.geotype == osm.SORTINDEX_EXT_RELATION) {
      let obj = createOsmRelation(form.geom,tags,sobject,entities);
      entities = obj.lists;

      entities.push(obj.entity)
      form.geom = obj.entity.id;
      // form.geomref = 'r'+form.geomref;
      form.geomref = form.geom;
      State.cacheRelation(obj.entity);
    }
  }
  let sobj = new psde.SObject()
  sobj.copyObject(sobject);
  // State.sobjects[sobj.id] = sobj;
  State.formateSObject(getEditor(),sobj);

  context.features().setFeature(sobject);
  let hidden = sobject.otype.fields.fields.find(el=>el.name=='indoor');
  if(hidden && sobject.parents.length>0){
    // getEditor().disableSobject(sobject.id);
  }
  
  return entities;
}





export default parseObjectToOsm
