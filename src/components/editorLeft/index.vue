<template>
  <div class='left-box fill'>
    <div class="object-title pd-left-small pd-right-small flex-between">
      <span class="font-16 text-ellipsis" v-show="componentId=='objectDetail'">
        <i class="el-icon-back pointer-default" @click="resetOtype"></i>
        {{title}}({{otypeName}})
      </span>
      <el-button class="btn" type="text" v-show="componentId=='objectDetail'" @click="cloneObject">克隆</el-button>
    </div>
    <div class="object-detail">
      <keep-alive>
        <component :is="componentId" :currentObject="sobject" :entity="entity"></component>
      </keep-alive>
    </div>
  </div>
</template>
<script>
  import {vm,operate,getEditor} from '@/script/operate'
  export default {
    data(){
      return {
        componentId:'searchList',
        title:'',
        otypeName:''
      }
    },
    props:['sobject','entity'],
    components:{
      'diagramList':()=>import('./tabs/diagramList.vue'),
      'objectDetail':()=>import('./tabs/objectDetail.vue'),
      'objectList':()=>import('./tabs/objectList.vue'),
      'relationList':()=>import('./tabs/relationList.vue'),
      'behaviorList':()=>import('./tabs/behaviorList.vue'),
      'searchList':()=>import('./tabs/searchList.vue'),
      'addRelation':()=>import('./tabs/addRelation.vue'),
      'modeList':()=>import('./tabs/modeList.vue')
    },
    computed:{},
    mounted(){
      this.listenEvent();
    },
    watch:{
      componentId(val){
        if(val!='objectDetail'){
          this.title = '';
          this.otypeName = '';
        }else{
          this.title = this.sobject.name||'default';
          this.otypeName = this.sobject.otype.name;
        }
      },
      'sobject.id'(id){
        this.otypeName = this.sobject.otype.name;
        this.title = this.sobject.name||'default';
      }
    },
    methods:{
      listenEvent(){
        vm.$on(operate.changeTab,obj=>{
          this.componentId = obj.name;
        })
      },
      cloneObject(){
        getEditor().cloneObject();
      },
      resetOtype(){
        // console.log(this.sobject,this.entity)
        vm.$emit(operate.currentEntity)
        vm.$emit(operate.changeTab,{name:'diagramList'});
      }
    }
  }
</script>
<style lang='scss' scoped>
  $height:50px;
  .left-box{
    background: #f1f1f1;
    .object-title{
      height: $height;
      background: #fff;
      border-bottom: 1px solid #ccc;
      span{
        line-height: $height;
      }
      .btn{
        height: 35px;
      }
    }
    .object-detail{
      position:absolute;
      left:0;
      right:0;
      top:$height;
      bottom:0;
      overflow-y: auto;
      overflow-x: hidden;
    }
  }
</style>