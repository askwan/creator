import * as iD from './id-editor/modules';

// import "./id-editor/css/00_reset.css";
// import "./id-editor/css/20_map.css";
// import "./id-editor/css/25_areas.css";
// import "./id-editor/css/30_highways.css";
// import "./id-editor/css/35_aeroways.css";
// import "./id-editor/css/40_railways.css";
// import "./id-editor/css/45_waterways.css";
// import "./id-editor/css/50_misc.css";
// import "./id-editor/css/55_cursors.css";
// import "./id-editor/css/60_photos.css";
// import "./id-editor/css/70_fills.css";
// import "./id-editor/css/80_app.css";
import psde from './psde';

import { dispatch as d3_dispatch } from 'd3-dispatch';
import { select as d3_select } from 'd3-selection';
import {utilRebind}  from './id-editor/modules/util/rebind'
import {actionChangeTags} from './id-editor/modules/actions/change_tags'

import { State,findOtypeById } from './utils/store'
import SObjectGraph from './utils/SObjectGraph'
import editsave from './utils/EditSave'

import {RelationOperate,Delete} from './operates'


const dispatch = d3_dispatch('currentObject','notice')

var relationRandomId = 1;
let isAjax = true;
export default class Editor {
  constructor(options={}){
    this.options = {};
    Object.assign(this.options,options);
    this.currentGraph = new SObjectGraph();
    this.sobjectlist = {};
    this.currentSobject = null;
    this.currentRelation = null;
    this.currentForm = null;
  }
  config(obj){
    Object.assign(this.options,obj);
  }
  init(dom,callback){
    this.idContext = iD.Context().assetPath("static/")
    this.idContext.ui()(dom,()=>{
      this.idContext.flush();
      utilRebind(this,dispatch,'on');
      this.listen();
      //operate
      this.relationOperate = new RelationOperate(this.idContext);
      this.deleteOperate = Delete;
      if(callback) callback(this.idContext);
    });
  }
  listen(){
    this.idContext.on('selectEle',ele=>{
      if(!ele) return dispatch.call('currentObject',this,{object:null,entityId:null});
      if(ele){
        
        let relation = State.findRelationByMember(ele);
        if(relation){
          ele = relation.id;
          this.relationOperate.highLightEntity([ele])
        } 
          
      }
      if(this.currentSobject&&this.currentForm) {
        let _form = this.currentSobject.forms.find(el=>el.id==this.currentForm.id);
        if(_form){
          _form.geom = ele;
        }
        dispatch.call('currentObject',this,{object:this.currentSobject,entity:ele});
        return
      }
      let sobject, form;
      for(let id in State.sobjects){
        sobject = State.sobjects[id];
        sobject.otype = findOtypeById(sobject.otype.id);
        if(sobject.forms && sobject.forms instanceof Array){
          form = sobject.forms.find(el=>el.geom==ele);
          if(form) break;
        }
      };
      this.currentRelation = null;
      this.currentSobject = null;
      this.currentForm = null;
      if(form){
        this.currentSobject = sobject;
        dispatch.call('currentObject',this,{object:sobject,entityId:ele})
      }else{
        dispatch.call('currentObject',this,{object:null,entityId:ele});
      }
    });
    this.idContext.on('saveObjects',context=>{
      this.saveEdit(context);
    })
  }



  setTool (style, otype, modeOptions) {
    let geotype = modeOptions.form.geotype;
    this.currentForm = modeOptions.form;
    if (geotype == 21) {
      d3_select('.add-point').nodes()[0].click();
    }else if (geotype == 22) {
      d3_select('.add-line').nodes()[0].click();
    }else if (geotype == 23) {
      d3_select('.add-area').nodes()[0].click();
    };
  }
  createSobject (entityId, otype, formType, geoType) {
    let sobject = this.currentGraph.createSobjectByOsmEntityId(entityId, otype, formType, geoType);
    this.currentSobject = sobject;
    this.modifySobject(sobject)
    this.sobjectlist[sobject.id] = sobject;
    State.sobjects[sobject.id] = sobject;
    dispatch.call('currentObject',this,{object:sobject,entityId:entityId})
  }
  modifySobject (sobject) {
    this.currentGraph.updateSObject(sobject)    
    // console.log('更新', this.currentGraph)
  }
  modifyAttr(attr,sobject){
    let tags = {};
    let newTag = {};
    let ele = sobject.forms[0].geom;
    let bool = sobject.forms.find(el=>el.geotype == 23);
    if(bool) tags.area = 'yes';
    attr.forEach(el=>tags[el.name]=el.value);
    let oldTag = this.idContext.entity(ele).tags;
    Object.assign(newTag,oldTag,tags)
    this.idContext.perform(actionChangeTags(ele,newTag), '修改属性');
    sobject.modifyAttr(attr)
    this.modifySobject(sobject);
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
    for (let key in sobjects) {
      let sobject = sobjects[key]
      for (let i = 0;i < sobject.forms.length;i++) {
        let form = sobject.forms[i];
        if(!form.geom) continue
        if (form.geom == entityId) {
          aimobj = sobject
        }
      }
    }
    return aimobj
  }
  getSobjectById (sid) {
    return State.sobjects[sid];
  }
  saveEdit (context) {
    let json = editsave.getSaveSObject(context, this);
    console.log(json,'save');

    return 
    let token = localStorage.getItem('token');
    if(!json.length) return dispatch.call('notice',this,{title:'提示',message:'未检测到变更'});
    if (isAjax) {
      isAjax = false;
      psde.psdeApi.post(`/object/saveObject?token=${token}`, json).then((result) => {
        isAjax = true
        if (result.data.status == 200) {
          context.flush();
          this.clearGraph();
          dispatch.call('notice',this,{
            type:'success',
            title:'成功',
            message:'保存成功'
          });
        }else {
          dispatch.call('notice',{
            type:'error',
            title:'错误',
            message:'保存失败'
          })
        };
      },()=>{
        dispatch.call('notice',{
          type:'error',
          title:'错误',
          message:'保存失败'
        })
      })
    }
  }
  clearGraph () {
    this.currentGraph.clearSobject();
    dispatch.call('currentObject',this,{object:null,entityId:null});
  }
  selectSobjects () {
    let ids = this.idContext.selectedIDs()
    let sobjects = []
    ids.forEach(id => {
      let sobj = this.getSObjectByOsmEntity(id)
      sobjects.push(sobj)
    })
    return sobjects
  }
  addObjectForm (sobject, form) {
    sobject.addForm(form);
    this.updateAndHistory(sobject)
  }
  updateAndHistory (sobject) {
    this.currentGraph.updateSObject(sobject);
    dispatch.call('currentObject',this,{object:sobject,entityId:null});
  }
  deleteObjectForm (sobject, form) {
    sobject.deleteForm(form);
    this.deleteOperate.deleteEntity(this.idContext,form.geom);
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
    let node = new psde.RNode();
    let bbox = tagObject.geoBox;
    node.point.x = (bbox.minx+bbox.maxx)/2;
    node.point.y = (bbox.miny+bbox.maxy)/2;
    node.point.z = (bbox.minz+bbox.maxz)/2;
    node.oType = {
      id: tagObject.otype.id,
      name: tagObject.otype.name
    }
    node.id = relationRandomId++
    node.label = tagObject.name
    node.relatedObjectId = tagObject.id
    node.edge = new psde.REdge()
    node.edge.relation = relation
    srcObject.addNetworkNode(node)
    this.updateAndHistory(srcObject)
    return node
  }
  updateParent(object){
    if(!object){
      this.currentSobject.deleteParent(object);
    }else{
      this.currentSobject.addParent(object);
    }
    this.updateAndHistory(this.currentSobject);
  }
  deleteParent(obj){
    this.currentSobject.deleteParent(obj);
    this.updateAndHistory(this.currentSobject);
  }
  updateObject(object){
    let sobject = this.getSobjectById(object.id);
    sobject.modifyObject(object);
    this.updateAndHistory(object)
  }









}
