import PublicLayer from './PublicLayer'

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
  add(sobject) {
    this.g = new THREE.Group()
    this.group.add(this.g);

    let form
    for (let i = 0; i < sobject.forms.length; i++) {
      let f = sobject.forms[i]
      if (f.type == 50) {
        form = f
      }

    }
    this.g.name = form.geomref

    let style = form.style[0]
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
        this.g.rotation.x += (style.x / 180) * Math.PI
        // this.g.rotation.y += (style.y / 180) * Math.PI
        // this.g.rotation.z += (style.z / 180) * Math.PI
        this.g.position.z = style.h ? style.h : 0


        this.g.rotation.y += (style.z / 180) * Math.PI
        this.g.rotation.z += (style.y / 180) * Math.PI
      }
    }, undefined, (e) => {
      if (this.mesh) {
        this.g.remove(this.mesh);
      }
      this.mesh = ''
      console.error('模型错误', e);
    });

  }
}
export default ModelLayer
