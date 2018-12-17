
//几何外边线
class OutsideLine{
  constructor(){

  }
  createLine(lonlatArr, topLength, height) {
    let group = new THREE.Group()
    let line = new THREE.LineBasicMaterial({
      color: "#ffffff",
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
}
export default OutsideLine