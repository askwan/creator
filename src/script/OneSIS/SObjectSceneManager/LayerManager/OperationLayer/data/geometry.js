let geometryObj = {}

geometryObj.arrowGeometry = new THREE.CylinderBufferGeometry(0, 0.05, 0.2, 12, 1, false);

geometryObj.scaleHandleGeometry = new THREE.BoxBufferGeometry(0.125, 0.125, 0.125);
geometryObj.lineGeometry = new THREE.BufferGeometry();
geometryObj.lineGeometry.addAttribute('position', new THREE.Float32BufferAttribute([0, 0, 0, 1, 0, 0], 3));

geometryObj.CircleGeometry = function (radius, arc) {

  let geometry = new THREE.BufferGeometry();
  let vertices = [];

  for (let i = 0; i <= 64 * arc; ++i) {

    vertices.push(0, Math.cos(i / 32 * Math.PI) * radius, Math.sin(i / 32 * Math.PI) * radius);

  }

  geometry.addAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));

  return geometry;

};

// Special geometry for transform helper. If scaled with position vector it spans from [0,0,0] to position

geometryObj.TranslateHelperGeometry = function (radius, arc) {

  let geometry = new THREE.BufferGeometry()

  geometry.addAttribute('position', new THREE.Float32BufferAttribute([0, 0, 0, 1, 1, 1], 3));

  return geometry;

};



export default geometryObj