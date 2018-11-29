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
import {objectServer} from '@/script/server'

import { dispatch as d3_dispatch } from 'd3-dispatch';
import { select as d3_select } from 'd3-selection';
import _debounce from 'lodash-es/debounce';
import {utilRebind}  from './id-editor/modules/util/rebind'
import {actionAddEntity,actionChangeTags,actionAddVertex,actionClose} from '@/script/editor/id-editor/modules/actions'
import { osmNode, osmRelation, osmWay } from '@/script/editor/id-editor/modules/osm'

import { State } from './utils/store'
import SObjectGraph from './utils/SObjectGraph'
import editsave from './utils/EditSave'

import {RelationOperate,Delete} from './operates'
import SObject from './psde/psdm/SObject';

let n = 1000;
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
    this.isChanges = false;
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
        let entity = this.idContext.entity(ele);
        console.log(entity);
        
      }
      if(this.currentSobject&&this.currentForm) {
        let _form = this.currentSobject.forms.find(el=>el.id==this.currentForm.id);
        if(_form){
          _form.geom = ele;
          _form.geomref = ele;
          this.updateAndHistory(this.currentSobject)
        };
        dispatch.call('currentObject',this,{object:this.currentSobject,entity:ele});
        return
      }
      let sobject, form;
      for(let id in State.sobjects){
        sobject = State.sobjects[id];
        sobject.otype = State.findOtypeById(sobject.otype.id);
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

  setSObject(sobject){
    let _sobject = new SObject();
    _sobject.copyObject(sobject);
    this.currentSobject = _sobject;
    this.sobjectlist[_sobject.list] = _sobject;
    dispatch.call('currentObject',this,{object:_sobject,entityId:null})
  }
  enableSobject(objId){
    // console.log(objId);
    // enableObject(objId);
    let features = this.idContext.features();
    features.enable(objId);
  }
  disableSobject(objId){
    // disableObject(objId);
    // console.log(objId)
    let features = this.idContext.features();
    features.disable(objId);
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
    this.idContext.features().setFeature(sobject);
    dispatch.call('currentObject',this,{object:sobject,entityId:entityId});
  }
  modifySobject (sobject) {
    this.currentGraph.updateSObject(sobject)    
    // console.log('更新', this.currentGraph)
  }
  modifyAttr(attr,sobject){
    try {
      let tags = {};
      let newTag = {};
      let ele = sobject.forms[0].geom;
      let bool = sobject.forms.find(el=>el.geotype == 23);
      if(bool) tags.area = 'yes';
      attr.forEach(el=>tags[el.name]=el.value);
      let oldTag = this.idContext.entity(ele).tags;
      Object.assign(newTag,oldTag,tags)
      this.idContext.perform(actionChangeTags(ele,newTag), '修改属性');
    } catch (error) {
      
    }
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
    // console.log(JSON.stringify(json));
    // return 
    let token = localStorage.getItem('token');
    if(!json.length) return dispatch.call('notice',this,{title:'提示',message:'未检测到变更'});
    if (isAjax) {
      isAjax = false;
      objectServer.save(json).then(res=>{
        isAjax = true
        if (res.status == 200) {
          this.flush();
          dispatch.call('notice',this,{
            type:'success',
            title:'成功',
            message:'保存成功'
          });
        }else {
          dispatch.call('notice',this,{
            type:'error',
            title:'错误',
            message:'保存失败'
          })
        };
      })
      .catch(err=>{
        dispatch.call('notice',this,{
          type:'error',
          title:'错误',
          message:err
        })
      })
      // psde.psdeApi.post(`/object/saveObject?token=${token}`, json).then((result) => {
      //   isAjax = true
      //   if (result.data.status == 200) {
      //     // context.flush();
      //     // this.clearGraph();
      //     this.flush();
      //     dispatch.call('notice',this,{
      //       type:'success',
      //       title:'成功',
      //       message:'保存成功'
      //     });
      //   }else {
      //     dispatch.call('notice',{
      //       type:'error',
      //       title:'错误',
      //       message:'保存失败'
      //     })
      //   };
      // },()=>{
      //   dispatch.call('notice',{
      //     type:'error',
      //     title:'错误',
      //     message:'保存失败'
      //   })
      // })
    }
  }
  clearGraph () {
    this.currentGraph.clearSobject();
    this.isChanges = false;
    State.relations = [];
    State.sobjects = {};
    State.ways = {};
    dispatch.call('currentObject',this,{object:null,entityId:null});
  }
  flush(){
    this.clearGraph();
    State.clear();
    this.idContext.flush();
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
    this.isChanges = true;
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
    node.show = true;
    srcObject.addNetworkNode(node)
    this.updateAndHistory(srcObject)
    return node
  }
  deleteNetwork(sobjectid,nodeId){
    let sobject = State.sobjects[sobjectid];
    sobject.deleteNetworkNode({id:nodeId});
    this.updateAndHistory(sobject);
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
  modifyRealTime(object,time){
    let sobject = this.getSobjectById(object.id);
    sobject.realTime = time;
    sobject.modifyObject(sobject);
    this.updateAndHistory(sobject)
  }
  filterObjectByOtype(arr){
    for(let id in State.otypes){
      let showId = arr.find(el=>el==id);
      if(showId){
        this.idContext.features().enable(id);
      }else{
        this.idContext.features().disable(id);
      }
    }


    

    // this.flush();
    // _debounce(this.flush,350);
  }
  zoomOut(){
    this.idContext.zoomOut();
  }
  zoomIn(){
    this.idContext.zoomIn();
  }

  cloneObject(){
    let newSobject = new SObject();
    let str = JSON.stringify(this.currentSobject);
    newSobject.copyObject(JSON.parse(str));
    newSobject.id = n++;
    newSobject.createObject(newSobject);
    // console.log(newSobject,'new')
    this.currentSobject = newSobject;

    newSobject.forms.forEach(form=>{
      let entity = this.copyEntity(form.geom);
      form.geom = entity.id;
      form.geomref = entity.id;
    })
    newSobject.uuid = null;
    newSobject.version = {};
    this.sobjectlist[newSobject.id] = newSobject;
    State.sobjects[newSobject.id] = newSobject;
    this.idContext.features().setFeature(newSobject);
    this.updateAndHistory(newSobject);
    this.idContext.selectEle(newSobject.forms[0].geom)
    // dispatch.call('currentObject',this,{object:newSobject,entityId:newSobject.forms[0].geom});
    dispatch.call('notice',this,{
      message:`克隆对象：${newSobject.id}成功`,
      type:'success'
    })
  }
  copyEntity(ele){
    let entity = this.idContext.entity(ele);
    if(entity.type=='way'){
      return this.createWay(entity);
    }else if(entity.type=="node"){
      return this.createNode(entity);
    }else if(entity.type=='relation'){
      return this.createRelation(entity);
    }
  }
  createNode(entity){
    let node = osmNode({loc:entity.loc});
    this.idContext.perform(actionAddEntity(node),actionChangeTags(node.id,entity.tags));
    return node;
  }
  createWay(entity){
    let way = osmWay({ tags: entity.tags });
    this.idContext.perform(actionAddEntity(way));
    entity.nodes.forEach(nodeId=>{
      let _node = this.idContext.entity(nodeId);
      let node = osmNode({loc:_node.loc});
      this.idContext.perform(actionAddEntity(node));

      this.idContext.perform(
        actionAddVertex(way.id, node.id),
        actionClose(way.id)
      )
    });
    return way
  }
  createRelation(entity){
    let newRelation = this.relationOperate.createRelation();
    entity.members.forEach(member=>{
      let _member = this.idContext.entity(member.id);
      let newMember = {},_entity;
      if(_member.type=='way'){
        _entity = this.createWay(_member);
      }else if(_member.type=='node'){
        _entity = this.createNode(_member);
      }else if(_member.type=='relation'){
        _entity = this.createRelation(_member);
      }
      if(!_entity) return dispatch.call('notice',{message:'创建失败'})
      newMember.id = _entity.id;
      newMember.index = 1;
      newMember.role = member.role;
      this.relationOperate.setRole(newMember,newRelation.id)
    });
    return newRelation;
  }









}
