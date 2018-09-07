import psde from '@/psde'
import Vue from 'vue'
var vue = new Vue

import { vm, operate } from '@/script/operate'
// import { vm, OPERARE } from "@/jscript/store/operateMenu.js"

import objectService from '@/request/object.service.js'

const oTypeCtrl = {
  otype: new psde.OType(),

  // 类模板详情
  oTypeContent: {},
  versionContent: [],
  // 类模板ID
  oTypeId: 0,

  // 暂时没用
  updateActions: new psde.Action(this.oTypeId, psde.Action.MODIFY),

  // 获取类模板详情
  getOTypeDetail(datas) {
    objectService.queryObject({
      ids: datas.id,
      loadForm: true,
      loadObjType: true,
      loadVersion: true,
      loadAction: true,
      loadNetwork: true
    }).then(res => {
      var maxItem = res.list[0]
      if (res.list && res.list > 0) {
        res.list.forEach((item, index) => {
          if (item.version && item.version.vid) {
            if (maxItem.version.vid < item.version.vid) {
              maxItem = item
            }
          }
        })
      }
      oTypeCtrl.oTypeContent = maxItem
      oTypeCtrl.versionContent = res.list
      oTypeCtrl.oTypeId = datas.id
      // console.log(datas , oTypeCtrl.oTypeContent)
      // 当前点击类的详情

      vm.$emit(operate.currentObject, res.list[0])

      return oTypeCtrl.oTypeContent
    })
  },
  // 修改类模板
  changeOType(data, type, callback) {
    data[0].editType = type
    objectService.editObject(data).then(res => {
      // 同步修改类视图中的当前类的详情
      // getDiagram().changeField(data)
      // 成功之后的回调
      callback(res)
      this.getOTypeDetail(data[0])
    })
      .catch((error) => {
        if (error.message) {
          vue.$message({
            message: error.message,
            type: 'error',
            showClose: true
          })
        } else {
          vue.$message({
            message: '服务器端错误',
            type: 'error',
            showClose: true
          })
        }
      })
  },
  // 获取形态列表
  getStyles() {
    if (this.oTypeContent && this.oTypeContent.name && this.oTypeContent.forms && this.oTypeContent.forms.length > 0) {
      var forms = this.oTypeContent.forms
      return forms
    }
    return []
  },
  // 时空域父对象保存修改
  updateObjectParents(data, callback) {
    /*var str = data.toString()
    this.oTypeContent.parents = [{
    	[str]: str
    }];*/
    this.oTypeContent.parents = []
    data.forEach((item, index) => {
      this.oTypeContent.parents.push({
        id: item.id
      })
    })
    this.oTypeContent.actions = []
    let action = new psde.Action(0, psde.Action.MODIFY | psde.Action.BASE)
    this.oTypeContent.actions.push(action)
    var arr = []
    arr.push(this.oTypeContent)

    this.changeOType(arr, 'domain', (res) => {
      callback(res)
      vue.$message({
        message: '父对象保存成功',
        type: 'success',
        showClose: true
      })
    })
  },
  // 编辑对象的关系对象
  updateObjectRelation(data, callback) {
    this.oTypeContent.network.nodes = data
    this.oTypeContent.actions = []
    let action = new psde.Action(this.oTypeContent.id, psde.Action.ADDING | psde.Action.RELEATION)
    this.oTypeContent.actions.push(action)
    var arr = []
    arr.push(this.oTypeContent)

    this.changeOType(arr, 'relation', (res) => {
      callback(res)
      vue.$message({
        message: '关系保存成功',
        type: 'success',
        showClose: true
      })
    })
  },
  // 形态保存
  updateOtypeForm(data, deleteObjectList, callback) {
    if (!this.oTypeContent.forms) {
      this.oTypeContent.forms = []
    }
    this.oTypeContent.forms = data
    this.oTypeContent.actions = []
    //		let action = new psde.Action(this.oTypeContent.id, psde.Action.MODIFY | psde.Action.FORM)
    //		this.oTypeContent.actions.push(action)
    this.oTypeContent.forms.forEach((item, index) => {
      item.minGrain = Number(item.minGrain)
      item.maxGrain = Number(item.maxGrain)
      if (item.id) {
        let action = new psde.Action(item.id, psde.Action.MODIFY | psde.Action.FORM)
        this.oTypeContent.actions.push(action)
      } else {
        item.id = index
        let action = new psde.Action(index, psde.Action.ADDING | psde.Action.FORM)
        this.oTypeContent.actions.push(action)
      }
      if (!item.formref.refid) {
        item.formref.refid = 0
      }
    })
    if (deleteObjectList.length > 0) {
      deleteObjectList.forEach((item, index) => {
        let action = new psde.Action(item.id, psde.Action.DELETE | psde.Action.FORM)
        this.oTypeContent.actions.push(action)
        this.oTypeContent.forms.push(item)
      })
    }
    var arr = []
    arr.push(this.oTypeContent)
    this.changeOType(arr, 'form', (res) => {
      callback(res)
      vue.$message({
        message: '形态保存成功',
        type: 'success',
        showClose: true
      })
    })
  },
  // 位置保存
  updateOtypePlace(data) {
    this.oTypeContent.placedes = data
    this.oTypeContent.actions = []
    let action = new psde.Action(0, psde.Action.MODIFY | psde.Action.COMPOSE)
    this.oTypeContent.actions.push(action)
    var arr = []
    arr.push(this.oTypeContent)
    this.changeOType(arr, 'place', (res) => {
    })
  },
  // 属性保存
  updateOtypeField(obj, datatypes) {
    if (!this.oTypeContent.fields.fields) {
      this.oTypeContent.fields.fields = []
    }
    let index = this.oTypeContent.fields.fields.findIndex(
      item => item.id == obj.data.data.id
    )
    if (index == -1) {
      datatypes.forEach((item, index) => {
        if (item.name == obj.data.data.type) {
          obj.data.data.type = item.value
        }
      })
      this.oTypeContent.fields.fields.push(obj.data.data)
      this.oTypeContent.actions = []
      let action = new psde.Action(0, psde.Action.MODIFY | psde.Action.ATTRIBUTE)
      this.oTypeContent.actions.push(action)
      var arr = []
      arr.push(this.oTypeContent)
      this.changeOType(arr, 'attr', (res) => {
      })
    } else {
      vue.$message({
        message: obj.data.data.caption + '--已经添加过了！',
        type: 'warning',
        showClose: true
      })
    }
  },
  // 属性删除更新
  deleteOtypeField(id) {
    this.oTypeContent.fields.fields = this.oTypeContent.fields.fields.filter(
      item => item.id != id
    )
    this.oTypeContent.actions = []
    let action = new psde.Action(0, psde.Action.MODIFY | psde.Action.ATTRIBUTE)
    this.oTypeContent.actions.push(action)
    var arr = []
    arr.push(this.oTypeContent)
    this.changeOType(arr, 'attr', (res) => {
    })
  },
  // 时空更新
  updateOtypeST(data) {
    this.oTypeContent.srs = {
      id: data
    }
    this.oTypeContent.actions = []
    let action = new psde.Action(0, psde.Action.MODIFY | psde.Action.BASE)
    this.oTypeContent.actions.push(action)
    var arr = []
    arr.push(this.oTypeContent)
    this.changeOType(arr, 'base', (res) => {
    })
  },
  // 关系更新
  updateOtypeConnect(item) {
    var oId = item.event.target.getAttribute('data-index')
    // var type = item.event.target.lastChild.getAttribute("data-type")
    if (item.data && item.data.id == 'relation') {
      this.oTypeContent.actions = []
      let action = new psde.Action(0, psde.Action.MODIFY | psde.Action.RELEATION)
      this.oTypeContent.actions.push(action)
      this.oTypeContent.connectors.connectors.forEach((it, index) => {
        if (index == oId) {
          this.oTypeContent.connectors.connectors[oId].actions = []
          let obj = new psde.Action(this.oTypeContent.connectors.connectors[oId].id, psde.Action.MODIFY)
          this.oTypeContent.connectors.connectors[oId].actions.push(obj)
          this.oTypeContent.connectors.connectors[oId].relation = {}
          this.oTypeContent.connectors.connectors[oId].relation = item.data.data
        } else {
          this.oTypeContent.connectors.connectors[index].actions = []
          let bbj = new psde.Action(0, 0)
          this.oTypeContent.connectors.connectors[index].actions.push(bbj)
        }
      })
      var arr = []
      arr.push(this.oTypeContent)
      this.changeOType(arr, 'connect', (res) => {
        this.oTypeContent.connectors.connectors[oId].relation = item.data.data
        vue.$message({
          message: '关系更新成功！',
          type: 'success',
          showClose: true
        })
      })
    }
  },
  // 更新行为
  updateOtypeBehavior(item) {
    if (!this.oTypeContent.models) {
      this.oTypeContent.models = {}
    }
    if (item.data && item.data.id == 'behavior') {
      this.oTypeContent.models.models = this.oTypeContent.models.models || []
      let index = this.oTypeContent.models.models.findIndex(
        obj => obj.id == item.data.data.id
      )
      if (index == -1) {
        item.data.data.actions = []
        this.oTypeContent.models.models.push(item.data.data)
        this.oTypeContent.actions = []
        let action = new psde.Action(0, psde.Action.MODIFY | psde.Action.MODEL)
        this.oTypeContent.actions.push(action)
        var arr = []
        arr.push(this.oTypeContent)
        this.changeOType(arr, 'model', (res) => {
        })
      }else {
        vue.$message({
          message: '此行为已经添加过了！',
          type: 'warning',
          showClose: true
        })
      }
    } else {
      vue.$message({
        message: '请拖动行为进行添加！',
        type: 'warning',
        showClose: true
      })
    }
  },
  // 删除行为
  deleteOtypeBehavior(id) {
    this.oTypeContent.models.models = this.oTypeContent.models.models.filter(
      item => item.id != id
    )
    this.oTypeContent.actions = []
    let action = new psde.Action(0, psde.Action.MODIFY | psde.Action.MODEL)
    this.oTypeContent.actions.push(action)
    var arr = []
    arr.push(this.oTypeContent)
    this.changeOType(arr, 'model', (res) => {
    })
  }

}

// 下面这是为了调用diagram的作用域
var oDiagram
const getDiagram = function (diagram) {
  if (arguments.length == 0) return oDiagram
  oDiagram = diagram
}



const dimension = [{
  value: 1,
  name: '一维'
},
  {
    value: 2,
    name: '二维'
  },
  {
    value: 3,
    name: '三维'
  },
  {
    value: 0,
    name: '零维'
  }
];
// 位置下拉列表
const place = [{
  key: 1,
  name: '前'
},
  {
    key: 2,
    name: '中'
  },
  {
    key: 3,
    name: '后'
  }
];

// 样式类型下拉列表
const formstyleType = [{
  name: 'Sld',
  value: 1
}, {
  name: 'Sld-Css',
  value: 2
}, {
  name: 'Mapbox-Css',
  value: 3
}, {
  name: 'Mesh',
  value: 4
}, {
  name: 'Server',
  value: 5
}
];

const styleServerType = [{
		name: "Xyz",
		value: "Xyz",
		caption:"rest切片服务"
	},{
		name: "Wms",
		value: "Wms",
		caption:"Wms服务"
	},{
		name: "Wmts",
		value: "Wmts",
		caption:"地图瓦片服务"
	},{
		name: "Image",
		value: "Image",
		caption:"图片"
	},{
		name: "VectorTile",
		value: "VectorTile",
		caption:"矢量切片"
	},{
		name: "ObliquePhotography",
		value: "ObliquePhotography",
		caption:"倾斜摄影"
	}
];


export { getDiagram, oTypeCtrl, dimension, place, formstyleType, styleServerType }
