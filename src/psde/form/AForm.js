import CoreData from '../CoreData'

/**
 * 形态基类
 */
class AForm extends CoreData {
  constructor () {
    super()

    this.defineProperty('id', 0)
    this.defineProperty('fid', 0)
    // this.defineProperty('formref', {})
    this.defineProperty('geomref', 0)
    this.defineProperty('geotype', 0)
    this.defineProperty('type', 20)
    // this.defineProperty('style', '')
    this.defineProperty('dim', 2)
    this.defineProperty('minGrain', 0)
    this.defineProperty('maxGrain', 0)
    this.style = '';
    this.formref = {
      refid:0,
      geometry:{}
    };
    this.geom = null;
  }
}
export default AForm
/*
NULL("NULL", -1),

  OSM("Osm", 10),
  NODE("Node", 11),
  WAY("Way", 12),
  RELATION("Relation", 13),

  GEOMETRY("Geometry", 20),
  POINT("Point", 21),
  LINESTRING("Linestring", 22),
  POLYGON("Polygon", 23),

  GEOGRAPHY("Geography", 30),
  ISOHYPSE("Isohypse", 31),
  DEM("Dem", 32),
  TIN("Tin", 33),

  BIM("Bim", 40),

  MODEL("Model", 50),

  SHAPEBLOCK("ShapeBlock", 60),
  ELLIPSOID("Ellipsoid", 61)

*/
