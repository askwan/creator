import AForm from './AForm'
import osm from './osm'

const TYPE = {
  'node': 11,
  'way': 12,
  'relation': 13,
  'point': 21,
  'linestring': 22,
  'polygon': 23
}
const GEOMTYPE = {
  'node': 'SORTINDEX_EXT_NODE',
  'way': 'SORTINDEX_EXT_WAY',
  'relation': 'SORTINDEX_EXT_RELATION'
}

/**
 * 几何形态
 */
class GeometryForm extends AForm {
  constructor () {
    super()

    // this.defineProperty('geotype', 0)
    this.defineProperty('geom', '')
  }
  updateType (geom) {
    this.type = TYPE[geom.type]
  }
  updateGeoType (geom) {
    this.geotype = TYPE[geom.type] // osm[GEOMTYPE[geom.type]]
  }
  addGeom (geom) {
    this.geom = geom
    this.updateType(geom)
    this.updateGeoType(geom)
  }

}

export default GeometryForm
