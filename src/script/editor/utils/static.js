const dimension = [{
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
];

const styleServerType = [{
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
];

const formstyleType = [{
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
];

export {
  dimension,
  styleServerType,
  formstyleType
}