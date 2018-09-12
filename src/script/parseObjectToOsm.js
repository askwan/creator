import { osmEntity, osmNode, osmRelation, osmWay } from '../iD-2.7.1/modules/osm'

import { actionAddMember } from '../iD-2.7.1/modules/actions/add_member'

// import parse from '@/script/wkt'

import parse from './wkt1'

import osm from '../psde/form/osm'
import psde from '@/psde/index'

import IdEdit from '@/script/id_edit/IdEdit'
// import debounce from "../../node_modules/_lodash-es@4.17.4@lodash-es/debounce"

import { allOtype, getOtypeById,clearRelationArr,relationArr } from '@/script/allOtype'

var jsonObjectsList
var allDatas = {}
var netData = []
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
  console.log(entities,4444444444444)
  callback(null, entities)
}

function parseObject (entities, sobject) {
  // console.log(sobject,'sobject')
  let tags = getAttributeTag(sobject)
  // 循环形态列表
  if (!sobject.forms) return
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
        let oNode = createOsmNode(geom, tags, sobject);
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
      // form.geom = oNode.id
      }
      // let way = createWay(nodeids, geom.id, {highway:'bridleway',name:tags.name}, sobject)
      let way = createWay(nodeids, geom.id, {name:tags.name}, sobject)
      entities.push(way)
      form.geom = way.id
    }else if ((form.geotype == osm.SORTINDEX_EXT_AREA)) {
      let nodeids = []
      if(geom.nodes.length==0) continue;
      // console.log(geom,sobject)
      // console.log(form.geom)
      for (let i = 0; i < geom.nodes.length; i++) {
        let node = geom.nodes[i]
        // console.log(sobject)
        let oNode = createOsmNode(node, [], sobject)
        nodeids.push(oNode.id)
        entities.push(oNode)
        form.geom = oNode.id
      }
      // let way = createWay(nodeids, geom.id, tags, sobject);
      // let way = createWay(nodeids, geom.id, {area: 'yes',name:tags.name,natural:'water'}, sobject)
      let way = createWay(nodeids, geom.id, {area: 'yes',name:tags.name}, sobject)
      entities.push(way)
      form.geom = way.id
    }else if (form.geotype == osm.SORTINDEX_EXT_RELATION) {
      var members = [];
      clearRelationArr();
      // console.log(geom,'relation',sobject)
      // if(!geom.nodes) continue;
      // if(geom.nodes.length==0) continue;
      geom.node.forEach(node => {
        let oNode = createOsmNode(node, tags, sobject)
        entities.push(oNode)
        members.push(oNode)
        form.geom = oNode.id
      })
      geom.way.forEach(way => {
        let nodeids = []
        for (let i = 0; i < way.nodes.length; i++) {
          let node = way.nodes[i]
          let arr = []
          for (let key in tags) {
            arr.push(tags[key])
          }

          let oNode = createOsmNode(node, {}, sobject);
          
          nodeids.push(oNode.id)
          entities.push(oNode)
          form.geom = oNode.id
        }
        let obj = createWay(nodeids, way.id, {area:'yes',name:tags.name}, sobject)
        members.push({
          id: obj.id,
          type: 'way',
          role: way.role
        })
        entities.push(obj)
        form.geom = obj.id
      })
      // console.log(members)
      let relation = createRelation(members, geom.id, {type: "multipolygon",name:tags.name}, sobject);
      // console.log(relation)
      entities.push(relation)
      form.geom = relation.id;
      // relation.addMember(members[0], 0);
      relationArr(relation)
    }
  }
  sobject.otype = getOtypeById(sobject.otype.id)
  let sobj = new psde.SObject()
  sobj.copyObject(sobject)
  IdEdit.addSobject(sobj);
  return entities;
}

function createOsmNode (geom, tags, org) {
  org = org || {}
  let nid = 'n' + geom.id;
  console.log(geom.id)
  let node = new osmNode({
    id: nid,
    visible: true,
    version: 1,
    changeset: 11668672,
    timestamp: '2012-05-22T07:13:23Z',
    user: 'min',
    uid: 0,
    loc: [geom.x,geom.y],
    tags: tags,
    orgData: org
  })
  // if(geom.id=='5224388132865'){
  //   if(tags.name=='askwan'){
  //     return node
  //   }else{
  //     return new osmNode({
  //       id: nid,
  //       visible: true,
  //       version: 1,
  //       changeset: 11668672,
  //       timestamp: '2012-05-22T07:13:23Z',
  //       user: 'min',
  //       uid: 0,
  //       loc: geom.coord,
  //       tags: {name:'askwan'},
  //       orgData: org
  //     })
  //   }
  // }
  allDatas[nid] = node;
  return node
}

function createWay (nodes, id, tags, org) {
  org = org || {}
  console.log(nodes,'nodes')
  let wid = 'w' + id
  let way = new osmWay({
    id: wid,
    visible: true,
    version: 1,
    changeset: 11668672,
    timestamp: '2012-05-22T07:13:23Z',
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

function createRelation (members, id, tags, org) {
  org = org || {}
  let rId = 'r' + id
  let relation = new osmRelation({
    id: rId,
    visible: true,
    version: 1,
    changeset: 11668672,
    timestamp: '2012-05-22T07:13:23Z',
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


export { findByNodeId, findRelations }

export default parseObjectToOsm
