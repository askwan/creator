import mercatorProj from '../manage/mercatorProj'
import getColor from '../manage/getColor'
// import {
//   getEditor
// } from '@/script/operate'

class publicFun {
  constructor() {

  }
 
  getColors(object) {
    return getColor.getColor(object)
  }
  // getOsmWay(id) {
  //   let IdEditor = getEditor();
  //   return IdEditor.idContext.entity(id)
  // }
  getPlace(lonLat, lonlatNow) {
    let old = mercatorProj.lonLat2Mercator(lonLat[0], lonLat[1])
    let newd = mercatorProj.lonLat2Mercator(lonlatNow[0], lonlatNow[1])
    let v = new THREE.Vector2(old.x - newd.x, old.y - newd.y)
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
