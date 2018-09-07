<template>
  <div class='root-user' @mouseleave="isShow=false">
    <ul class="user-title">
      <li>
        <i class="iconfont icon-bangzhu"></i>
        <span>帮助</span>
      </li>
      <li @click="openInstant">
        <i class="iconfont icon-duixiangshilihua"></i>
        <span>对象实例化</span>
      </li>
      <!-- <li>
        <i class="iconfont icon-xuqiuguanli"></i>
        <span @click="pathTo('/management')">需求管理</span>
      </li> -->
      <li @mouseenter="isShow = true">
        <img :src="src" alt="">
      </li>
      
    </ul>
    <div class="user-exit" v-show="isShow">
          <a href="javascript:;" @click="exitUser"><i class="iconfont icon-tuichu"></i>退出登录</a>
    </div>
  </div>
</template>
<script>
  import { vm,operate} from '@/script/operate'
  import common from "@/script/common";
  export default {
    data(){
      return {
        isShow:false,
        src:common.getAvatar(common.getInfo('avatar'))
      }
    },
    props:{
      
    },
    components:{},
    computed:{},
    mounted(){

    },
    methods:{
      openInstant(){
        vm.$emit(operate.openInstant)
      },
      showExit(){
        this.isShow = true;
      },
      exitUser(){
        common.exitUser.requestOutUser();
      },
      pathTo(url){
        this.$router.push({
          path:url
        })
      }
    }
  }
</script>
<style lang='less' scoped>
  .root-user{
    width:100%;
    height: 100%;
    position: relative;
    
    
    .user-title{
      display: flex;
      padding: 10px;
      height: 46px;
      align-items: center;
      justify-content: center;
      background-color: #fff;
      border-radius: 3px;
      li{
        display: flex;
        justify-content: center;
        align-items: center;
        flex-grow: 2;
        height: 14px;
        color:#666;
        i{
          margin-right: 2px;
        }
        img{
          width: 30px;
          height: 30px;
          border-radius: 50%;
        }
      }
      li:nth-of-type(2){
        border-left: 1px solid #999;
        border-right: 1px solid #999;
      }
      li:nth-of-type(4){
        flex-grow: 0 !important;
        // flex-basis: 20px;
      }
    }
  }
  .user-exit{
    width: 80px;
    height: 30px;
    background-color: #fff;
    position: absolute;
    top:48px;
    right: 0;
    color:#666;
    text-align: center;
    line-height: 30px;
    font-size: 12px;
    border-radius: 3px;
    cursor: pointer;
    a{
      text-decoration: none;
    }
  }
  .user-title{
    li:hover{
      i{
        transition: transform .2s linear;
        transform: scale(1.2);
        color:#176de6;
      }
      span{
        color: #176de6;
      }
    }
  }
</style>