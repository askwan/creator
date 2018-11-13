export function actionAddEntity(way) {
    return function(graph) {
        way.toggle(false)
        console.log(way,123);
        console.log(graph)
        return graph.replace(way);
    };
}
