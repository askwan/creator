import PublicLayer from './PublicLayer'
import {
  modelServer
} from '@/script/server'
import osg from './manage/osg/index'
import axios from 'axios'

class ModelLayer extends PublicLayer {
  constructor() {
    super()
    this.id = 'model'
    this.mesh = ''
    this.g = ''
  }
  lamplight() {
    let l = new THREE.AmbientLight(0xffffff, 0.8)
    this.scene.add(l)

  }
  getModel(id, fn) {
    modelServer.getModel({
      fids: id
    }).then(res => {
      if (res.status == 200) {
        fn(res.data.list[0].extension)
      } else {
        fn()
      }
    })
  }
  add(sobject) {
    let form
    for (let i = 0; i < sobject.forms.length; i++) {
      let f = sobject.forms[i]
      if (f.type == 50) {
        form = f
      }

    }

    let style = form.style[0]

    this.g = new THREE.Group()
    this.group.add(this.g);

    this.g.name = form.geomref
    this.g.geom = form.geom

    this.getModel(form.formref.refid, data => {
      if (data == "osgb") {
        this.addOsgb(form, style)
      } else if (data == "glb" || data == "gltf") {
        this.addGltf(form, style)
      } else {}
    })


  }
  addGltf(form, style) {
    let loader = new THREE.GLTFLoader();
    loader.load('http://bt1.geosts.ac.cn/api/dae/model-service/model/rest/v0.1.0/datastore/slave/model/file/download/' + form.formref.refid, gltf => {
      gltf.scene.rotation.x += Math.PI / 2
      // if (style) {
      //   gltf.scene.scale.x = style.scale ? style.scale : 1
      //   gltf.scene.scale.y = style.scale ? style.scale : 1
      //   gltf.scene.scale.z = style.scale ? style.scale : 1
      //   gltf.scene.rotation.x += (style.x / 180) * Math.PI
      //   gltf.scene.rotation.y += (style.y / 180) * Math.PI
      //   gltf.scene.rotation.z += (style.z / 180) * Math.PI
      //   gltf.scene.position.z = style.h ? style.h : 0
      // }

      if (this.mesh) {
        this.g.remove(this.mesh);
      }
      this.g.add(gltf.scene);
      this.mesh = gltf.scene
      if (style) {
        this.g.scale.x = style.scale ? style.scale : 1
        this.g.scale.y = style.scale ? style.scale : 1
        this.g.scale.z = style.scale ? style.scale : 1
        this.g.rotation.x = (style.x / 180) * Math.PI
        // this.g.rotation.y += (style.y / 180) * Math.PI
        // this.g.rotation.z += (style.z / 180) * Math.PI
        this.g.position.z = style.h ? style.h : 0
        this.g.rotation.y = (style.z / 180) * Math.PI
        this.g.rotation.z = (style.y / 180) * Math.PI
      }
    }, undefined, (e) => {
      if (this.mesh) {
        this.g.remove(this.mesh);
      }
      this.mesh = ''
      console.log('模型错误,不是2.0', e);
    });
  }
  addOsgb(form, style) {
    axios({
        method: 'get',
        url: 'http://bt1.geosts.ac.cn/api/dae/model-service/model/rest/v0.1.0/datastore/slave/model/file/download/' + form.formref.refid,
        responseType: 'arraybuffer'
      })
      .then((response) => {
        let osgbData = osg.readBuffer(response.data)
        let arr = []
        console.log(osgbData)
        if (this.mesh) {
          this.g.remove(this.mesh);
        }
        this.lookGeometry(osgbData, arr)
        for (let i = 0; i < arr.length; i++) {
          let Geometry = arr[i]
          this.createOsgb(Geometry,style)
        }
      })
      .catch(function (error) {
        console.log(error)
      })
  }

  lookGeometry(data, arr) {
    if (data.Children) {
      for (let i = 0; i < data.Children.length; i++) {
        let geode = data.Children[i]
        if (geode.VertexArray) {
          arr.push(geode)
        } else {
          this.lookGeometry(geode, arr)
        }
      }
    }
  }
  createOsgb(data,style) {
    let VertexArray = data.VertexArray
    let indexes = data.PrimitiveSetList[0].data
    let Vertex = []
    let VertexArr = []
    for (let i = 0; i < indexes.length; i++) {
      let indexe = indexes[i]
      Vertex.push(VertexArray[indexe])
    }
    for (let i = 0; i < Vertex.length; i++) {
      let indexe = Vertex[i]
      indexe.forEach(e => {
        VertexArr.push(e)
      });
    }
    let geometry = new THREE.BufferGeometry();
    let vertices = new Float32Array(VertexArr);
    geometry.addAttribute('position', new THREE.BufferAttribute(vertices, 3));
    let material = new THREE.MeshPhongMaterial({
      color: this.randomColor()
    });
 
    this.mesh = new THREE.Mesh(geometry, material);
   
    this.g.add(this.mesh)
    if (style) {
      this.g.scale.x = style.scale ? style.scale : 1
      this.g.scale.y = style.scale ? style.scale : 1
      this.g.scale.z = style.scale ? style.scale : 1
      this.g.rotation.x = (style.x / 180) * Math.PI
      // this.g.rotation.y += (style.y / 180) * Math.PI
      // this.g.rotation.z += (style.z / 180) * Math.PI
      this.g.position.z = style.h ? style.h : 0


      this.g.rotation.y = (style.z / 180) * Math.PI
      this.g.rotation.z = (style.y / 180) * Math.PI
    }
  }
  randomColor(){
    return '#'+Math.floor(Math.random()*0xffffff).toString(16);
}
}
export default ModelLayer
