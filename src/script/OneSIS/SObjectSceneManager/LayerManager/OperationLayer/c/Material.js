let gizmoMaterial = new THREE.MeshBasicMaterial({
  depthTest: false,
  depthWrite: false,
  transparent: true,
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
materialObj.matInvisible.opacity = 0.15;

materialObj.matHelper = gizmoMaterial.clone();
materialObj.matHelper.opacity = 0.33;

materialObj.matRed = gizmoMaterial.clone();
materialObj.matRed.color.set(0xff0000);
materialObj.matRed.opacity = 0.35;

materialObj.matGreen = gizmoMaterial.clone();
materialObj.matGreen.color.set(0x00ff00);
materialObj.matGreen.opacity = 0.35;

materialObj.matBlue = gizmoMaterial.clone();
materialObj.matBlue.color.set(0x0000ff);
materialObj.matBlue.opacity = 0.35;

materialObj.matWhiteTransperent = gizmoMaterial.clone();
materialObj.matWhiteTransperent.opacity = 0.25;

materialObj.matYellowTransparent = materialObj.matWhiteTransperent.clone();
materialObj.matYellowTransparent.color.set(0xffff00);
materialObj.matYellowTransparent.opacity = 0.35;

materialObj.matCyanTransparent = materialObj.matWhiteTransperent.clone();
materialObj.matCyanTransparent.color.set(0x00ffff);
materialObj.matCyanTransparent.opacity = 0.35;

materialObj.matMagentaTransparent = materialObj.matWhiteTransperent.clone();
materialObj.matMagentaTransparent.color.set(0xff00ff);
materialObj.matMagentaTransparent.opacity = 0.35;

materialObj.matYellow = gizmoMaterial.clone();
materialObj.matYellow.color.set(0xffff00);
materialObj.matYellow.opacity = 0.35;

materialObj.matLineRed = gizmoLineMaterial.clone();
materialObj.matLineRed.color.set(0xff0000);
materialObj.matLineRed.opacity = 0.35;

materialObj.matLineGreen = gizmoLineMaterial.clone();
materialObj.matLineGreen.color.set(0x00ff00);
materialObj.matLineGreen.opacity = 0.35;

materialObj.matLineBlue = gizmoLineMaterial.clone();
materialObj.matLineBlue.color.set(0x0000ff);
materialObj.matLineBlue.opacity = 0.35;

materialObj.matLineCyan = gizmoLineMaterial.clone();
materialObj.matLineCyan.color.set(0x00ffff);
materialObj.matLineCyan.opacity = 0.35;

materialObj.matLineMagenta = gizmoLineMaterial.clone();
materialObj.matLineMagenta.color.set(0xff00ff);
materialObj.matLineMagenta.opacity = 0.35;

materialObj.matLineYellow = gizmoLineMaterial.clone();
materialObj.matLineYellow.color.set(0xffff00);
materialObj.matLineYellow.opacity = 0.35;

materialObj.matLineGray = gizmoLineMaterial.clone();
materialObj.matLineGray.color.set(0x787878);
materialObj.matLineGray.opacity = 0.35;

materialObj.matLineYellowTransparent = materialObj.matLineYellow.clone();
materialObj.matLineYellowTransparent.opacity = 0.25;

export default materialObj