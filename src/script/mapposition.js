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
  },
  saveArea(obj){
    if(obj){
      localStorage.setItem('areaObj',JSON.stringify(obj));
    }
  },
  getArea(){
    let str = localStorage.getItem('areaObj');
    if(str&&str!='undefined') {
      return JSON.parse(str);
    }else{
      return {};
    }
  }
}

export default mapposition
