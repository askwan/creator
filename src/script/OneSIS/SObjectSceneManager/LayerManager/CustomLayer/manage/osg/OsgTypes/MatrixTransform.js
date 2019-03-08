import Transform  from './Transform';
class MatrixTransform extends Transform{
    constructor(){
        super();
        this.Type = "osg::MatrixTransform";

        this.Matrix = null;
    }
}

export default MatrixTransform;