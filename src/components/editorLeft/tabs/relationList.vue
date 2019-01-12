<template>
  <div class="fill relation-box">
    <div class="pd-left-small pd-right-small relation-header">
      <common-head title="关系列表" @back="back"></common-head>
    </div>
    <div class='relation-list pd-big'>
      <div v-for="relation in relationsList" :key="relation.id" class="relation-el radius-2 pointer-shadow pd-small mg-bottom-big" @click="selectRelation(relation)">
        <div class="relation-text flex mg-bottom-small">
          <div class="relation-icon font-white radius-2 flex-center font-14">{{relation.name|initialName}}</div>
          <p class="mg-left-small font-14">{{relation.name}}</p>
        </div>
        <div class="tags">
          <el-tag size="mini">{{relation.mappingType|getName}}</el-tag>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import {vm,operate,getEditor} from '@/script/operate'
  import {State} from '@/script/editor/utils/store'
  export default {
    data(){
      return {
        otype:{},
        relationsList:[]
      }
    },
    props:{
      currentObject:{
        type:Object,
        default:()=>{return {}}
      }
    },
    components:{
      commonHead:()=>import('@/components/common/tabHead.vue')
    },
    computed:{},
    filters:{
      initialName(str){
        if(typeof str =='string'){
          return str.slice(0,2);
        }else{
          return 'default'
        }
      },
      getName(type){
        let obj = State.relationType.find(el=>el.value==type);
        if(obj){
          return obj.name
        }else{
          return 'default'
        }
      }
    },
    mounted(){
      // this.otype = this.currentObject.otype;
      // console.log('mounted',this.otype);
      // this.getList(this.otype);
    },
    activated(){
      this.relationsList = [];
      this.otype = this.currentObject.otype;
      this.getList(this.otype);
    },
    methods:{
      getList(otype){
        // otype = State.otypes[otype.id];
        console.log(otype,77777)
        if(otype.connectors&&otype.connectors.connectors){
          otype.connectors.connectors.forEach(connector=>{
            if(connector.relation){
              let relation = this.relationsList.find(el=>el.id==connector.relation.id);
              if(!relation) this.relationsList.push(connector.relation);
              console.log(this.relationsList,'ffff')
            }
          })
        }
      },
      selectRelation(relation){
        let IdEdit = getEditor();
        IdEdit.currentRelation = relation;
        vm.$emit(operate.changeTab,{name:'objectList'})
      },
      back(){
        vm.$emit(operate.changeTab,{name:'objectDetail'})
      }
    }
  }
</script>
<style lang='scss' scoped>
  .relation-box{
    background: #fff;
    .relation-header{
      border-bottom: 1px solid #ccc;
    }
  }
  .relation-list{
    height: calc(100% - 41px);
    overflow-y: auto;
    .relation-el{
      border: 1px solid #ccc;
      .relation-text{
        .relation-icon{
          width: 50px;
          height: 50px;
          background-color: #b2d2ff;
        }
      }
    }
  }
</style>