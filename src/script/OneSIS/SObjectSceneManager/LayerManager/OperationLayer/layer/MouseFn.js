import mercatorProj from '../m/mercatorProj'
import {
  MapEvent,
  EventAll
} from '../../../../evented/Event.js'
class MouseFn {
  constructor() {
    this.changeColorId = ''
    this.changeColorOpacity = ''
    this.changeColor = new THREE.Color()
    this.changeMesh = ''

    this.mouseDownClient = {
      x: '',
      y: '',
      z: '',
      lng: '',
      lat: '',
      worldLng: '',
      worldLat: ''
    }


    this.pitch = ''
    this.bearing = ''

    this.idObjNew = ''
    this.lonlat = []
  }
  setLonLat(lonlat) {
    this.lonlat = lonlat
  }
  setPitchAndBearing(pitch, bearing) {
    this.pitch = pitch
    this.bearing = bearing
  }
  //按下鼠标
  mousedownPick(e, map) {
    // console.log(e)
    if (this.changeColorOpacity && this.changeColorId) {
      map.dragPan.disable();
      let lngLat = mercatorProj.lonLat2Mercator(e.lngLat.lng, e.lngLat.lat)
      this.mouseDownClient = {
        x: e.point.x,
        y: e.point.y,
        z: '',
        lng: e.lngLat.lng,
        lat: e.lngLat.lat,
        worldLng: lngLat.x,
        worldLat: lngLat.y
      }

    }
  }
  changeLocData(allLayer) {
    let modelGroup = this.getModelGroup(allLayer, 'model')
    let lngLat = mercatorProj.lonLat2Mercator(modelGroup.geom.x, modelGroup.geom.y)

    let ll = mercatorProj.Mercator2lonLat(lngLat.x+ modelGroup.position.x, lngLat.y+ modelGroup.position.y)

    let top = modelGroup.position.z
    let rotateZ = modelGroup.rotation.z % (Math.PI * 2)
    let scale = modelGroup.scale

    let obj = {
      id: modelGroup.name,
      lng: ll.lng ,
      lat: ll.lat ,
      top: top,
      rotateZ: Math.floor(180 * rotateZ / Math.PI),
      scale: {
        x: scale.x,
        // y: scale.y,
        // z: scale.z,
        y: scale.z,
        z: scale.y,
      }
    }
    this.lonlat = [obj.lng, obj.lat]
    // console.log('松手发',this.lonlat, modelGroup, obj)
    EventAll.fire(MapEvent.changeLoc, obj)
  }
  changeSliderEnd(allLayer) {
    this.changeLocData(allLayer)
  }
  //抬起鼠标
  mouseupPick(e, map, allLayer) {
    map.dragPan.enable();
    if (this.mouseDownClient.lng && this.mouseDownClient.lat) {
      this.changeLocData(allLayer)
    }
    this.mouseDownClient = {
      x: '',
      y: '',
      z: '',
      lng: '',
      lat: '',
      worldLng: '',
      worldLat: ''
    }
  }
  groupFnTranslate(Group, name, client, mouseDownClient) {
    if (Group) {
      for (let i = 0; i < name.length; i++) {
        let xyz = name[i]
        if (xyz == 'X') {
          Group.position.x += client.worldLng - mouseDownClient.worldLng
        } else if (xyz == 'Y') {
          Group.position.y += client.worldLat - mouseDownClient.worldLat
        } else if (xyz == 'Z') {
          Group.position.z -= (client.y - mouseDownClient.y) / 10
        }
      }
    }
  }
  groupFnRotate(Group, name, client, mouseDownClient, c) {
    if (Group) {
      for (let i = 0; i < name.length; i++) {
        let xyz = name[i]
        if (xyz == 'X') {
          // Group.rotation.x += ((client.y - mouseDownClient.y) + (client.x - mouseDownClient.x)) / 50
        } else if (xyz == 'Y') {
          // Group.rotation.y += ((client.y - mouseDownClient.y) + (client.x - mouseDownClient.x)) / 50
        } else if (xyz == 'Z') {
          let x = Group.rotation.x
          let y = Group.rotation.y
          // let z=Group.rotation.z+ (client.x - mouseDownClient.x) / 50
          let z = Group.rotation.z + c
          // console.log(z)
          Group.rotation.set(x, y, z)

        }
      }
    }
  }
  // groupFnScale(Group, name, client, mouseDownClient) {
  //   if (Group) {
  //     for (let i = 0; i < name.length; i++) {
  //       let xyz = name[i]
  //       if (xyz == 'X') {
  //         Group.scale.x += ((client.y - mouseDownClient.y) + (client.x - mouseDownClient.x)) / 100
  //       } else if (xyz == 'Y') {
  //         Group.scale.y += ((client.y - mouseDownClient.y) + (client.x - mouseDownClient.x)) / 100
  //       } else if (xyz == 'Z') {
  //         Group.scale.z -= (client.y - mouseDownClient.y) / 100
  //       }
  //     }
  //   }
  // }
  changeSlider(val, group, groupP, allLayer) {
    let modelGroup = this.getModelGroup(allLayer, 'model')
    // let operationGroup = this.getGroup(group, 'operation')
    // let operationGroupP = this.getGroup(groupP, 'operation')
    if (modelGroup) {
      modelGroup.scale.x = val
      modelGroup.scale.y = val
      modelGroup.scale.z = val
    }
  }
  //按下鼠标  拖动
  mouseDrag(e, group, groupP, allLayer) {
    if (this.changeColorOpacity && this.changeColorId) {
      let modelGroup = this.getModelGroup(allLayer, 'model')
      let operationGroup = this.getGroup(group, 'operation')
      let operationGroupP = this.getGroup(groupP, 'operation')
      let lngLat = mercatorProj.lonLat2Mercator(e.lngLat.lng, e.lngLat.lat)
      let client = {
        x: e.point.x,
        y: e.point.y,
        z: '',
        lng: e.lngLat.lng,
        lat: e.lngLat.lat,
        worldLng: lngLat.x,
        worldLat: lngLat.y
      }
      let name = this.changeMesh.name
      if (this.idObjNew.type == 0) {
        this.groupFnTranslate(modelGroup, name, client, this.mouseDownClient)
        this.groupFnTranslate(operationGroup, name, client, this.mouseDownClient)
        this.groupFnTranslate(operationGroupP, name, client, this.mouseDownClient)
      } else if (this.idObjNew.type == 1) {
        // console.log(lonlat)
        let worldLngLat = mercatorProj.lonLat2Mercator(this.lonlat[0], this.lonlat[1])
        let a = new THREE.Vector3(client.worldLng - worldLngLat.x, client.worldLat - worldLngLat.y, 0);
        let b = new THREE.Vector3(this.mouseDownClient.worldLng - worldLngLat.x, this.mouseDownClient.worldLat - worldLngLat.y, 0);
        // let d = new THREE.Vector3( this.mouseDownClientOld.worldLng-worldLngLat.x, this.mouseDownClientOld.worldLat-worldLngLat.y, 0 );
        let c = a.angleTo(b)
        let leftOrRight = a.x * b.y - a.y * b.x
        if (leftOrRight < 0) {
          c = c
        } else {
          c = -c
        }
        // console.log(a.x * b.y - a.y * b.x)
        // let e=a.angleTo(d)
        // let f=a.multiply(d)
        // console.log(c,e,f)

        // console.log(mercatorProj.lonLat2Mercator(lonlat[0], lonlat[1]))
        //   console.log(client)
        //   console.log( this.mouseDownClient)

        this.groupFnRotate(modelGroup, name, client, this.mouseDownClient, c)
        this.groupFnRotate(operationGroup, name, client, this.mouseDownClient, c)
        this.groupFnRotate(operationGroupP, name, client, this.mouseDownClient, c)
      } else if (this.idObjNew.type == 2) {
        // this.groupFnScale(modelGroup, name, client, this.mouseDownClient)
        // this.groupFnScale(operationGroup, name, client, this.mouseDownClient)
        // this.groupFnScale(operationGroupP, name, client, this.mouseDownClient)
      }
      // console.log(modelGroup)
      // console.log(client)


      this.mouseDownClient = {
        x: client.x,
        y: client.y,
        z: client.z,
        lng: client.lng,
        lat: client.lat,
        worldLng: client.worldLng,
        worldLat: client.worldLat
      }
    }
  }
  //鼠标移动
  mousePick(e, group, groupP, id) {
    let operationGroup = this.getGroup(group, 'operation')
    this.clearOpacityChange(operationGroup)

    this.idObjNew = this.disposeId(id)
    if (id < 10000 && this.idObjNew.type >= 0 && this.idObjNew.num >= 0) {
      if (!operationGroup) {
        return
      }
      let group = operationGroup.children[this.idObjNew.type].children[this.idObjNew.num]
      if (group.type == 'Mesh') {
        // console.log(operationGroup)
        // console.log(group)
        this.changeColorOpacity = group.material.opacity
        this.changeColorId = id
        this.changeMesh = group
        group.material.opacity = 1
      } else {
        this.changeColorOpacity = ''
        this.changeColorId = ''
        this.changeMesh = ''
      }
    } else {
      this.changeColorOpacity = ''
      this.changeColorId = ''
      this.changeMesh = ''
    }
  }
  //消除透明度改变
  clearOpacityChange(operationGroup) {
    if (this.changeColorOpacity && this.changeColorId) {
      let idObj = this.disposeId(this.changeColorId)
      let group = operationGroup.children[idObj.type].children[idObj.num]
      group.material.opacity = this.changeColorOpacity
    }
  }
  //获取显示操作的那个组
  getGroup(group, name) {
    for (let i = 0; i < group.children.length; i++) {
      if (group.children[i].name == name) {
        return group.children[i]
      }
    }
  }
  getModelGroup(allLayer, name) {
    for (let i in allLayer) {
      let layer = allLayer[i]
      if (layer.group.children.length > 0) {
        return layer.group.children[0]
      }
    }
  }
  //处理id转化
  disposeId(id) {
    let a = parseInt(id / 1000)
    let b = parseInt(id % 1000 / 100) - 1
    let c = id % 100 / 5 - 1
    let num = {
      style: a,
      type: b,
      num: c,
    }
    return num
  }

}
let mouseFn = new MouseFn()
export default mouseFn
