<template>
  <div class="fill relation-box">
    <div class="pd-left-small pd-right-small relation-header">
      <common-head title="关系列表" @back="back"></common-head>
    </div>
    <div class="mg-left-small mg-right-small object-search flex-center">
      <common-search @startSearch="startSearch" :searchValue="searchValue" :loading="loading"></common-search>
    </div>
    <div class='relation-list pd-big' v-if="relationsList.length>0" v-loading='loading'>
      <div v-for="relation in relationsList" :key="relation.id" class="relation-el radius-2 pointer-shadow pd-small mg-bottom-big" @click="selectRelation(relation)">
        <div class="relation-text flex mg-bottom-small">
          <div class="relation-icon font-white radius-2 flex-center font-14">{{relation.name|initialName}}</div>
          <p class="mg-left-small font-14">{{relation.name}}</p>
        </div>
        <div class="tags">
          <el-tag size="mini" disable-transitions>{{relation.mappingType|getName}}</el-tag>
        </div>
      </div>
      
    </div>
    <div v-else class="relation-list pd-big" v-loading='loading'>
      <div class="font-28 font-gray align-center">暂无关系</div>
      <div class="align-center">
        <el-button @click="getRelationList" type="text">查找全库...</el-button>
      </div>
    </div>
    <div v-if="total>20" class="block flex-center">
      <el-pagination
        layout="prev, pager, next"
        small
        :total="total"
        :pager-count="5"
        :page-size="pageSize"
        @current-change="loadMore">
      </el-pagination>
    </div>
  </div>
</template>
<script>
  import {vm,operate,getEditor} from '@/script/operate'
  import {State} from '@/script/editor/utils/store'
  import {relationServer} from '@/script/server'
  export default {
    data(){
      return {
        otype:{},
        relationsList:[],
        loading:false,
        searchValue:'',
        pageSize:10,
        total:100,
        pageNum:1
      }
    },
    props:{
      currentObject:{
        type:Object,
        default:()=>{return {}}
      }
    },
    components:{
      commonHead:()=>import('@/components/common/tabHead.vue'),
      commonSearch:()=>import('@/components/common/searchBar.vue')
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
        if(otype.connectors&&otype.connectors.connectors){
          otype.connectors.connectors.forEach(connector=>{
            if(connector.relation){
              let relation = this.relationsList.find(el=>el.id==connector.relation.id&&connector.dType.id!=otype.id);
              if(!relation) this.relationsList.push(connector.relation);
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
      },
      startSearch(val){
        console.log(this.searchValue,'serr');
        this.loading = true;
        relationServer.getRelationByName(val).then(res=>{
          console.log(res,'res');
          this.loading = false;
          this.relationsList = res.list;
          this.pageNum = res.pageNum;
          this.pageSize = res.pageSize;
          this.total = Number(res.total);
        })
      },
      loadMore(page){
        // console.log(page,'loadMore');
        this.pageNum = page;
        this.getRelationList();
      },
      getRelationList(){
        let obj = {
          pageNum:this.pageNum,
          pageSize:this.pageSize
        }
        this.loading = true;
        relationServer.getList(obj).then(res=>{
          this.relationsList = res.list;
          this.pageNum = res.pageNum;
          this.pageSize = res.pageSize;
          this.total = Number(res.total);
          this.loading = false;
        })
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
    height: calc(100% - 121px);
    overflow-y: auto;
    // background-color: red;
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
  .object-search{
      border: 1px solid #ccc;
      margin-top: 10px;
      height: 40px;
    }
</style>