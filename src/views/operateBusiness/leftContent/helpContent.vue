<template>
    <div class="help-box">
     <div class="help-m">
       <div class="help-tit"><i class="iconfont icon-bangzhu1"></i>如何管理业务？</div>
       <div class="help-des">
          此处为帮助内容后期完善此处为帮助内容后
          期完善此处为帮助内容后期完善此处为帮助
          内容后期完善此处为帮助内容后期完善此处
          为帮助内容后期完善此处为帮助内容后期完
          善此处为帮助内容后期完善此处为帮助内容
          后期完善此处为帮助内容后期完善此处为帮
          处为帮助内容后期完善此处为帮完善。
       </div> 
       <div class="more-txt">
         深入了解<a href="http://116.62.28.103:16666/onegis/#/wiki/term" target="_blank">creator.onegis.org/wiki</a>
       </div>
      <div class="help-tit"><i class="iconfont icon-bangzhu1"></i>业务操作流程？</div>
       <div class="help-des">
          此处为帮助内容后期完善此处为帮助内容后
          期完善此处为帮助内容后期完善此处为帮助
          内容后期完善此处为帮助内容后期完善此处
          为帮助内容后期完善此处为帮助内容后期完
          善此处为帮助内容后期完善此处为帮助内容
          后期完善此处为帮助内容后期完善此处为帮
          处为帮助内容后期完善此处为帮完善。
       </div> 
     </div>
    </div>
</template>
<script>
export default {
  data() {
    return {
    };
  },
  components:{
  },
  mounted(){

  },
  methods:{
   
  }
};
</script>
<style lang="less" scoped>
.help-box {
  position: absolute;
  top: 50%;
  left: 0;
  transform: translateY(-50%);
  overflow: auto;
  .help-m {
    margin: 100px 15px 115px 15px;
    background: #fff;
    padding: 0 20px 20px 20px;
    border-radius: 5px;
    position: relative;
    &:after {
      content: "";
      display: block;
      position: absolute;
      bottom: -33px;
      left: 30px;
      width: 0;
      height: 0;
      border-top: 0px solid transparent;
      border-left: 32px solid #fff;
      border-bottom: 35px solid transparent;
      -webkit-transition: all .2s ease;
      transition: all .2s ease;
    }
    .help-tit {
      color: #666;
      font-size: 16px;
      line-height: 50px;
      i {
        font-size: 20px;
        margin: 0 3px 0 0;
        vertical-align: middle;
        color: #999;
      }
    }
    .help-des {
      color: #666; 
      line-height: 20px;
    }
    .more-txt {
      color: #666;
      line-height: 30px;
      a {
        margin: 0 0 0 5px;
        color: #4588e5;
      }
    }
  }
}
</style>
