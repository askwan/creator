<template>
  <div class="object-box fill">
    <div class="pd-left-small pd-right-small">
      <common-head title="对象列表" @back="back"></common-head>
    </div>
  
    <div class='object-list pd-big'>
      <div v-for="item in objectList" :key="item.id" class="object-el pointer-shadow radius-2 mg-bottom-big flex-align pd-left-small pd-right-small" @click="selectObj(item)">
        <div class="icon-text flex-center radius-2 mg-right-big">
          <span class="font-14 font-white">{{item.name|splice2}}</span>
        </div>
        <div class="el-content">
          <p class="font-black font-14 text-ellipsis">{{item.name|formatstr}}（ {{item.otype.id|toName}} ）</p>
          <p class="font-info font-12 text-ellipsis" :title="item.attributes|toString">属性：{{item.attributes|toString}}</p>
          <div class="align-right"><span class="pointer-danger font-info" @click.stop="deleteObj(item)">删除</span></div>
        </div>
      </div>
      <div class="block">
        <el-pagination
          layout="prev, pager, next"
          small
          :total="1000">
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
      }
    },
    props:['currentObject'],
    components:{
      commonHead:()=>import('@/components/common/tabHead.vue')
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
        this.queryObject();
      }
    },
    methods:{
      queryObject(){
        var obj = {
					names: '',
					otNames: '',
					pageNum: 1,
					pageSize: 20
				};
        psde.objectQuery.ByNameAndOTName.query(obj).then(res => {
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
          vm.$emit(operate.changeTab,{name:'relationList'});
        }else{
          vm.$emit(operate.changeTab,{name:'objectDetail'});
        }
      }
    }
  }
</script>
<style lang='scss' scoped>
  .object-list{
    .object-el{
      background-color: #fff;
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