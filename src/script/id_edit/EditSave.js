import osm from '@/psde/form/osm'
import { allOtype, getOtypeById,relationArr } from '@/script/allOtype'

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
  

  formateOsm(context,arr,flag){
    let result = [];
    arr.forEach(el=>{
      let entity;
      if(el.type==='node'){
        if(context.geometry(el.id)==='vertex'){
          if(!el.orgData) return
          let ways = context.getParents(el.id);

          ways.forEach(w=>{
            let way = new osm.OsmWay();
            way.setOsmWay(context,context.entity(w));
            addObj(result,way);
            let res = context.getRelations(w);
            res.forEach(r=>{
              let relation = new osm.OsmRelation();
              relation.setOsmRelation(context,context.entity(r));
              console.log(relation,'relationssssssssssssssss')
              addObj(result,relation)
            })

          })


          el.orgData.forms.forEach(ev=>{
            if(ev.geotype==21){
              let node = new osm.OsmNode(context.entity(ev.geom));
              addObj(result,node);
            }else if(ev.geotype==23||ev.geotype==22){
              let way = new osm.OsmWay();
              way.setOsmWay(context,context.entity(ev.geom));
              addObj(result,way)
            }else if(ev.geotype==24){
              let relation = new osm.OsmRelation();
              relation.setOsmRelation(context,context.entity(ev.geom));
              addObj(result,relation)
            }
          })
        }
        entity = new osm.OsmNode(el);
      }else if(el.type ==='way'){
        entity = new osm.OsmWay();
        entity.setOsmWay(context,el);
        let relations = context.getRelations(entity.id);
        relations.forEach(r=>{
          let relation = new osm.OsmRelation();
          relation.setOsmRelation(context,context.entity(r));
          
          if(relation.flag!==1) relation.updateFlag(2);
          addObj(result,relation);
        })
      }else if(el.type==='relation'){
        entity = new osm.OsmRelation();
        entity.setOsmRelation(context,el)
      }
      entity.updateFlag(flag);
      addObj(result,entity);
    });
    return result
  }

  getOsmChanges1(context){
    let changes = context.changes();
    console.log(changes)
    let _osmChange = [];
    //created
    let created = this.formateOsm(context,changes.created,flagType.created);
    //modified
    let modified = this.formateOsm(context,changes.modified,flagType.modified);
    //deleted
    let deleted = this.formateOsm(context,changes.deleted,flagType.deleted);

    _osmChange = _osmChange.concat(created,modified,deleted);

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
            entity.members.forEach(member=>{
              if(member.type=='way'){
                console.log(member)
                member.refEntity.nodes.push(el);
              }
            })
          }
          console.log(entity,'entity')
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
          // console.log(member.refEntity,5555);
          if(!member.refEntity){
            // member
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
    let currentGraph = idedit.currentGraph
    let resultSobjectList = []
    // let osmCollection = this.getOsmChanges(context);
    let osmCollection = this.getOsmChanges1(context);
    console.log(osmCollection,456664)
    // 检测osm变化，currentgraph未检测到的变化
    for (let key in currentGraph.sobjectList) {
      let sobject = currentGraph.sobjectList[key];
      this.addSObjectList(resultSobjectList, sobject)
    }

    for (var key in osmCollection) {
      let entity = osmCollection[key];

      // let sobject = idedit.getSObjectByListOsmEntity(resultSobjectList, entity.id);
      let sobject = idedit.getSObjectByListOsmEntity(idedit.sobjectlist, entity.id)
      if (sobject == null) {
        // console.log(idedit.sobjectlist,9999);
      }else{
        let bool = adjustChange(entity);
        if(!bool) continue;
        this.updateSObjectForm(sobject, entity)
        this.addSObjectList(resultSobjectList, sobject);
        // entity.clearId();
      }
      // if (sobject != null) {
      //   console.log(sobject,99999999999)
      //   let bool = adjustChange(entity);
      //   if(!bool) continue;
      //   this.updateSObjectForm(sobject, entity)
      //   this.addSObjectList(resultSobjectList, sobject)
      // }
    };

    //删除没有form的sobject;
    resultSobjectList.forEach(el=>{
      if(el.forms.length==0){
        el.deleteObject();
      }
    })
    
    // let trans = JSON.stringify(resultSobjectList);

    // resultSobjectList = JSON.parse(trans);

    resultSobjectList.forEach(obj => {
      obj.otype = {id: obj.otype.id};
      obj.forms.forEach(form => {
      	if ((form.style instanceof Array) && form.style.length>0) {
      		form.style = JSON.stringify(form.style);
      	} else{
      		form.style = "";
        }
        if(typeof form.geom =='object'){
          form.geom.clearId();
        }
      })
    })
    // resultSobjectList.forEach(obj=>{
    //   obj.forms.forEach(form=>{
    //     if(form.geom && form.geom.includes('RELATION')){
    //       form.geotype= 24;
    //     };
        
    //   })
    // });

    // console.log(resultSobjectList, osmCollection, currentGraph, '保存');
    return resultSobjectList
  }
  updateSObjectForm (sobject, entity) {
    let entityId = entity.id.replace(/[^0-9]/ig, '');
    let form = sobject.forms.find(el => el.geom == entity.id)
    form.geom = entity;
    form.formref.geometry = entity;

    if (form.type < 30) {
      form.formref.refid = entityId
      form.geomref = entityId;
    }else {
      form.geomref = entityId;
      
      if( typeof form.formref.refid=='string' && form.formref.refid.search(/[a-zA-Z]+/)>-1){
        form.formref.refid = 0;
      }

    }
    // console.log(typeof form.id =='number',form.id)
    if (entity.flag == 1) {
      sobject.modifyForm(form)
    }else if (entity.flag == 2) {
      sobject.modifyForm(form)
    }else if (entity.flag == 3) {
      sobject.deleteForm(form)
    }
    
  }
  addSObjectList (sobjectlist, sobject) {
    let idx = sobjectlist.findIndex(el => el.id == sobject.id)
    if (idx == -1) {
      sobjectlist.push(sobject)
    }
  }

}

const getRelationByMember=(member)=>{
  let aimRelation;
  let relationArrs = relationArr();
  relationArrs.forEach(relation=>{
    relation.members.forEach(el=>{
      if(el.id==member.id){
        aimRelation = relation;
      }
    })
  })
  return aimRelation
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

const getRoot = arr => {
  arr.forEach(entity=>{

  })
}

let editSave = new EditSave()

export default editSave
