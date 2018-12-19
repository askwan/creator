import publicFun from './publicFun'

class Line extends publicFun{
  constructor() {
    super()
    
  }
  create(lonlat, sobject,node) {
    // console.log(sobject)
    let floorObj = new THREE.Group();
    let topNum=sobject.floor//楼层数
    let topLength = topNum < 0 || !topNum ? 0 : topNum * 16
  
    // let color = this.getColors(sobject.data)
  
    let lonlatArr = []
    for (let q = 0; q < node.nodes.length; q++) {
      let coor = node.nodes[q]
      lonlatArr.push(this.getPlace(coor, lonlat))
    }
    let geometry = new THREE.Geometry().setFromPoints(lonlatArr);
    let material = new THREE.LineBasicMaterial( {
      color: 0xff0000,
      // color: color.color,
      // linewidth: 100,
      // linecap: 'round', //ignored by WebGLRenderer
      // linejoin:  'round' //ignored by WebGLRenderer
    } );
    let line = new THREE.Line(geometry, material);
    line.position.z += topLength+0.2
    floorObj.add(line);
    return floorObj
  }
}
export default Line