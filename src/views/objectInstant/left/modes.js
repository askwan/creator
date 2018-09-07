import {coreContext} from '@/iD-2.7.1/modules/core/context.js';
import {
  modeAddArea,
  modeAddLine,
  modeAddPoint,
  modeBrowse
} from '@/iD-2.7.1/modules/modes';
import { select as d3_select } from 'd3-selection';
const operation = {};
const context = coreContext();

const addPoint = function(otype){
  context.currentId(otype.id.toString());
  
  if(d3_select('.add-point').nodes()[0]){
    d3_select('.add-point').nodes()[0].click();
  }
};

const addWay = function(otype){
  context.currentId(otype.id.toString());
  if(d3_select('.add-line').nodes()[0]){
    d3_select('.add-line').nodes()[0].click();
  }
  
};

const addArea = function(otype){
  context.currentId(otype.id.toString());
  if(d3_select('.add-area').nodes()[0]){
    d3_select('.add-area').nodes()[0].click();
  }
  
};




const filterList = function(list){
  let arr = [];
  let str = JSON.stringify(list);
  arr = JSON.parse(str);
  arr = arr.filter(el=>{
    el.formStyles = el.formStyles||{};
    return el.formStyles.styles && el.formStyles.styles.length>0
  });
  arr.map(el=>{
    return el.formStyles.styles = el.formStyles.styles.filter(item=>{
      return item.type == 11||item.type==12||item.type ==13;
    })
  });
  arr = arr.filter(el=>{
    return el.formStyles.styles.length>0;
  })
  return arr;
}


const initUi = function(){
  // d3_select('.joined').style('display','none');
  
}


export {
  addPoint,
  addWay,
  addArea,
  filterList,
  initUi
}