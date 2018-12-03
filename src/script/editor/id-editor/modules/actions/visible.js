export function actionVisible(entityId,bool) {
  return function(graph) {
    var entity = graph.entity(entityId);
    // geometry = entity.geometry(graph),
    // tags = entity.tags;
    let obj = {name:'askwan',id:8541254}
    return graph.replace(entity.update({ssdata: obj}));
  };
}