import {
  psdeImgShow,
  userImgShow
} from './config'

/**
 * 图片管理
 */
function ImageManage() {

}

/*
 * 图片显示
 */
ImageManage.getImgUrl = function (id) {
  return psdeImgShow.baseURL + id;
}
/*
 * 头像显示
 */
ImageManage.userImgUrl = function (id) {
  return userImgShow.baseURL + id;
}

export default ImageManage;
