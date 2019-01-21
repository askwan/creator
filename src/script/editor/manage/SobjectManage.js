import Base from './Base'
import SObject from '../psde/psdm/SObject';
import { State } from '../utils/store';
export default class SobjectManage extends Base {
  constructor(context){
    super(context);
    this.context = context;
    this.State = State;
    this.sobjectlist = {};
  }
  setContext(context){
    this.context = context;
  }
  setSobject(sobject){
    let _sobject = new SObject();
    _sobject.copyObject(sobject);
    this.sobjectlist[_sobject.id] = _sobject;
    this.fire('currentObject',{object:_sobject,entityId:null});
  }
  enableSobject(objId){
    let features = this.context.features();
    features.enable(objId);
    this.State.showObject({id:objId});
  }
  disableSobject(objId){
    let features = this.context.features();
    features.disable(objId);
    this.State.hiddenObject({id:objId});
  }
  enableOtype(otId){
    this.context.features().enable(otId);
    let children = State.findChildrenOtype(otId);
    children.forEach((el,i)=>{
      if(i==children.length-1){
        this.context.features().enable(el);
      }else{
        this.context.features().enable(el,true);
      }
      this.State.enableOt(el);
    });
    let showOt = [otId];
    showOt = showOt.concat(children);
    if(this.State.viewObject){
      this.changeStatusObj(State.viewObject,showOt,true);
    }
    let hiddens = State.enableOt(otId);
    return hiddens;
  }
  disableOtype(){
    this.context.features().disable(otId);
    let children = this.State.findChildrenOtype(otId);
    children.forEach((el,i)=>{
      if(i==children.length-1){
        this.context.features().disable(el);
      }else{
        this.context.features().disable(el,true);
      }
      this.State.disableOt(el);
    });
    let hiddens = this.State.disableOt(otId);
    
    if(this.State.viewObject){
      this.changeStatusObj(this.State.viewObject,hiddens,false)
    }
    return hiddens;
  }
  changeStatusObj(){
    if(otIds.find(el=>el==obj.otype.id)){
      obj.show = bool;
    }
    obj.children.forEach(el=>this.changeStatusObj(el,otIds,bool));
    return obj;
  }
  setTool(style,otype,modeOptions){
    let geotype = modeOptions.form.geotype;
    this.currentForm = modeOptions.form;
    if (geotype == 21) {
      document.querySelector('.add-point').click();
    }else if (geotype == 22) {
      document.querySelector('.add-line').click();
    }else if (geotype == 23) {
      document.querySelector('.add-area').click();
    };
  }
  createSobject(entityId,otype,formType,geoType){
    let sobject = new SObject();
    sobject.forms = [{
      
    }]
  }
  modifySobject(){

  }
  modifyAttr(){

  }
  addSobject(){

  }
  changeVersion(){

  }
  addObjectForm(){

  }
  deleteObjectForm(){

  }
  modifyObjectForm(){

  }
  createSobjectNetwork(){

  }
  modifySobjectNetwork(){

  }
  deleteNetwork(){

  }
  updateParent(){

  }
  deleteParent(){

  }
  updateObject(){

  }
  modifyRelaTime(){

  }

  

  updateAndHistory(){

  }


  save(){

  }
  clearGraph(){

  }
  flush(){

  }
}