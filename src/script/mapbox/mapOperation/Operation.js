import {
  objectServer
} from '@/script/server'
import sObjectManege from './SObjectManege'
import GeometryLayer from './GeometryLayer'

class Operation {
  constructor(map) {
    this.map = map
    this.layer = new GeometryLayer()
    this.addLayer()
    // this.moveend()
  }
  addLayer() {
    this.map.addLayer({
      id: 'build',
      type: 'fill-extrusion',
      source: 'vector-tiles',
      'source-layer': "l5193",
      minzoom: 0,
      maxzoom: 22,
      'paint': {
        'fill-extrusion-color': ['to-color', ['get', 'color'], '#484896'],
        'fill-extrusion-opacity': 0.9,
        'fill-extrusion-height': ["*", ['to-number', ['get', 'height']],
          ['to-number', ['get', 'FLOOR']]
        ],
        'fill-extrusion-base': ["*", ["-", ['to-number', ['get', 'FLOOR']], 1],
          ['to-number', ['get', 'height']]
        ]
      },
    })
    this.map.addLayer(this.layer)

  }
  moveend() {
 
    let obj = {
      // parents: 2169714253824,
      geoWkt:'BBOX(120.432183  120.433512 31.322479 31.324123)',
      loadChildren: true,
      loadForm: true,
      geoEdit: true,
      loadNetwork: true,
      loadObjType:true
    }
    console.log(obj)
    objectServer.query(obj).then(res => {
      console.log(res)
      let list = res.list
      for (let i = 0; i < list.length; i++) {
        let s = list[i]
        sObjectManege.addList(s)
      }
        console.log(sObjectManege)

      for(let i in sObjectManege.sobjectList){
        let s=sObjectManege.sobjectList[i]
      this.layer.add(s)
      }
      console.log(this.layer)
    })
  }
}
export default Operation
