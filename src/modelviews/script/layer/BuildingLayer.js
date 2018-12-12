import mercatorProj from '../manage/mercatorProj'
import randomColor from '../manage/randomColor'
import getColor from '../manage/getColor'
import {
  getEditor
} from '@/script/operate'
import {
  State
} from '@/script/editor/utils/store'



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
    let l = new THREE.AmbientLight(0xffffff,0.4)
    this.scene.add(l)
      //set up the lights
      var light = new THREE.DirectionalLight(0xffffff);
      light.position.set(-50000, 50000, -50000);
      this.scene.add(light);

      var lights = new THREE.DirectionalLight(0xffffff);
      lights.position.set(50000, 50000, 50000);
      this.scene.add(lights);
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
  createLine(lonlatArr, topLength, height) {
    let group = new THREE.Group()
    let line = new THREE.LineBasicMaterial({
      // color: "#73ccff",
      color: "#ffffff",
      // linewidth: 10,
      // opacity: 0.5,
      // transparent: true
    })

    let lonLatHeiBase = []
    let lonLatHeiPeak = []
    let lonLatHeiSide = []
    for (let z = 0; z < lonlatArr.length; z++) {
      let v = new THREE.Vector3(lonlatArr[z].x, lonlatArr[z].y, 0)
      let b = new THREE.Vector3(lonlatArr[z].x, lonlatArr[z].y, height)

      lonLatHeiBase.push(v)
      lonLatHeiPeak.push(b)
      lonLatHeiSide.push(v)
      lonLatHeiSide.push(b)
    }

    lonLatHeiBase.push(lonLatHeiBase[0])
    lonLatHeiPeak.push(lonLatHeiPeak[0])

    let geomBase = new THREE.Geometry().setFromPoints(lonLatHeiBase);
    let geomPeak = new THREE.Geometry().setFromPoints(lonLatHeiPeak);
    let geomSide = new THREE.Geometry().setFromPoints(lonLatHeiSide);

    let wireBase = new THREE.Line(geomBase, line);
    let wirePeak = new THREE.Line(geomPeak, line);
    let wireSide = new THREE.LineSegments(geomSide, line);

    wireBase.position.z += topLength
    wirePeak.position.z += topLength
    wireSide.position.z += topLength

    group.add(wireBase);
    group.add(wirePeak);
    group.add(wireSide);
    return group
  }
  /**
   * 
   * @param {*} object 
   * @param {*} entityId 
   * @param {*} topNum 给楼层的几何向上偏移距离
   */
  createGeometry(object, entityId, topNum) {
    let floorObj = new THREE.Object3D();
    let multiple
    let transparent
    let topLength = topNum < 0 || !topNum ? 0 : topNum * 4
    if (object.otype.name == '楼层') {
      transparent = true
      multiple = 4
    } else {
      transparent = false
      multiple = 2.5
    }
    let color = getColor.getColor(object)
    let heightLength = this.getAttributes(object.attributes, 'height')
    let height = heightLength ? heightLength * multiple : 0.1
    let osmWay = this.getOsmWay(entityId)
    let lonlatArr = []
    // console.log(osmWay)

    for (let q = 0; q < osmWay.nodes.length - 1; q++) {
      let id = osmWay.nodes[q]
      lonlatArr.push(this.getPlace(id, object.geoBox))
    }
    // console.log(JSON.stringify(lonlatArr))
    let shape = new THREE.Shape(lonlatArr);

    let extrudeSettings = {
      steps: 1,
      depth: height,
      bevelEnabled: false,
      bevelThickness: 0,
      bevelSize: 0,
      bevelSegments: 0
    };
    let geometry = new THREE.ExtrudeBufferGeometry(shape, extrudeSettings);
    // let material = new THREE.MeshBasicMaterial({
    //   color: color.color,
    //   // wireframe:true
    // });
    let material = new THREE.MeshPhongMaterial({
      color: color.color,
      // specular: 0x555555, 
      shininess: 30
      // wireframe:true
    });
    
    material.transparent = transparent
    material.opacity = color.opacity
    // material.lights = true
    let mesh = new THREE.Mesh(geometry, material);
    mesh.position.z += topLength
    // mesh.receiveShadow = true;
    // mesh.castShadow = true;


    floorObj.add(mesh);

    floorObj.add(this.createLine(lonlatArr, topLength, height))

    return floorObj

  }

  createBuildingTier(list, num) {
    let group = new THREE.Group()
    for (let i = 0; i < list.length; i++) {
      let child = list[i]
      for (let q = 0; q < child.forms.length; q++) {
        let form = child.forms[q]
        if (form.type == 23) {
          let entityId = form.geom

          group.add(this.createGeometry(child, entityId, num))
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

    let list = State.getSobjectByParents(object.id);
    if (list.length > 0) {
      list = list.filter(el => State.sobjects[el.id]).map(el => State.sobjects[el.id])
      this.tierGroup.add(this.createBuildingTier(list, 0));
      this.tierGroup.add(this.createGeometry(object, entityId));
    } else {
      this.geometryGroup.add(this.createGeometry(object, entityId));
    }


  }
  addBuilding(allData, data) {
    this.remove()
    let geoBoxs = allData.object.geoBox
    this.lonlat = [(geoBoxs.maxx + geoBoxs.minx) / 2, (geoBoxs.maxy + geoBoxs.miny) / 2]
    this.otypeBuilding(data)
  }
  otypeBuilding(data) {
    for (let i = 0; i < data.length; i++) {
      let object = data[i]
      let geoBox = object.geoBox
      let lonlat = [(geoBox.maxx + geoBox.minx) / 2, (geoBox.maxy + geoBox.miny) / 2]
      let objId = object.id
      let list = State.getSobjectByParents(objId);
      list = list.filter(el => State.sobjects[el.id]).map(el => State.sobjects[el.id])
      if (object.otype.name != '楼层') {
        this.otypeBuilding(list)
      } else {
        if (list.length > 0) {
          let entityId = object.forms[0].geom
          let num = parseInt(this.getAttributes(object.attributes, "FLOOR"))
          let height = this.getAttributes(object.attributes, 'height')
          this.towerGroup.add(this.createBuildingTier(list, num * height));
          this.tierGroup.add(this.createGeometry(object, entityId, num * height));

        }
      }


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

  // getColor() {
  //   //定义字符串变量colorValue存放可以构成十六进制颜色值的值
  //   var colorValue = "0,1,2,3,4,5,6,7,8,9,a,b,c,d,e,f";
  //   //以","为分隔符，将colorValue字符串分割为字符数组["0","1",...,"f"]
  //   var colorArray = colorValue.split(",");
  //   var color = "#"; //定义一个存放十六进制颜色值的字符串变量，先将#存放进去
  //   //使用for循环语句生成剩余的六位十六进制值
  //   for (var i = 0; i < 6; i++) {
  //     //colorArray[Math.floor(Math.random()*16)]随机取出
  //     // 由16个元素组成的colorArray的某一个值，然后将其加在color中，
  //     //字符串相加后，得出的仍是字符串
  //     color += colorArray[Math.floor(Math.random() * 16)];
  //   }
  //   return color;
  // }
}
export default BuildingLayer