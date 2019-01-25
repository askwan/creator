import cGeometry from './geometry'
import cMaterial from './Material'


// Gizmo definitions - custom hierarchy definitions for setupGizmo() function
let meshObj = {}
meshObj.gizmoTranslate = {
  X: [
    [new THREE.Mesh(cGeometry.arrowGeometry, cMaterial.matRed.clone()), [1, 0, 0],
      [0, 0, -Math.PI / 2], null, 'fwd'
    ],
    [new THREE.Mesh(cGeometry.arrowGeometry, cMaterial.matRed.clone()), [1, 0, 0],
      [0, 0, Math.PI / 2], null, 'bwd'
    ],
    [new THREE.Line(cGeometry.lineGeometry, cMaterial.matLineRed.clone())]
  ],
  Y: [
    [new THREE.Mesh(cGeometry.arrowGeometry, cMaterial.matGreen.clone()), [0, 1, 0], null, null, 'fwd'],
    [new THREE.Mesh(cGeometry.arrowGeometry, cMaterial.matGreen.clone()), [0, 1, 0],
      [Math.PI, 0, 0], null, 'bwd'
    ],
    [new THREE.Line(cGeometry.lineGeometry, cMaterial.matLineGreen.clone()), null, [0, 0, Math.PI / 2]]
  ],
  Z: [
    [new THREE.Mesh(cGeometry.arrowGeometry, cMaterial.matBlue.clone()), [0, 0, 1],
      [Math.PI / 2, 0, 0], null, 'fwd'
    ],
    [new THREE.Mesh(cGeometry.arrowGeometry, cMaterial.matBlue.clone()), [0, 0, 1],
      [-Math.PI / 2, 0, 0], null, 'bwd'
    ],
    [new THREE.Line(cGeometry.lineGeometry, cMaterial.matLineBlue.clone()), null, [0, -Math.PI / 2, 0]]
  ],
  // XYZ: [
  //   [new THREE.Mesh(new THREE.OctahedronBufferGeometry(0.1, 0), cMaterial.matWhiteTransperent.clone()), [0, 0, 0],
  //     [0, 0, 0]
  //   ]
  // ],
  XY: [
    [new THREE.Mesh(new THREE.PlaneBufferGeometry(0.295, 0.295), cMaterial.matYellowTransparent), [0.15, 0.15, 0]],
    [new THREE.Line(cGeometry.lineGeometry, cMaterial.matLineYellow.clone()), [0.18, 0.3, 0], null, [0.125, 1, 1]],
    [new THREE.Line(cGeometry.lineGeometry, cMaterial.matLineYellow.clone()), [0.3, 0.18, 0],
      [0, 0, Math.PI / 2],
      [0.125, 1, 1]
    ]
  ],
  YZ: [
    [new THREE.Mesh(new THREE.PlaneBufferGeometry(0.295, 0.295), cMaterial.matCyanTransparent.clone()), [0, 0.15, 0.15],
      [0, Math.PI / 2, 0]
    ],
    [new THREE.Line(cGeometry.lineGeometry, cMaterial.matLineCyan.clone()), [0, 0.18, 0.3],
      [0, 0, Math.PI / 2],
      [0.125, 1, 1]
    ],
    [new THREE.Line(cGeometry.lineGeometry, cMaterial.matLineCyan.clone()), [0, 0.3, 0.18],
      [0, -Math.PI / 2, 0],
      [0.125, 1, 1]
    ]
  ],
  XZ: [
    [new THREE.Mesh(new THREE.PlaneBufferGeometry(0.295, 0.295), cMaterial.matMagentaTransparent.clone()), [0.15, 0, 0.15],
      [-Math.PI / 2, 0, 0]
    ],
    [new THREE.Line(cGeometry.lineGeometry, cMaterial.matLineMagenta.clone()), [0.18, 0, 0.3], null, [0.125, 1, 1]],
    [new THREE.Line(cGeometry.lineGeometry, cMaterial.matLineMagenta.clone()), [0.3, 0, 0.18],
      [0, -Math.PI / 2, 0],
      [0.125, 1, 1]
    ]
  ]
};


meshObj.pickerTranslate = {
  X: [
    [new THREE.Mesh(new THREE.CylinderBufferGeometry(0.2, 0, 1, 4, 1, false), cMaterial.matInvisible.clone()), [0.6, 0, 0],
      [0, 0, -Math.PI / 2]
    ]
  ],
  Y: [
    [new THREE.Mesh(new THREE.CylinderBufferGeometry(0.2, 0, 1, 4, 1, false), cMaterial.matInvisible.clone()), [0, 0.6, 0]]
  ],
  Z: [
    [new THREE.Mesh(new THREE.CylinderBufferGeometry(0.2, 0, 1, 4, 1, false), cMaterial.matInvisible.clone()), [0, 0, 0.6],
      [Math.PI / 2, 0, 0]
    ]
  ],
  XYZ: [
    [new THREE.Mesh(new THREE.OctahedronBufferGeometry(0.2, 0), cMaterial.matInvisible.clone())]
  ],
  XY: [
    [new THREE.Mesh(new THREE.PlaneBufferGeometry(0.4, 0.4), cMaterial.matInvisible.clone()), [0.2, 0.2, 0]]
  ],
  YZ: [
    [new THREE.Mesh(new THREE.PlaneBufferGeometry(0.4, 0.4), cMaterial.matInvisible.clone()), [0, 0.2, 0.2],
      [0, Math.PI / 2, 0]
    ]
  ],
  XZ: [
    [new THREE.Mesh(new THREE.PlaneBufferGeometry(0.4, 0.4), cMaterial.matInvisible.clone()), [0.2, 0, 0.2],
      [-Math.PI / 2, 0, 0]
    ]
  ]
};

meshObj.helperTranslate = {
  START: [
    [new THREE.Mesh(new THREE.OctahedronBufferGeometry(0.01, 2), cMaterial.matHelper.clone()), null, null, null, 'helper']
  ],
  END: [
    [new THREE.Mesh(new THREE.OctahedronBufferGeometry(0.01, 2), cMaterial.matHelper.clone()), null, null, null, 'helper']
  ],
  DELTA: [
    [new THREE.Line(cGeometry.TranslateHelperGeometry(), cMaterial.matHelper.clone()), null, null, null, 'helper']
  ],
  X: [
    [new THREE.Line(cGeometry.lineGeometry, cMaterial.matHelper.clone()), [-1e3, 0, 0], null, [1e6, 1, 1], 'helper']
  ],
  Y: [
    [new THREE.Line(cGeometry.lineGeometry, cMaterial.matHelper.clone()), [0, -1e3, 0],
      [0, 0, Math.PI / 2],
      [1e6, 1, 1], 'helper'
    ]
  ],
  Z: [
    [new THREE.Line(cGeometry.lineGeometry, cMaterial.matHelper.clone()), [0, 0, -1e3],
      [0, -Math.PI / 2, 0],
      [1e6, 1, 1], 'helper'
    ]
  ]
};

meshObj.gizmoRotate = {
  // X: [
  //   [new THREE.Line(cGeometry.CircleGeometry(1, 0.5), cMaterial.matLineRed.clone())],
  //   [new THREE.Mesh(new THREE.OctahedronBufferGeometry(0.04, 0), cMaterial.matRed.clone()), [0, 0, 0.99], null, [2, 5, 2]],
  // ],
  // Y: [
  //   [new THREE.Line(cGeometry.CircleGeometry(1, 0.5), cMaterial.matLineGreen.clone()), null, [0, 0, -Math.PI / 2]],
  //   [new THREE.Mesh(new THREE.OctahedronBufferGeometry(0.04, 0), cMaterial.matGreen.clone()), [0, 0, 0.99], null, [5, 2, 2]],
  // ],
  Z: [
    [new THREE.Line(cGeometry.CircleGeometry(1, 0.5), cMaterial.matLineBlue.clone()), null, [0, Math.PI / 2, 0]],
    [new THREE.Mesh(new THREE.OctahedronBufferGeometry(0.04, 0), cMaterial.matRed.clone()), [0.99, 0, 0], null, [2, 5, 2]],
  ],
  E: [
    [new THREE.Line(cGeometry.CircleGeometry(1.25, 1), cMaterial.matLineYellowTransparent.clone()), null, [0, Math.PI / 2, 0]],
    [new THREE.Mesh(new THREE.CylinderBufferGeometry(0.03, 0, 0.15, 4, 1, false), cMaterial.matLineYellowTransparent.clone()), [1.17, 0, 0],
      [0, 0, -Math.PI / 2],
      [1, 1, 0.001]
    ],
    [new THREE.Mesh(new THREE.CylinderBufferGeometry(0.03, 0, 0.15, 4, 1, false), cMaterial.matLineYellowTransparent.clone()), [-1.17, 0, 0],
      [0, 0, Math.PI / 2],
      [1, 1, 0.001]
    ],
    [new THREE.Mesh(new THREE.CylinderBufferGeometry(0.03, 0, 0.15, 4, 1, false), cMaterial.matLineYellowTransparent.clone()), [0, -1.17, 0],
      [Math.PI, 0, 0],
      [1, 1, 0.001]
    ],
    [new THREE.Mesh(new THREE.CylinderBufferGeometry(0.03, 0, 0.15, 4, 1, false), cMaterial.matLineYellowTransparent.clone()), [0, 1.17, 0],
      [0, 0, 0],
      [1, 1, 0.001]
    ],
  ],
  XYZE: [
    [new THREE.Line(cGeometry.CircleGeometry(1, 1), cMaterial.matLineGray.clone()), null, [0, Math.PI / 2, 0]]
  ]
};

meshObj.helperRotate = {
  AXIS: [
    [new THREE.Line(cGeometry.lineGeometry, cMaterial.matHelper.clone()), [-1e3, 0, 0], null, [1e6, 1, 1], 'helper']
  ]
};

meshObj.pickerRotate = {
  X: [
    [new THREE.Mesh(new THREE.TorusBufferGeometry(1, 0.1, 4, 24), cMaterial.matInvisible.clone()), [0, 0, 0],
      [0, -Math.PI / 2, -Math.PI / 2]
    ],
  ],
  Y: [
    [new THREE.Mesh(new THREE.TorusBufferGeometry(1, 0.1, 4, 24), cMaterial.matInvisible.clone()), [0, 0, 0],
      [Math.PI / 2, 0, 0]
    ],
  ],
  Z: [
    [new THREE.Mesh(new THREE.TorusBufferGeometry(1, 0.1, 4, 24), cMaterial.matInvisible.clone()), [0, 0, 0],
      [0, 0, -Math.PI / 2]
    ],
  ],
  E: [
    [new THREE.Mesh(new THREE.TorusBufferGeometry(1.25, 0.1, 2, 24), cMaterial.matInvisible.clone())]
  ],
  XYZE: [
    [new THREE.Mesh(new THREE.SphereBufferGeometry(0.7, 10, 8), cMaterial.matInvisible.clone())]
  ]
};

meshObj.gizmoScale = {
  X: [
    [new THREE.Mesh(cGeometry.scaleHandleGeometry, cMaterial.matRed.clone()), [0.8, 0, 0],
      [0, 0, -Math.PI / 2]
    ],
    [new THREE.Line(cGeometry.lineGeometry, cMaterial.matLineRed.clone()), null, null, [0.8, 1, 1]]
  ],
  Y: [
    [new THREE.Mesh(cGeometry.scaleHandleGeometry, cMaterial.matGreen.clone()), [0, 0.8, 0]],
    [new THREE.Line(cGeometry.lineGeometry, cMaterial.matLineGreen.clone()), null, [0, 0, Math.PI / 2],
      [0.8, 1, 1]
    ]
  ],
  Z: [
    [new THREE.Mesh(cGeometry.scaleHandleGeometry, cMaterial.matBlue.clone()), [0, 0, 0.8],
      [Math.PI / 2, 0, 0]
    ],
    [new THREE.Line(cGeometry.lineGeometry, cMaterial.matLineBlue.clone()), null, [0, -Math.PI / 2, 0],
      [0.8, 1, 1]
    ]
  ],
  XY: [
    [new THREE.Mesh(cGeometry.scaleHandleGeometry, cMaterial.matYellowTransparent.clone()), [0.85, 0.85, 0], null, [2, 2, 0.2]],
    [new THREE.Line(cGeometry.lineGeometry, cMaterial.matLineYellow.clone()), [0.855, 0.98, 0], null, [0.125, 1, 1]],
    [new THREE.Line(cGeometry.lineGeometry, cMaterial.matLineYellow.clone()), [0.98, 0.855, 0],
      [0, 0, Math.PI / 2],
      [0.125, 1, 1]
    ]
  ],
  YZ: [
    [new THREE.Mesh(cGeometry.scaleHandleGeometry, cMaterial.matCyanTransparent.clone()), [0, 0.85, 0.85], null, [0.2, 2, 2]],
    [new THREE.Line(cGeometry.lineGeometry, cMaterial.matLineCyan.clone()), [0, 0.855, 0.98],
      [0, 0, Math.PI / 2],
      [0.125, 1, 1]
    ],
    [new THREE.Line(cGeometry.lineGeometry, cMaterial.matLineCyan.clone()), [0, 0.98, 0.855],
      [0, -Math.PI / 2, 0],
      [0.125, 1, 1]
    ]
  ],
  XZ: [
    [new THREE.Mesh(cGeometry.scaleHandleGeometry, cMaterial.matMagentaTransparent.clone()), [0.85, 0, 0.85], null, [2, 0.2, 2]],
    [new THREE.Line(cGeometry.lineGeometry, cMaterial.matLineMagenta.clone()), [0.855, 0, 0.98], null, [0.125, 1, 1]],
    [new THREE.Line(cGeometry.lineGeometry, cMaterial.matLineMagenta.clone()), [0.98, 0, 0.855],
      [0, -Math.PI / 2, 0],
      [0.125, 1, 1]
    ]
  ],
  // XYZX: [
  //   [new THREE.Mesh(new THREE.BoxBufferGeometry(0.125, 0.125, 0.125), cMaterial.matWhiteTransperent.clone()), [1.1, 0, 0]],
  // ],
  // XYZY: [
  //   [new THREE.Mesh(new THREE.BoxBufferGeometry(0.125, 0.125, 0.125), cMaterial.matWhiteTransperent.clone()), [0, 1.1, 0]],
  // ],
  // XYZZ: [
  //   [new THREE.Mesh(new THREE.BoxBufferGeometry(0.125, 0.125, 0.125), cMaterial.matWhiteTransperent.clone()), [0, 0, 1.1]],
  // ]
};

meshObj.pickerScale = {
  X: [
    [new THREE.Mesh(new THREE.CylinderBufferGeometry(0.2, 0, 0.8, 4, 1, false), cMaterial.matInvisible.clone()), [0.5, 0, 0],
      [0, 0, -Math.PI / 2]
    ]
  ],
  Y: [
    [new THREE.Mesh(new THREE.CylinderBufferGeometry(0.2, 0, 0.8, 4, 1, false), cMaterial.matInvisible.clone()), [0, 0.5, 0]]
  ],
  Z: [
    [new THREE.Mesh(new THREE.CylinderBufferGeometry(0.2, 0, 0.8, 4, 1, false), cMaterial.matInvisible.clone()), [0, 0, 0.5],
      [Math.PI / 2, 0, 0]
    ]
  ],
  XY: [
    [new THREE.Mesh(cGeometry.scaleHandleGeometry, cMaterial.matInvisible.clone()), [0.85, 0.85, 0], null, [3, 3, 0.2]],
  ],
  YZ: [
    [new THREE.Mesh(cGeometry.scaleHandleGeometry, cMaterial.matInvisible.clone()), [0, 0.85, 0.85], null, [0.2, 3, 3]],
  ],
  XZ: [
    [new THREE.Mesh(cGeometry.scaleHandleGeometry, cMaterial.matInvisible.clone()), [0.85, 0, 0.85], null, [3, 0.2, 3]],
  ],
  XYZX: [
    [new THREE.Mesh(new THREE.BoxBufferGeometry(0.2, 0.2, 0.2), cMaterial.matInvisible.clone()), [1.1, 0, 0]],
  ],
  XYZY: [
    [new THREE.Mesh(new THREE.BoxBufferGeometry(0.2, 0.2, 0.2), cMaterial.matInvisible.clone()), [0, 1.1, 0]],
  ],
  XYZZ: [
    [new THREE.Mesh(new THREE.BoxBufferGeometry(0.2, 0.2, 0.2), cMaterial.matInvisible.clone()), [0, 0, 1.1]],
  ]
};

meshObj.helperScale = {
  X: [
    [new THREE.Line(cGeometry.lineGeometry, cMaterial.matHelper.clone()), [-1e3, 0, 0], null, [1e6, 1, 1], 'helper']
  ],
  Y: [
    [new THREE.Line(cGeometry.lineGeometry, cMaterial.matHelper.clone()), [0, -1e3, 0],
      [0, 0, Math.PI / 2],
      [1e6, 1, 1], 'helper'
    ]
  ],
  Z: [
    [new THREE.Line(cGeometry.lineGeometry, cMaterial.matHelper.clone()), [0, 0, -1e3],
      [0, -Math.PI / 2, 0],
      [1e6, 1, 1], 'helper'
    ]
  ]
};


export default meshObj