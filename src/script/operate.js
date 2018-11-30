import Vue from 'vue';

export const operate = {
  changeTab:'changeTab',
  selectBehavior:'selectBehavior',
  notice:'notice',
  selectObject:'selectObject',
  openTab:'openTab',
  mapBoxZoom:'mapBoxZoom',
  DiagramReady:'DiagramReady',
  mapStatus:'mapStatus',
  showClickdel:'showClickdel',
  constituteOtype:'constituteOtype',
  currentObject:'currentObject'
}

let vm = new Vue();

let _editor;
const getEditor = (_)=>{
  if(!_) return _editor;
  _editor = _;
}

let _map
const getMap = (_)=>{
  if(!_) return _map;
  _map = _;
}

export {vm,getEditor,getMap};