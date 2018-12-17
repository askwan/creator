import otypeList from '../manage/otypeList'

class SObject {
  constructor(props) {
    this.data = props //源数据

    this.name = '' //名字
    this.id = '' //id
    this.otypeId = '' //otype的id

    this.forms = '' //forms集合
    this.nodes = {} //坐标和种类【点线面】way area node relation
    this.lonlat = '' //中心坐标

    this.layer = '' //在哪个图层
    // this.layer = 'modelLayer' //在哪个图层
    // this.layer = 'pipelineLayer' //在哪个图层
    this.floor = null //第几层
    this.isfloor = false

    this.init()
  }

  init() {
    this.id = this.data.id
    this.name = this.data.name
    this.otypeId = this.data.otype.id
    this.forms = this.data.forms
    this.lonlat = [(this.data.geoBox.maxx + this.data.geoBox.minx) / 2, (this.data.geoBox.maxy + this.data.geoBox.miny) / 2]
    this.setNodes()
    this.setIsFloor()
    this.setLayer()
  }

  setLayer() {
    let connectors = this.data.otype.connectors.connectors
    for (let i = 0; i < connectors.length; i++) {
      let t = connectors[i]
      this.recursionLayer(t, this.data.otype.id)
    }
    if (!this.layer) {
      console.log('没有找到', this.data)
    }
  }
  recursionLayer(type, id) {
    if (type.type == 2) {
      let l = otypeList.getOtype(type.dType.id)
      if (type.dType.id == id) {
        return
      }
      if (l.name == '建筑元素') {
        this.layer = 'buildingLayer'
        return
      } else if (l.name == '管线') {
        this.layer = 'pipelineLayer'
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
    }
  }
  setNodes() {
    for (let i = 0; i < this.forms.length; i++) {
      let form = this.forms[i]
      if (!form.geom) {
        this.forms.forEach(e => {
          if (e.formref.refid == form.formref.refid) {
            form.geom = e.geom
          }
        });
      }
      this.nodes[form.id] = {}
      this.nodes[form.id].nodes = []
      let type = form.type
      if (type == 21) {
        this.nodes[form.id].type = 'point'
      } else if (type == 22) {
        this.nodes[form.id].type = 'line'
      } else if (type == 23) {
        this.nodes[form.id].type = 'polygon'
      } else if (type == 50) {
        this.nodes[form.id].type = 'model'
      }
      if (form.geom.nodes) {
        for (let q = 0; q < form.geom.nodes.length; q++) {
          let n = form.geom.nodes[q]
          this.nodes[form.id].nodes.push([n.x, n.y, n.z])
        }
      } else {
        this.nodes[form.id].nodes.push([form.geom.x, form.geom.y])
      }
    }
  }

}
export default SObject
