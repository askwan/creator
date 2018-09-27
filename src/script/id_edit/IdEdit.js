import psde from '@/psde'
import _assign from 'lodash-es/assign'
import _cloneDeep from 'lodash-es/cloneDeep'
import { objectQuery } from '../../psde/objectService'
import SObjectGraph from '../mapbox/SObjectGraph'
import { vm, operate } from '@/script/operate'
import { select as d3_select } from 'd3-selection'
// import {operationDelete} from '@/iD-2.7.1/modules/operations/delete'
import { relationArr } from '@/script/allOtype'
import editsave from './EditSave'
import {actionChangeTags} from '@/iD-2.7.1/modules/actions/change_tags'

const TYPE = {
  point: 21,
  vertex:21,
  line: 22,
  area: 23,
  relation:24
}

let nodeType = {
  node: 1,
  vertex:1,
  way: 2,
  relation: 3
}

let geomType = {
  node: 21,
  vertex:21,
  way: 22,
  area: 23,
  relation:24
}
let relationRandomId = 1
class IdEdit {
  constructor (osmContent) {
    this.sobjectlist = {}

    // 当前编辑的数据集
    this.currentGraph = new SObjectGraph()
  }
  initEdit (osmContent) {
    this.osmContent = osmContent
    osmContent.on('selectEle', ele => {
      // let tags = {name:'askwan'};
      if(ele){
        console.log(osmContent.entity(ele));
        // let entity = osmContent.entity(ele);
        // if(entity.type=='relation'){
        //   entity.members.forEach(el=>{
        //     let way = osmContent.entity(el.id);
        //     way.nodes.forEach(node=>{
        //       console.log(osmContent.entity(node),node,osmContent.entity(node).type)
        //     })
        //   })
        // }
      }
      // let relations = relationArr();
      // relations = JSON.stringify(relations);
      // relations = JSON.parse(relations);
      // let reForm,aimRelation;
      // relations.forEach(relation=>{
      //   reForm = relation.members.find(member=>member.id==ele);
      //   if(reForm){
      //     aimRelation = relation
      //   }
      // })
      // if(aimRelation){
      //   ele = aimRelation.id;
      // }

      if (this.aimForm) {
        this.currentSobject.forms.forEach(form => {

          if (form.id == this.aimForm.id) {
            form.geom = ele
          // form.formref = ele
          // form.geomref = ele
          }

        })
        this.updateAndHistory(this.currentSobject)
        this.aimForm = null
        return vm.$emit(operate.currentObject, this.currentSobject)
      }
      if (!ele) {
        vm.$emit(operate.currentObject, {})
        vm.$emit(operate.getOsmType, {type: 1})
        return
      }
      let entityId = ele;
      let aimSobject = this.getSObjectByOsmEntity(entityId);
      // console.log(aimSobject,55555555);
      // console.log(osmContent.entity(ele));
      vm.$emit(operate.currentObject, aimSobject);
      let entity = ele.replace(/[^0-9]/ig, '')
      vm.$emit(operate.currentForm,entity);
      if (!aimSobject) {
        let type = TYPE[osmContent.geometry(entityId)]
        vm.$emit(operate.getOsmType, {
          type: type,
          entityId: entityId
        })
      }
    })
  }
  setTool (style, otype, modeOptions) {
    
    let geotype = modeOptions.form.geotype
    if (geotype == 21) {
      d3_select('.add-point').nodes()[0].click()
    }else if (geotype == 22) {
      d3_select('.add-line').nodes()[0].click()
    }else if (geotype == 23) {
      d3_select('.add-area').nodes()[0].click()
    }
    this.setPosition(style, otype, modeOptions)
  }
  createSobject (entityId, otype, formType, geoType) {
    let sobject = this.currentGraph.createSobjectByOsmEntityId(entityId, otype, formType, geoType)
    this.modifySobject(sobject)
    this.sobjectlist[sobject.id] = sobject
    vm.$emit(operate.currentObject, sobject)
  }
  modifySobject (sobject) {
    this.currentGraph.updateSObject(sobject)    
    console.log('更新', this.currentGraph)
  // console.log(this.sobjectlist)
  }
  modifyAttr(attr,sobject){
    let tags = {};
    let newTag = {};
    let ele = sobject.forms[0].geom;
    let bool = sobject.forms.find(el=>el.geotype == 23);
    if(bool) tags.area = 'yes';
    attr.forEach(el=>tags[el.name]=el.value);
    let oldTag = this.osmContent.entity(ele).tags;
    Object.assign(newTag,oldTag,tags)
    this.osmContent.perform(actionChangeTags(ele,newTag), '修改属性');
    sobject.modifyAttr(attr)
    this.modifySobject(sobject);
    console.log(sobject,77777777)
  }
  loadBoxSObject (minx, maxx, miny, maxy, callback) {
    objectQuery.getBoxSObject(minx, maxx, miny, maxy).then(res => {
      // 更新当前sobject
      console.log(res.list,'44444000000')
      this.addSobject(res.list)
      callback(res.list)
    })
  }
  addSobject (sobjects) {
    this.sobjectlist[sobjects.id] = sobjects
  }
  getSObjectByOsmEntity (entityId) {
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
  getSObjectByListOsmEntity (sobjects, entityId) {
    let aimobj = null;
    // if(typeof entityId !=='string') entityId = entityId.id;
    for (let key in sobjects) {
      let sobject = sobjects[key]
      for (let i = 0;i < sobject.forms.length;i++) {
        let form = sobject.forms[i];
        if(!form.geom) continue
        // console.log(id,entityId);
        // let id = form.geom.replace(/[^0-9]/ig,"");
        if (form.geom == entityId) {
          aimobj = sobject
        }
      }
    }
    return aimobj
  }
  getSobjectById (sid) {
    if (this.currentGraph.sobjectList[sid]) {
      return this.currentGraph.sobjectList[sid]
    }
    if (this.sobjectlist[sid]) {
      return this.sobjectlist[sid]
    }
    return null
  }
  saveEdit (context) {
    let resultSobjectList = editsave.getSaveSObject(context, this)
    return resultSobjectList
  }
  clearGraph () {
    this.currentGraph.clearSobject();
    vm.$emit(operate.currentObject, {})
    vm.$emit(operate.getOsmType, {type: 1})
  }
  selectSobjects () {
    let ids = this.osmContent.selectedIDs()
    let sobjects = []
    ids.forEach(id => {
      let sobj = this.getSObjectByOsmEntity(id)
      sobjects.push(sobj)
    })
    return sobjects
  }
  setPosition (style, otype, modeOptions) {
    this.currentSobject = modeOptions.sobject
    this.aimForm = modeOptions.form
  }
  addObjectForm (sobject, form) {
    sobject.addForm(form);
    console.log(sobject,777777777);
    this.updateAndHistory(sobject)
  }
  updateAndHistory (sobject) {
    this.currentGraph.updateSObject(sobject)
    vm.$emit(operate.currentObject, sobject)
  }
  deleteObjectForm (sobject, form) {
    sobject.deleteForm(form);
    
    this.updateAndHistory(sobject)
  }
  modifyObjectForm (sobject, form) {
    sobject.modifyForm(form)
    this.updateAndHistory(sobject)
  }
  deleteSObjectNetwork (srcObject, relation) {
    srcObject.deleteNetworkNode(relation)
    this.updateAndHistory(srcObject)
  }
  modifySObjectNetwork (srcObject, relation) {
    srcObject.modifyNetworkNode(relation)
    this.updateAndHistory(srcObject)
  }
  querySObjectByOType (sobjectlist, oytpeId) {
    let result = []
    for (let i = 0;i < sobjectlist.length;i++) {
      let sobject = sobjectlist[i]
      if (sobject.otype.id == oytpeId) {
        result.push(sobject)
      }
    }
    return result
  }
  createSObjectNetwork (srcObject, tagObject, relation) {
    let node = new psde.RNode()
    node.oType = {
      id: tagObject.otype.id,
      name: tagObject.otype.name
    }
    // node.id = tagObject.id
    node.id = relationRandomId++
    node.label = tagObject.name
    //  node.relatedObjectId = tagObject.uuid
    node.relatedObjectId = tagObject.id
    node.edge = new psde.REdge()
    node.edge.relation = relation
    // srcObject.network.nodes.push(node)

    srcObject.addNetworkNode(node)
    this.updateAndHistory(srcObject)
    return node
  }
}

let edit = new IdEdit()

export default edit
