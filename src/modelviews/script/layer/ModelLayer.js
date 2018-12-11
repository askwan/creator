import mercatorProj from '../manage/mercatorProj'
import {
  getEditor
} from '@/script/operate'
class ModelLayer {
  constructor() {
    this.id = 'model';
    this.type = 'custom';
    this.renderingMode = '3d';

    this.camera = new THREE.Camera();
    this.scene = new THREE.Scene();
    this.map = ''
    this.renderer = ''

    this.lonlat = []
    this.mesh = ''
    this.lamplight()
  }
  /**
   * 添加灯光 --环境光
   */
  lamplight() {
    let light = new THREE.AmbientLight(0xffffff)
    this.scene.add(light)

    // let lights = new THREE.DirectionalLight( 0xffffff, 0.5 );
    // lights.position.set(-500, 500, -500);

    // this.scene.add(lights)
  }

  addModel(data, from) {
    let IdEditor = getEditor();
    let osmWay = IdEditor.idContext.entity(data.entityId);
    this.lonlat = osmWay.loc
    let style = from.style[0]
    let loader = new THREE.GLTFLoader();
    loader.load('http://bt1.geosts.ac.cn/api/dae/model-service/model/rest/v0.1.0/datastore/slave/model/file/download/' + from.formref.refid, gltf => {
      gltf.scene.rotation.x += Math.PI / 2
      if (style) {
        gltf.scene.scale.x = style.scale ? style.scale : 1
        gltf.scene.scale.y = style.scale ? style.scale : 1
        gltf.scene.scale.z = style.scale ? style.scale : 1
        gltf.scene.rotation.x += (style.x / 180) * Math.PI
        gltf.scene.rotation.y += (style.y / 180) * Math.PI
        gltf.scene.rotation.z += (style.z / 180) * Math.PI
        gltf.scene.position.z = style.h ? style.h : 0
      }

      if (this.mesh) {
        this.scene.remove(this.mesh);
      }
      this.scene.add(gltf.scene);
      this.mesh = gltf.scene
    }, undefined, (e) => {
      if (this.mesh) {
        this.scene.remove(this.mesh);
      }
      this.mesh = ''
      console.error('模型错误', e);
    });

  }
  remove() {
    if (this.mesh) {
      this.scene.remove(this.mesh);
    }
    this.mesh = ''
  }
  onAdd(map, gl) {
    this.map = map;
    this.renderer = new THREE.WebGLRenderer({
      canvas: map.getCanvas(),
      context: gl
    });
    this.renderer.autoClear = false;
  }
  transition(gl, matrix, mapCenter, translate) {
    if (this.mesh) {
      let position = mercatorProj.lonLat2Mercator(this.lonlat[0] - mapCenter.lng, this.lonlat[1] - mapCenter.lat)
      this.mesh.position.x = position.x / 2
      this.mesh.position.y = position.y / 2
      this.mesh.position.z = 0
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
export default ModelLayer
