class Point {
  constructor(option){
    this.type = 'Point';
    this.coordinates=[option.x,option.y];
  }
}

class Node {
  constructor(option){
    this.type = 'NODE';
    this.id = option.id;
    this.coord = [option.x,option.y];
  }
}

class Way {
  constructor(option){
    this.type = 'WAY';
    this.nodes = [];
    option.nodes.forEach(n=>{
      this.nodes.push(new Node(n));
    })
  }
}

class Relation {
  constructor(){

  }
}

const parse = geom => {
  return new Point(geom)
}
export default parse

