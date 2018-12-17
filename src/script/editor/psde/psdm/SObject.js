import DObject from './DObject'
import Action from './Action'
import osm from '../form/osm'
import Network from '../relation/Network'
import SpatialReferenceSystem from '../reference/SpatialReferenceSystem'
import psde from '../index.js'

import _trim from 'lodash-es/trim'

/**
 * 时空对象
 * 
 * @class SObject
 * @extends {DObject}
 */
export default class SObject extends DObject {
  constructor () {
    super()
    this.defineProperty('srs', new SpatialReferenceSystem())

    /**
     * 形态
     */
    // this.defineProperty('forms', []);
    this.forms = [];

    this.defineProperty('models', { models: [] })

    this.defineProperty('network', new Network(), Network)

    this.defineProperty('compose', {});

    this.defineProperty('realTime','');
    this.realTime = '';
    this.sdomain = 0;
    this.children = [];
  }

  createObject (obj) {
    let id = obj.id || 0
    // Object.assign(this, obj);
    this.copyObject(obj);
    this.addAction(id, Action.ADDING | Action.BASE);
    this.realTime = '';
    return this
  }
  copyObject (obj) {
    let sobject = Object.assign(this, obj)
    if (sobject.forms instanceof Array) {
      sobject.forms = sobject.forms.map(el => {
        if(el.type===50 || el.type===40) {
          if (!el.style) {
            el.style = [];
            el.style[0] = {
              scale: "",
              smallPX: "",
              x: "",
              y: "",
              z: "",
              h:""
            };
          }
        } else {
        }
        if(typeof el.style == "string" && el.style != "") {
          el.style = JSON.parse(el.style);
        }
        return el
      });
    }
    function parse (arr) {
      arr = eval(arr)
      if (arr instanceof Array) {
        return arr
      }else {
        return parse(arr)
      }
    }
    
    sobject.network.nodes.forEach(el=>{
      el.show = true;
    })
    
    this.realTime = '';
    return sobject
  }
  modifyObject (obj) {
    Object.assign(this, obj)
    this.addAction(this.id, Action.MODIFY | Action.BASE)
    return this
  }
  deleteObject () {
    this.addAction(this.id, Action.DELETE | Action.BASE)
    return this
  }
  modyifyOtype(otype){
    this.otype = otype;
    if(!this.actions.find(el=>el.operation==33)){
      this.addAction(this.id, Action.MODIFY | Action.BASE)
    };
    return this;
  }

  addAttr (attr) {
    let index = this.attributes.findIndex(attribute => attribute.name == attr.name)
    if (index == -1) {
      this.attributes.push(attr)
    }else {
      this.attributes.splice(index, 1, attr)
    }
    this.addAction(attr.fid, Action.ADDING | Action.ATTRIBUTE)
    return this
  }
  deleteAttr (attr) {
    let addAction = this.getAction(0, Action.ADDING | Action.ATTRIBUTE)
    if (addAction) return this.deleteAction(addAction, addAction.operation)
    let modifyAction = this.getAction(attr.id, Action.MODIFY | Action.ATTRIBUTE)
    if (modifyAction) this.deleteAction(modifyAction.id, modifyAction.operation)
    // let index = this.attributes.findIndex(attribute => attribute.name == attr.name)
    this.addAction(attr.fid, Action.DELETE | Action.ATTRIBUTE)
    return this
  }
  modifyAttr (attr) {
    this.attributes = attr
    this.addAction(-1, Action.MODIFY | Action.ATTRIBUTE)

    let name = this.getAttrName(attr)
    if (name != null) {
      this.name = name
    }
    return this
  }
  getAttrName (attrs) {
    for (let i = 0;i < attrs.length;i++) {
      let attr = attrs[i]
      if (attr.name == 'name') {
        return attr.value
      }
    }
    return null
  }
  addForm (form) {
    let index = this.forms.findIndex(el => el.id == form.id)
    if (index == -1) {
      this.forms.push(form)
    }else {
      this.forms.splice(index, 1, form)
    }
    this.addAction(form.id, Action.ADDING | Action.FORM)
    return this
  }
  deleteForm (form) {

    let addAction = this.getAction(form.id, Action.ADDING | Action.FORM)
    if (addAction) {
      this.deleteAction(addAction.id, addAction.operation)
      return
    }
    let modifyAction = this.getAction(form.id, Action.MODIFY | Action.FORM)
    if (modifyAction) {
      return this.deleteAction(modifyAction.id, modifyAction.operation)
    }
    this.addAction(form.id, Action.DELETE | Action.FORM)
    let index = this.forms.findIndex(el => el.id == form.id)
    if (index !== -1) this.forms.splice(index, 1)
    return this
  }
  /**
   * 修改form属性
   * @param {Object} form 
   */
  modifyForm (form) {
    this.modifyObject(this);
    let index = this.forms.findIndex(el => el.id == form.id)
    let addAction = this.getAction(form.id, Action.ADDING | Action.FORM);
    if (addAction) {
      this.forms.splice(index, 1, form)
    }else {
      if (index == -1) {
        this.forms.push(form)
        this.addAction(form.id, Action.MODIFY | Action.FORM)
      }else {
        this.forms.splice(index, 1, form)
        this.addAction(form.id, Action.MODIFY | Action.FORM)
      }
    }

    return this
  }
  addParent (parent) {
    let index = this.parents.findIndex(el => el.id == parent.id)
    if (index == -1) this.parents.push({id:parent.id})
    this.addAction(this.id, Action.MODIFY | Action.BASE)
    return this
  }
  deleteParent (parent) {
    console.log(this.parents,parent,88888888888)
    this.parents = this.parents.filter(el => el.id != parent.id)
    console.log(this.parents,777777777)
    this.addAction(this.id, Action.MODIFY | Action.BASE)
    return this
  }
  addNetworkNode (rnode) {
    let tempNode = this.queryNetWorkRNode(rnode)
    if (tempNode != null) {
      return
    }

    let deleteActions = this.findByOperation(Action.DELETE | Action.RELEATION)
    if (deleteActions.length > 0) {
      let a = deleteActions.find(el => rnode.id == el.id)
      if (a) {
        this.deleteAction(a.id, a.operation)
      }
    }
    let index = this.network.nodes.findIndex(el => el.id == rnode.id)
    if (index == -1) {
      this.network.nodes.push(rnode)
      this.addAction(rnode.id, Action.ADDING | Action.RELEATION)
    }else {
      this.network.nodes.splice(index, 1, rnode)
      this.addAction(rnode.id, Action.ADDING | Action.RELEATION)
    }
    return this
  }
  queryNetWorkRNode (rnode) {
    if (!rnode.edge || !rnode.edge.relation) {
      return null
    }

    for (let i = 0;i < this.network.nodes.length;i++) {
      let node = this.network.nodes[i]
      if (node.relatedObjectId == rnode.relatedObjectId && node.edge.relation.id == rnode.edge.relation.id) {
        return node
      }
    }
    return null
  }
  modifyNetworkNode (rnode) {
    let index = this.network.nodes.findIndex(el => el.id == rnode.id)
    if (index == -1) {
      this.network.nodes.push(rnode)
    }else {
      this.network.nodes.splice(index, 1, rnode)
    }
    let addAction = this.getAction(rnode.id, Action.ADDING | Action.RELEATION)
    if (!addAction) {
      this.addAction(rnode.id, Action.MODIFY | Action.RELEATION)
    }
    return this
  }
  deleteNetworkNode (rnode) {
    // 1、action查找rnode action
    // 2、action是否是add  remover
    // 3、没有找到对应的action add 只添加action，不做处理
    let addAction = this.getAction(rnode.id, Action.ADDING | Action.RELEATION)
    if (addAction) return this.deleteAction(addAction.id, addAction.operation)
    let modifyAction = this.getAction(rnode.id, Action.MODIFY | Action.RELEATION)
    if (modifyAction) this.deleteAction(modifyAction.id, modifyAction.operation)
    // this.actions = [];
    // this.network.nodes = this.network.nodes.filter(el=>el.id!=rnode.id);
    this.network.nodes.find(el=>el.id==rnode.id).show = false;
    // this.network.nodes = this.network.nodes.filter(node=>node.id!=rnode.id)
    this.addAction(rnode.id, Action.DELETE | Action.RELEATION)
    return this
  }
  addModel (model) {
    let index = this.models.models.findIndex(el => el.id == model.id)
    let id = model.id || 0
    if (index == -1) {
      this.models.models.push(model)
    }else {
      this.models.models.splice(index, 1, model)
    }
    this.addAction(id, Action.ADDING | Action.MODEL)
    return this
  }
  deleteModel (model) {
    this.models.models = this.models.models.filter(el => el.id != model.id)
    this.addAction(model.id, Action.DELETE | Action.MODEL)
  }
  addAction (id, operate) {
    if (!id) id = 0
    let addAction = this.actions.find(el=>el.operation==33)
    let modifyAction = this.getAction(id, Action.MODIFY | Action.BASE)
    let deleteAction = this.getAction(id, Action.DELETE | Action.BASE)
    if (!addAction && !deleteAction) {
      let action = this.getAction(id, operate)
      if (!action) this.actions.push(new psde.Action(id, operate))
    }
  }
  /**
   * 获取action
   * @param {Number} id 
   * @param {Number} operate 
   */
  getAction (id, operate) {
    return this.actions.find(action => action.id == id && operate == action.operation)
  }
  deleteAction (id, operate) {
    let index = this.actions.findIndex(el => el.id == id && el.operation == operate)
    this.actions.splice(index, 1)
  }
  /**
   * 通过operation查找action
   * @param {Number} operation 
   */
  findByOperation (operation) {
    return this.actions.filter(action => action.operation == operation)
  }
}
