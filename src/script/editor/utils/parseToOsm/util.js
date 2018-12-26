import { osmNode, osmRelation, osmWay } from '../../id-editor/modules/osm'
import Member from './Member'
import osm from '../../psde/form/osm'

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
  return way
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
      if(typeof el.refEntity=='object'){
        let option = {}
        el.refEntity.id = el.id;
        if(el.refEntity.nodes[0].id===el.refEntity.nodes[el.refEntity.nodes.length-1].id){
          option.area = 'yes';
        }
        let obj = createOsmWay(el.refEntity,option,org,collection);
        obj.entity.vid = el.refEntity.vid;
        members.push(new Member(obj.entity.id,el.role,obj.entity.type));
        collection = obj.lists;
      }else{
        members.push(new Member('w'+el.id,el.role,el.type));
        collection = collection.concat([]);
      }
    }else if(el.type=='relation'){
      let obj = createOsmRelation(el.refEntity,{},org,collection)
      members.push(new Member(obj.entity.id,el.role,obj.entity.type));
      collection = obj.lists;
    }
  })
  let relation = createRelation(members,geom.id,tags,org);
  relation.uuid = geom.uuid;
  relation.vid = geom.vid;
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

function transformObject (context,object){
  let _obj = JSON.parse(JSON.stringify(object));
  _obj.forms.forEach(form=>{
    if(form.geom){
      let entity = context.entity(form.geom);
      if(form.geotype==21){
        form.geom = new osm.OsmNode(entity);
      }else if(form.geotype==22){
        form.geom = new osm.OsmWay();
        form.geom.setOsmWay(context,entity);
      }else if(form.geotype == 23){
        form.geom = new osm.OsmWay();
        form.geom.setOsmWay(context,entity);
      }else if(form.geotype==24){
        form.geom = new osm.OsmRelation();
        form.geom.setOsmRelation(context,entity);
      }
      form.geom.clearId();
    }
  });
  return _obj;
}

export {
  createOsmNode,
  createOsmWay,
  createWay,
  createOsmRelation,
  createRelation,
  getAttributeTag,
  transformObject
}