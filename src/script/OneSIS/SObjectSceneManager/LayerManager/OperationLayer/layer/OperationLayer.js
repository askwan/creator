import mercatorProj from '../mercatorProj/mercatorProj'
import make from '../data/make'
import UpdateFn from './UpdateFn'
import MouseFn from './MouseFn'
class OperationLayer {
  constructor() {
    this.id = 'OperationLayer';
    this.type = 'custom';
    this.renderingMode = '3d';

    this.camera = new THREE.Camera();
    this.scene = new THREE.Scene();

    this.sceneP = new THREE.Scene();
    this.rendererP = ''

    this.map = '' //地图
    this.renderer = '' //渲染器

    this.lonlat = [] //中心坐标

    this.group = '' //最外层的组
    this.groupP = '' //最外层的组

    this.cWidth = '' //地图视口的宽
    this.cHeight = '' //地图视口的高

    this.pitch = ''
    this.bearing = ''

    this.selectType = 'translate'
    // this.selectType = 'rotate'
    // this.selectType = 'scale'

    this.lamplight()
  }
  setLonLat(lonlat) {
    this.lonlat = lonlat
    MouseFn.setLonLat(lonlat)
  }
  lamplight() {
    let l = new THREE.AmbientLight(0xffffff, 0.4)
    this.scene.add(l)

    var light = new THREE.DirectionalLight(0xffffff, 0.5);
    light.position.set(-50000, -50000, 50000);
    this.scene.add(light);

    var lights = new THREE.DirectionalLight(0xffffff);
    lights.position.set(50000, 50000, 50000);
    this.scene.add(lights);

    let ls = new THREE.AmbientLight(0xffffff)
    this.sceneP.add(ls)
  }


  onAdd(map, gl) {
    this.map = map;
    this.renderer = new THREE.WebGLRenderer({
      canvas: map.getCanvas(),
      context: gl
    });
    this.renderer.autoClear = false;

    this.rendererP = new THREE.WebGLRenderer({
      antialias: true
    });

    this.rendererP.setPixelRatio(window.devicePixelRatio);
    let widthHeight = {
      width: this.renderer.domElement.clientWidth,
      height: this.renderer.domElement.clientHeight
    }
    // let widthHeight=this.renderer.getSize()
    this.rendererP.setSize(widthHeight.width, widthHeight.height);
    this.pickingTexture = new THREE.WebGLRenderTarget(widthHeight.width, widthHeight.height);
    this.pickingTexture.texture.minFilter = THREE.LinearFilter;
    this.resetView()
  }
  resetView() {
    this.group = ''
    this.group = new THREE.Group() //总的组
    this.group.name = 'allGroup' //总的组
    this.scene.add(this.group);

    this.groupP = ''
    this.groupP = new THREE.Group() //总的组
    this.groupP.name = 'allGroup' //总的组
    this.sceneP.add(this.groupP);
  }
  remove() {
    this.scene.remove(this.group);
    this.sceneP.remove(this.groupP);

    this.resetView()
  }

  add() {
    this.groupP.add(make.addP())
    this.group.add(make.add())
  }

  render(gl, matrix) {

    let mapCenter = this.map.getCenter()
    //经纬度转坐标
    let translate = mercatorProj.fromLL(mapCenter.lng, mapCenter.lat)

    const m = new THREE.Matrix4().fromArray(matrix);
    const l = new THREE.Matrix4().makeTranslation(translate.x, translate.y, 0)
      .scale(new THREE.Vector3(mercatorProj.scale, -mercatorProj.scale, mercatorProj.scale));

    //改变的
    this.updateFn(gl, matrix, mapCenter, translate)

    this.camera.projectionMatrix.elements = matrix;
    this.camera.projectionMatrix = m.multiply(l);

    this.renderer.state.reset();

    this.rendererP.render(this.sceneP, this.camera, this.pickingTexture);
    this.renderer.render(this.scene, this.camera);

    let widthHeight = {
      width: this.renderer.domElement.clientWidth,
      height: this.renderer.domElement.clientHeight
    }
    // let widthHeight=this.renderer.getSize()
    this.rendererP.setPixelRatio(window.devicePixelRatio);
    this.rendererP.setSize(widthHeight.width, widthHeight.height);
    this.pickingTexture.setSize(widthHeight.width, widthHeight.height);

    this.map.triggerRepaint();
  }
  updateFn(gl, matrix, mapCenter, translate) {
    this.transition(gl, matrix, mapCenter, translate, this.group)
    this.transition(gl, matrix, mapCenter, translate, this.groupP)
    this.setWidthHeight()
    this.setAngle()
  }
  transition(gl, matrix, mapCenter, translate, group) {
    if (group) {
      let lonlat = mercatorProj.lonLat2Mercator(this.lonlat[0], this.lonlat[1])
      let mapPosition = mercatorProj.lonLat2Mercator(mapCenter.lng, mapCenter.lat)

      group.position.x = (lonlat.x - mapPosition.x) / 2
      group.position.y = (lonlat.y - mapPosition.y) / 2
      group.position.z = 0
      //缩小
      group.scale.x = 0.5
      group.scale.y = 0.5
      group.scale.z = 0.5
    }
  }
  setWidthHeight() {
    this.cWidth = this.map.getCanvas().width
    this.cHeight = this.map.getCanvas().height
  }

  setAngle() {
    this.pitch = this.map.getPitch()
    this.bearing = this.map.getBearing()
    //刷新操作线
    UpdateFn.updateShow(this.bearing, this.pitch, this.selectType, make.gizmo)
    UpdateFn.updateShow(this.bearing, this.pitch, this.selectType, make.gizmoP)

    MouseFn.setPitchAndBearing(this.pitch, this.bearing)
  }
  //改变选择状态
  setType(val) {
    this.selectType = val
  }
  setShow(val) {
    this.group.visible = val
    this.groupP.visible = val
  }
  setZoom(num) {
    let n =1.8
    let big=Math.pow(n,(25 - num))
    this.group.children[0].scale.x = big
    this.group.children[0].scale.y = big
    this.group.children[0].scale.z = big
    this.groupP.children[0].scale.x = big
    this.groupP.children[0].scale.y = big
    this.groupP.children[0].scale.z = big
    // this.group.visible = val
    //   this.groupP.visible = val
  }
  changeSlider(val, allLayer) {
    MouseFn.changeSlider(val, this.group, this.groupP, allLayer)
  }
  changeSliderEnd(allLayer) {
    MouseFn.changeSliderEnd(allLayer)
  }
  //按下拖动
  mouseDrag(e, allLayer) {
    MouseFn.mouseDrag(e, this.group, this.groupP, allLayer)
  }
  //鼠标移动拾取
  mousePick(e) {
    let client = {
      x: e.point.x,
      y: e.point.y,
    }
    let id = this.getColorId(client)
    MouseFn.mousePick(e, this.group, this.groupP, id)

  }
  //鼠标抬起
  mouseupPick(e, allLayer) {
    MouseFn.mouseupPick(e, this.map, allLayer)

  }
  //鼠标按下
  mousedownPick(e) {
    MouseFn.mousedownPick(e, this.map)

  }
  getColorId(client) {
    let pixelBuffer = new Uint8Array(4);
    this.rendererP.readRenderTargetPixels(this.pickingTexture, client.x, this.pickingTexture.height - client.y, 1, 1, pixelBuffer);
    let id = (pixelBuffer[0] << 16) | (pixelBuffer[1] << 8) | (pixelBuffer[2]);
    return id
  }

  update() {
    this.map.triggerRepaint();
  }
}
export default OperationLayer
