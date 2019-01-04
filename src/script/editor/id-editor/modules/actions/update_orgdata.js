export function actionUpdateOrgData(entityId,orgData) {
  return function(graph) {
    var entity = graph.entity(entityId);
    return graph.replace(entity.updateOrgData(orgData));
  };
}