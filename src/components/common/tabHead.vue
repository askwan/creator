<template>
  <div class="tab-head flex-between">
    <i class="el-icon-back font-18 font-black pointer-default" @click="back"></i>
    <span class="font-14 no-select">{{title}}</span>
  </div>
</template>
<script>
  export default {
    data(){
      return {

      }
    },
    props:{
      title:{
        type:String,
        default:''
      }
    },
    components:{},
    computed:{},
    mounted(){

    },
    methods:{
      back(){
        this.$emit('back');
      }
    }
  }
</script>
<style lang='scss' scoped>
  .tab-head{
    height: 40px;
  }
</style>