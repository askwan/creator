import _assign from 'lodash-es/assign'
import _cloneDeep from 'lodash-es/cloneDeep';
/**
编辑历史
 */
class History {
  constructor(map, draw) {
    this.map = map
    this.draw = draw
    // 变更记录
    this.index = 0
    /**编辑历史 */
    this.graphList = []

    this.graphListNext = []
    this.summary = [];
  }
  push(graph) {
    this.index++
    //添加编辑区域到内存中
    this.graphList.push(_cloneDeep(graph));
    
  }
  /**
   * 编辑的撤销
   */
  pop() {
    if (this.index > 0) {
      let graphs = this.graphList.splice(this.index - 1, 1);
      
      return graphs[0]
    }
    return null
  }
  /**
   * 撤销
   */
  undo() {
    
  }
  /**
   * 重做
   */
  redo() {
    
  }
  changes(change){
    if(!change){
      if(this.graphList.length==0) return []
      // return this.graphList[this.graphList.length-1].sobjectList;
      return this.summary
    }else{
      // console.log(this.graphList);
      // console.log(,96999);
      if(this.graphList[this.graphList.length-1].getSobjectById(change.features[0].id)){
        let obj = {};
        obj.change = change;
        obj.graph = this.graphList[this.graphList.length-1].getSobjectById(change.features[0].id)
        this.summary.push(obj);
      }
      
    }
    
  }

  
}

export default History;
