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
  getOsmChanges (context) {
    var osmChanges = context.history().difference().summary()

    console.log(context.history());
    console.log(context.history().changes())

    // return;
    let osmCollection = [];
    osmChanges.forEach(change => {
      
      
      

      let flag = flagType[change.changeType]

      let entity = null
      if (change.entity.type === 'node') {
        entity = new osm.OsmNode(change.entity)
        entity.updateFlag(flag)
      }else if (change.entity.type === 'way') {
	  		entity = new osm.OsmWay(change)
	  		entity.updateFlag(flag)   
      }else if (change.entity.type === 'relation') {
        entity = new osm.OsmRelation(context,change)
        entity.updateFlag(flag)
      }

      osmCollection.push(entity)


      let relationModify = getRelationByMember(change.entity);

      if(relationModify&&change.changeType!="deleted"){
        relationModify.members.forEach(el=>{
          let wa = context.graph().hasEntity(el.id);
          let en = new osm.OsmWay();
          en.setOsmWay(context,wa);
          let rela = new osm.OsmRelation();
          rela.setOsmRelation(context,relationModify);
          rela.updateFlag(2)
          osmCollection.push(rela);
        })
      };


    })

    return osmCollection
  }

  getSaveSObject (context, idedit) {
    let currentGraph = idedit.currentGraph
    let resultSobjectList = []

    let osmCollection = this.getOsmChanges(context)

    // 检测osm变化，currentgraph未检测到的变化

    for (let key in currentGraph.sobjectList) {
      let sobject = currentGraph.sobjectList[key]
      this.addSObjectList(resultSobjectList, sobject)
    }

    for (let key in osmCollection) {
      let entity = osmCollection[key]
      let sobject = idedit.getSObjectByListOsmEntity(resultSobjectList, entity.id)
      if (sobject == null) {
        sobject = idedit.getSObjectByListOsmEntity(idedit.sobjectlist, entity.id)
      }
      if (sobject != null) {
        this.updateSObjectForm(sobject, entity)
        this.addSObjectList(resultSobjectList, sobject)
      }
    };
    //删除没有form的sobject
    resultSobjectList.forEach(el=>{
      if(el.forms.length==0){
        el.deleteObject();
      }
    })

    let trans = JSON.stringify(resultSobjectList);

    resultSobjectList = JSON.parse(trans);

    resultSobjectList.forEach(obj => {
      obj.otype = {id: obj.otype.id};
      obj.forms.forEach(form => {
      	if ((form.style instanceof Array) && form.style.length>0) {
      		form.style = JSON.stringify(form.style);
      	} else{
      		form.style = "";
        }
      })
    })
    resultSobjectList.forEach(obj=>{
      obj.forms.forEach(form=>{
        if(form.geom && form.geom.includes('RELATION')){
          form.geotype= 24;
        };
        
      })
    });

    console.log(resultSobjectList, osmCollection, currentGraph, '保存');
    return resultSobjectList
  }
  updateSObjectForm (sobject, entity) {
    let entityId = entity.id.replace(/[^0-9]/ig, '')
    let form = sobject.forms.find(el => el.geom == entity.id)
    form.geom = entity;
    console.log(form,'save')
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
      
      // sobject.addForm(form)
      // form.geomref = 0;
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

let editSave = new EditSave()

export default editSave
