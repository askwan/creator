import osm from '../psde/form/osm'
import SObject from '../psde/psdm/SObject';
import {State} from './store';
import { diff } from 'martinez-polygon-clipping';

let flagType = {
  created: 1,
  modified: 2,
  deleted: 3
}

const TYPE = {
  21:{
    type:21,
    fnName:'createNode'
  },
  22:{
    type:22,
    fnName:'createWay'
  },
  23:{
    type:23,
    fnName:'createWay'
  },
  24:{
    type:24,
    fnName:'createRelation'
  }
}

class EditSave {
  constructor(){}
  createNode(context,entity,flag){
    flag = flag||0;
    let node = new osm.OsmNode(entity);
    node.updateFlag(flag)
    return node;
  }
  createWay(context,entity,flag){
    flag = flag || 0;
    let way = new osm.OsmWay();
    way.setOsmWay(context,entity);
    way.updateFlag(flag);
    return way;
  }
  createRelation(context,entity,flag){
    flag = flag || 0;
    let relation = new osm.OsmRelation();
    relation.setOsmRelation(context,entity);
    relation.updateFlag(flag);
    return relation;
  }
  formateOsm(context,arr,flag){
    let result = [];
    arr.forEach(el=>{
      let entity;
      if(el.type==='node'){
        if(context.geometry(el.id)==='vertex'){
          if(!el.orgData) return
          let ways = context.graph().parentWays(el)
          ways.forEach(w=>{
            let way = this.createWay(context,w,2);
            addObj(result,way);
            let res = context.graph().parentRelations(way)
            res.forEach(r=>{
              let relation = this.createRelation(context,r,2);
              addObj(result,relation)
            })

          });


          el.orgData.forms.forEach(ev=>{
            if(!ev.geom) return
            if(ev.geotype==21){
              let node = this.createNode(context,context.entity(ev.geom));
              addObj(result,node);
            }else if(ev.geotype==23||ev.geotype==22){
              let way = this.createWay(context,context.entity(ev.geom));
              addObj(result,way)
            }else if(ev.geotype==24){
              let relation = this.createRelation(context,context.entity(ev.geom),2);
              addObj(result,relation)
            }
          })
        }
        entity = this.createNode(context,el);
      }else if(el.type ==='way'){
        entity = this.createWay(context,el)
        let relations = context.getRelations(entity.id);
        relations.forEach(r=>{
          let relation = this.createRelation(context,context.entity(r));
          if(relation.flag!==1) relation.updateFlag(2);
          addObj(result,relation);
        })
      }else if(el.type==='relation'){
        entity = this.createRelation(context,el);
      }
      entity.updateFlag(flag);
      addObj(result,entity);
    });
    return result
  }
  /**
   * 将变更集的sobject的form还原为对象。
   */
  formateHistory(context,idedit){
    let sobjects = idedit.currentGraph.sobjectList;
    let _sobjects = {};
    for(let id in sobjects){
      let sobject = this.clone(sobjects[id]);
      sobject.forms.forEach(form=>{
        // console.log(form.geom,123123);
        if(form.geom){
          form.geom = this[TYPE[form.geotype].fnName](context,context.entity(form.geom));
        }
      })
      _sobjects[id] = sobject;
    }
    return _sobjects;
  }
  getOsmChanges1(context,Idedit){
    let changes = context.changes();
    let difference = context.history();
    console.log(difference,'changes');
    console.log(difference.difference().summary())
    let _osmChange = [];
    let geomCollection = context.history().base();
    //created
    let created = this.formateOsm(context,changes.created,flagType.created);
    //modified
    let modified = this.formateOsm(context,changes.modified,flagType.modified);
    //deleted
    let deleted = this.formateOsm(context,changes.deleted,flagType.deleted);
    _osmChange = _osmChange.concat(created,modified,deleted);
    
    // return
    let ways = _osmChange.filter(el=>el.type == 'way');
    ways.forEach(way=>{
      let entity = deleted.find(el=>el.id==way.refOb.id);
      way.nodes.forEach((el,k)=>{
        let i = _osmChange.findIndex(ev=>ev.id==el.id);
        if(i>-1){
          let node = _osmChange[i];
          way.nodes.splice(k,1,node);
          way.updateFlag(2);
        }; 
      });
    });

    deleted.forEach(el=>{

      

      if(el['@type']==='Node'){
        
        let p = geomCollection._parentWays[el.id];
        if(p instanceof Array){
          p.forEach(en=>{
            let entity = _osmChange.find(ev=>ev.id==en);
            if(entity){
              entity.nodes.push(el);
            }
          })
        }


        let entitys = _osmChange.filter(ev=>ev.refOb.id==el.refOb.id);
        if(entitys.length==0) return
        entitys.forEach(entity=>{
          if(entity['@type']=='Way'){
            if(!entity.nodes.find(ev=>ev.id==el.id)) entity.nodes.push(el);
          }else if(entity['@type']=='Relation'){
            let wayIds = this.getWayFromRelation(el.id,entity);
            wayIds.forEach(id=>{
              let way = entity.members.find(el=>el.refEntity.id.replace(/[^0-9]/ig,"")==id);
              if(way){
                way.refEntity.nodes.push(el);
              }
            })
          }
        })
        
      }else if(el['@type']==='Way'){
        let entity = _osmChange.find(ev=>ev.refOb.id===el.refOb.id);
        if(!entity) return;
        if(entity['@type']=='Relation'){
          let obj = {};
          obj.refEntity = el;
          obj.type = 'way';
          entity.members.push(obj);
        }
      }
    });

    let relations = _osmChange.filter(el=>el.type == 'relation');
    relations.forEach(relation=>{
      relation.members.forEach((member,k)=>{
        if(member.type=='node'){
          let i = _osmChange.findIndex(ev=>ev.id==el.id);
          if(i>-1){
            relation.members.splice(k,1,_osmChange[i]);
          }
        }else if(member.type=='way'){
          if(!member.refEntity){
            return
          }
          member.refEntity.nodes.forEach((node,k)=>{
            let i = _osmChange.findIndex(ev=>ev.id==node.id);
            if(i>-1){
              member.refEntity.nodes.splice(k,1,_osmChange[i]);
            }
          })
        }
        let index = _osmChange.findIndex(ev=>ev.id==member.refEntity.id);
        if(index>-1) {
          member.refEntity = _osmChange[index];
        }

      })
    });



    return _osmChange
  }
  getSaveSObject(context,idedit){
    let nowDate = Math.floor(Date.parse(new Date()));
    let sobjects = this.formateHistory(context,idedit);
    let resultSobjectList = [];
    let osmCollection = this.getOsmChanges1(context,idedit);
    // console.log(osmCollection,'chage');
    // return
    for(let id in sobjects){
      let sobject = sobjects[id];
      this.addSObjectList(resultSobjectList,sobject)
    }

    for(let i in osmCollection){
      let entity = osmCollection[i];
      let sobject = this.getSobjectByEntityId(resultSobjectList,entity.id);
      if(!sobject) {
        sobject = this.getSobjectByEntityId(State.sobjects,entity.id);
        
      }
      if(sobject){
        this.addSObjectList(resultSobjectList,sobject);
        this.updateSObjectForm(resultSobjectList,sobject.id,entity);
      }
    }

    resultSobjectList.forEach(obj=>{
      if(obj.forms.length==0){
        obj.actions = [];
        obj.deleteObject();
      }

      obj.otype = {id:obj.otype.id};
      obj.forms.forEach(form=>{

        if(typeof form.formref.refid =='string'){
          form.formref.refid = this.toNum(form.formref.refid);
        }
        if ((form.style instanceof Array) && form.style.length>0) {
          form.style = JSON.stringify(form.style);
        } else{
          form.style = "";
        }
        form.geomref = this.toNum(form.geomref);

        
        if(obj.actions.find(el=>el.operation==33)) {
          obj.forms.forEach(el=>{
            
            if(el.geom && typeof el.geom=='object'&&el.geom.type=='way'){
              el.geom.nodes.forEach(node=>{
                node.updateFlag(1);
                node.uuid=null;
              })
              el.geom.updateFlag(1);
            };
          })
        }
        if(form.geom && typeof form.geom=='object') {
          form.geom.clearId();
        }else{
          form.geom = '';
        }

      })
      // console.log(obj.realTime,'ffffffff')
      if(!obj.realTime){
        if (State.findVersionObj(obj)!==obj){
          obj.realTime = obj.version.vtime;
        }
        if(!obj.realTime){
          obj.realTime = nowDate;
        };
      }else{
        
      }
      obj.sdomain = JSON.parse(sessionStorage.getItem('sdomain')).id;
      obj.children = [];
    });
    
    
    
    return resultSobjectList;

  }

  addSObjectList(sobjectlist, sobject){
    let _sobject = sobject;
    let idx = sobjectlist.findIndex(el => el.id == _sobject.id)
    if (idx == -1) {
      sobjectlist.push(_sobject)
    }else{
      sobjectlist.splice(idx,1,_sobject);
    }
    return sobjectlist
  }
  clone(s){
    let str = JSON.parse(JSON.stringify(s));
    let obj = new SObject();
    obj.copyObject(str);
    obj.realTime = s.realTime;
    return obj;
  }
  toNum(str){
    if(typeof str === 'string'){
      return str.replace(/[^0-9]/ig,"")
    }else if(typeof str === 'number'){
      return str;
    }
  }
  getSobjectByEntityId(list,id){
    let sobject;
    for(let key in list){
      let obj = list[key];
      obj.forms.forEach(form=>{
        if(form.geom==id){
          sobject = obj;
        }
      })
    }
    return sobject;
  }
  getWayFromRelation(nodeId,relation){
    if(!relation.refOb) return;
    let aimIds = [];
    return aimIds
  }
  updateSObjectForm (collection,sobjectId, entity) {
    let sobject = collection.find(el=>el.id==sobjectId);
    let entityId = entity.id.replace(/[^0-9]/ig, '');
    let form = sobject.forms.find(el => el.geom == entity.id)
    form.geom = entity;
    if (form.type < 30) {
      // form.geomref = this.toNum(entityId);
      form.formref.refid = this.toNum(entityId)

    }else {
      // form.geomref = entityId;
      if(entity.flag==1) {
        form.geomref = 0;
        form.formref.geometry = null;
      }
      if( typeof form.formref.refid=='string' && form.formref.refid.search(/[a-zA-Z]+/)>-1){
        form.formref.refid = 0;
      }

    }
    if (entity.flag == 1) {
      sobject.modifyForm(form);
    }else if (entity.flag == 2) {
      sobject.modifyForm(form)
    }else if (entity.flag == 3) {
      sobject.deleteForm(form)
    };
    
    return sobject
  }
}


const addObj=(arr,obj)=>{
  let index = arr.findIndex(el=>el.id==obj.id);
  if(index>-1){
    arr.splice(index,1,obj);
  }else{
    arr.push(obj);
  }
}

let editSave = new EditSave()

export default editSave