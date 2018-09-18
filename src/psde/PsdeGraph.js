import { dispatch as d3_dispatch } from 'd3-dispatch'
import { psdeApi, apiConfig } from './config'

//import * as formate from './formateOsm'

import psde from './index'
import osm from './form/osm'
import Attribute from './attribute/Attribute'
import btDispatch from '@/script/dispatchEvent'
import _debounce from 'lodash-es/debounce'
import dmes from '@/script/common'
import _cloneDeep from 'lodash-es/cloneDeep'

import parse from '@/script/wkt'
import idedit from "@/script/id_edit/IdEdit"
import {vm} from '@/script/operate'
/**
 * psde的内存映射
 */
const timer = 300
var context
var isAjax = true

class PsdeGraph {
  constructor () {}

  /**
   * 保存当前变化
   */
  saveObjects (context) {
    let token = localStorage.getItem('token');
    let json = idedit.saveEdit(context);//formate.compairOsm(context);
    console.log(json);
    // console.log(JSON.stringify(json))
    // return
    if (!json.length) return
    let loading = vm.$loading({
      lock:true,
      text:'加载中',
      spinner:'el-icon-loading',
      background:'rgba(255,255,255,.2)'
    })
    if (isAjax) {
      isAjax = false;
      psdeApi.post(`/object/saveObject?token=${token}`, json).then((result) => {
        // console.log(result)
        isAjax = true
        if (result.data.status == 200) {
          alert('saved')
          context.flush();
          idedit.clearGraph();
          osm.clearCollection();
        }else {
          alert('fail')
        };
        loading.close();
      })
    }
  }

}

let psdeGraph = new PsdeGraph()


export default psdeGraph
