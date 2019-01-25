import Evented from '../utils/Evented'
import SObject from '../psde/psdm/SObject';
import {transformObject} from '../utils/parseToOsm/util.js'
export default class ManageBase extends Evented {
  constructor(context){
    super();
    // this.context = context;
  }
  getSobjectByOsmEntity(entityId){
    let result = this.getSObjectByListOsmEntity(this.currentGraph.sobjectList, entityId)
    if (result != null) {
      return result
    }
    result = this.getSObjectByListOsmEntity(this.sobjectlist, entityId)
    if (result != null) {
      return result
    }
    return null
  }
  getSobjectByListOsmEntity(){

  }
  getSobjectById(){
    return this.State.sobjects[sid];
  }
  getSobjectByOtypes(list){
    let arr = [];
    list.forEach(otId=>{
      for(let key in this.State.sobjects){
        let sobject = this.State.sobjects[key];
        if(sobject.otype.id==otId){
          arr.push(sobject);
        }
      }
    });
    return arr;
  }
  querySobjectByOtype(otype){
    let arr = [];
    for(let id in this.State.sobjects){
      let sobject = this.State.sobjects[id];
      if(sobject.otype.id==otype.id) arr.push(sobject);
    }
    return arr;
  }
  cloneObject(){
    let newSobject = new SObject();
    let str = JSON.stringify(this.currentSobject);
    newSobject.copyObject(JSON.parse(str));
    newSobject.id = n++;
    newSobject.createObject(newSobject);
    // console.log(newSobject,'new')
    this.currentSobject = newSobject;

    newSobject.forms.forEach(form=>{
      let entity = this.copyEntity(form.geom);
      form.geom = entity.id;
      form.geomref = entity.id;
    })
    newSobject.uuid = null;
    newSobject.version = {};
    // this.sobjectlist[newSobject.id] = newSobject;
    this.State.sobjects[newSobject.id] = newSobject;
    this.context.features().setFeature(newSobject);
    this.updateAndHistory(newSobject);
    this.context.selectEntity(newSobject.forms[0].geom)
  }
  copyEntity(ele){
    let entity = this.context.entity(ele);
    if(entity.type=='way'){
      return this.createWay(entity);
    }else if(entity.type=="node"){
      return this.createNode(entity);
    }else if(entity.type=='relation'){
      return this.createRelation(entity);
    }
  }
  createNode(entity){
    let node = osmNode({loc:entity.loc});
    this.context.perform(actionAddEntity(node),actionChangeTags(node.id,entity.tags));
    return node;
  }
  createWay(){
    let way = osmWay({ tags: entity.tags });
    this.context.perform(actionAddEntity(way));
    entity.nodes.forEach(nodeId=>{
      let _node = this.context.entity(nodeId);
      let node = osmNode({loc:_node.loc});
      this.context.perform(actionAddEntity(node));

      this.context.perform(
        actionAddVertex(way.id, node.id),
        actionClose(way.id)
      )
    });
    return way
  }
  createRelation(){
    let newRelation = this.relationOperate.createRelation();
    entity.members.forEach(member=>{
      let _member = this.context.entity(member.id);
      let newMember = {},_entity;
      if(_member.type=='way'){
        _entity = this.createWay(_member);
      }else if(_member.type=='node'){
        _entity = this.createNode(_member);
      }else if(_member.type=='relation'){
        _entity = this.createRelation(_member);
      }
      if(!_entity) return this.fire('notice',{message:"创建失败"});
      newMember.id = _entity.id;
      newMember.index = 1;
      newMember.role = member.role;
      this.relationOperate.setRole(newMember,newRelation.id)
    });
    return newRelation;
  }
  copySobject(){
    let _sobject = transformObject(this.idContext,sobject);
    _sobject.children = _sobject.children.map(el=>this.copySObject(el));
    return _sobject;
  }
  getCenter(){
    let x = (box.minx+box.maxx)/2;
    let y = (box.miny+box.maxy)/2;
    let z = (box.minz+box.maxz)/2
    return {x,y,z}
  }

}