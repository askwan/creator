import publicFun from './publicFun'


class Polygon extends publicFun {
  constructor() {
    super()
  }
 
  create(lonlat, sobject, node) {
    let floorObj = new THREE.Object3D();

    let obj=this.getDataObj(lonlat, sobject,node)
    let color = this.getColors(sobject.data)
    let shape = new THREE.Shape(obj.lonlatArr);
    let extrudeSettings = {
      steps: 1,
      depth: obj.height,
      bevelEnabled: false,
      bevelThickness: 0,
      bevelSize: 0,
      bevelSegments: 0
    };
    let geometry = new THREE.ExtrudeBufferGeometry(shape, extrudeSettings);

    let material = new THREE.MeshPhongMaterial({
      color: color.color,
      shininess: 30,
      // side: THREE.DoubleSide,
      // clippingPlanes: [localPlane],
      // clipShadows: true
    });
    material.transparent = obj.transparent
    material.opacity = color.opacity

    let mesh = new THREE.Mesh(geometry, material);
    floorObj.add(mesh);
    //边线
    let edges = new THREE.EdgesGeometry(geometry);
    let line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({
      color: 0xffffff
    }));
    floorObj.add(line);
    floorObj.position.z += obj.topLength

    return floorObj
  }

}
export default Polygon
