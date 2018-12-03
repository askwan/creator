import mercatorProj from '../manage/mercatorProj'
import randomColor from '../manage/randomColor'

import {
  getEditor
} from '@/script/operate'
import {
  State
} from '@/script/editor/utils/store'
import {
  objectServer,
} from '@/script/server'


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
    this.geometryGroup = ''
    this.tierGroup = ''
    this.towerGroup = ''
    this.lamplight()
  }
  /**
   * 添加灯光 --环境光
   */
  lamplight() {
    let light = new THREE.AmbientLight(0xffffff)
    this.scene.add(light)
  }
  getOsmWay(id) {
    let IdEditor = getEditor();
    return IdEditor.idContext.entity(id)
  }
  getPlace(id) {
    let lonLat = this.getOsmWay(id).loc
    let old = mercatorProj.lonLat2Mercator(lonLat[0], lonLat[1])
    let newd = mercatorProj.lonLat2Mercator(this.lonlat[0], this.lonlat[1])
    let v = new THREE.Vector2(old.x - newd.x, old.y - newd.y)

    // let mercator = mercatorProj.lonLat2Mercator(lonLat[0] - this.lonlat[0], lonLat[1] - this.lonlat[1])
    // let v = new THREE.Vector2(mercator.x, mercator.y)
    return v
  }

  createGeometry(object, entityId, num, node) {
    let geoBox = object.geoBox
    let osmWay = this.getOsmWay(entityId)
    let lonlatArr = []
    for (let q = 0; q < osmWay.nodes.length - 1; q++) {
      let id = osmWay.nodes[q]
      lonlatArr.push(this.getPlace(id, geoBox))
    }
    let shape = new THREE.Shape(lonlatArr);
    let extrudeSettings = {
      steps: 2,
      depth: 2,
      bevelEnabled: false,
      bevelThickness: 1,
      bevelSize: 1,
      bevelSegments: 1
    };
    let geometry = new THREE.ExtrudeBufferGeometry(shape, extrudeSettings);
    let material = new THREE.MeshBasicMaterial({
      color: this.getColor()
    });
    let mesh = new THREE.Mesh(geometry, material);
    mesh.position.z += 20 * num
    if (node) {
      mesh.position.z += 3
    }
    return mesh

  }

  createBuildingTier(object, num) {
    let group = new THREE.Group()
    for (let i = 0; i < object.children.length; i++) {
      let child = object.children[i]
      for (let q = 0; q < child.forms.length; q++) {
        let form = child.forms[q]
        if (form.type == 23) {
          let entityId = form.geom

          group.add(this.createGeometry(child, entityId, num, true))
        }
      }
    }
    return group
  }

  addGeometry(data) {
    this.remove()
    let object = data.object
    let geoBox = object.geoBox
    this.lonlat = [(geoBox.maxx + geoBox.minx) / 2, (geoBox.maxy + geoBox.miny) / 2]
    let entityId = data.entityId
    objectServer.query({
      parents: object.id,
      geoEdit: true
    }).then(d => {
      if (d.list.length > 0) {
        d.list = d.list.filter(el => State.sobjects[el.id]).map(el => State.sobjects[el.id])
        object.children = d.list
        this.tierGroup.add(this.createBuildingTier(object, 0));
        this.tierGroup.add(this.createGeometry(object, entityId, 0));
      } else {
        this.geometryGroup.add(this.createGeometry(object, entityId, 0));
      }
    });

  }
  addBuilding(allData, data) {
    this.remove()
    let geoBoxs = allData.object.geoBox
    this.lonlat = [(geoBoxs.maxx + geoBoxs.minx) / 2, (geoBoxs.maxy + geoBoxs.miny) / 2]
    for (let i = 0; i < data.length; i++) {
      let object = data[i]
      let geoBox = object.geoBox
      let lonlat = [(geoBox.maxx + geoBox.minx) / 2, (geoBox.maxy + geoBox.miny) / 2]
      let objId = object.id
      objectServer.query({
        parents: objId,
        geoEdit: true
      }).then(d => {
        if (d.list.length > 0) {
          d.list = d.list.filter(el => State.sobjects[el.id]).map(el => State.sobjects[el.id])
          object.children = d.list
          let entityId = object.forms[0].geom
          let num = parseInt(object.attributes[0].value) + 1
          this.towerGroup.add(this.createBuildingTier(object, num));
          this.tierGroup.add(this.createGeometry(object, entityId, num));

        }
      });
    }
  }
  remove() {
    console.log('remove')
    this.scene.remove(this.group);
    this.resetView()
  }
  resetView() {
    this.geometryGroup = ''
    this.tierGroup = ''
    this.towerGroup = ''
    this.group = ''
    this.geometryGroup = new THREE.Group() //几何的组
    this.tierGroup = new THREE.Group() //楼层的组
    this.towerGroup = new THREE.Group() //楼的组
    this.group = new THREE.Group()
    this.group.add(this.geometryGroup);
    this.group.add(this.tierGroup);
    this.group.add(this.towerGroup);
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
  bg3(saturation, value) {
    let ratio = 0.618033988749895
    let hue = Math.random()

    hue += ratio
    hue %= 1

    if (typeof saturation !== 'number') {
      saturation = 0.5
    }

    if (typeof value !== 'number') {
      value = 0.95
    }

    return randomColor({
      h: hue * 360,
      s: saturation * 100,
      v: value * 100
    })
  }

  getColor() {
    //定义字符串变量colorValue存放可以构成十六进制颜色值的值
    var colorValue = "0,1,2,3,4,5,6,7,8,9,a,b,c,d,e,f";
    //以","为分隔符，将colorValue字符串分割为字符数组["0","1",...,"f"]
    var colorArray = colorValue.split(",");
    var color = "#"; //定义一个存放十六进制颜色值的字符串变量，先将#存放进去
    //使用for循环语句生成剩余的六位十六进制值
    for (var i = 0; i < 6; i++) {
      //colorArray[Math.floor(Math.random()*16)]随机取出
      // 由16个元素组成的colorArray的某一个值，然后将其加在color中，
      //字符串相加后，得出的仍是字符串
      color += colorArray[Math.floor(Math.random() * 16)];
    }
    return color;
  }
}
export default BuildingLayer
