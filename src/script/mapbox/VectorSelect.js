import psde from '../../psde'
import { vm, operate } from '@/script/operate'
class VectorSelect {
  constructor () {}
  initMap (map) {
    this.map = map


    let self = this
    map.on('click', function (e) {
      // console.log(e)
      var bbox = [
        [e.point.x - 5, e.point.y - 5],
        [e.point.x + 5, e.point.y + 5]
      ]
      var features = map.queryRenderedFeatures(bbox)

      if (map.getLayer('polygon-highlighted')) {
        map.removeLayer('polygon-highlighted')
      }
      if (map.getLayer('line-highlighted')) {
        map.removeLayer('line-highlighted')
      }
      if (map.getLayer('point-highlighted')) {
        map.removeLayer('point-highlighted')
      }

      if (features.length > 0) {
        let feature = features[0]
        self.feature = feature
        if (!feature.layer['source-layer']) {
          return
        }

        if (feature.layer.type == 'fill') {
          map.addLayer({
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
        }else if (feature.layer.type == 'line') {
          map.addLayer({
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
        }else if (feature.layer.type == 'circle') {
          map.addLayer({
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
        }
				
				//点击对象左边显示详细信息
//				console.log(feature.properties)
//      self.loadObjectById(feature.properties.oid)
      }else {
//      vm.$emit(operate.currentObject, {})
        self.feature = null
      }

    // map.setFilter("polygon-highlighted", filter)
    })
  }
  loadObjectById (id) {
    let self = this
    psde.objectQuery.getDetailById.query({ ids: id }).then(response => {
      vm.$emit(operate.currentObject, response.list[0])
    })
  }
}

let vectorSelect = new VectorSelect()

export default vectorSelect
