<template>
    <div class="user-info cle">
      <div class="user-info-fl cle">
        <img :src="common.getAvatar(common.getInfo('avatar'))" class="user-avatar" alt="">
        <span class="omitted">{{common.getInfo("nick")}}</span>
      </div>
      <div class="user-info-fr cle">
        <a href="javascript:;" @click="common.exitUser.requestOutUser()"><i class="iconfont icon-tuichu"></i>退出登录</a>
      </div>
    </div>
</template>
<script>
import common from "@/script/common";
export default {
  data() {
    return {
      common
    };
  },
  mounted(){

  },
  methods:{
   
  }
};
</script>
<style lang="less" scoped>
.user-info {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  border-top: 1px solid #e1e3e6;
  background: #fff;
  height: 54px;
  line-height: 54px;
  padding: 0 15px;
  .user-info-fl {
    float: left;
    .user-avatar {
      width: 35px;
      height: 35px;
      float: left;
      margin: 10px 0 0 0;
    }
    span {
      float: left;
      color: #666666;
      margin: 0 0 0 5px;
      max-width: 100px;
    }
  }
  .user-info-fr {
    float: right;
    line-height: 57px;
    a {
       color: #999;
       text-decoration: none;
       vertical-align: top;
       i {
          font-size: 14px;
          margin: 0 3px 0 0;
       }
    }
  }
}
</style>
