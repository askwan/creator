import {dimension,styleServerType,formstyleType} from './static'
var State = {
  sobjects:{},
  diagrams:[],
  relations:[],
  relationType:[],
  connectors:[],
  otypes:{},
  ways:{},
  otypeIds:[],
  dimension,
  styleServerType,
  formstyleType,
  entitys:[],
  hidden:[],
  _hiddenEntity:[],
  versionObjs:[]
}

State.cacheRelation = function(relation){
  let index = this.relations.findIndex(el=>el.id==relation.id);
  if(index==-1) {
    this.relations.push(relation);
  }else{
    this.relations.splice(index,1,relation);
  }
}

/**
 * 通过member查找relation
 */
State.findRelationByMember = function(memberId){
  let aimRelation;
  this.relations.forEach(relation=>{
    let aimMember = relation.members.find(member=>member.id==memberId&&member.role=='outer');
    if(aimMember) aimRelation = relation;
  })
  return aimRelation;
}

State.userDiagram = function(userId){
  return this.diagrams.filter(el=>el.user.uid==userId);
}

State.getDiagram = function(list){
  this.otypeIds = [];
  list.forEach(el=>{
    this.otypeIds.push(el.id)
    el.otypes.forEach(ev=>{
      this.otypes[ev.id] = ev;
      this.otypeIds.push(ev.id);
    })
  })
  this.diagrams = list;
}

State.findOtypeById = function(id){
  return this.otypes[id];
}


State.clear = function(){
  this.relations = [];
  this.sobjects = {};
  // this.otypeIds = [];
  this.hidden = [];
}

State.flush = function(){
  this.relations = [];
  this.sobjects = {};
}

/**
 * 获取父对象otype
 * 
 */
State.getParentOtypeById = function(id){
  // console.log(this.connectors)
  let array = this.connectors.filter(el=>el.dType.id==id&&el.type==8);
  if(array.length>0){
    array = array.filter(el=>this.otypes[el.fId]).map(el=>this.otypes[el.fId]);
  }
  return array;
}


State.hiddenObjects = function(list){
  if(!list) return this.hidden;
  this.hidden = list;
}

State.showObject = function(obj){
  let index = this.hidden.findIndex(el=>el==obj.id);
  this.hidden.splice(index,1);
}

State.hiddenObject = function(obj){
  let index = this.hidden.findIndex(el=>el==obj.id);
  if(index==-1) this.hidden.push(obj.id);
}

State.getSobjectByParents = function(parentsId){
  let result = [];
  for(let id in this.sobjects){
    let sobject = this.sobjects[id];
    // console.log(sobject.parents)
    let find = sobject.parents.find(el=>el.id==parentsId);
    if(find){
      result.push(sobject);
    }
  }
  return result
}

State.setVersionObj = function(sobj){
  let index = this.versionObjs.findIndex(el=>el.id==sobj.id);
  if(index==-1){
    this.versionObjs.push(sobj);
  }else{
    this.versionObjs.splice(index,1,sobj);
  }
}

State.findVersionObj = function(sobj){
  let sobject = this.versionObjs.find(el=>el.id==sobj.id);
  if(sobject) {
    return JSON.parse(JSON.stringify(sobject));
  }else{
    return sobj;
  }
}



export {
  State
}

