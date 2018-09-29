<template>
  <div class='relation-tab padding-10'>
    <h3 class="padding-10" @click="back">返回</h3>
    <el-form size="mini">
      <el-form-item label-width="75px" label="添加关系">
        <relation-operate></relation-operate>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
  import {vm,operate,getContext} from '@/script/operate';
  export default {
    data(){
      return {
        
      }
    },
    props:{
      name:{
        type:String,
        default:'propertyObject'
      }
    },
    components:{
      relationOperate:()=>import('./relationOperate')
    },
    computed:{},
    mounted(){

    },
    methods:{
      back(){
        vm.$emit(operate.currentComp,{name:this.name});
      }
    }
  }
</script>
<style lang='less' scoped>
  .padding-10{
    padding: 10px;
  }

</style>