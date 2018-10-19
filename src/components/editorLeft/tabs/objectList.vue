<template>
  <div class="object-box fill">
    <div class="pd-left-small pd-right-small object-header">
      <common-head title="对象列表" @back="back"></common-head>
    </div>
    <div class="mg-left-small mg-right-small object-search flex-center">
      <common-search @startSearch="startSearch" :searchValue="searchValue"></common-search>
    </div>
  
    <div ref="list" class='object-list pd-big'>
      <div v-if="objectList.length>0" v-for="item in objectList" :key="item.id" class="object-el pointer-shadow radius-2 mg-bottom-big flex-align pd-left-small pd-right-small" @click="selectObj(item)">
        <div class="icon-text flex-center radius-2 mg-right-big">
          <span class="font-14 font-white">{{item.name|splice2}}</span>
        </div>
        <div class="el-content">
          <p class="font-black font-14 text-ellipsis">{{item.name|formatstr}}（ {{item.otype.id|toName}} ）</p>
          <p class="font-info font-12 text-ellipsis" :title="item.attributes|toString">属性：{{item.attributes|toString}}</p>
          <div class="align-right"><span class="pointer-danger font-info" @click.stop="deleteObj(item)">删除</span></div>
        </div>
      </div>
      <div v-if="objectList.length==0" class="font-gray font-18 align-center pd-top-large">
        没有相关对象
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
  </div>
</template>
<script>
  import psde from '@/script/editor/psde'
  import {State} from '@/script/editor/utils/store'
  import {vm,operate,getEditor} from '@/script/operate'
  let IdEdit;
  export default {
    data(){
      return {
        objectList:[],
        currentRelation:{},
        otype:{},
        total:0,
        pageNum:1,
        searchValue:'',
        pageSize:20
      }
    },
    props:['currentObject'],
    components:{
      commonHead:()=>import('@/components/common/tabHead.vue'),
      commonSearch:()=>import('@/components/common/searchBar.vue')
    },
    computed:{

    },
    filters:{
      splice2(str){
        if(typeof str === 'string' &&str.length>0){
          return str.slice(0,2);
        }else{
          return 'default'
        }
      },
      toString(arr){
        let _arr = arr.map(el=>el.name);
        return _arr.join(';')
      },
      toName(id){
        let otype = State.otypes[id];
        return (typeof otype === 'object' && otype.name.length>0) ? otype.name : 'default'
      },
      formatstr(str){
        return str.length>0?str:'defalut'
      }
    },
    mounted(){

    },
    activated(){
      IdEdit = getEditor();
      if(IdEdit.currentRelation){
        this.currentRelation = IdEdit.currentRelation;
        this.objectList = [];
        this.otype = this.currentObject.otype;
        this.getObjectByRelation();
      }else{
        this.searchValue = ''
        this.queryObject();
      }
    },
    methods:{
      queryObject(){
        this.$refs.list.scrollTop = 0;
        if(!this.searchValue) {
          this.pageNum = 1;
          this.objectList = [];
          for(let id in State.sobjects){
            this.objectList.push(State.sobjects[id]);
            this.total = this.objectList;
          }
            // console.log(this.objectList,789789)
            return
        }
        var obj = {
					names: this.searchValue,
					otNames: '',
					pageNum: this.pageNum,
					pageSize: this.pageSize
				};
        psde.objectQuery.ByNameAndOTName.query(obj).then(res => {
          console.log(res,456);
          this.total = res.total;
          this.pageNum = res.pageNum;

          this.objectList = res.list;
          
				});
      },
      getObjectByRelation(){
        let connector = this.otype.connectors.connectors.find(el=>el.relation.id==this.currentRelation.id);
        let obj = {
          otNames:connector.dType.name
        };
        psde.objectQuery.ByNameAndOTName.query(obj).then(res=>{
          this.objectList = res.list;
        })
      },
      selectObj(obj){

        if(IdEdit.currentRelation){
          let _obj = {};
          obj.relation = this.currentRelation;
          obj.srcObject = this.currentObject;
          obj.tarObject = obj;
          IdEdit.createSObjectNetwork(this.currentObject,obj,this.currentRelation);
          vm.$emit(operate.changeTab,{name:'objectDetail'})
        }else{
          IdEdit.updateParent(obj);
          vm.$emit(operate.changeTab,{name:'objectDetail'});
        }
        
        
      },
      deleteObj(obj){
        console.log("delete",obj)
      },
      back(){
        if(IdEdit.currentRelation){
          IdEdit.currentRelation = null;
          vm.$emit(operate.changeTab,{name:'relationList'});
        }else{
          vm.$emit(operate.changeTab,{name:'objectDetail'});
        }
      },
      loadMore(num){
        console.log(num);
        this.pageNum = num;
        
        this.queryObject();
      },
      startSearch(val){
        this.searchValue = val;
        this.queryObject();
      }
    }
  }
</script>
<style lang='scss' scoped>
  .object-box{
    background: #fff;
    .object-header{
      border-bottom: 1px solid #ccc;
    }
    .object-search{
      border: 1px solid #ccc;
      margin-top: 10px;
      height: 40px;
    }
  }
  .object-list{
    height: calc(100% - 91px);
    overflow-y: auto;
    .object-el{
      // background-color: #fff;
      height: 80px;
      border: 1px solid #ccc;
      .icon-text{
        width: 50px;
        height: 50px;
        background: #b2d2ff;
        flex-shrink: 0;
      }
      .el-content{
        flex-grow: 1;
        p{
          width: 150px;
        }
      }
    }
  }
</style>