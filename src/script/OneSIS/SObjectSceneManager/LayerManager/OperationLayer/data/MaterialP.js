let gizmoMaterial = new THREE.MeshBasicMaterial({
  depthTest: false,
  depthWrite: false,
  // transparent: true,
  side: THREE.DoubleSide,
  fog: false
});

let gizmoLineMaterial = new THREE.LineBasicMaterial({
  depthTest: false,
  depthWrite: false,
  // transparent: true,
  linewidth: 1,
  fog: false
});

// Make unique material for each axis/color
let materialObj = {}
materialObj.matInvisible = gizmoMaterial.clone();
// materialObj.matInvisible.opacity = 0.15;

materialObj.matHelper = gizmoMaterial.clone();
// materialObj.matHelper.opacity = 0.33;

materialObj.matRed = gizmoMaterial.clone();
materialObj.matRed.color.set(0xff0000);

materialObj.matGreen = gizmoMaterial.clone();
materialObj.matGreen.color.set(0x00ff00);

materialObj.matBlue = gizmoMaterial.clone();
materialObj.matBlue.color.set(0x0000ff);

materialObj.matWhiteTransperent = gizmoMaterial.clone();
// materialObj.matWhiteTransperent.opacity = 0.25;

materialObj.matYellowTransparent = materialObj.matWhiteTransperent.clone();
materialObj.matYellowTransparent.color.set(0xffff00);

materialObj.matCyanTransparent = materialObj.matWhiteTransperent.clone();
materialObj.matCyanTransparent.color.set(0x00ffff);

materialObj.matMagentaTransparent = materialObj.matWhiteTransperent.clone();
materialObj.matMagentaTransparent.color.set(0xff00ff);

materialObj.matYellow = gizmoMaterial.clone();
materialObj.matYellow.color.set(0xffff00);

materialObj.matLineRed = gizmoLineMaterial.clone();
materialObj.matLineRed.color.set(0xff0000);

materialObj.matLineGreen = gizmoLineMaterial.clone();
materialObj.matLineGreen.color.set(0x00ff00);

materialObj.matLineBlue = gizmoLineMaterial.clone();
materialObj.matLineBlue.color.set(0x0000ff);

materialObj.matLineCyan = gizmoLineMaterial.clone();
materialObj.matLineCyan.color.set(0x00ffff);

materialObj.matLineMagenta = gizmoLineMaterial.clone();
materialObj.matLineMagenta.color.set(0xff00ff);

materialObj.matLineYellow = gizmoLineMaterial.clone();
materialObj.matLineYellow.color.set(0xffff00);

materialObj.matLineGray = gizmoLineMaterial.clone();
materialObj.matLineGray.color.set(0x787878);

materialObj.matLineYellowTransparent = materialObj.matLineYellow.clone();
// materialObj.matLineYellowTransparent.opacity = 0.25;

export default materialObj