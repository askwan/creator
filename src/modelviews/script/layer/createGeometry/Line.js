import publicFun from './publicFun'

class Line extends publicFun{
  constructor() {
    super()
    
  }
  createLine(lonlat, sobject,node) {
    let floorObj = new THREE.Group();
    let multiple
    let topNum=sobject.floor//楼层数
    let topLength = topNum < 0 || !topNum ? 0 : topNum * 4
    if (object.otype.name == '楼层') {
      multiple = 4
    } else {
      multiple = 2.5
    }
    let color = this.getColors(sobject.data)
    // let heightLength = this.getAttributes(object.attributes, 'height')
    // let height = heightLength ? heightLength * multiple : 0.1
  
    let lonlatArr = []
    for (let q = 0; q <  node.nodes.length; q++) {
      let coor = node.nodes[q]
      lonlatArr.push(this.getPlace(coor, lonlat))
    }

    // console.log(lonlatArr)
    
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