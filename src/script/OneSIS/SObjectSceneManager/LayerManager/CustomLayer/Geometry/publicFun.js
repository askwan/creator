import mercatorProj from '../manage/mercatorProj'
import getColor from '../manage/getColor'

class publicFun {
  constructor() {

  }
  getDataObj(lonlat, sobject, node) {
    let obj = {}
    let multiple
    let floor = sobject.floor
    //是否透明   是楼层透明
    if (sobject.isfloor) {
      obj.transparent = true
      obj.haveLine = true
      multiple = 0.95
    } else {
      obj.transparent = false
      multiple = 0.9
      obj.haveLine = false
    }
    //自身高度
    let selfHeight = 0
    //顶据地高度
    let heightLength = this.getAttributes(sobject.data.attributes, 'height')
    //底据地高度
    let minHeightLength = this.getAttributes(sobject.data.attributes, 'min_height')
    if (!minHeightLength) {
      minHeightLength = this.getAttributes(sobject.data.attributes, 'minheight')

    }
    selfHeight = (Number(heightLength) - Number(minHeightLength)) * multiple
    obj.selfHeight = selfHeight ? selfHeight : 0
    obj.height = Number(heightLength) ? Number(heightLength) : 0
    obj.minHeight = Number(minHeightLength) ? Number(minHeightLength) : 0
    if (selfHeight <= 0) {
      obj.selfHeight = Math.abs(selfHeight)
      obj.haveLine = false
    }
    return this.getLonLatArr(lonlat, sobject, node, obj)
  }
  getLonLatArr(lonlat, sobject, node, obj) {
    let lonlatArr = []
    if (node.type == "multiPolygon") {
      let sideLonlatArr = []
      let allArrs = []
      for (let y = 0; y < node.nodes.length; y++) {
        let n = node.nodes[y]
        let allArr = []
        for (let i = 0; i < n.length; i++) {
          let der = n[i]
          let arr = []
          let arrObj = {}
          for (let q = 0; q < der.length - 1; q++) {
            let z = der[q]
            let oldarr = []
            if (!arrObj[z[0] + '~' + z[1]]) {
              arrObj[z[0] + '~' + z[1]] = z
              arr.push(new poly2tri.Point(z[0], z[1]))
              let next = der[q + 1]
              if (next) {
                oldarr.push(this.getMultiPolygonPlace(z, lonlat, true))
                oldarr.push(this.getMultiPolygonPlace(next, lonlat, true))
              } else {
                oldarr.push(this.getMultiPolygonPlace(next, lonlat, true))
                oldarr.push(this.getMultiPolygonPlace(der[0], lonlat, true))
              }
              sideLonlatArr.push(oldarr)
            }
          }
          allArr.push(arr)
        }
        allArrs.push(allArr)
      }
      let swctx
      for (let i =0; i < allArrs.length; i++) {
        let o = allArrs[i]
        let triangles
        try {
          swctx = new poly2tri.SweepContext(o[0]);
          for (let q = 1; q < o.length; q++) {
            swctx.addHole(o[q]);
          }
          swctx.triangulate()
          triangles = swctx.getTriangles();
          triangles.forEach((t) => {
            let p = t.getPoints()
            let ar = []
            p.forEach(po => {
              ar.push(this.getMultiPolygonPlace(po, lonlat, false))
            })
            lonlatArr.push(ar)
          });
        } catch (arr) {
          console.log('错误数据', arr)
          return obj
        }
      }
      obj.sideLonlatArr = sideLonlatArr
    } else {
      for (let q = 0; q < node.nodes.length; q++) {
        let coor = node.nodes[q]
        let type = node.type
        lonlatArr.push(this.getPlace(coor, lonlat))
        if (type == 'line' && sobject.height != sobject.min_height) {
          lonlatArr.push(this.getLinePlace(coor, lonlat, sobject.height, sobject.min_height))
        }
      }
    }
    obj.lonlatArr = lonlatArr
    return obj
  }
  getColors(object) {
    return getColor.getColor(object)
  }

  getPlace(lonLat, lonlatNow) {
    let old = mercatorProj.lonLat2Mercator(lonLat[0], lonLat[1])
    let newd = mercatorProj.lonLat2Mercator(lonlatNow[0], lonlatNow[1])
    let v = new THREE.Vector3(old.x - newd.x, old.y - newd.y, 0)
    return v
  }
  getLinePlace(lonLat, lonlatNow, height, min_height) {
    let old = mercatorProj.lonLat2Mercator(lonLat[0], lonLat[1])
    let newd = mercatorProj.lonLat2Mercator(lonlatNow[0], lonlatNow[1])
    let v = new THREE.Vector3(old.x - newd.x, old.y - newd.y, height - min_height)
    return v
  }
  getMultiPolygonPlace(lonLat, lonlatNow, or) {
    let old
    if (or) {
      old = mercatorProj.lonLat2Mercator(lonLat[0], lonLat[1])
    } else {
      old = mercatorProj.lonLat2Mercator(lonLat.x, lonLat.y)
    }
    let newd = mercatorProj.lonLat2Mercator(lonlatNow[0], lonlatNow[1])
    let v = new THREE.Vector3(old.x - newd.x, old.y - newd.y, 0)
    return v
  }
  getAttributes(list, name) {
    for (let i = 0; i < list.length; i++) {
      let l = list[i]
      if (l.name == name) {
        return l.value
      }
    }
    return null
  }
}
export default publicFun
