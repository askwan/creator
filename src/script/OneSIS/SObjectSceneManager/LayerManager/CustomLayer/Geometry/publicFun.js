import mercatorProj from '../manage/mercatorProj'
import getColor from '../manage/getColor'

class publicFun {
  constructor() {

  }
 
  getColors(object) {
    return getColor.getColor(object)
  }

  getPlace(lonLat, lonlatNow) {
    let old = mercatorProj.lonLat2Mercator(lonLat[0], lonLat[1])
    let newd = mercatorProj.lonLat2Mercator(lonlatNow[0], lonlatNow[1])
    // let v = new THREE.Vector2(old.x - newd.x, old.y - newd.y)
    let v = new THREE.Vector3(old.x - newd.x, old.y - newd.y,0)
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
