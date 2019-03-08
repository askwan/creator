import ObjectWrapperManager from '../Serializer/ObjectWrapperManager';
import UserSerializer  from '../Serializer/UserSerializer';
import ObjectWrapper from '../Serializer/ObjectWrapper';
import Group from '../OsgTypes/Group';

let objectWrapper = new ObjectWrapper(
    "osg::Group",
    ["osg::Object","osg::Node","osg::Group"],
    Group
);

function readChildren(inputStream,groupNode){
    let size = inputStream.inputOperator.readUInt();
    inputStream.readBeginBracket();
    for (let i=0;i<size;i++){
        let obj = inputStream.readObject();
        if (obj) {
            groupNode.Children.push(obj);
        }
    }
    inputStream.readEndBracket();
}

objectWrapper.addSerializer(new UserSerializer("Children",readChildren));

ObjectWrapperManager.addWrapper(objectWrapper);