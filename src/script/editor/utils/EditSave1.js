import osm from '../psde/form/osm'
import SObject from '../psde/psdm/SObject';
import {State} from './store';

let flagType = {
  created: 1,
  modified: 2,
  deleted: 3
}

let GEOMETRY = {
  21:'node',
  22:'way',
  23:'way',
  24:'relation'
}

class EditSave {
  constructor () {}
  /**
  获取osm变化集
   */
  
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
          let ways = context.getParents(el.id);

          ways.forEach(w=>{
            // let way = new osm.OsmWay();
            // way.setOsmWay(context,context.entity(w));
            let way = this.createWay(context,context.entity(w));
            addObj(result,way);
            let res = context.getRelations(w);
            res.forEach(r=>{
              // let relation = new osm.OsmRelation();
              // relation.setOsmRelation(context,context.entity(r));
              let relation = this.createRelation(context,context.entity(r));
              addObj(result,relation)
            })

          })


          el.orgData.forms.forEach(ev=>{
            if(ev.geotype==21){
              // let node = new osm.OsmNode(context.entity(ev.geom));
              let node = this.createNode(context,context.entity(ev.geom));
              addObj(result,node);
            }else if(ev.geotype==23||ev.geotype==22){
              // let way = new osm.OsmWay();
              // way.setOsmWay(context,context.entity(ev.geom));
              let way = this.createWay(context,context.entity(ev.geom));
              addObj(result,way)
            }else if(ev.geotype==24){
              // let relation = new osm.OsmRelation();
              // relation.setOsmRelation(context,context.entity(ev.geom));
              let relation = this.createRelation(context,context.entity(ev.geom));
              addObj(result,relation)
            }
          })
        }
        // entity = new osm.OsmNode(el);
        entity = this.createNode(context,el);
      }else if(el.type ==='way'){
        // entity = new osm.OsmWay();
        // entity.setOsmWay(context,el);
        entity = this.createWay(context,el)
        let relations = context.getRelations(entity.id);
        relations.forEach(r=>{
          // let relation = new osm.OsmRelation();
          // relation.setOsmRelation(context,context.entity(r));
          let relation = this.createRelation(context,context.entity(r));
          if(relation.flag!==1) relation.updateFlag(2);
          addObj(result,relation);
        })
      }else if(el.type==='relation'){
        // entity = new osm.OsmRelation();
        // entity.setOsmRelation(context,el)
        entity = this.createRelation(context,el);
      }
      entity.updateFlag(flag);
      addObj(result,entity);
    });
    return result
  }

  getOsmChanges1(context,Idedit){
    let changes = context.changes();
    let _osmChange = [];
    //created
    let created = this.formateOsm(context,changes.created,flagType.created);
    //modified
    let modified = this.formateOsm(context,changes.modified,flagType.modified);
    //deleted
    let deleted = this.formateOsm(context,changes.deleted,flagType.deleted);

    let sobjectCanged = Idedit.currentGraph;
    let sArr = [];
    for(let id in sobjectCanged.sobjectList){
      let s = sobjectCanged.sobjectList[id]
      s.forms.forEach(form=>{
        sArr.push(context.entity(form.geom));
      })
    }
    let _change = this.formateOsm(context,sArr,flagType.modified);


    _osmChange = _osmChange.concat(_change,created,modified,deleted);

    // _osmChange = getRoot(context,_osmChange)

    let ways = _osmChange.filter(el=>el.type == 'way');

    ways.forEach(way=>{
      way.nodes.forEach((el,k)=>{
        let i = _osmChange.findIndex(ev=>ev.id==el.id);
        if(i>-1){
          let node = _osmChange[i];
          way.nodes.splice(k,1,node);
        }; 
      });
      
    });
    
    deleted.forEach(el=>{
      if(el['@type']==='Node'){
        let entitys = _osmChange.filter(ev=>ev.refOb.id==el.refOb.id);
        if(entitys.length==0) return
        entitys.forEach(entity=>{
          if(entity['@type']=='Way'){
            entity.nodes.push(el);
          }else if(entity['@type']=='Relation'){
            
            let wayIds = getWayFromRelation(el.id,entity);
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
    })

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
      })
    })
    return _osmChange

  }

  getSaveSObject (context, idedit) {
    let currentGraph = idedit.currentGraph;
    let osmCollection = this.getOsmChanges1(context,idedit);
    // 检测osm变化，currentgraph未检测到的变化
    console.log(osmCollection,'osmCollecto')
    // return []
    //sobject变化集合
    let resultSobjectList = [];

    for (var key in osmCollection) {
      let entity = osmCollection[key];

      let sobject = idedit.getSObjectByListOsmEntity(currentGraph.sobjectList, entity.id);

      if (!sobject) {
        sobject = idedit.getSObjectByListOsmEntity(State.sobjects, entity.id);
        if(sobject) this.addSObjectList(resultSobjectList, sobject);
      }
      if(sobject){
        let bool = adjustChange(entity);
        if(!bool) continue;
        this.addSObjectList(resultSobjectList,sobject);
        this.updateSObjectForm(resultSobjectList,sobject.id, entity);
      }
    };

    for (let key in currentGraph.sobjectList) {
      let sobject = currentGraph.sobjectList[key];
      this.addSObjectList(resultSobjectList, sobject);
    }

    

    //删除没有form的sobject;
    resultSobjectList.forEach(el=>{
      if(el.forms.length==0){
        el.deleteObject();
      }
    })
    
    resultSobjectList.forEach(obj => {
      obj.otype = {id: obj.otype.id};
      obj.forms.forEach(form => {
        if(typeof form.formref.refid =='string'){
          form.formref.refid = this.toNum(form.formref.refid);
        }
      	if ((form.style instanceof Array) && form.style.length>0) {
      		form.style = JSON.stringify(form.style);
      	} else{
      		form.style = "";
        }
        
        if(typeof form.geom == 'string'){
          if(form.geotype==21){
            let entity = osmCollection.find(el=>el.id==form.geom);
            form.geom = entity || this.createNode(context,context.entity(form.geom));
          }else if((form.geotype==22) || (form.geotype==23)){
            let entity = osmCollection.find(el=>el.id==form.geom);
            form.geom = entity || this.createWay(context,context.entity(form.geom));
          }else if(form.geotype==24){
            let entity = osmCollection.find(el=>el.id==form.geom);
            form.geom = entity || this.createRelation(context,context.entity(form.geom));
          }
        }
        if(form.geom instanceof osm.OsmEntity){
          form.geom.clearId();
        }
      })
    })

    return resultSobjectList
  }
  updateSObjectForm (collection,sobjectId, entity) {
    let sobject = collection.find(el=>el.id==sobjectId);
    let entityId = entity.id.replace(/[^0-9]/ig, '');
    let form = sobject.forms.find(el => el.geom == entity.id)
    form.geom = entity;
    // return
    // form.formref.geometry = entity;

    if (form.type < 30) {
      form.formref.refid = this.toNum(entityId)
      form.geomref = this.toNum(entityId);

    }else {
      form.geomref = entityId;
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
  addSObjectList (sobjectlist, sobject) {
    let _sobject = this.clone(sobject);
    let idx = sobjectlist.findIndex(el => el.id == _sobject.id)
    if (idx == -1) {
      sobjectlist.push(_sobject)
    }else{
      _sobject.attributes = sobjectlist[idx].attributes;
      sobjectlist.splice(idx,1,_sobject);

    }
  }
  clone(s){
    let str = JSON.parse(JSON.stringify(s));
    let obj = new SObject();
    obj.copyObject(str);
    return obj;
  }
  toNum(str){
    return str.replace(/[^0-9]/ig,"")
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

const adjustChange = (entity)=>{
  let bool = true;
  if(entity.flag>0) return bool = true;
  if(entity['@type']==='Way'){
    let n = entity.nodes.find(node=>node.flag>0);
    if(n){
      bool = true
    }else{
      bool = false;
    }
  }
  return bool;
}

const getWayFromRelation = (nodeId,relation)=>{
  if(!relation.refOb) return;
  let aimIds = [];
  let forms = relation.refOb.forms;
  let form = forms.find(el=>el.formref.geometry.id==relation.id.replace(/[^0-9]/ig,""));
  if(form){
    let _relation = form.formref.geometry;
    _relation.members.forEach(member=>{

      if(member.id==nodeId.replace(/[^0-9]/ig,"")){
        aimId = [_relation.id];
      }else if(member.refEntity){
        let way = member.refEntity;
        let node = way.nodes.find(el=>el.id==nodeId.replace(/[^0-9]/ig,""));
        if(node) aimIds.push(way.id);
      }
  })
}
  return aimIds
}

let editSave = new EditSave()

export default editSave
