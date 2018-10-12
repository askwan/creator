export const State = {
  sobjects:{},
  diagrams:[],
  relations:[],
  otypes:{},
  dimension :[{
    value: 1,
    name: '一维'
  },
    {
      value: 2,
      name: '二维'
    },
    {
      value: 3,
      name: '三维'
    },
    {
      value: 0,
      name: '零维'
    }
  ],
  styleServerType :[{
      name: "Xyz",
      value: "Xyz",
      caption:"rest切片服务"
    },{
      name: "Wms",
      value: "Wms",
      caption:"Wms服务"
    },{
      name: "Wmts",
      value: "Wmts",
      caption:"地图瓦片服务"
    },{
      name: "Image",
      value: "Image",
      caption:"图片"
    },{
      name: "VectorTile",
      value: "VectorTile",
      caption:"矢量切片"
    },{
      name: "ObliquePhotography",
      value: "ObliquePhotography",
      caption:"倾斜摄影"
    }
  ],
  formstyleType :[{
    name: 'Sld',
    value: 1
  }, {
    name: 'Sld-Css',
    value: 2
  }, {
    name: 'Mapbox-Css',
    value: 3
  }, {
    name: 'Mesh',
    value: 4
  }, {
    name: 'Server',
    value: 5
  }
  ],
  relationType:[],
  cacheRelation(relation){
    let index = this.relations.findIndex(el=>el.id==relation.id);
    if(index==-1) {
      this.relations.push(relation);
    }else{
      this.relations.splice(index,1,relation);
    }
  },
  findRelationByMember(memberId){
    let aimRelation;
    this.relations.forEach(relation=>{
      let aimMember = relation.members.find(member=>member.id==memberId&&member.role=='outer');
      if(aimMember) aimRelation = relation;
    })
    return aimRelation;
  }
}

export const userDiagram = userId=>{
  return State.diagrams.filter(el=>el.user.uid==userId);
}

export const getDiagram = list => {
  list.forEach(el=>{
    el.otypes.forEach(ev=>{
      State.otypes[ev.id] = ev;
    })
  })
  State.diagrams = list;
}

export const findOtypeById = id =>{
  return State.otypes[id] 
}
