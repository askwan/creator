//import Log from '../Common/Log';
import BaseSerializer from './BaseSerializer';

class ImageSerializer extends BaseSerializer {

    constructor(name, defaultValue, options) {
        super(name, options);

        this._defaultValue = defaultValue;
    }

    /** @override */
    read(inputStream, object) {
        if (inputStream.isBinary()) {
            let hasImage = inputStream.inputOperator.readBool();
            if (hasImage) {
                object.setProperty(this.getName(), inputStream.readImage());
            }
        }
        else if (inputStream.inputOperator.matchString(this.getName())) {
            let hasImage = inputStream.inputOperator.readBool();
            if(hasImage){
                inputStream.readBeginBracket();
                object.setProperty(this.getName(),inputStream.readImage());
                inputStream.readEndBracket();
            }
        }
    }

}

export default ImageSerializer;