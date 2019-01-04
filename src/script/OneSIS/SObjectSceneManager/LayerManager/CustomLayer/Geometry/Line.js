import publicFun from './publicFun'

class Line extends publicFun{
  constructor() {
    super()
    
  }
  create(lonlat, sobject,node) {
    let floorObj = new THREE.Group();
    let obj=this.getDataObj(lonlat, sobject,node)
    let geometry = new THREE.BufferGeometry().setFromPoints(obj.lonlatArr);
    let material = new THREE.LineBasicMaterial( {
      color: 0xff0000,
      // color: color.color,
      // linewidth: 100,
      // linecap: 'round', //ignored by WebGLRenderer
      // linejoin:  'round' //ignored by WebGLRenderer
    } );
    let line = new THREE.Line(geometry, material);
    line.position.z += obj.topLength+0.2
    floorObj.add(line);
    return floorObj
  }
}
export default Line