import publicFun from './publicFun'

class Point extends publicFun {
  constructor() {
    super()
  }
  create(lonlat, sobject,node) {
    let floorObj = new THREE.Group();
    let topNum=sobject.floor//楼层数

    let topLength = topNum < 0 || !topNum ? 0 : topNum * 16
    
    // let color = this.getColors(sobject.data)

    let lonlatArr = []
    lonlatArr = this.getPlace(sobject.lonlat, lonlat)
   
    let geometry = new THREE.CircleBufferGeometry(0.1, 32);
    let material = new THREE.MeshBasicMaterial({
      color: 0xffff00
    });
    let circle = new THREE.Mesh(geometry, material);

    circle.position.x += lonlatArr.x
    circle.position.y += lonlatArr.y
    circle.position.z += topLength+0.15
    floorObj.add(circle);
    return floorObj
  }
}
export default Point
