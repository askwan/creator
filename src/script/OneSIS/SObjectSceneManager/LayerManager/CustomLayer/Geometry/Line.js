import publicFun from './publicFun'

class Line extends publicFun{
  constructor() {
    super()
    
  }
  create(lonlat, sobject,node) {
    let floorObj = new THREE.Object3D();
    let obj = this.getDataObj(lonlat, sobject, node)
    let vColor = 0xff0000

    let geometry = new THREE.BufferGeometry().setFromPoints(obj.lonlatArr);
    let material = new THREE.LineBasicMaterial({
      color: vColor,
    });
    let line = new THREE.Line(geometry, material);
    floorObj.add(line);
    floorObj.position.z += Number(obj.height)+0.15

    return floorObj
   
  }
}
export default Line