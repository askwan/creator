import publicFun from './publicFun'


class Polygon extends publicFun {
  constructor() {
    super()
  }
  /**
   * 
   * @param {*} object 
   * @param {*} entityId 
   * @param {*} topNum 给楼层的几何向上偏移距离
   */
  create(lonlat, sobject, node) {
    let floorObj = new THREE.Object3D();
    let multiple //拔高倍数
    let transparent //是否透明
    let topNum = sobject.floor //楼层数
    let topLength = topNum < 0 || !topNum ? 0 : topNum * 16

    if (sobject.isfloor) {
      transparent = true
      multiple = 4
    } else {
      transparent = false
      multiple = 2.5
    }
    let color = this.getColors(sobject.data)

    let heightLength = this.getAttributes(sobject.data.attributes, 'height')
    let height = heightLength ? heightLength * multiple : 0.1
    let lonlatArr = []

    for (let q = 0; q < node.nodes.length; q++) {
      let coor = node.nodes[q]
      lonlatArr.push(this.getPlace(coor, lonlat))
    }
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

    let material = new THREE.MeshPhongMaterial({
      color: color.color,
      shininess: 30
    });
    material.transparent = transparent
    material.opacity = color.opacity

    let mesh = new THREE.Mesh(geometry, material);
    floorObj.add(mesh);
    //边线
    let edges = new THREE.EdgesGeometry(geometry);
    let line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({
      color: 0xffffff
    }));
    floorObj.add(line);
    floorObj.position.z += topLength

    return floorObj
  }

}
export default Polygon
