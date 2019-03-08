import ObjectWrapperManager from '../Serializer/ObjectWrapperManager';
import EnumSerializer from '../Serializer/EnumSerializer';
import UserSerializer  from '../Serializer/UserSerializer';
import ObjectWrapper from '../Serializer/ObjectWrapper';
import LOD from '../OsgTypes/LOD';
import CenterMode  from '../Enum/LOD_CenterMode';
import RangeMode   from '../Enum/LOD_RangeMode';

let objectWrapper = new ObjectWrapper(
    "osg::LOD",
    ["osg::Object", "osg::Node", "osg::Group", "osg::LOD"],
    LOD
);

function readRangeList(inputStream, lod) {
    let size = inputStream.inputOperator.readUInt();
    inputStream.readBeginBracket();
    let ranges = [];
    for(let i = 0 ; i<size ; i++){
        let min = inputStream.inputOperator.readFloat();
        let max = inputStream.inputOperator.readFloat();
        ranges.push({min,max});
    }
    inputStream.readEndBracket();
    lod.setProperty("RangeList",ranges);
}

function readUserCenter(inputStream, groupNode) {
    let center = inputStream.readVectorOfType(3,"Double");
    let radius = inputStream.inputOperator.readDouble();
    groupNode.setProperty("Radius",radius);
    groupNode.setProperty("Center",center);
}

objectWrapper.addSerializer(new EnumSerializer("CenterMode", CenterMode, CenterMode.USE_BOUNDING_SPHERE_CENTER));
objectWrapper.addSerializer(new UserSerializer("UserCenter", readUserCenter));
objectWrapper.addSerializer(new EnumSerializer("RangeMode", RangeMode, RangeMode.DISTANCE_FROM_EYE_POINT));
objectWrapper.addSerializer(new UserSerializer("RangeList", readRangeList));

ObjectWrapperManager.addWrapper(objectWrapper);