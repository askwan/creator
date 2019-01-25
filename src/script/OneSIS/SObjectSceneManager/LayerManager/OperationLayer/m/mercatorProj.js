let extent = 20037508.34
let scale = 1 / extent

function fromLL(lon, lat) {
  let position = lonLat2Mercator(lon, lat)
  return {
    x: (position.x + extent) / (2 * extent),
    y: 1 - ((position.y + extent) / (2 * extent))
  }
}

function lonLat2Mercator(lon, lat) {
  let x = lon * extent / 180
  let y = Math.log(Math.tan((90 + lat) * Math.PI / 360)) / (Math.PI / 180)
  y = y * extent / 180
  return {
    x: x,
    y: y
  }
}
//墨卡托转经纬度

function Mercator2lonLat(x, y) {
  let lon = x / 20037508.34 * 180;
  let lat = y / 20037508.34 * 180;
  lat= 180 / Math.PI * (2 * Math.atan(Math.exp(lat * Math.PI / 180)) - Math.PI / 2);
  return {
    lon: lon,
    lat: lat
  }

}
//         public Vector2D Mercator2lonLat(Vector2D mercator)
//         {
//             Vector2D lonLat = new Vector2D();
//             double x = mercator.X / 20037508.34 * 180;
//             double y = mercator.Y / 20037508.34 * 180;
//             y = 180 / Math.PI * (2 * Math.Atan(Math.Exp(y * Math.PI / 180)) - Math.PI / 2);
//             lonLat.X = x;
//             lonLat.Y = y;
//             return lonLat;
//         }

export default {
  fromLL,
  lonLat2Mercator,
  Mercator2lonLat,
  scale,
  extent
}
