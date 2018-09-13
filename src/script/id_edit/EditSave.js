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
            addObj(result,way)
          })

          el.orgData.forms.forEach(ev=>{
            if(ev.geotype==21){
              let node = new osm.OsmNode(context.entity(ev.geom));
              addObj(result,node);
            }else{
              let way = new osm.OsmWay();
              way.setOsmWay(context,context.entity(ev.geom));
              addObj(result,way)
            }
          })
        }
        entity = new osm.OsmNode(el);
      }else if(el.type ==='way'){
        entity = new osm.OsmWay();
        entity.setOsmWay(context,el)
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

    let ways = _osmChange.filter(el=>el.type == 'Way');

    ways.forEach(way=>{
      way.nodes.forEach((el,k)=>{
        let i = _osmChange.findIndex(ev=>ev.id==el.id);
        if(i>-1){
          let node = _osmChange[i];
          way.nodes.splice(k,1,node);
        }; 
      })
    });
    deleted.forEach(el=>{
      if(el['@type']==='Node'){
        let way = _osmChange.find(ev=>ev.refOb.id==el.refOb.id);
        if(way){
          way.nodes.push(el);
        }
      }
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
      console.log(entity.id,55555555)
      // let sobject = idedit.getSObjectByListOsmEntity(resultSobjectList, entity.id);
      let sobject = idedit.getSObjectByListOsmEntity(idedit.sobjectlist, entity.id)
      if (sobject == null) {
        // sobject = idedit.getSObjectByListOsmEntity(idedit.sobjectlist, entity.id)
      }else{
        console.log(entity.id,sobject)
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
        form.geom.clearId();
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

let editSave = new EditSave()

export default editSave
