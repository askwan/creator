import publicFun from './publicFun'

class Point extends publicFun {
  constructor() {
    super()
  }
  create(lonlat, sobject, node) {
    let floorObj = new THREE.Group();
    let obj=this.getDataObj(lonlat, sobject,node)
    
    // let color = this.getColors(sobject.data)

    let lonlatArr = []
    lonlatArr = this.getPlace(sobject.lonlat, lonlat)

    let geometry = new THREE.CircleBufferGeometry(0.1, 32);
    let material = new THREE.MeshPhongMaterial({
      color: 0xffff00
    });
    let circle = new THREE.Mesh(geometry, material);

    circle.position.x += lonlatArr.x
    circle.position.y += lonlatArr.y
    circle.position.z += obj.topLength + 0.15
    floorObj.add(circle);
    return floorObj
  }
}
export default Point
