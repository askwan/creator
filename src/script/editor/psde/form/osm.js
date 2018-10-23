
class OsmEntity {
  constructor () {
    this.id = 0

    /* 0:默认
     * 1:新增
     * 2:修改
     * 3:删除*/
    this.flag = 0
    // 引用对象
    this.refOb = {}
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
    if(this.flag==1) return;
    if(this.flag==3) return;
    this.flag = flag
  }
  clearId(){
    delete this.refOb;
    this.id = this.id.replace(/[^0-9]/ig,"");
  }
  copy(form){
    Object.assign(this,form);
    return this;
  }
}

class OsmNode extends OsmEntity {
  constructor (node) {
    super()
    this.type = 'node'
    if (!node) return
    this.uuid = node.uuid;
    this.vid = node.vid;
    this.x = node.loc[0]
    this.y = node.loc[1]
    this.flag = node.flag || 0
    this.z = 0
    this.id = node.id || 0
    this.refOb = node.orgData||{};
    this.tags = {}
    this['@type'] = 'Node'
  }

  setOsmNode (node, flag) {
    this.refOb = node.orgData||{};
    this.id = node.id;
    thid.uuid = node.uuid;
    this.vid = node.vid;
    this.flag = flag | 0
    this.x = node.loc[0]
    this.y = node.loc[1]
  }
  // 转换为btwkt
}

class OsmWay extends OsmEntity {
  constructor (context,way) {
    super()
    this.nodes = []
    this.type = 'way';
    this['@type'] = 'Way'
    if(!way) return
    if (way.entity.tags.area == 'yes') {
      this.type = 'area'
    }
    if(!context||!way) return
    this.setOsmWay(context,way);
  }

  setOsmWay (context, way) {
    this.id = way.id;
    this.uuid = way.uuid;
    this.vid = way.vid;
    way.nodes.forEach(el => {
      let node = new OsmNode(context.entity(el));
      if(node.id.includes('-')) node.updateFlag(1);
      this.nodes.push(node)
    })
    this.refOb = way.orgData||{};
    let change = false
    this.nodes.forEach(node => {
      if (node.flag !== 0) {
        change = true
      }
    })
    if (change) this.updateFlag(2);
    if(this.id.includes('-')) this.updateFlag(1);
    if(!this.id.includes('-')) this.updateFlag(2);
  }

  clearId(){
    delete this.refOb;
    let change = false;
    this.id = this.id.replace(/[^0-9]/ig,"")
    this.nodes.forEach(node=>{
      if(node.flag!==0) change = true;
      node.clearId();
    });
    if(!change) this.flag = 0;
  }



}

class OsmRelation extends OsmEntity {
  constructor (context,relation) {
    super()
    this.type = 'relation'
    this['@type'] = 'Relation'
    if(!context||!relation) return
    this.setOsmRelation(context,relation);
  }
  setOsmRelation (context, relation) {
    this.tags = {
      tags:{
        type:{
          key:'type',
          value:relation.tags.type
        }
      }
    }
    this.id = relation.id;
    this.uuid = relation.uuid;
    this.vid = relation.vid;
    this.members = [];
    if(relation.id.includes('-')) this.updateFlag(1);
    if(!relation.id.includes('-')) this.updateFlag(2);
    relation.members.forEach(member => {
      let entity;
      try {
        entity = context.entity(member.id);
        let obj = {};
        if(entity.type=='relation'){
          obj.refEntity = new OsmRelation();
          obj.refEntity.setOsmRelation(context,entity);
        }else if(entity.type=='way'){
          obj.refEntity = new OsmWay();
          obj.refEntity.setOsmWay(context,entity);
        }else if(entity.type=="node"){
          obj.refEntity = new OsmNode(entity);
          node.role = member.role;
        }
        obj.role = member.role;
        obj.type = entity.type;
        this.members.push(obj);
      } catch (error) {
        this.members.push(member.clone());
      }
      
    });
    
    this.refOb = relation.orgData||{};
  }
  updateMember (member) {
    let index = this.members.findIndex(el => el.id == member.id)
    if (index == -1) {
      this.members.push(member)
    }else {
      this.members.splice(index, 1, member)
    }
  }
  clearId(){
    delete this.refOb;
    this.id = this.id.replace(/[^0-9]/ig,"");
    this.members.forEach(el=>{
      if(typeof el.refEntity =='object'){
        el.refEntity.clearId();
      }else{
        el.id = el.id.replace(/[^0-9]/ig,"");
      }
    })
  }
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
  OsmEntity:OsmEntity
}
