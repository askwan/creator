
//每个几何生成
class GeometryMesh{
  constructor() {
    
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

    for (let q = 0; q < osmWay.nodes.length - 1; q++) {
      let id = osmWay.nodes[q]
      lonlatArr.push(this.getPlace(id, object.geoBox))
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
    mesh.position.z += topLength

    floorObj.add(mesh);
    floorObj.add(this.createLine(lonlatArr, topLength, height))

    return floorObj
  }
}
export default GeometryMesh