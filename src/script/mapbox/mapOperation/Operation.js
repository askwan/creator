import {
  objectServer
} from '@/script/server'
import sObjectManege from './SObjectManege'
import MapGL from './MapGL'
// import SObject from '../../OneSIS/SObjectSceneManager/LayerManager/CustomLayer/SObject';


class Operation {
  constructor(map) {
    this.map = map
    this.layer = new MapGL(map)
    this.addLayer()
    // this.moveend();
    this.rootObj = '';
  }
  addLayer() {
    this.map.addLayer({
      'id': 'build',
      'type': 'fill-extrusion',
      'source': 'vector-tiles',
      'source-layer': "l5193",
      'paint': {
        'fill-extrusion-color': ['to-color', ['get', 'color'], '#484896'],
        'fill-extrusion-opacity': {
          "stops": [
            [17, 1],
            [18, 0]
          ]
        },
        'fill-extrusion-height': ["*", ['to-number', ['get', 'height']],
          ['to-number', ['get', 'FLOOR']]
        ],
        'fill-extrusion-base': ["*", ["-", ['to-number', ['get', 'FLOOR']], 1],
          ['to-number', ['get', 'height']]
        ]
      },
    });

    // this.map.addLayer({
    //   id: 'building',
    //   type: 'fill-extrusion',
    //   source: 'vector-tiles',
    //   'source-layer': "l7040",
    //   'filter': ['!has', 'internal'],
    //   // scheme:'tms',
    //   'paint': {
    //     'fill-extrusion-color': ['to-color', ['get', 'color'], '#f00'],
    //     // 'fill-extrusion-color': ['get', 'color'],
    //     'fill-extrusion-opacity': {
    //       "stops":[[17,1],[18,0]]
    //     },
    //     // 'fill-extrusion-pattern': (1, 2),
    //     'fill-extrusion-height': ['to-number', ['get', 'height'],1],
    //     // 'fill-extrusion-base': ['to-number', ['get', 'min_height']],
    //   },
    // })
    // this.map.addLayer(this.layer)

  }
  moveend(_obj) {
    let domain = JSON.parse(sessionStorage.getItem('sdomain'));
    let obj = {
      // parents: 2169714253824,
      geoWkt: _obj,
      // geoWkt: "BBOX(120.432163 120.433513 31.322459 31.324095)",
      loadChildren: true,
      loadForm: true,
      geoEdit: true,
      loadNetwork: true,
      loadObjType: true,
      sdomains: domain.id,
      uids: ''
    };
    if (this.bool) return
    this.bool = true;
    if (this.rootObj) {
      this.rootObj = sObjectManege.toggle(this.rootObj, true);
      if (this.rootObj.children) {
        this.layer.start(this.rootObj.children);
      };
      return
    }
    objectServer.query(obj).then(res => {
      console.log(11111111, res)
      let list = res.list;
      let sobject = sObjectManege.transform(list);
      this.rootObj = sobject;
      this.layer.start(this.rootObj);

      // if(sobject.children){
      //   this.layer.start(sobject.children[0]);
      //   this.layer.start(sobject.children[1]);
      // };
    })
  }
  renderObject(root) {
    root.children.forEach(child => {
      this.renderObject(child);
    })
    this.layer.add(root);
  }
  remove() {
    if (!this.bool || !this.rootObj) return
    this.layer.remove();
    this.bool = false;
  }

}
export default Operation
