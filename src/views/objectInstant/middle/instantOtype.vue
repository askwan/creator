<template>
  <div class='instant-otype-root'>
    <div class="instant-box" ></div>
    <div class="close-menu" @click="closeOpen">
      <i class="iconfont icon-guanbi1"></i>
    </div>
  </div>
</template>
<script>
  import { vm,operate} from '@/script/operate'
  export default {
    data(){
      return {
        isOpen:false
      }
    },
    props:{},
    components:{},
    computed:{},
    mounted(){
      
    },
    methods:{
      closeOpen(){
        this.$emit("closeOperate");
      }
    }
  }
</script>
<style lang='less' scoped>

  .instant-otype-root{
    position: absolute;
    top:0px;
    left: 0px;
    z-index: 21;
    right: 40px;
    bottom:0;
  }
  .instant-box{
    position: absolute;
    left: 0;
    top:0;
    bottom:0;
    right: 0px;
    background-color: #969799;
  }
  .close-menu{
    width: 40px;
    height: 40px;
    border-top-right-radius: 3px;
    border-bottom-right-radius: 3px;
    background-color: #969799;
    position: absolute;
    top: 0;
    right:-40px;
    line-height: 40px;
    text-align: center;
    cursor: pointer;
    i{
      color: #fff;
      font-size: 14px;
    }
  }
  
</style>