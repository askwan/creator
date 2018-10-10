class Relation {
  constructor(id){
    this.id = id;
    this.way = [];
    this.node = [];
    this.relation = [];
    this.type = "Relation";
  }
  copy(relation){
    for(let key in this){
      if(key !== "relation"){
        this[key] = relation[key]
      }
    }
  }
}

export default Relation