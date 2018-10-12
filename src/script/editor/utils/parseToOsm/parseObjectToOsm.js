import { osmNode, osmRelation, osmWay } from '../../id-editor/modules/osm'

import osm from '../../psde/form/osm'
import psde from '../../psde'

import { State } from '../store'

var jsonObjectsList
var allDatas = {}
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
    // entities = entities.concat(arr);
    arr.forEach(el=>{
      let k = entities.findIndex(ev=>ev.id==el.id);
      if(k>=0){
        entities.splice(k,1,el);
      }else{
        entities.push(el);
      }
    })
    // allDatas[jsonObjectsList[i].id] = jsonObjectsList[i]
  }
  entities.sort((a,b)=>TYPE[a.type]>TYPE[b.type]);
  // console.log(entities,4444444444444);
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
      // console.log(geom,sobject)
      if (geom.id) {
        let oNode = createOsmNode(geom, tags, sobject,'point');
        entities.push(oNode);
        form.geom = oNode.id;
      }
    } else if ((form.geotype == osm.SORTINDEX_EXT_WAY)) {
      let nodeids = []
      // console.log(geom,sobject)
      if(geom.nodes.length==0) continue;
      for (let i = 0; i < geom.nodes.length; i++) {
        let node = geom.nodes[i]
        let oNode = createOsmNode(node, {}, sobject)
        nodeids.push(oNode.id)
        entities.push(oNode)
      }
      // let way = createWay(nodeids, geom.id, {highway:'bridleway',name:tags.name}, sobject)
      let way = createWay(nodeids, geom.id, {name:tags.name}, sobject);
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
      let way = createWay(nodeids, geom.id, {area: 'yes',name:tags.name}, sobject);
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
  // sobject.otype = getOtypeById(sobject.otype.id)
  let sobj = new psde.SObject()
  sobj.copyObject(sobject);
  State.sobjects[sobj.id] = sobj;
  return entities;
}

function createOsmNode (geom, tags, org,_t) {
  org = org || {}
  _t = _t || 'vertex';
  let nid = 'n' + geom.id;
  // console.log(geom,'geom')
  let node = new osmNode({
    id: nid,
    visible: true,
    version: 1,
    changeset: 1,
    timestamp: org.realTime,
    user: 'min',
    uid: 0,
    loc: [geom.x,geom.y],
    tags: tags,
    orgData: org,
    uuid:geom.uuid,
    vid:geom.vid,
    _t:_t
  })
  allDatas[nid] = node;
  return node
}

function createOsmWay (geom,tags,org,collection){
  org = org || {};
  let nodes = [];
  
  geom.nodes.forEach(n=>{
    let node = createOsmNode(n,{},org);
    collection.push(node);
    nodes.push(node.id);
  });

  let _way = createWay(nodes,geom.id,tags,org);
  _way.uuid = geom.uuid;
  collection.push(_way);
  return {
    lists:collection,
    entity:_way
  }

}

function createWay (nodes, id, tags, org) {
  org = org || {}
  let wid = 'w' + id
  let way = new osmWay({
    id: wid,
    visible: true,
    version: 1,
    changeset: 11668672,
    timestamp: org.realTime,
    user: 'min',
    uid: 0,
    tags: tags,
    nodes: nodes,
    orgData: org
  })
  // console.log(way,'way')
  allDatas[wid] = way
  return way
}

function Member (id,role,type){
  this.id = id;
  this.role = role;
  this.type = type;
}

function createOsmRelation (geom,tags,org,collection){
  Object.assign(tags,{type: "multipolygon",area:'yes'});
  org = org||{};
  let members = [];
  geom.members.forEach(el=>{
    if(el.type=='node'){
      let node = createOsmNode(el,{},org);
      collection.push(new Member(node.id,el.role,node.type));
      members.push(node.id);
    }else if(el.type=='way'){
      let option = {}
      if(el.refEntity.nodes[0].id===el.refEntity.nodes[el.refEntity.nodes.length-1].id){
        option.area = 'yes';
      }
      let obj = createOsmWay(el.refEntity,option,org,collection);
      obj.entity.vid = el.refEntity.vid;
      members.push(new Member(obj.entity.id,el.role,obj.entity.type));
      collection = obj.lists;
    }else if(el.type=='relation'){
      let obj = createOsmRelation(el.refEntity,{},org,collection)
      members.push(new Member(obj.entity.id,el.role,obj.entity.type));
      collection = obj.lists;
    }
  })
  let relation = createRelation(members,geom.id,tags,org);
  relation.uuid = geom.uuid;
  relation.vid = geom.vid;
  // if(relation.id=='r9216872906752'){
  //   relation.members = [relation.members[1],relation.members[0]];
  //   console.log(relation,'sort')
  // }
  return {
    lists:collection,
    entity:relation
  }
}

function createRelation (members, id, tags, org) {
  org = org || {}
  let rId = 'r' + id
  let relation = new osmRelation({
    id: rId,
    visible: true,
    version: 1,
    changeset: 11668672,
    timestamp: org.realTime,
    user: 'min',
    uid: 0,
    tags: tags,
    members: members,
    orgData: org
  })
  allDatas[rId] = relation
  return relation
}

function getAttributeTag (sobject) {
  let tags = {}
  let attributes = sobject.attributes
  if (attributes) {
    attributes.forEach(attr => {
      tags[attr.name] = attr.value
    })
    tags.name = sobject.name
  // tags[sobject.name] = "*"
  }

  return tags
}

function findByNodeId (id) {
  // console.log(id,allDatas,"jsonobjectlist")
  var aim
  for (let key in allDatas) {
    if (id == key) {
      aim = Object.assign({}, allDatas[key].orgData)
    }
  }
  return aim || {}
}
function findRelations () {
  let aim = []
  // console.log(allDatas)
  for (let key in allDatas) {
    if (allDatas[key].type == 'relation') {
      aim.push(allDatas[key])
    }
  }
  return aim
}




export { findByNodeId, findRelations,getRelation }

export default parseObjectToOsm
