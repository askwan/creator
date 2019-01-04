import Evented from '../utils/Evented'
export default class ManageBase extends Evented {
  constructor(context){
    super();
    this.context = context;
  }
  getSobjectByOsmEntity(entityId){
    let result = this.getSObjectByListOsmEntity(this.currentGraph.sobjectList, entityId)
    if (result != null) {
      return result
    }
    result = this.getSObjectByListOsmEntity(this.sobjectlist, entityId)
    if (result != null) {
      return result
    }
    return null
  }
  getSobjectByListOsmEntity(){

  }
  getSobjectById(){

  }
  getSobjectByOtypes(){

  }
  querySobjectByOtype(){

  }
  cloneObject(){

  }
  copyEntity(){

  }
  createNode(){

  }
  createWay(){

  }
  createRelation(){

  }
  copySobject(){

  }
  getCenter(){

  }

}