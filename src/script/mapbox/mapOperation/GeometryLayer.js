import PublicLayer from '../../OneSIS/SObjectSceneManager/LayerManager/CustomLayer/PublicLayer'

class GeometryLayer extends PublicLayer{
  constructor() {
    super()
    this.id = 'building'
    this.lonlat = [120.432183,31.322479]
  
  }
  add(sobject) {
    if (!this.allSObjectGroup[sobject.id]) {
      this.allSObjectGroup[sobject.id] = new THREE.Group()
      this.group.add(this.allSObjectGroup[sobject.id])
    } else {

    }
    let nodes = sobject.nodes
    for (let i in nodes) {
      let node = nodes[i]
      this.allSObjectGroup[sobject.id].add(this.cGeometry[node.type].create(this.lonlat, sobject, node))
    }
    // if(!sobject.show){
    //   this.allSObjectGroup[sobject.id].visible = false
    // }
  }
}
export default GeometryLayer
