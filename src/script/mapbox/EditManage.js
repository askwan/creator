
import dmes from '@/script/common'
import { vm, operate } from '@/script/operate'
import { psdeApi } from '@/psde/config'

import { toJson, getType } from './utils'



import _clone from 'lodash-es/clone'

import psde from '@/psde'

import IdEdit from '@/script/id_edit/IdEdit'

import { select as d3_select } from 'd3-selection';

let tools = {
  21: 'draw_point',
  22: 'draw_line_string',
  23: 'draw_polygon',
  100: 'simple_select' // 选择工具
}
let draw = null
let geometryEdit = null
let map = null
let isEdit = false
let layerList = []
let currentObj

geometryEdit = IdEdit;
/**
编辑管理
 */
let EditManage = {
  setMap(mapboxMap) {
    map = mapboxMap
  },
  startEdit() {
    geometryEdit = IdEdit;
      
  },
  setTool(style, otype, modeOptions) {
    console.log(style,otype,modeOptions);
    geometryEdit.setPosition(style,otype,modeOptions);
    d3_select('.add-point').nodes()[0].click();


  
  },
  exitEdit() {
    if (!geometryEdit && !geometryEdit.isEdit()) return
    this.layers().forEach((el, i) => {
      map.addLayer(el)
    })

    map.removeControl(draw)
    map.off('draw.create', geometryEdit.create)
    map.off('draw.delete', geometryEdit.delete)
    map.off('draw.update', geometryEdit.update)
    map.off('draw.selectionchange', geometryEdit.select)
    geometryEdit.changeEditStatus(false)
    // geometryEdit = null

  },
  getHistory() {
    return geometryEdit.history
  },
  layers(arr) {
    if (!arr) return layerList
    layerList = arr
  },
  currentSobject(obj) {
    if (!obj) {
      vm.$emit(operate.currentObject, currentObj)
      return currentObj
    }else{
      currentObj = obj
      vm.$emit(operate.currentObject, currentObj)
    }
    
  },
  getGeometryEdit() {
    return geometryEdit
  },
  /**
  修改sobject
   */
  update(sobject) {},

  saveEdit() {
    let jsons = geometryEdit.currentGraph.sobjectList;
    let json = {};
    for(let key in jsons){
    	let ss = jsons[key];
    	let createObj = ss.findByOperation(psde.Action.BASE | psde.Action.ADDING);
    	if(createObj.length>0&&ss.forms.length==0){
    		
    	}else{
    		json[key] = ss
    	}
    }
    if (JSON.stringify(json) == '{}') {
      alert('没有可保存的对象')
      return
    }
    // console.log(json)
    // return
    let arr = []
    for (let key in json) {
      // let sobj = _clone(json[key]);
      
      let str = JSON.stringify(json[key]);
      let sobj = Object.assign({},JSON.parse(str));

      sobj.forms.forEach(form => {
        if(form.type!=21&&form.type!=22&&form.type!=23){
          form.style = JSON.stringify(form.style);
          form.geom = toJson(form.geom);
        }else if(form.geom){
          form.type = getType(form.geom);
          form.geom = toJson(form.geom)
          if(form.style && form.style.length > 0) {
            form.style = JSON.stringify(form.style);
          } else {
            form.style = null;
          }
        }else{
        	if(form.style && form.style.length > 0) {
            form.style = JSON.stringify(form.style);
          } else {
            form.style = null;
          }
        }
        
      })
      if (sobj.network.nodes.length > 0) {
      	sobj.network.nodes.forEach((item,index) => {
      		if (item.edge.relation.model && item.edge.relation.model.mobj) {
      			item.edge.relation.model.mobj = null;
      		}
      	})
      }
      // delete sobj.network
      arr.push(sobj)
    }
    console.log(arr)
//  return
    psdeApi.post(`/object/saveObject?token=${dmes.getItem("token")}`, arr).then(res => {
      if (res.data.status == 200) {
        alert('save');
        this.reset();
      // geometryEdit.changeEditStatus(false)
      // this.exitEdit()
      }

    // geometryEdit = null
    })
  },
  createRelation() {
    geometryEdit.createRelation()
  },
  reset(){
  	if(geometryEdit && geometryEdit.isEdit()){
  		this.exitEdit();
	    setTimeout(() => {
	      this.startEdit();
	    }, 100);
  	}else{
  		this.startEdit();
	    setTimeout(() => {
	    	this.exitEdit();
	    }, 100);
  	}
    
  }
}

export default EditManage
