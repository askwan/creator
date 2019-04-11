import otypeList from './manage/otypeList'
import  regroupMultiPolygon from './regroupMultiPolygon'
class SObject {
  constructor(props, selectData) {
    this.data = props //源数据
    this.selectData = selectData ? selectData : null
    this.name = '' //名字
    this.id = '' //id
    this.otypeId = '' //otype的id

    this.forms = '' //forms集合
    this.nodes = {} //坐标和种类【点线面】way area node relation
    this.lonlat = '' //中心坐标

    this.layer = [] //在哪个图层
    // this.layer = 'modelLayer' //在哪个图层
    // this.layer = 'pipelineLayer' //在哪个图层
    this.floor = null //第几层
    this.height = null
    this.min_height = null
    this.isfloor = false
    this.show = true

    this.init()
  }

  init() {
    this.id = this.data.id
    this.name = this.data.name
    this.otypeId = this.data.otype.id
    this.forms = this.data.forms
    this.show = this.data.show
    this.lonlat = [(this.data.geoBox.maxx + this.data.geoBox.minx) / 2, (this.data.geoBox.maxy + this.data.geoBox.miny) / 2]
    if (this.selectData) {
      this.setSelectNodes()
    } else {
      this.setNotSelectNodes()
    }
    this.setIsFloor()
    this.setLayer()
    // this.judgeType()
  }

  setLayer() {
    if (this.layer.length < 1) {
      let connectors = this.data.otype.connectors.connectors
      for (let i = 0; i < connectors.length; i++) {
        let t = connectors[i]

        this.recursionLayer(t, this.data.otype.id)
      }
      if (this.layer.length < 1) {
        this.layer.push('otherLayer')
        // console.log('没有找到', this.data)
      }
    }
    let have = false
    for (let i = 0; i < this.layer.length; i++) {
      if (this.layer[i] == 'otherLayer') {
        have = true
      }
    }
    if (!have) {
      // this.layer.push('otherLayer')
    }

  }
  recursionLayer(type, id) {
    if (type.type == 2) {
      let l = otypeList.getOtype(type.dType.id)
      if (!l) {
        return
      }
      if (type.dType.id == id) {
        return
      }
      if (l.name == '建筑元素') {
        this.layer.push('buildingLayer')
        return
      } else if (l.name == '管线') {
        this.layer.push('pipelineLayer')
        return
      } else {
        let connectors = l.connectors.connectors
        for (let i = 0; i < connectors.length; i++) {
          let t = connectors[i]
          this.recursionLayer(t, l.id)
        }
      }
    }
  }
  setIsFloor() {
    if (this.data.otype.name == '楼层') {
      this.isfloor = true
      let num = parseInt(this.getAttributes(this.data.attributes, "FLOOR"))
      this.floor = num ? num : null
    }
  }
  setSelectNodes() {
    for (let i = 0; i < this.forms.length; i++) {
      let form = this.forms[i]
      if (form.geomref == this.selectData.id) {
        if (!form.geom) {
          this.forms.forEach(e => {
            if (e.formref.refid == form.formref.refid) {
              form.geom = e.geom
            }
          });
        }
        this.setNodes(form)
      }
    }
  }
  setNotSelectNodes() {
    for (let i = 0; i < this.forms.length; i++) {
      let form = this.forms[i]
      if (!form.geom) {
        this.forms.forEach(e => {
          if (e.formref.refid == form.formref.refid) {
            form.geom = e.geom
          }
        });
      }
      this.setNodes(form)
    }
  }
  setNodes(form) {
    // console.log(999,form)
    this.nodes[form.id] = {}
    this.nodes[form.id].nodes = []
    let type = form.type
    this.height = this.getAttributes(this.data.attributes, "height")
    this.min_height = this.getAttributes(this.data.attributes, "min_height")
    if (type == 21) {
      if (this.height - this.min_height != 0) {
        this.nodes[form.id].type = 'line'
      } else {
        this.nodes[form.id].type = 'point'
      }
    } else if (type == 22) {
      this.nodes[form.id].type = 'line'
    } else if (type == 23) {
      this.nodes[form.id].type = 'polygon'
    } else if (type == 50) {
      this.layer.push('modelLayer')
      this.nodes[form.id].type = 'model'
    }
    if (form.geom.members) {
      let membersArr=regroupMultiPolygon.multiPolygonData(form)
      this.nodes[form.id].type = 'multiPolygon'
      this.nodes[form.id].nodes = []

      for (let q = 0; q < membersArr.length; q++) {
        let members = membersArr[q]
        let arr = []
        if (members.type == "outer") {
          this.nodes[form.id].nodes.push([])
          for (let e = 0; e < members.nodes.length; e++) {
            let r = members.nodes[e]
            arr.push([r.x, r.y, r.z])
          }
        }
        if (members.type == "inner") {
          for (let e = 0; e < members.nodes.length; e++) {
            let r = members.nodes[e]
            arr.push([r.x, r.y, r.z])
          }
        }
        if (this.nodes[form.id].nodes.length > 0) {
          this.nodes[form.id].nodes[this.nodes[form.id].nodes.length - 1].push(arr)
        }
      }
    } else if (form.geom.nodes) {
      for (let q = 0; q < form.geom.nodes.length; q++) {
        let n = form.geom.nodes[q]
        this.nodes[form.id].nodes.push([n.x, n.y, n.z])
      }
    } else {
      this.nodes[form.id].nodes.push([form.geom.x, form.geom.y, form.geom.z])
    }
   
  }
  judgeType() {
    for (let i in this.nodes) {
      let node = this.nodes[i]
      if (node.type == 'multiPolygon') {
        let or = 0
        for (let q = 0; q < node.nodes.length; q++) {
          let nod = node.nodes[q]
          if (nod.length > 1) {
            or++
          }
        }
        if (or == 0) {
          node.type = 'polygon'
          let allArr = []
          for (let q = 0; q < node.nodes.length; q++) {
            let nod = node.nodes[q][0]
            if (allArr.length == 0) {
              for (let w = 0; w < nod.length; w++) {
                allArr.push(nod[w])
              }
            }
            if (allArr[allArr.length - 1][0] == nod[0][0] && allArr[allArr.length - 1][1] == nod[0][1]) {
              for (let w = 0; w < nod.length; w++) {
                allArr.push(nod[w])
              }
            }
          }
          node.nodes = allArr
        }else{
          
        }
        // if (node.nodes.outer.length == 0 || node.nodes.inner.length == 0) {
        //   node.type = 'polygon'
        //   let nodeArr = []
        //   let allArr
        //   if (node.nodes.outer.length == 0) {
        //     allArr = node.nodes.inner
        //   } else {
        //     allArr = node.nodes.outer
        //   }
        //   nodeArr = allArr[0]
        //   for (let q = 0; q < allArr.length; q++) {
        //     let arr = allArr[q]
        //     if (nodeArr[nodeArr.length - 1][0] == arr[0][0] && nodeArr[nodeArr.length - 1][1] == arr[0][1]) {
        //       for (let w = 0; w < arr.length; w++) {
        //         nodeArr.push(arr[w])
        //       }
        //     }
        //   }
        //   node.nodes = nodeArr
        // } else {
        //   for (let q in node.nodes) {
        //     let er = node.nodes[q]
        //     let nodeArr = []
        //     for (let w = 0; w < er.length; w++) {
        //       for (let e = 0; e < er.length; e++) {
        //         if (er[w][er[w].length - 1][0] == er[e][0][0] && er[w][er[w].length - 1][1] == er[e][0][1]) {

        //         }
        //       }
        //     }
        //   }
        // }
      }
    }
  }
  getAttributes(list, name) {
    for (let i = 0; i < list.length; i++) {
      let l = list[i]
      if (l.name == name) {
        return l.value
      }
    }
    return 0
  }
}
export default SObject
