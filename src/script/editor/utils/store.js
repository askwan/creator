import {dimension,styleServerType,formstyleType} from './static'
var State = {
  sobjects:{},
  diagrams:[],
  relations:[],
  relationType:[],
  otypes:{},
  ways:{},
  otypeIds:[],
  dimension,
  styleServerType,
  formstyleType,
  entitys:[]
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
      // let index = this.otypeIds.findIndex(n=>n==ev.id);
      // if(index==-1) this.otypeIds.push(ev.id);
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
}

let hidden = [];
State.hiddenObjects = function(list){
  if(!list) return hidden;
  // list.forEach(el=>{
  //   let index = hidden.findIndex(ev=>ev==el);
  //   if(index)
  // });
  hidden = list;
}

State.toggleObject = function(obj){
  let index = hidden.findIndex(el=>el==obj.id);
  if(index==-1){
    hidden.push(obj.id);
  }else{
    hidden.splice(index,1,1);
  }
}

export {
  State
}

