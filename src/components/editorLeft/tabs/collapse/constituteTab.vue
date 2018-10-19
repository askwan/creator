<template>
  <div class='constitute-tab pd-big'>
    <div class="add-content pointer-default flex-center mg-bottom-big" @click="chooseParent">
      <span class="font-14 no-select">+选择关系对象</span>
    </div>
    <div class="">
      <el-tag v-for="parent in parents" class="mg-right-small mg-bottom-small" :key="parent.id" @close="deleteParent(parent)" closable disable-transitions>{{parent.name||parent.id}}</el-tag>
    </div>
  </div>
</template>
<script>
  import {vm,operate,getEditor} from '@/script/operate';
  import psde from '@/script/editor/psde';
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
      this.getName(this.objectDetail.parents);
    },
    activated(){
      this.getName(this.objectDetail.parents);
    },
    methods:{
      deleteParent(parent){
        
        getEditor().deleteParent(parent);
        this.parents = this.parents.filter(el=>el.id!=parent.id);
      },
      chooseParent(){
        vm.$emit(operate.changeTab,{name:'objectList'});
      },
      getName(parents){
        let str = parents.map(el=>el.id).join(',');
        this.parents = [];
        if(str.length==0) return
        psde.objectQuery.loadObject({ids:str}).then(res=>{
          res.list.forEach(el=>{
            let obj = {};
            obj.id = el.id;
            obj.name = el.name;
            this.parents.push(obj)
          })
        })
      }
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