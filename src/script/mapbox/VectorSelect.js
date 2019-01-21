
import {
  vm,
  operate
} from '@/script/operate'
class VectorSelect {
  constructor() {
    this.pitchOn = ''
    this.con()
  }
  con() {
    vm.$on(operate.showClickdel, data => {
      this.feature = null;
      let obj = {
        point: {
          x: -10000000,
          y: -10000000
        }
      }
      this.onclick(obj);


    });
  }
  initMap(map) {
    this.map = map


    let self = this
    map.on('click', (e) => {
      this.onclick(e)
    })
  }
  onclick(e) {
    var bbox = [
      [e.point.x - 5, e.point.y - 5],
      [e.point.x + 5, e.point.y + 5]
    ];
    // console.log(e.lngLat);
    var features = this.map.queryRenderedFeatures(bbox)
    if (this.map.getLayer('polygon-highlighted')) {
      this.map.removeLayer('polygon-highlighted')
    }
    if (this.map.getLayer('line-highlighted')) {
      this.map.removeLayer('line-highlighted')
    }
    if (this.map.getLayer('point-highlighted')) {
      this.map.removeLayer('point-highlighted')
    }
    if(this.map.getLayer('cube-highlighted')){
      this.map.removeLayer('cube-highlighted');
    }
    if(this.map.getLayer('symbol-highlighted')){
      this.map.removeLayer('symbol-highlighted');
    }

    if (features.length > 0) {
      this.pitchOn = features[0].properties
      // vm.$emit(operate.showClick, this.pitchOn)

      let feature = features[0]
      self.feature = feature
      if (!feature.layer['source-layer']) {
        return
      }
      if (feature.layer.type == 'fill') {
        
        this.map.addLayer({
          'id': 'polygon-highlighted',
          'type': 'fill',
          'source': 'vector-tiles',
          'source-layer': feature.layer['source-layer'],
          'paint': {
            'fill-outline-color': '#484896',
            'fill-color': '#ff0000',
            'fill-opacity': 1
          },
          'filter': ['in', 'uuid', feature.properties.uuid]
        })
      } else if (feature.layer.type == 'line') {
        this.map.addLayer({
          'id': 'line-highlighted',
          'type': 'line',
          'source': 'vector-tiles',
          'source-layer': feature.layer['source-layer'],
          'paint': {
            'line-color': '#ff0000',
            'line-opacity': 1,
            'line-width': 3
          },
          'filter': ['in', 'uuid', feature.properties.uuid]
        })
      } else if (feature.layer.type == 'circle') {
        this.map.addLayer({
          'id': 'point-highlighted',
          'type': 'circle',
          'source': 'vector-tiles',
          'source-layer': feature.layer['source-layer'],
          'paint': {
            'circle-radius': 5,
            'circle-color': '#ff0000'
          },
          'filter': ['in', 'uuid', feature.properties.uuid]
        })
      } else if(feature.layer.type == 'fill-extrusion'){
        // console.log(feature,'featue');
        this.map.addLayer({
          id:'cube-highlighted',
          type:'fill-extrusion',
          source:"vector-tiles",
          "source-layer":feature.layer['source-layer'],
          paint:{
            "fill-extrusion-color": "#f00",
            "fill-extrusion-height": ["to-number", ["get", "height"],0.4],
            "fill-extrusion-base": ["to-number", ["get", "min_height"],1]
          },
          'filter': ['in', 'uuid', feature.properties.uuid]
        })
      }else if(feature.layer.type == 'symbol'){
        this.map.addLayer({
          id:'symbol-highlighted',
          'type': 'circle',
          'source': 'vector-tiles',
          'source-layer': feature.layer['source-layer'],
          'paint': {
            'circle-radius': 5,
            'circle-color': '#ff0000'
          },
          'filter': ['in', 'uuid', feature.properties.uuid]
        })
      }

      //点击对象左边显示详细信息
      // console.log(feature,feature.properties.oid);
      vm.$emit(operate.selectObject,{id:feature.properties.oid})
    } else {
      this.pitchOn = ''
      // vm.$emit(operate.showClick, this.pitchOn)
      vm.$emit(operate.selectObject,{id:null})
      // self.feature = null
    }

    
  }

}

let vectorSelect = new VectorSelect()

export default vectorSelect
