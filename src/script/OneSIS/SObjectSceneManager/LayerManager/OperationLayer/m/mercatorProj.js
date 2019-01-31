let extent = 20037508.34
let scale = 1 / extent

function fromLL(lng, lat) {
  let position = lonLat2Mercator(lng, lat)
  return {
    x: (position.x + extent) / (2 * extent),
    y: 1 - ((position.y + extent) / (2 * extent))
  }
}

function lonLat2Mercator(lng, lat) {
  let x = lng * extent / 180
  let y = Math.log(Math.tan((90 + lat) * Math.PI / 360)) / (Math.PI / 180)
  y = y * extent / 180
  return {
    x: x,
    y: y
  }
}
//墨卡托转经纬度

function Mercator2lonLat(x, y) {
  let lng = x / extent * 180;
  let lat = y / extent * 180;
  lat= 180 / Math.PI * (2 * Math.atan(Math.exp(lat * Math.PI / 180)) - Math.PI / 2);
  return {
    lng: lng,
    lat: lat
  }

}


export default {
  fromLL,
  lonLat2Mercator,
  Mercator2lonLat,
  scale,
  extent
}
