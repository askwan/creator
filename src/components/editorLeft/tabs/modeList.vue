<template>
  <div class='mode-list fill'>
    <div class="pd-left-small pd-right-small object-header">
      <common-head title="模型列表" @back="back"></common-head>
    </div>
    <div class="mg-left-small mg-right-small object-search flex-center">
      <common-search @startSearch="startSearch" :searchValue="searchValue" :loading="loading"></common-search>
    </div>
    <div class="list-box pd-big">
      <div v-for="mode in modeLists" :key="mode.fid" class="list-el pointer-shadow radius-2 mg-bottom-big flex-align pd-left-small pd-right-small" @click="select(mode)">
        <div class="icon-text flex-center radius-2 mg-right-big">
          <span class="font-14 font-white">{{mode.name|splice2}}</span>
        </div>
        <div class="el-content">
          <p class="font-black font-14 text-ellipsis">{{mode.name}}</p>
          <p class="font-info font-12 text-ellipsis" :title="mode.des">描述：{{mode.des}}</p>
          <div class="align-right">
            <a :href="downloadUrl(mode)" class="pointer-default font-default">下载</a>
            <span class="pointer-danger font-danger" @click.stop="deleteObj(mode)">删除</span>
            </div>
        </div>
      </div>
      <div class="up-load">
        <el-button type="primary" size="mini" icon="el-icon-upload" circle @click="showDiag=true"></el-button>
      </div>
      <div class="block flex-center" v-show="more&&!noData">
        <el-button v-loading="loading" @click="loadMore">加载更多</el-button>
      </div>
      <div class="flex-center" v-if="noData">
        <span class="font-24 font-gray">没有数据</span>
      </div>
    </div>
    <upload-mode v-show="showDiag" @close="showDiag = false" :centerDialogVisible="showDiag" @successFn="changeMode"></upload-mode>
  </div>
</template>
<script>
  import {modelServer} from '@/script/server'
  import { vm, operate,getEditor } from "@/script/operate";
  let IdEditor;
  export default {
    data(){
      return {
        loading:false,
        searchValue:'',
        pageNum:1,
        pageSize:20,
        name:'dsff',
        modeLists:[],
        showDiag:false,
        more:true,
        noData:false
      }
    },
    props:['currentObject'],
    
    components:{
      commonHead:()=>import('@/components/common/tabHead.vue'),
      commonSearch:()=>import('@/components/common/searchBar.vue'),
      uploadMode:()=>import('../components/uploadMode.vue')
    },
    computed:{},
    mounted(){
      this.getList();
    }, 
    watch: {
      modeLists(val){
        // console.log(val,'va');
        if(val.length==0) {
          this.noData = true;
        }else{
          this.noData = false;
        }
      }
    },
    methods:{
      startSearch(value){
        this.pageNum = 1;
        this.searchValue = value;
        this.modeLists = [];
        this.getList();
      },
      back(){
        vm.$emit(operate.changeTab,{name:'objectDetail'});
      },
      getList(){
        this.loading = true;
        this.more = true;
        modelServer.getModel({pageNum:this.pageNum,pageSize:this.pageSize,name:this.searchValue}).then(res=>{
          if(res.data.list.length<20) this.more = false;
          let lists = res.data.list.filter(el=>el.name);
          this.modeLists = this.modeLists.concat(lists);
          this.pageNum = res.data.pageNum;
          this.loading = false;
        })
      },
      select(mode){
        IdEditor = getEditor();
        IdEditor.currentForm.formref.refid = mode.fid;
        IdEditor.currentForm.formref.name = mode.name;
        IdEditor.modifyObjectForm(this.currentObject, IdEditor.currentForm);
        IdEditor.currentForm = null;
        vm.$emit(operate.changeTab,{name:'objectDetail'});
      },
      deleteObj(mode){
        modelServer.deleteMode(mode._id).then(res=>{
          if(res.status==200){
            let index = this.modeLists.findIndex(el=>el._id==mode._id);
            this.modeLists.splice(index,1);
          }
          
        })
      },
      loadMore(){
        this.pageNum++;
        this.getList();
      },
      changeMode(data){
        var obj = data.data;
        this.pageNum = 1;
        this.modeLists = [];
        this.getList();
				this.showDiag= false;
      },
      downloadUrl(mode){
        return modelServer.downloadUrl(mode._id);
      }
    },
    filters:{
      splice2(str){
        if(typeof str === 'string' &&str.length>0){
          return str.slice(0,2);
        }else{
          return 'default'
        }
      },
      formatstr(str){
        return str.length>0?str:'defalut'
      }
    }
  }
</script>
<style lang='scss' scoped>
  .mode-list{
    background: #fff;

    .object-header{
      border-bottom: 1px solid #ccc;
    }
    .object-search{
      border: 1px solid #ccc;
      margin-top: 10px;
      height: 40px;
    }
    .list-box{
      height: calc(100% - 91px);
      overflow-y: auto;
      .list-el{
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
      // background-color: red;
    }
    .up-load{
      position: absolute;
      right: 20px;
      bottom: 20px;
    }
  }
</style>