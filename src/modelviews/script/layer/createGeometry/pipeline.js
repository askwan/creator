class PipelineGeometry{
  constructor(from:From,sobject:SObject){
    this.lineGeometrty=sobject.getFormPolygon();
  }
  createGeometry(){
return this;
  }
  render(gl){

  }

}