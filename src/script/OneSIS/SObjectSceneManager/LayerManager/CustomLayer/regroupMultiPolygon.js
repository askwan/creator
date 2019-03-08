class RegroupMultiPolygon {
  constructor() {

  }
  screen(members) {
    for (let q = 0; q < members.length; q++) {
      let memb = members[q]
      let nodes2 = memb.refEntity.nodes
      if (!memb.been) {
        memb.been = true
        return memb
      }
    }
    return null
  }
  recursion(temporary, temp, members) {
    let nodes = temp.nodes
    let or = -1
    for (let q = 0; q < members.length; q++) {
      let memb = members[q]
      let nodes2 = memb.refEntity.nodes
      if (!memb.been && nodes[nodes.length - 1].id != nodes[0].id && nodes[nodes.length - 1].id == nodes2[0].id) {
        or = q
        memb.been = true
        for (let w = 1; w < nodes2.length; w++) {
          nodes.push(nodes2[w])
        }
      }else if(!memb.been && nodes[nodes.length - 1].id != nodes[0].id && nodes[nodes.length - 1].id == nodes2[nodes2.length - 1].id){
        or = q
        memb.been = true
        nodes2.reverse()
        for (let w = 1; w < nodes2.length; w++) {
          nodes.push(nodes2[w])
        }
      } 
    }
    if (or != -1) {
      this.recursion(temporary, temp, members)
    } else {
      let m = this.screen(members)
      if (m) {
        let o = {
          type: m.role,
          nodes: m.refEntity.nodes,
        }
        temporary.push(o)
        this.recursion(temporary, temporary[temporary.length - 1], members)
      } else {
        return temporary
      }
    }
  }
  multiPolygonData(form) {
    let temporary = []
    let members = []
    for (let i = 0; i < form.geom.members.length; i++) {
      members.push(form.geom.members[i])
    }
    let m = this.screen(members)
    if (m) {
      let o = {
        type: m.role,
        nodes: m.refEntity.nodes,
      }
      temporary.push(o)
      this.recursion(temporary, temporary[temporary.length - 1], members)
    }
    return temporary
  }
}
let regroupMultiPolygon = new RegroupMultiPolygon()
export default regroupMultiPolygon
