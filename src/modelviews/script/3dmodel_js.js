import three_js from './three_js'
import {
  getEditor
} from '@/script/operate'
class Model_js {
  constructor() {
    this.center = [113.658247, 34.774313]
    // this.center = [0, 0]
    this.three = ''
  }
  init() {
    this.addMapbox()
    this.getData()
  }

  addMapbox() {
    this.map = new mapboxgl.Map({
      container: "mapbox-3d",
      style: {
        version: 8,
        'sprite': 'http://116.62.28.103:8000/creator/static/mapbox/sprite',
        sources: {
          'raster-tiles': {
            type: 'raster',
            tiles: [
              'http://www.google.cn/maps/vt?lyrs=s@781&gl=cn&x={x}&y={y}&z={z}'
            ],
            tileSize: 256,
            minzoom: 0,
            maxzoom: 22
          }
        },
        layers: [{
          id: 'raster-tiles',
          type: 'raster',
          source: 'raster-tiles',
          minzoom: 0,
          maxzoom: 22
        }]
      },
      center: this.center,
      zoom: 10,
    });



    this.map.on("load", () => {
      console.log("mapbox地图加载完");
      this.three = new three_js(this.center)
      this.map.addLayer(this.three);
      this.map.resize()
    });
  }

  getData() {
    let IdEditor = getEditor();
    IdEditor.on('currentObject', data => {
      console.log('---------------------------------')
      let IdMap = IdEditor.idContext.map();
      console.log(IdMap.center())
      if (!data.object) {
        console.log('没点到')
        return
      }
      let geoBox = data.object.geoBox
      console.log([(geoBox.maxx + geoBox.minx) / 2, (geoBox.maxy + geoBox.miny) / 2])
      
      this.map.flyTo({
        center: [(geoBox.maxx + geoBox.minx) / 2, (geoBox.maxy + geoBox.miny) / 2],
        zoom: 15
      });
      this.three.getData(data, IdEditor.idContext.entity(data.entityId),[(geoBox.maxx + geoBox.minx) / 2, (geoBox.maxy + geoBox.miny) / 2])
      

    })
  }
}
let model_js = new Model_js()
export default model_js
