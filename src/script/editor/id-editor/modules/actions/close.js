export function actionClose(wayId) {
  return function (graph) {
      return graph.replace(graph.entity(wayId).close());
  };
}