export function actionVisible(entityId,bool) {
  return function(graph) {
    let changes = [];
    var entity = graph.entity(entityId);
    // console.log(entity.copy(entity,graph));
    // if(entity.type=='way'){
    //   entity.nodes.forEach(node=>{
    //     let n = graph.entity(node).toggle(bool);
    //     changes.push(n)
    //   })
    // }
    // entity.toggle(bool);
    // changes.push(entity);
    // console.log(entity,7777)
    // console.log(graph);
    // console.log(changes);
    // graph.rebase(changes,[graph],false);
    console.log(graph);
    return graph
  };
}