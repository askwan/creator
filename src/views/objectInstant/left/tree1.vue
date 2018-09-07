<template>
  <div class='root'>
    <div class="tree-title">
      {{title}}
    </div>
     <div class="tree-content">
       <o-tree :data="fields"
        :props="defaultProps"
        @node-click="handleNodeClick"
        :indent="12"
        :filter-node-method="filterNode"
        :highlight-current="true"
        :render-content="renderContent"
        ref="tree"></o-tree>
     </div>
  </div>
</template>
<script>
  // import dcbc from "@/dcbc"
  import businessService from '@/request/business.service.js'
  import psde from '@/psde'
  import {vm,operate} from '@/script/operate'
  import {allOtype} from '@/script/allOtype'
  var aimData = {};
  var otype = new psde.OType();
  export default {
    data(){
      return {
        data:[],
        defaultProps: {
          children: 'businessCategoryList',
          label: 'name',
        },
        currentCollection:[],
        aimData:{},
        lists:[{name:456},{name:885},{name:885},{name:885},{name:885},{name:885},{name:885},{name:885},{name:885},{name:885},{name:885},{name:885}],
        title:"",
        bid:sessionStorage.getItem("business")
      }
    },
    props:{},
    components:{
      oTree:()=>import("@/components/tree/src/tree"),
      selectList:()=>import("@/components/common/selectMenu")
    },
    computed:{
      fields(){
        var name = this.title||"总目录"
        let data = [].concat(this.data);
        let arr = [];
        let obj={
          name:name,
          id:sessionStorage.getItem("business"),
          // id:645,
          nType:1
        }
        obj.businessCategoryList = this.transformData(data)||[];
        arr.push(obj);
        return arr;
      }
    },
    mounted(){
      
      
      // this.$nextTick(()=>{
      //   dcbc.Proxy.query("business", {
      //     ids: this.bid
      //   }).then(bis=>{
      //     this.title = bis.list[0].name;
      //     businessService.queryForTree(bis.list[0].objectId).then(res=>{
      //       this.data = res;
      //       this.getCollection(res);
      //       vm.$emit("getchildData",{
      //         list:this.currentCollection
      //       });
      //       // console.log(this.currentCollection,4564);
      //       var ids = this.currentCollection.map(item=>item.refId);
      //       ids = ids.join(",");
      //       otype.query({ ids: ids, loadField: true, loadModel: true,loadForm: true,loadParentField: true }).then((data)=>{
      //         allOtype.orginData(data.list);
      //         vm.$emit("dataReady")
      //       },(err)=>{
      //         console.log(err)
      //       })
      //     });
      //   })
        
      // })
      vm.$emit("dataReady")
    },
    methods:{
      handleNodeClick(data) {
        // console.log(data.expanded);
        // console.log(this.$refs.tree.getCheckedKeys());
        this.currentCollection = [];
        let orgData = this.getOrginData(this.data,data);
        let orgArr = orgData.businessCategoryList
        if(orgData.id!=data.id){
          orgArr = this.data;
        }
        this.getCollection(orgArr);
        vm.$emit("getchildData",{
          list:this.currentCollection
        });
      },
      filterNode(value,data){
        return data.nType==1;
      },
      transformData(arr){
        let brr = [];
        arr.forEach(item=>{
          if(item.nType===1){
            let obj = Object.assign({},item)
            obj.businessCategoryList = this.transformData(obj.businessCategoryList);
            brr.push(obj);
          }
        })
        return brr
      },
      getCollection(arr){
        if(!arr) return
        arr.forEach(item=>{
          if(item.nType==2){
            this.currentCollection.push(item)
          }else if(item.nType==1){
            this.getCollection(item.businessCategoryList);
          }
        })
        
      },
      getOrginData(datas,obj){
        
        for(let i=0;i<datas.length;i++){
          let item = datas[i];
          if(item.id==obj.id){
            aimData = Object.assign({},item);
            break;
          }else{
            this.getOrginData(item.businessCategoryList,obj);
          }
        }
        return aimData;
      },
      chooseBusness(data){
        this.title = data.name
      },
      renderContent(h,{node,data,store}){
        return (<div class="my-tree-box">
        <i class="iconfont icon-wenjianjia-copy"></i>
        <span>{node.label}</span>
        </div>)
      }
    }
  }
  
</script>
<style lang='less' scoped>
  .root{
    width: 100%;
    height: 100%;
    background-color: #f7fafc;
    position: relative;
    .tree-content{
      min-height: 80px;
      overflow-y: auto;
      height: calc(~"100% - 20px");
    }
    .tree-title{
      height: 40px;
      text-align: center;
      line-height: 40px;
      font-size: 16px;
      color:#333;
      cursor: pointer;
    }
  }
  .el-tree{
    background-color: rgba(0,0,0,0) !important;
    border: none !important;
  }
  .bus-text{
    font-size: 16px;
    color:#333;
  }
  .bus-logo{
    color:#333;
  }
  
</style>