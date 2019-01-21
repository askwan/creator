import Base from './Base'

import {psdeUrl,psdeBaseUrl,token,UcServerUrl} from '../config'

class HdfsServer extends Base {
  constructor(){
    super();
    // psdeBaseUrl +'/dae/model-service/model/rest/v0.1.0/datastore/slave/model/file';
    // this.url = psdeBaseUrl + "/dae/hdfs-service/hdfs/rest/v0.1.0/datastore/slave/hdfs/download?srcPath="
    this.url = psdeBaseUrl + "/dae/hdfs-service/hdfs/rest/v0.1.0/datastore/slave/hdfs";
  }
  getImageUrl(src){
    return psdeUrl + "image/show?token=" + token + "&imageUrl=" + src
  }
  getUserImage(src){
    return UcServerUrl+src;
  }
  downloadUrl(name){
    return this.url+'/download?srcPath='+name;
  }
}

export default new HdfsServer();