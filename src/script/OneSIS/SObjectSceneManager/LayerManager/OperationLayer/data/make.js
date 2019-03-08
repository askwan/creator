import cMesh from './Mesh'
import cMeshP from './MeshP'
class Make {
  constructor() {

  }

  add() {
    let floorObj = new THREE.Group();
    floorObj.name='operation'
    this.gizmo = {};
    this.picker = {};
    this.helper = {};

    floorObj.add(this.gizmo["translate"] = this.setupGizmo(cMesh.gizmoTranslate));
    floorObj.add(this.gizmo["rotate"] = this.setupGizmo(cMesh.gizmoRotate));
    // floorObj.add(this.gizmo["scale"] = this.setupGizmo(cMesh.gizmoScale));

    // floorObj.add(this.helper["translate"] = this.setupGizmo(cMesh.helperTranslate));
    // floorObj.add(this.helper["rotate"] = this.setupGizmo(cMesh.helperRotate));
    // floorObj.add(this.helper["scale"] = this.setupGizmo(cMesh.helperScale));

    // floorObj.scale.x = 20
    // floorObj.scale.y = 20
    // floorObj.scale.z = 20
    // floorObj.position.z = 20
    return floorObj
  }
  addP() {
    let floorObj = new THREE.Group();
    floorObj.name='operation'

    this.gizmoP = {};
    this.pickerP = {};
    this.helperP = {};

    floorObj.add(this.gizmoP["translate"] = this.setupGizmoP(cMeshP.gizmoTranslate, 1, 1));
    floorObj.add(this.gizmoP["rotate"] = this.setupGizmoP(cMeshP.gizmoRotate, 2, 1));
    // floorObj.add(this.gizmoP["scale"] = this.setupGizmoP(cMeshP.gizmoScale, 3, 1));

    // floorObj.add(this.helperP["translate"] = this.setupGizmoP(cMeshP.helperTranslate, 4, 2));
    // floorObj.add(this.helperP["rotate"] = this.setupGizmoP(cMeshP.helperRotate, 5, 2));
    // floorObj.add(this.helperP["scale"] = this.setupGizmoP(cMeshP.helperScale, 6, 2));


    floorObj.scale.x = 20
    floorObj.scale.y = 20
    floorObj.scale.z = 20
    // floorObj.position.z = 20
    return floorObj
  }
  setupGizmoP(gizmoMap, type, style) {

    let gizmo = new THREE.Object3D();
    let q = 0
    for (let name in gizmoMap) {
      for (let i = gizmoMap[name].length; i--;) {
        let object = gizmoMap[name][i][0].clone();
        if (type) {
          q++
          let num = style * 1000 + type * 100 + q * 5
          object.material.color = new THREE.Color().setHex(num)
        }

        let position = gizmoMap[name][i][1];
        let rotation = gizmoMap[name][i][2];
        let scale = gizmoMap[name][i][3];
        let tag = gizmoMap[name][i][4];

        // name and tag properties are essential for picking and updating logic.
        object.name = name;
        object.tag = tag;

        if (position) {
          object.position.set(position[0], position[1], position[2]);
        }
        if (rotation) {
          object.rotation.set(rotation[0], rotation[1], rotation[2]);
        }
        if (scale) {
          object.scale.set(scale[0], scale[1], scale[2]);
        }

        object.updateMatrix();

        let tempGeometry = object.geometry.clone();
        tempGeometry.applyMatrix(object.matrix);
        object.geometry = tempGeometry;

        object.position.set(0, 0, 0);
        object.rotation.set(0, 0, 0);
        object.scale.set(1, 1, 1);

        gizmo.add(object);

      }

    }

    return gizmo;

  };
  setupGizmo(gizmoMap) {

    let gizmo = new THREE.Object3D();

    for (let name in gizmoMap) {

      for (let i = gizmoMap[name].length; i--;) {

        let object = gizmoMap[name][i][0].clone();
        let position = gizmoMap[name][i][1];
        let rotation = gizmoMap[name][i][2];
        let scale = gizmoMap[name][i][3];
        let tag = gizmoMap[name][i][4];

        // name and tag properties are essential for picking and updating logic.
        object.name = name;
        object.tag = tag;

        if (position) {
          object.position.set(position[0], position[1], position[2]);
        }
        if (rotation) {
          object.rotation.set(rotation[0], rotation[1], rotation[2]);
        }
        if (scale) {
          object.scale.set(scale[0], scale[1], scale[2]);
        }

        object.updateMatrix();

        let tempGeometry = object.geometry.clone();
        tempGeometry.applyMatrix(object.matrix);
        object.geometry = tempGeometry;

        object.position.set(0, 0, 0);
        object.rotation.set(0, 0, 0);
        object.scale.set(1, 1, 1);

        gizmo.add(object);

      }

    }

    return gizmo;

  };

}

let make = new Make()
export default make