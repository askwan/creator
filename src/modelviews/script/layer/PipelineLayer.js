import mercatorProj from '../manage/mercatorProj'

import {
  State
} from '@/script/editor/utils/store'

import Point from './createGeometry/Point'
import Line from './createGeometry/Line'
import Polygon from './createGeometry/Polygon'

class PipelineLayer {
  constructor() {
    this.id = 'pipeline';
    this.type = 'custom';
    this.renderingMode = '3d';

    this.camera = new THREE.Camera();
    this.scene = new THREE.Scene();
    this.map = ''
    this.renderer = ''

    this.lonlat = []

    this.group = ''
    this.pointGroup = ''
    this.lineGroup = ''
    this.polygonGroup = ''
    this.tierGroup = ''

    this.point = new Point()
    this.line = new Line()
    this.polygon = new Polygon()
    this.lamplight()
  }
  /**
   * 添加灯光 --环境光
   */
  lamplight() {
    let l = new THREE.AmbientLight(0xffffff, 0.4)
    this.scene.add(l)
    var light = new THREE.DirectionalLight(0xffffff, 0.5);
    light.position.set(-50000, -50000, 50000);
    this.scene.add(light);

    var lights = new THREE.DirectionalLight(0xffffff);
    lights.position.set(50000, 50000, 50000);
    this.scene.add(lights);
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

  createBuildingTier(list, num) {
    for (let i = 0; i < list.length; i++) {
      let child = list[i]
      for (let q = 0; q < child.forms.length; q++) {
        let form = child.forms[q]
        if (form.type == 23) {
          let entityId = form.geom
          if (entityId) {
            this.polygonGroup.add(this.polygon.createPolygon(this.lonlat, child, entityId, num))
          }
        } else if (form.type == 22) {
          let entityId = form.geom
          if (entityId) {
            this.lineGroup.add(this.line.createLine(this.lonlat, child, entityId, num))
          }
        } else if (form.type == 21) {
          let entityId = form.geom
          if (entityId) {
            this.pointGroup.add(this.point.createPoint(this.lonlat, child, entityId, num))
          }
        }
      }
    }
  }
  
  createPolygon(sobject){
let polygon=sobject.getFormPolygon();
  }

  addGeometry(data, type) {
    this.remove()
    let object = data.object
    let geoBox = object.geoBox
    this.lonlat = [(geoBox.maxx + geoBox.minx) / 2, (geoBox.maxy + geoBox.miny) / 2]
    let entityId = data.entityId
    if (!entityId) {
      return
    }
    if (type == 21) {
      this.addPoint(object, entityId)
    } else if (type == 22) {
      this.addLine(object, entityId)
    } else if (type == 23) {
      this.addPolygon(object, entityId)
    }

  }
  addPolygon(object, entityId) {
    let list = this.getChildren(object.id);
    if (list.length > 0) {
      list = this.getMessage(list)
      this.createBuildingTier(list, 0);
      this.tierGroup.add(this.polygon.createPolygon(this.lonlat, object, entityId));
    } else {
      this.polygonGroup.add(this.polygon.createPolygon(this.lonlat, object, entityId));
    }
  }
  addLine(object, entityId) {
    this.lineGroup.add(this.line.createLine(this.lonlat, object, entityId));
  }
  addPoint(object, entityId) {
    let list = this.getChildren(object.id);
    if (list.length > 0) {
      this.otypeBuilding(list)
    } else {
      this.pointGroup.add(this.point.createPoint(this.lonlat, object, entityId));
    }
  }
  otypeBuilding(data) {
    for (let i = 0; i < data.length; i++) {
      let object = data[i]
      let geoBox = object.geoBox
      let lonlat = [(geoBox.maxx + geoBox.minx) / 2, (geoBox.maxy + geoBox.miny) / 2]
      let objId = object.id
      let list = this.getChildren(objId);
      list = this.getMessage(list)
      if (object.otype.name != '楼层') {
        this.otypeBuilding(list)
      } else {
        if (list.length > 0) {
          let entityId = object.forms[0].geom
          if (entityId) {
            let num = parseInt(this.getAttributes(object.attributes, "FLOOR"))
            let height = this.getAttributes(object.attributes, 'height')
            this.createBuildingTier(list, num * height);
            this.tierGroup.add(this.polygon.createPolygon(this.lonlat, object, entityId, num * height));
          }
        }
      }
    }
  }
  getChildren(id) {
    return State.getSobjectByParents(id);
  }
  getMessage(list) {
    return list.filter(el => State.sobjects[el.id]).map(el => State.sobjects[el.id])
  }
  remove() {
    console.log('remove')
    this.scene.remove(this.group);
    this.resetView()
  }
  resetView() {
    this.group = ''
    this.pointGroup = ''
    this.lineGroup = ''
    this.polygonGroup = ''
    this.tierGroup = ''

    this.group = new THREE.Group() //总的组
    this.pointGroup = new THREE.Group() //点的组
    this.lineGroup = new THREE.Group() //线的组
    this.polygonGroup = new THREE.Group() //普通几何的组
    this.tierGroup = new THREE.Group() //楼层几何的组

    this.group.add(this.pointGroup);
    this.group.add(this.lineGroup);
    this.group.add(this.polygonGroup);
    this.group.add(this.tierGroup);
    this.scene.add(this.group);
  }
  onAdd(map, gl) {
    this.map = map;
    this.renderer = new THREE.WebGLRenderer({
      canvas: map.getCanvas(),
      context: gl
    });
    this.renderer.autoClear = false;
    // this.resetView()

  }
  transition(gl, matrix, mapCenter, translate) {
    if (this.group) {
      let lonlat = mercatorProj.lonLat2Mercator(this.lonlat[0], this.lonlat[1])
      let mapPosition = mercatorProj.lonLat2Mercator(mapCenter.lng, mapCenter.lat)
      this.group.position.x = (lonlat.x - mapPosition.x) / 2
      this.group.position.y = (lonlat.y - mapPosition.y) / 2
      this.group.position.z = 0
      //缩小
      this.group.scale.x = 0.5
      this.group.scale.y = 0.5
      this.group.scale.z = 0.5
    }
  }
  render(gl, matrix) {
    let mapCenter = this.map.getCenter()
    //经纬度转坐标
    let translate = mercatorProj.fromLL(mapCenter.lng, mapCenter.lat)

    const m = new THREE.Matrix4().fromArray(matrix);
    const l = new THREE.Matrix4().makeTranslation(translate.x, translate.y, 0)
      .scale(new THREE.Vector3(mercatorProj.scale, -mercatorProj.scale, mercatorProj.scale));

    //改变的
    // this.transition(gl, matrix, mapCenter, translate)

    this.camera.projectionMatrix.elements = matrix;
    this.camera.projectionMatrix = m.multiply(l);
    this.renderer.state.reset();
    this.renderer.render(this.scene, this.camera);
    this.map.triggerRepaint();
  }


}
export default PipelineLayer
