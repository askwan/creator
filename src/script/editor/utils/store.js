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
  versionObjs:[],
  hiddenOt:[],
  viewObject:{},
  parentRoot:{},
  buildings:{}
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
    });
    
  });
  for(let id in this.otypes){
    this.formateOtype(this.otypes[id]);
  }
  // console.log(this.otypes[3453])
  this.diagrams = list.map(el=>{
    el.otypes = el.otypes.map(otype=>State.otypes[otype.id]);
    return el
  })
}

State.formateOtype = function(otype){
  let connectors = otype.connectors.connectors;
  let inheritConnectors = connectors.filter(el=>el.type==2&&otype.id==el.fId&&otype.id!==el.dType.id);
  inheritConnectors.forEach(connector=>{
    let _otype = this.otypes[connector.dType.id];
    if(_otype){
      _otype = this.formateOtype(_otype);
      _otype.fields.fields.forEach(field=>{
        let aim = otype.fields.fields.find(el=>el.id==field.id);
        if(!aim) otype.fields.fields.push(field);
      })
      _otype.formStyles.styles.forEach(style=>{
        let aim = otype.formStyles.styles.find(el=>el.type==style.type);
        if(!aim) otype.formStyles.styles.push(style);
      })
    }
  })
  return otype;
}

State.findOtypeById = function(id){
  return this.otypes[id];
}

State.clear = function(){
  this.relations = [];
  this.sobjects = {};
  // this.otypeIds = [];
  this.hidden = [];
  this.parentRoot = {};
}

State.flush = function(){
  this.relations = [];
  this.sobjects = {};
  this.parentRoot = {};
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

State.formateSObject = function(obj){
  // this.parentRoot[obj.id] = [];
  if(this.sobjects[obj.id]) return;
  obj.show = true;
  this.sobjects[obj.id] = obj;
  obj.parents.forEach(parent=>{
    if(!this.parentRoot[parent.id]){
      this.parentRoot[parent.id] = [];
    };
    let index = this.parentRoot[parent.id].findIndex(el=>el.id==obj.id);
    if(index==-1) this.parentRoot[parent.id].push(obj);
  })
}

State.setFloor = function(sobject){
  if(sobject.otype.id=='大楼'){
    this.buildings[sobject.id] = sobject;
  }else if(sobject.otype.id=='楼层'){
    let buildingId;
    this.buildings[buildingId].children.push(sobject);
  }else if(sobject.attributes.find(el=>el.id==1555)){
    
  }

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

State.disableOt = function(otId){
  let aim = this.hiddenOt.find(el=>el==otId);
  if(!aim) this.hiddenOt.push(otId);
  return this.hiddenOt;
}

State.enableOt = function(otId){
  let index = this.hiddenOt.findIndex(el=>el==otId);
  this.hiddenOt.splice(index,1);
  return this.hiddenOt;
}

State.findChildrenOtype = function(otypeId){
  let otype = this.otypes[otypeId];
  let connectors = otype.connectors.connectors;
  let inheritConnectors = connectors.filter(el=>el.dType.id==otypeId&&el.type==2&&State.otypes[el.fId]);
  return inheritConnectors.map(el=>el.fId);
}



export {
  State
}

