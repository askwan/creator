import Vue from "vue"

const operate = {
  flyTo: 'flyTo',
  currentObject: 'currentObject',
  mapBoxZoom: 'mapBoxZoom',
  currentComp: 'currentComp',
  showClick: 'showClick',
  showClickdel: 'showClickdel',

}
let context;
const getContext = (_) => {
  if (!_) return context;
  context = _;
  return context;
}

const vm = new Vue();

let _relation;
const manager = {
  currentRelation(_) {
    if (!_) return _relation;
    _relation = _
  }
}






export {
  vm,
  operate,
  getContext,
  manager
}
