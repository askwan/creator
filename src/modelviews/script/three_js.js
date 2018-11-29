import mercatorProj from './manage/mercatorProj'
import {
  getEditor
} from '@/script/operate'
class three_js {
  constructor(center) {
    this.id = 'mycustomlayer';
    this.type = 'custom';
    this.renderingMode = '3d';

    this.coordinate = center

    this.camera = new THREE.Camera();
    this.scene = new THREE.Scene();
    this.map = ''
    this.renderer = ''

    this.mesh = ''
    this.lamplight()
    // this.getData()
  }
  /**
   * 添加灯光 --环境光
   */
  lamplight() {
    let light = new THREE.AmbientLight(0xffffff)
    this.scene.add(light)
  }
  getPlace(id, coordinate) {
    let IdEditor = getEditor();
    let p = IdEditor.idContext.entity(id).loc
    let ps = mercatorProj.lonLat2Mercator(coordinate[0] - p[0], coordinate[1] - p[1])
    // let ps = mercatorProj.lonLat2Mercator(p[0]-coordinate[0], p[1]-coordinate[1])
    console.log(ps)
    let v = new THREE.Vector2(ps.x, ps.y)
    return v
  }
  getData(data, osmWay, coordinate) {
    // this.coordinate=coordinate
    console.log(data, 111111)
    console.log(osmWay)
    // this.addModel()
    // return
    let forms = data.object.forms
    console.log(forms)
    for (let i = 0; i < forms.length; i++) {
      let from = forms[i]
      if (from.type == 23) {
        let arr = []
        for (let q = 0; q < osmWay.nodes.length; q++) {
          let id = osmWay.nodes[q]
          arr.push(this.getPlace(id, coordinate))
        }
        console.log(arr)

        let shape = new THREE.Shape(arr);

        let extrudeSettings = {
          steps: 2,
          depth: 2,
          bevelEnabled: true,
          bevelThickness: 1,
          bevelSize: 1,
          bevelSegments: 1
        };
        let geometry = new THREE.ExtrudeBufferGeometry(shape, extrudeSettings);
        let material = new THREE.MeshBasicMaterial({
          color: 0x00ff00
        });
        let mesh = new THREE.Mesh(geometry, material);
        let po = mercatorProj.lonLat2Mercator(coordinate[0], coordinate[1])
        // let po = mercatorProj.lonLat2Mercator(coordinate[0]-this.coordinate[0], coordinate[1]-this.coordinate[1])
        // let po = mercatorProj.lonLat2Mercator(this.coordinate[0]-coordinate[0], this.coordinate[1]-coordinate[1])
        console.log(po)
        mesh.position.x = po.x / 2
        mesh.position.y = po.y / 2
        mesh.position.z = 10
        // mesh.scale.x=10000
        // mesh.scale.y=10000
        // mesh.scale.z=10
        console.log(mesh)
        if (this.mesh) {
          this.scene.remove(this.mesh);
        }
        this.scene.add(mesh);
        this.mesh = mesh
        console.log(this.scene)

      }else if(from.type == 50){
        let arr=[]
    let p = osmWay.loc

    let ps = mercatorProj.lonLat2Mercator(p[0], p[1])
    let v = new THREE.Vector2(ps.x, ps.y)
    console.log(v,from.formref.refid)
    let loader = new THREE.GLTFLoader();
    loader.load('http://bt1.geosts.ac.cn/api/dae/model-service/model/rest/v0.1.0/datastore/slave/model/file/download/'+from.formref.refid, gltf => {
      // gltf.scene.rotation.x += Math.PI / 2
      // gltf.scene.position.y += 100
      // gltf.scene.position.z += 1000
      // gltf.scene.scale.x +=10
      // gltf.scene.scale.y += 10
      // gltf.scene.scale.z += 10
      this.car = gltf.scene
      this.scene.add(gltf.scene)
    }, undefined, function (e) {
      console.error(e);
    });
      }
    }
  }
  addModel() {
    var geometry = new THREE.BoxBufferGeometry(1000000, 500000, 100);
    var material = new THREE.MeshBasicMaterial({
      color: 0x00ff00
    });

    var cubeA = new THREE.Mesh(geometry, material);
    // cubeA.position.set(100, 100, 0);

    // var cubeB = new THREE.Mesh(geometry, material);
    // cubeB.position.set(-100, -100, 0);

    //create a group and add the two cubes
    //These cubes can now be rotated / scaled etc as a group
    var group = new THREE.Group();
    group.add(cubeA);
    // group.add(cubeB);

    this.scene.add(group);

    // let loader = new THREE.GLTFLoader();
    // loader.load('/static/gltf/liaoninghao.glb', gltf => {
    //   gltf.scene.rotation.x += Math.PI / 2
    //   gltf.scene.position.y += 100
    //   gltf.scene.scale.x += 10
    //   gltf.scene.scale.y += 10
    //   gltf.scene.scale.z += 10
    //   this.car = gltf.scene
    //   this.scene.add(gltf.scene)
    // }, undefined, function (e) {
    //   console.error(e);
    // });
  }
  onAdd(map, gl) {
    this.map = map;
    this.renderer = new THREE.WebGLRenderer({
      canvas: map.getCanvas(),
      context: gl
    });
    this.renderer.autoClear = false;
    // console.log(this.map)
    // console.log(this.scene)
    // console.log(this.renderer)
    console.log('----------------------------------')
    // this.addModel()
  }
  render(gl, matrix) {
    let mapCenter = this.map.getCenter()

    //经纬度转坐标
    // let translate = mercatorProj.fromLL(mapCenter.lng, mapCenter.lat)
    // let translate = mercatorProj.fromLL(this.coordinate[0], this.coordinate[1])
    let translate = mercatorProj.fromLL(0,0)

    const m = new THREE.Matrix4().fromArray(matrix);
    const l = new THREE.Matrix4().makeTranslation(translate.x, translate.y, 0)
      .scale(new THREE.Vector3(mercatorProj.scale, -mercatorProj.scale, mercatorProj.scale));

    //改变的
    this.change(gl, matrix)

    this.camera.projectionMatrix.elements = matrix;
    this.camera.projectionMatrix = m.multiply(l);
    this.renderer.state.reset();
    this.renderer.render(this.scene, this.camera);
    this.map.triggerRepaint();
  }
  change() {

  }

}
export default three_js
