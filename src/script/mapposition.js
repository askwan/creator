/**
用来记录当前编辑位置
 */
let mapposition = {
  saveMapPosition(position) {
    localStorage.setItem('position', JSON.stringify(position))
  },
  getMapPosition() {
    let position = localStorage.getItem('position')
    if (position) {
      return JSON.parse(position)
    }
    return {
      lng: 113,
      lat: 34,
      zoom: 6
    }
  }
}

export default mapposition
