import Vue from 'vue';

export const operate = {
  changeTab:'changeTab',
  selectBehavior:'selectBehavior',
  notice:'notice',
  selectObject:'selectObject',
  openTab:'openTab',
  mapBoxZoom:'mapBoxZoom',
}

let vm = new Vue();

let _editor;
const getEditor = (_)=>{
  if(!_) return _editor;
  _editor = _;
}

export {vm,getEditor};