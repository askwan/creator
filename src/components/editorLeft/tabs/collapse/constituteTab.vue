<template>
  <div class='constitute-tab pd-big'>
    <div class="add-content pointer-default flex-center mg-bottom-big" @click="chooseParent">
      <span class="font-14 no-select">+选择父对象</span>
    </div>
    <div class="">
      <el-tag v-for="parent in parents" class="mg-right-small mg-bottom-small" :key="parent" @close="deleteParent(parent)" closable disable-transitions>{{parent}}</el-tag>
    </div>
  </div>
</template>
<script>
  import {vm,operate,getEditor} from '@/script/operate';
  export default {
    data(){
      return {
        parents:[]
      }
    },
    props:{
      objectDetail:{
        type:Object,
        defalut:{}
      }
    },
    components:{},
    computed:{},
    filters:{
      formateName(str){
        return str?str:'defalut'
      }
    },
    mounted(){
      this.parents = this.objectDetail.parents;
    },
    activated(){
      this.parents = this.objectDetail.parents;
    },
    methods:{
      deleteParent(parent){
        console.log('deleteParent');
        getEditor().deleteParent(parent);
        this.parents = this.parents.filter(el=>el!=parent);
      },
      chooseParent(){
        vm.$emit(operate.changeTab,{name:'objectList'});
      },
    }
  }
</script>
<style lang='scss' scoped>
  .constitute-tab{
    .add-content{
      height: 70px;
      background-color: #f5f7fa;
      border: 2px dashed #e1e3e6;
      border-radius: 4px;
    }
  }
  
</style>