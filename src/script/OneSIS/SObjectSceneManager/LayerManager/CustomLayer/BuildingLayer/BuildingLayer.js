import mercatorProj from '../manage/mercatorProj'

import Point from '../Geometry/Point'
import Line from '../Geometry/Line'
import Polygon from '../Geometry/Polygon'
import Model from '../Geometry/Model'

class BuildingLayer {
  constructor() {
    this.id = 'building';
    this.type = 'custom';
    this.renderingMode = '3d';

    this.camera = new THREE.Camera();
    this.scene = new THREE.Scene();
    this.map = ''
    this.renderer = ''

    this.lonlat = []

    this.group = ''

    this.allOtypeGroup = {}

    this.cGeometry = {}

    this.lamplight()
    this.init()
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
  init() {
    this.cGeometry.point = new Point()
    this.cGeometry.line = new Line()
    this.cGeometry.polygon = new Polygon()
    this.cGeometry.model = new Model()
  
  }
  setLonLat(lonlat) {
    this.lonlat = lonlat
  }

  add(sobject) {
    if (this.allOtypeGroup[sobject.otypeId]) {

    } else {
      this.allOtypeGroup[sobject.otypeId] = new THREE.Group() 
      this.group.add(this.allOtypeGroup[sobject.otypeId])
    }
    let nodes = sobject.nodes
    for (let i in nodes) {
      let node = nodes[i]
        this.allOtypeGroup[sobject.otypeId].add(this.cGeometry[node.type].create(this.lonlat, sobject,node))
    }
  }

  remove() {
    this.allOtypeGroup={}
    this.scene.remove(this.group);
   
    console.log('remove')

    this.resetView()
  }
  resetView() {
    this.group = ''
    this.group = new THREE.Group() //总的组
    this.scene.add(this.group);
  }
  onAdd(map, gl) {
    this.map = map;
    this.renderer = new THREE.WebGLRenderer({
      canvas: map.getCanvas(),
      context: gl
    });
    this.renderer.autoClear = false;
    this.resetView()

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
    this.transition(gl, matrix, mapCenter, translate)

    this.camera.projectionMatrix.elements = matrix;
    this.camera.projectionMatrix = m.multiply(l);
    this.renderer.state.reset();
    this.renderer.render(this.scene, this.camera);
    this.map.triggerRepaint();
  }


}
export default BuildingLayer