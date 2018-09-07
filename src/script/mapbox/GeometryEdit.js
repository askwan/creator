import psde from '@/psde'
import _assign from 'lodash-es/assign'
import _cloneDeep from 'lodash-es/cloneDeep'

import SObjectGraph from './SObjectGraph'
import History from './History'

import _debounce from 'lodash-es/debounce'
import axios from 'axios'
import { psdeUrl } from '../../psde/config'
import EditManage from './EditManage'

import * as allotype from '../allOtype'

import { vm, operate } from '@/script/operate'

import { objectQuery } from '../../psde/objectService'

/**
普通几何编辑管理，
作者：zffp
 */
let relationRandomId = 1
let isEdit = false
class GeometryEdit {
  constructor (map, draw) {
    this.map = map
    this.draw = draw

    // 当前编辑的数据集
    this.currentGraph = new SObjectGraph()
       console.log(this.currentGraph,'sobj')
    this.history = new History(map, draw)

    this.currentSobject = null

    bindAll([
      'create',
      'delete',
      'update',
      'select',
      'loadBoxSObject'
    ], this)
    this.loadBoxSObject()

    this.currentSObjectIsdirty = false

    this.currentMapBounds = [[0, 0], [0, 0]]
  }
  loadBoxSObject (data) {
    if (!isEdit) return

    let boundpos = this.map.getBounds().toArray()
    // 如果当前的范围相同，不载入后台数据
    if (this.boxEqual(this.currentMapBounds, boundpos)) {
      return
    }
    // 如果当前是添加多边形操作，也不载入后台数据
    let mode = this.draw.ctx.events.getModeObject()
    if (mode) {
      let currentVertexPosition = mode.state.currentVertexPosition
      if (currentVertexPosition && currentVertexPosition > 0) {
        return
      }
    }

    console.log(this.draw.ctx.events.getModeObject(), 'draw')
    this.currentMapBounds = boundpos
    let minx = boundpos[0][0], miny = boundpos[0][1], maxx = boundpos[1][0], maxy = boundpos[1][1]

    objectQuery.getBoxSObject(minx, maxx, miny, maxy).then(res => {
      // 更新当前sobject
      // console.log(res.list,'sdfsd')
      this.currentViewSObject = res.list
      this.syncData(this.currentGraph)
    })
  }
  boxEqual (bound1, bound2) {
    return bound1[0][0] == bound2[0][0] && bound1[0][1] == bound2[0][1] && bound1[1][0] == bound2[1][0] && bound1[1][1] == bound2[1][1]
  }
  /**
   *新建feature时，将feature转换为新的sobject
   * @param {any} data
   */
  create (data) {
    if (data.features.length > 0) {
      let feature = data.features[0]

      let sobject
      if (this.currentSobject != null) {
        sobject = this.currentSobject.sobject
        let form = this.currentSobject.form // this.currentGraph.createForm(feature, this.currentSobject.form)
        // sobject.addForm(form)

        this.currentSobject.form.geom = feature.geometry

        feature.id = 'f' + form.id + '_' + sobject.id
      }else {
        sobject = this.currentGraph.createSObject(feature, this.currentOType, this.style)
      }
      this.modifySobject(sobject)
      this.currentSobject = null

      // this.currentViewSObject.push(sobject)
      this.syncData(this.currentGraph)

      EditManage.currentSobject(sobject)

      // this.draw.add(feature)
      // this.draw.changeMode('direct_select', {featureId: feature.id})

      setTimeout(() => {
        this.draw.changeMode('simple_select', {featureIds: [feature.id]})
      }, 250)
    // this.draw.changeMode('direct_select',feature.id)
    }
  }
  delete (data) {
    if (data.features.length > 0) {
      this.updateSObject(data)
      this.history.push(this.currentGraph)
      // 将操作添加到历史中，便于做撤销操作
      this.syncData(this.currentGraph)
    }
  }
  update (data) {
    if (data.features && data.features.length > 0) {
      // 将操作添加到历史中，便于做撤销操作
      let feature = data.features[0]
      this.updateSObject(data)

      this.history.push(this.currentGraph)

      this.syncData(this.currentGraph)
    }else {
      // 接受数据

      // this.updateSObject(data)
      // this.syncData(this.currentGraph)
      // this.history.push(this.currentGraph)
    }
  }

  select (data) {
    let sobjectList = this.currentViewSObject
    if (data.features.length > 0) {
      let feature = data.features[0]
      let words = feature.id.substring(1).split('_')
      let sid = words[1]
      let fid = words[0]
      let sobject
      sobject = this.queyrSObject(sid)
      EditManage.currentSobject(sobject)
    }else {
      EditManage.currentSobject({})
    }
  }
  updateSObject (data) {
    let feature = data.features[0]
    let action
    let sobject = this.updateSObjectFormByFeature(this.currentGraph.sobjectList, feature, data)

    if (sobject != null) {
      let action = sobject.actions[0]
      // console.log(action, 'sobjectacrion')
      if (action.operation & psde.Action.MODIFY) {
        // 当前对象是修改的，而非新建的

      } else if (action.operation & psde.Action.ADDING) {
        // 新建对象
      }
    } else {
      sobject = this.updateSObjectFormByFeature(this.currentViewSObject, feature, data)
      if (sobject != null) {
        this.currentGraph.addSObject(sobject)
      }
    }
    return sobject
  }
  /**
   * 通过feature更新sobject列表
   * @param {any} sobjectList
   * @param {any} feature
   */
  updateSObjectFormByFeature (sobjectList, feature, data) {
    let words = feature.id.substring(1).split('_')
    let sid = words[1]
    let fid = words[0]

    for (let key in sobjectList) {
      let sobject = sobjectList[key]
      if (sobject.id == sid) {
        for (let i = 0; i < sobject.forms.length; i++) {
          let form = sobject.forms[i]
          if (form.id == fid) {
            if (data.type == 'draw.delete') {
              sobject.deleteForm(form)
            }else if (data.type == 'draw.update') {
              form.geom = feature.geometry
              sobject.modifyForm(form)
            }else if (data.type == 'draw.selectionchange') {
              // select
            }

            return sobject
          }
        }
      }
    }
    return null
  }
  updateSobjectFeature (sobject, feature) {
    // 更新feature
  }
  addObjectForm (sobject, form) {
    sobject.addForm(form)
    this.updateAndHistory(sobject)
  }
  modifyObjectForm (sobject, form) {
    sobject.modifyForm(form)
    this.updateAndHistory(sobject)
  }
  deleteObjectForm (sobject, form) {
    sobject.deleteForm(form)
    this.updateAndHistory(sobject)
  }
  getObjectByFeature (feature) {
    for (let key in this.currentGraph.sobjectList) {
      let sobject = this.currentGraph.sobjectList[key]
      if (sobject.id == feature.id) {
        return sobject
      }
    }

    for (let key in this.currentViewSObject) {
      let sobject = this.currentViewSObject[key]
      if (sobject.id == feature.id) {
        return sobject
      }
    }

    return null
  }

  queyrSObject (sid) {
    if (this.currentGraph.sobjectList[sid]) {
      return this.currentGraph.sobjectList[sid]
    }

    let sobject = this.currentViewSObject.find(el => {
      return el.id == sid
    })
    if (sobject != null) {
      return sobject
    }
  }

  setOType (otype, style, currentSobject) {
    this.currentOType = otype
    this.style = style
    this.currentSobject = currentSobject
  }
  /**
   *同步数据
   */
  syncData (graph) {
    // 将数据与编辑内存同步
    // let features = graph.toFeatures()
    if (this.currentViewSObject.length == 0) return
    // console.log(this.currentViewSObject)
    let features = graph.toFeatures(this.currentViewSObject)
    // console.log(features)
    // console.log(this.draw)
    setTimeout(() => {
      this.draw.set({
        type: 'FeatureCollection',
        features: features
      })
    }, 0)
  }
  isEdit () {
    return isEdit
  }
  changeEditStatus (bool) {
    isEdit = bool
    if (isEdit) {
      let loadBoxSObject = _debounce(this.loadBoxSObject, 350)
      this.loadBoxSObject()
      this.map.on('zoomend', loadBoxSObject)
      this.map.on('moveend', loadBoxSObject)
    }
  }
  modifySobject (sobject) {
    this.currentGraph.updateSObject(sobject)
    this.history.push(this.currentGraph)
  // console.log('更新', this.currentGraph)
  }
  clear () {
    this.currentGraph.sobjectList = Object.create({})
  }
  getSelectSobject () {
    let selectlist = this.draw.getSelected()
    let sobjectlist = []
    for (let i = 0;i < selectlist.features.length;i++) {
      let feature = selectlist.features[i]
      let words = feature.id.substring(1).split('_')
      let sid = words[1]
      let fid = words[0]
      let sobject = this.queyrSObject(sid)
      if (sobject) {
        sobject.otype = allotype.getOtypeById(sobject.otype.id)

        sobjectlist.push(sobject)
      }
    }
    return sobjectlist
  }
  /**
  创建对象关系  */
  createRelation () {
    // 获取选择对象
    let sobjectlist = this.getSelectSobject()
    vm.$emit(operate.addObjectRalation, {
      sign: 'moreRelationList',
      value: true,
      data: sobjectlist
    })
  /*let rnodelist = []
  for (let i = 0;i < sobjectlist.length;i++) {
    let sobject = sobjectlist[i]
    let connectors = sobject.otype.connectors.connectors
    for (let cj = 0;cj < connectors.length;cj++) {
      let connector = connectors[cj]
      let dtype = connector.dType
      let dobject = this.querySObjectByOType(sobjectlist, dtype.id)
      if (dobject.length > 0) {
        // 创建关系
        for (let dj = 0;dj < dobject.length;dj++) {
          let node = this.createSObjectNetwork(sobject, dobject[dj], connector.relation)
          rnodelist.push(node)
          this.currentGraph.updateSObject(sobject)
        }
      }
    }
  }
  if (rnodelist.length > 0) {
    console.log(rnodelist)
  // alert('创建成功')
  }else {
    alert('创建失败，没有找到对应的关系')
  }*/
  // console.log(selectlist, sobjectlist)
  }
  /**
  创建sobject的关系网络
   */
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
  // 更新页面and保存历史
  updateAndHistory (sobject) {
    this.currentGraph.updateSObject(sobject)
    EditManage.currentSobject(sobject)
  }
}
/**
 * 编辑工具当前选中图层
 */
let HOT = 'mapbox-gl-draw-hot'
/**
 * 编辑工具显示绘制图层
 */
let COLD = 'mapbox-gl-draw-cold'
/**
 * feature集合名称
 */

/**
 * 绑定放发的作用域
 * @param {any} fns
 * @param {any} context
 */
function bindAll (fns, context) {
  fns.forEach((fn) => {
    if (!context[fn]) {
      return
    }
    context[fn] = context[fn].bind(context)
  })
}
export default GeometryEdit
