import wkt from '../wkt'
const type = {
  Point: 21,
  LineString: 22,
  Polygon: 23
}
const toJson = function (way) {
  if(!way) return way
  let str = way.type.toUpperCase();
  str += '(';
  if (way.type == 'Polygon') {
    way.coordinates.forEach(c => {
      str += '(';
      c.forEach((el, i) => {
        str += `${el[0]} ${el[1]}`;
        str += c.length - 1 == i ? '' : ',';
      })
      str += ')';
    })
  } else if (way.type == 'Point') {
    str += `${way.coordinates[0]} ${way.coordinates[1]}`
  } else if (way.type == 'LineString') {
    way.coordinates.forEach((el, i) => {
      str += `${el[0]} ${el[1]}`
      str += i == way.coordinates.length - 1 ? '' : ','
    })
  }
  str += ')';
  return str;
};

const getType = function (way) {
  return type[way.type];
}

const toFeatures = function (sobjectList) {
  let features = [];
  for (let key in sobjectList) {
    let sobject = sobjectList[key]
    for (let i = 0; i < sobject.forms.length; i++) {
      let form = sobject.forms[i];

      let properties = {};
      properties["oid"] = sobject.id;
      properties["fid"] = form.id;
      let geometry = wkt(form.geom);
      if (geometry == null) {
        continue
      }
      let feature = {
        "id": "f" + form.id + "_" + sobject.id,
        "type": "Feature",
        "properties": properties,
        "geometry": geometry
      }
      features.push(feature)
    }
  }
  return features;
}
export {
  toJson,
  getType,
  toFeatures
}
