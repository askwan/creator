let collection = []

class OsmEntity {
  constructor () {
    this.id = 0

    /* 0:默认
     * 1:新增
     * 2:修改
     * 3:删除*/
    this.flag = 0
    // 引用对象
    this.refOb = null
    this.type = ''
  }
  /**
   * 设置osm的上下文对象
   * @param {*} content 
   */
  setOsmContent (content) {
    this.content = content
  }
  updateFlag (flag) {
    this.flag = flag
  }
  record () {
    let index = collection.findIndex(el => el.id === this.id)
    if (index == -1) {
      collection.push(this)
    }else{
      // console.log(this.flag,'ff');
      if(this.flag>0){
        collection.splice(index,1,this);
      }
    }
  }
}

class OsmNode extends OsmEntity {
  constructor (node) {
    super()
    this.type = 'node'
    if (!node) return
    this.x = node.loc[0]
    this.y = node.loc[1]
    this.flag = node.flag || 0
    this.z = 0
    this.id = node.id || 0
    this.refOb = node.orgData
    this.record()
  }

  setOsmNode (node, flag) {
    this.refOb = node.orgData;
    this.id = node.id
    this.flag = flag | 0
    this.x = node.loc[0]
    this.y = node.loc[1]
  }


  // 转换为btwkt

  toJSON () {
    let nid = this.id.replace('n-', '')
    nid = nid.replace('n', '')
    return `NODE(ID(${nid}),POINT(${this.x} ${this.y} 0.000000),FLAG(${this.flag}))`
  }
}

class OsmWay extends OsmEntity {
  constructor (way) {
    super()
    this.nodes = []
    this.type = 'way';
    if(!way) return
    if (way.entity.tags.area == 'yes') {
      this.type = 'area'
    }
    if (!way) return
    this.id = way.entity.id
    for (let i = 0;i < way.entity.nodes.length;i++) {
      let node = new OsmNode(way.graph.entities[way.entity.nodes[i]])
      let change = Object.assign({}, way.graph.entities)
      if (change[node.id] && !this.id.includes('-')) {
        node.updateFlag(2)
      }
      if (this.id.includes('-')) {
        this.updateFlag(1)
      }else {
        this.updateFlag(2)
      }
      if (node.id.includes('-')) {
        node.updateFlag(1)
      }
      this.nodes.push(node)
    }
    let change = false;
    this.record()
  }

  setOsmWay (context, way) {
    // console.log(context,way,'sdfsf')
    this.id = way.id;
    console.log(way,88888888)
    way.nodes.forEach(el => {
      let node = new OsmNode(context.entity(el));
      if(node.id.includes('-')) node.updateFlag(1);
      this.nodes.push(node)
    })
    this.refOb = way.orgData;
    let change = false
    this.nodes.forEach(node => {
      if (node.flag !== 0) {
        change = true
      }
    })
    if (change) this.updateFlag(2);
    if(this.id.includes('-')) this.updateFlag(1);
    if(!this.id.includes('-')) this.updateFlag(2);
    this.record()
  }
  toJSON () {

    // 获取way对应的所有节点
    let nodeWkt = ''
    for (let i = 0; i < this.nodes.length; i++) {
      let node = this.nodes[i]
      nodeWkt += ',' + node.toJSON()
    }


    let nid = this.id.replace('w-', '')

    nid = nid.replace('w', '')
    return `WAY(ID(${nid})${nodeWkt},FLAG(${this.flag}))`
  }
  getOrgin (_) {
    return _
  }



}

class OsmRelation extends OsmEntity {
  constructor (context,relation) {
    super()
    this.type = 'relation'
    if (!relation) return
    this.id = relation.entity.id
    this.members = []
    relation.entity.members.forEach(el => {
      let entity = collection.find(member => member.id == el.id);

      if(entity){
        entity.role = el.role||'';
        this.members.push(entity)
      }else{
        entity = context.graph().entity(el.id);

        if(entity){
        	if(entity.type=='way'){
	          let way = new OsmWay()
	          way.setOsmWay(context, context.entity(el.id))
	          this.members.push(way)
	        }else if(entity.type=='node'){
	          let node = new OsmNode(el)
	          this.members.push(node)
	        }
	        this.record()
        }
      }
    })
    this.record()
  }
  setOsmRelation (context, relation) {

    this.id = relation.id
    this.members = [];
    // console.log(relation,'relation')
    relation.members.forEach(el => {
      
      let way = collection.find(member => member.id == el)
      if (way) {
        this.members.push(way)
      }else {
        if (el.type === 'node') {
          let node = new OsmNode(el)
          this.members.push(node)
        }else if (el.type === 'way') {
          way = new OsmWay()
          way.setOsmWay(context, context.entity(el))
          this.members.push(way)
        }
      }
    });
    this.refOb = relation.orgData;
    this.record()
  }
  updateMember (member) {
    let index = this.members.findIndex(el => el.id == member.id)
    if (index == -1) {
      this.members.push(member)
    }else {
      this.members.splice(index, 1, member)
    }
  }
  toJSON () {
    let id = this.id.replace('r-', '').replace('r', '')
    let str = `RELATION(ID(${id}),`

    this.members.forEach(member => {
      str += member.toJSON() + ','
    })
    str = str.slice(0, -1)
    str += `,FLAG(${this.flag}))`
    // console.log(str)
    return str
  }
}

const clearCollection = ()=>{
  collection = [];
  console.log('clear')
}

export default {
  SORTINDEX_EXT_NODE: 21,
  SORTINDEX_EXT_WAY: 22,
  SORTINDEX_EXT_AREA: 23,
  SORTINDEX_EXT_RELATION: 24,
  NONE: 0, // 默认操作（无变化）
  ADD: 1, // 新增
  MODIFY: 2, // 修改
  DELETE: 3, // 删除
  OsmNode: OsmNode,
  OsmWay: OsmWay,
  OsmRelation: OsmRelation,
  clearCollection
}
