export function actionVisible(entityId,bool) {
  return function(graph) {
    var entity = graph.entity(entityId);
    // entity.visible = bool;
    // entity.toggle(bool);
    // entity.update({name:888})
    console.log(graph);
    graph.remove(entity);
    return graph.update();
  };
}