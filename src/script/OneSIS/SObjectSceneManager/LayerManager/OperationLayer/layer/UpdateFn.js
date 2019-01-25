// import make from '../c/make'
import UpdateFnObj from './UpdateFnObj'

class UpdateFn {
  constructor(params) {

  }
  updateShow(bearing, pitch, selectType, makeGizmo) {
    for (let q in makeGizmo) {
      let gizmo = makeGizmo[q]
      if (q == selectType) {
        gizmo.visible = true
        if (selectType == 'translate') {
          this.updataTranslate(gizmo, bearing)
        } else if (selectType == 'rotate') {
          this.updataRotate(gizmo, bearing, pitch)
        } else if (selectType == 'scale') {
          this.updataScale(gizmo, bearing)
        }
      } else {
        gizmo.visible = false
      }
    }
  }




  updataTranslate(gizmo, bearing) {
    for (let i = 0; i < gizmo.children.length; i++) {
      let m = gizmo.children[i]
      for (let q in UpdateFnObj.translate) {
        let c = UpdateFnObj.translate[q]
        if (m.name == q) {
          if (c.fwd && m.tag && m.tag == "fwd") {
            m.visible = c.fwd(bearing)
          } else if (c.bwd && m.tag && m.tag == "bwd") {
            m.visible = c.bwd(bearing)
          }
          m.scale.x = c.x(bearing);
          m.scale.y = c.y(bearing);
          m.scale.z = c.z(bearing);
        }
      }
    }
  }
  updataRotate(gizmo, bearing, pitch) {
    for (let i = 0; i < gizmo.children.length; i++) {
      let m = gizmo.children[i]
      for (let q in UpdateFnObj.rotate) {
        let c = UpdateFnObj.rotate[q]
        if (m.name == q) {
          m.rotation.x = c.x(bearing);
          m.rotation.y = c.y(bearing);
          m.rotation.z = c.z(bearing);
        }
      }
    }
  }
  updataScale(gizmo, bearing) {
    for (let i = 0; i < gizmo.children.length; i++) {
      let m = gizmo.children[i]
      for (let q in UpdateFnObj.scale) {
        let c = UpdateFnObj.scale[q]
        if (m.name == q) {
          m.scale.x = c.x(bearing);
          m.scale.y = c.y(bearing);
          m.scale.z = c.z(bearing);
        }
      }
    }
  }
}



let updateFn = new UpdateFn()
export default updateFn