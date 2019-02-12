import * as iD from './id-editor/modules';
//some
console.log(iD, 'id')
import './id-editor/css/00_reset.css'
import './id-editor/css/20_map.css'
import './id-editor/css/25_areas.css'
import './id-editor/css/30_highways.css'
import './id-editor/css/35_aeroways.css'
import './id-editor/css/40_railways.css'
import './id-editor/css/45_waterways.css'
import './id-editor/css/50_misc.css'
import './id-editor/css/55_cursors.css'
import './id-editor/css/60_photos.css'
import './id-editor/css/65_data.css'
import './id-editor/css/70_fills.css'
import './id-editor/css/80_app.css'

import psde from './psde';
import {
  objectServer
} from '@/script/server'

import {
  dispatch as d3_dispatch
} from 'd3-dispatch';
import {
  select as d3_select
} from 'd3-selection';
import _debounce from 'lodash-es/debounce';
import {
  utilRebind
} from './id-editor/modules/util/rebind'
import {
  actionAddEntity,
  actionChangeTags,
  actionAddVertex,
  actionClose,
  actionUpdateOrgData
} from '@/script/editor/id-editor/modules/actions'
import {
  osmNode,
  osmWay
} from '@/script/editor/id-editor/modules/osm'

import {
  State
} from './utils/store'
import SObjectGraph from './utils/SObjectGraph'
import editsave from './utils/EditSave'

import {
  RelationOperate,
  Delete
} from './operates'
import SObject from './psde/psdm/SObject';
import {
  transformObject,
  calcGeoBox
} from './utils/parseToOsm/util.js';

let n = 1000;
const dispatch = d3_dispatch('currentObject', 'notice', 'loading','previewModel')
var relationRandomId = 1;
let isAjax = true;
export default class Editor {
  constructor(options = {}) {
    this.options = {};
    Object.assign(this.options, options);
    this.currentGraph = new SObjectGraph();
    this.sobjectlist = {};
    this.currentSobject = null;
    this.currentRelation = null;
    this.currentForm = null;
    this.isChanges = false;
    this.currentEntity = {};
  }
  config(obj) {
    Object.assign(this.options, obj);
  }
  init(dom, callback) {
    if (dom) {
      dom.innerHTML = '';
    }
    this.idContext = null;
    this.idContext = iD.Context().assetPath("static/");
    if (sessionStorage.getItem('sdomain')) {
      let domain = JSON.parse(sessionStorage.getItem('sdomain'));
      this.idContext.loadOptions({
        sdomains: domain.id
      });

    }
    this.idContext.ui()(dom, () => {
      this.idContext.flush();
      utilRebind(this, dispatch, 'on');
      this.listen();
      this.relationOperate = new RelationOperate(this.idContext);
      this.deleteOperate = Delete;
      if (callback) callback(this.idContext);
    });
  }
  listen() {
    this.idContext.on('selectEntity', ele => {
      if (!ele) {
        this.currentEntity = null;
        dispatch.call('currentObject', this, {
          object: null,
          entityId: null
        });
        return
      }

      if (ele) {
        let entity = this.idContext.entity(ele);
        // console.log(entity)
        this.currentEntity = entity;
      }

      // this.changeLoc({entityId:'n1086762917686247425',lat:114.28745136686429,lng:9.714856337064521})

      if (this.currentSobject && this.currentForm) {
        let _form = this.currentSobject.forms.find(el => el.id == this.currentForm.id);
        if (_form) {
          _form.geom = ele;
          _form.geomref = ele;
          this.updateAndHistory(this.currentSobject)
        };
        dispatch.call('currentObject', this, {
          object: this.currentSobject,
          entity: ele
        });
        this.previewModel(this.currentSobject);
        this.currentForm = null;
        return
      }
      let sobject, form;
      for (let id in State.sobjects) {
        sobject = State.sobjects[id];
        sobject.otype = State.findOtypeById(sobject.otype.id);
        if (sobject.forms && sobject.forms instanceof Array) {
          form = sobject.forms.find(el => el.geomref == ele);
          if (form) break;
        }
      };
      this.currentRelation = null;
      this.currentSobject = null;
      this.currentForm = null;
      if (form) {
        this.currentSobject = sobject;
        dispatch.call('currentObject', this, {
          object: sobject,
          entityId: ele
        })
        this.previewModel(sobject);
      } else {
        dispatch.call('currentObject', this, {
          object: null,
          entityId: ele
        });
      }

    });
    this.idContext.on('saveObjects', context => {
      this.saveEdit(context);
    })
  }

  setSObject(sobject) {
    let _sobject = new SObject();
    _sobject.copyObject(sobject);
    this.currentSobject = _sobject;
    this.sobjectlist[_sobject.list] = _sobject;
    dispatch.call('currentObject', this, {
      object: _sobject,
      entityId: null
    })
  }
  enableSobject(objId) {
    let features = this.idContext.features();
    features.enable(objId);
    State.showObject({
      id: objId
    })
  }
  disableSobject(objId) {
    let features = this.idContext.features();
    features.disable(objId);
    State.hiddenObject({
      id: objId
    })
  }



  setTool(modeOptions) {
    let geotype = modeOptions.form.geotype;
    this.currentForm = modeOptions.form;
    if (geotype == 21) {
      d3_select('.add-point').nodes()[0].click();
    } else if (geotype == 22) {
      d3_select('.add-line').nodes()[0].click();
    } else if (geotype == 23) {
      d3_select('.add-area').nodes()[0].click();
    };
  }
  createSobject(entityId, otype, formType, geoType) {
    let sobject = this.currentGraph.createSobjectByOsmEntityId(entityId, otype, formType, geoType);
    this.currentSobject = sobject;
    this.modifySobject(sobject)
    this.sobjectlist[sobject.id] = sobject;
    State.sobjects[sobject.id] = sobject;
    this.idContext.features().setFeature(sobject);
    sobject.geoBox = calcGeoBox(this.idContext, sobject);
    this.idContext.perform(actionUpdateOrgData(entityId, sobject));
    dispatch.call('currentObject', this, {
      object: sobject,
      entityId: entityId
    });
  }
  modifySobject(sobject) {
    this.currentGraph.updateSObject(sobject)
  }
  modifyOtype(sobject, otypeId) {
    sobject.modyifyOtype(State.otypes[otypeId]);
    this.modifySobject(sobject);
    dispatch.call('currentObject', this, {
      object: sobject,
      entityId: this.currentEntity.id
    });
  }
  modifyAttr(attr, sobject) {
    try {
      let tags = {};
      let newTag = {};
      let ele = sobject.forms[0].geom;
      let bool = sobject.forms.find(el => el.geotype == 23);
      if (bool) tags.area = 'yes';
      attr.forEach(el => tags[el.name] = el.value);
      let oldTag = this.idContext.entity(ele).tags;
      Object.assign(newTag, oldTag, tags)
      this.idContext.perform(actionChangeTags(ele, newTag), '修改属性');
    } catch (error) {

    }
    console.log(attr,'2222')
    sobject.modifyAttr(attr)
    this.modifySobject(sobject);
  }
  addSobject(sobjects) {
    this.sobjectlist[sobjects.id] = sobjects
  }
  changeVersion(obj) {
    State.setVersionObj(obj);
    this.idContext.loadOptions({
      versions: obj.version.vid
    });
    this.flush();
  }
  getSObjectByOsmEntity(entityId) {

    let aimobj = null;

    for (let key in State.sobjects) {
      let sobject = State.sobjects[key];
      for (let i = 0; i < sobject.forms.length; i++) {
        let form = sobject.forms[i];
        if (form.geom == entityId) {
          aimobj = sobject;
          break;
        }
      }
    }
    return aimobj
  }
  getSobjectById(sid) {
    return State.sobjects[sid];
  }
  saveEdit(context) {
    let json = editsave.getSaveSObject(context, this);
    console.log(json, 'save');
    // console.log(JSON.stringify(json));
    return 
    let token = localStorage.getItem('token');
    if (!json.length) return dispatch.call('notice', this, {
      title: '提示',
      message: '未检测到变更'
    });
    dispatch.call('loading', this, true);
    if (isAjax) {
      isAjax = false;
      objectServer.save(json).then(res => {
          isAjax = true;
          dispatch.call('loading', this, false);
          if (res.status == 200) {
            State.versionObjs = [];
            this.flush();
            dispatch.call('notice', this, {
              type: 'success',
              title: '成功',
              message: '保存成功'
            });
          } else {
            dispatch.call('notice', this, {
              type: 'error',
              title: '错误',
              message: res.message
            });
            State.versionObjs = [];
            this.flush();
          };
        })
        .catch(err => {
          dispatch.call('notice', this, {
            type: 'error',
            title: '错误',
            message: err
          });
          dispatch.call('loading', this, false);
        })
    }
  }
  clearGraph() {
    this.currentGraph.clearSobject();
    this.isChanges = false;
    State.relations = [];
    State.sobjects = {};
    State.ways = {};
    dispatch.call('currentObject', this, {
      object: null,
      entityId: null
    });
  }
  flush() {
    this.clearGraph();
    State.clear();
    this.idContext.flush();
  }
  setLoadOptions(option) {
    this.idContext.loadOptions(option);
    this.flush();
  }
  addObjectForm(sobject, form) {
    sobject.addForm(form);
    this.updateAndHistory(sobject)
  }
  updateAndHistory(sobject) {
    this.currentGraph.updateSObject(sobject);
    this.isChanges = true;
    dispatch.call('currentObject', this, {
      object: sobject,
      entityId: null
    });
  }
  deleteObjectForm(sobject, form) {
    sobject.deleteForm(form);
    this.deleteOperate.deleteEntity(this.idContext, form.geom);
    this.updateAndHistory(sobject)
  }
  modifyObjectForm(sobject, form) {
    sobject.modifyForm(form)
    this.updateAndHistory(sobject)
  }
  deleteSObjectNetwork(srcObject, relation) {
    srcObject.deleteNetworkNode(relation)
    this.updateAndHistory(srcObject)
  }
  modifySObjectNetwork(srcObject, relation) {
    srcObject.modifyNetworkNode(relation)
    this.updateAndHistory(srcObject)
  }
  createSObjectNetwork(srcObject, tagObject, relation) {
    let node = new psde.RNode();
    let bbox = tagObject.geoBox;
    node.point.x = (bbox.minx + bbox.maxx) / 2;
    node.point.y = (bbox.miny + bbox.maxy) / 2;
    node.point.z = (bbox.minz + bbox.maxz) / 2;
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
  deleteNetwork(sobjectid, nodeId) {
    let sobject = State.sobjects[sobjectid];
    sobject.deleteNetworkNode({
      id: nodeId
    });
    this.updateAndHistory(sobject);
  }
  updateParent(object) {
    if (!object) {
      this.currentSobject.deleteParent(object);
    } else {
      this.currentSobject.addParent(object);
    }
    this.updateAndHistory(this.currentSobject);
  }
  deleteParent(obj) {
    this.currentSobject.deleteParent(obj);
    this.updateAndHistory(this.currentSobject);
  }
  updateObject(object) {
    let sobject = this.getSobjectById(object.id);
    sobject.modifyObject(object);
    this.updateAndHistory(object);
  }
  modifyRealTime(object, time) {
    let sobject = this.getSobjectById(object.id);
    sobject.realTime = time;
    sobject.modifyObject(sobject);
    this.updateAndHistory(sobject);
  }
  enableOtype(otId) {
    this.idContext.features().enable(otId);
    let children = State.findChildrenOtype(otId);
    children.forEach((el, i) => {
      if (i == children.length - 1) {
        this.idContext.features().enable(el);
      } else {
        this.idContext.features().enable(el, true);
      }
      State.enableOt(el);
    });
    let showOt = [otId];
    showOt = showOt.concat(children);
    if (State.viewObject) {
      this.changeStatusObj(State.viewObject, showOt, true);
    }
    let hiddens = State.enableOt(otId);
    return hiddens;
  }
  changeStatusObj(obj, otIds, bool) {
    if (obj.id) {
      if (otIds.find(el => el == obj.otype.id)) {
        obj.show = bool;
      }
      obj.children.forEach(el => this.changeStatusObj(el, otIds, bool));
    }
    return obj;
  }
  disableOtype(otId) {
    this.idContext.features().disable(otId);
    let children = State.findChildrenOtype(otId);
    children.forEach((el, i) => {
      if (i == children.length - 1) {
        this.idContext.features().disable(el);
      } else {
        this.idContext.features().disable(el, true);
      }
      State.disableOt(el);
    });
    let hiddens = State.disableOt(otId);

    if (State.viewObject) {
      this.changeStatusObj(State.viewObject, hiddens, false)
    }


    return hiddens;
  }
  zoomOut() {
    this.idContext.zoomOut();
  }
  zoomIn() {
    this.idContext.zoomIn();
  }

  cloneObject() {
    let newSobject = new SObject();
    let str = JSON.stringify(this.currentSobject);
    newSobject.copyObject(JSON.parse(str));
    newSobject.id = n++;
    newSobject.createObject(newSobject);
    this.currentSobject = newSobject;
    newSobject.forms.forEach(form => {
      if(form.geomref){
        console.log(form.geomref,'sdfsdfsd')
        let entity = this.copyEntity(form.geomref);
        form.geom = entity.id;
        form.geomref = entity.id;
      }
    })
    newSobject.uuid = null;
    newSobject.version = {};
    this.sobjectlist[newSobject.id] = newSobject;
    State.sobjects[newSobject.id] = newSobject;
    this.idContext.features().setFeature(newSobject);
    this.updateAndHistory(newSobject);
    // this.idContext.selectEntity(newSobject.forms[0].geomref)
    // dispatch.call('currentObject',this,{object:newSobject,entityId:newSobject.forms[0].geom});
    dispatch.call('notice', this, {
      message: `克隆对象：${newSobject.id}成功`,
      type: 'success'
    })
  }
  copyEntity(ele) {
    let entity = this.idContext.entity(ele);
    if (entity.type == 'way') {
      return this.createWay(entity);
    } else if (entity.type == "node") {
      return this.createNode(entity);
    } else if (entity.type == 'relation') {
      return this.createRelation(entity);
    }
  }
  createNode(entity) {
    let node = osmNode({
      loc: entity.loc
    });
    this.idContext.perform(actionAddEntity(node), actionChangeTags(node.id, entity.tags));
    return node;
  }
  createWay(entity) {
    let way = osmWay({
      tags: entity.tags
    });
    this.idContext.perform(actionAddEntity(way));
    entity.nodes.forEach(nodeId => {
      let _node = this.idContext.entity(nodeId);
      let node = osmNode({
        loc: _node.loc
      });
      this.idContext.perform(actionAddEntity(node));

      this.idContext.perform(
        actionAddVertex(way.id, node.id),
        actionClose(way.id)
      )
    });
    return way
  }
  createRelation(entity) {
    let newRelation = this.relationOperate.createRelation();
    entity.members.forEach(member => {
      let _member = this.idContext.entity(member.id);
      let newMember = {},
        _entity;
      if (_member.type == 'way') {
        _entity = this.createWay(_member);
      } else if (_member.type == 'node') {
        _entity = this.createNode(_member);
      } else if (_member.type == 'relation') {
        _entity = this.createRelation(_member);
      }
      if (!_entity) return dispatch.call('notice', {
        message: '创建失败'
      })
      newMember.id = _entity.id;
      newMember.index = 1;
      newMember.role = member.role;
      this.relationOperate.setRole(newMember, newRelation.id)
    });
    return newRelation;
  }
  copySObject(sobject) {
    let _sobject = transformObject(this.idContext, sobject);
    _sobject.children = _sobject.children.map(el => this.copySObject(el));
    return _sobject;
  }
  getCenter(box) {
    let x = (box.minx + box.maxx) / 2;
    let y = (box.miny + box.maxy) / 2;
    let z = (box.minz + box.maxz) / 2
    return {
      x,
      y,
      z
    }
  }

  changeLoc(option) {
    let entity = this.idContext.entity(option.entityId);
    let lng = option.lng;
    let lat = option.lat;
    this.idContext.perform(iD.actionMoveNode(option.entityId, [lng, lat]));
    let sobject = this.getSObjectByOsmEntity(option.entityId);
    sobject.geoBox.maxx = lng;
    sobject.geoBox.minx = lng;
    sobject.geoBox.miny = lat;
    sobject.geoBox.maxy = lat;
    // console.log(sobject,option);
    let form = sobject.forms.find(el => el.geomref == entity.id);
    if (option.scale) {
      form.style[0].scale = Math.floor(option.scale.x * 100) / 100;
    }
    if (option.top) {
      form.style[0].h = Math.floor(option.top * 100) / 100;
    }
    if (option.rotateZ) {
      form.style[0].y = option.rotateZ;
    };
    this.modifyObjectForm(sobject, form);

    // dispatch.call('currentObject',this,{object:sobject,entityId:entity.id});

  }

  previewModel(sobject){
    // console.log('preview');
    State.viewObject = this.copySObject(sobject);
    dispatch.call('previewModel',this);
  }







}
