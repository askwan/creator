<template>
  <div class='modelist' v-loading='loading'>
    <!-- 搜索上传 -->
    <div class="search-box flex">
      <el-input
        class="search"
        placeholder="请输入模型名称"
        v-model="searchValue"
        @change="startSearch"
        clearable>
      </el-input>
      <el-tooltip effect="dark" content="上传新模型" placement="bottom">
        <el-button class="mg-left-small" type="primary" size="mini" icon="el-icon-upload" circle @click="modelUploadFn"></el-button>
      </el-tooltip>
      <!-- <search-bar @startSearch="startSearch" :searchValue="searchValue" :loading="loading"></search-bar> -->
      <!-- <el-input suffix-icon="el-icon-search" v-model="searchValue" @change="startSearch" placeholder="请输入模型名称"></el-input> -->
    </div>
    <!-- 模型列表 -->
    <ul class="model-lis">
      <li v-for="it in ModelList" :key="it.fid">
        <span style="float: left">{{it.name}}</span>
        <span style="float: right; color: #999999; font-size: 14px">
          <a :href="downloadFile.downloadUrl(it.fid)" style="margin-left: 5px;color: #999999;">
            <i class="el-icon-download"></i>
          </a>
        </span>
        <!-- <span style="clear: both"></span> -->
      </li>
    </ul>
    <!-- 更多结果 -->
    <div class="earth-null-list" v-if="showMore">
      <ul>
        <li>
          <span class="earth-span" @click="searchObject">更多结果</span>
        </li>
      </ul>
    </div>
    <!-- 上传 -->
		<upload-mode v-show="showDiag" @close="showDiag = false" :centerDialogVisible="showDiag" @successFn="changeMode"></upload-mode>
  </div>
</template>
<script>
  import {State} from '@/script/editor/utils/store'
  import axios from 'axios'
  import { downloadFile } from "@/script/editor/psde/config";
  import {modelServer} from '@/script/server'
  export default {
    data(){
      return {
        searchValue:"",
        ModelList: [], //模型列表
        showDiag:false,
        downloadFile: modelServer,
        showMore:true,
        pageNum:1,
        pageSize:20,
        arrModelList:[],
        loading:false
      }
    },
    props:{},
    components:{
      uploadMode:()=>import('../editorLeft/components/uploadMode.vue'),
      searchBar: () => import("@/components/common/searchBar")
    },
    computed:{},
    mounted(){
      // this.requestList()
      this.getModels()
    },
    watch: {
			input1(newVal,old) {
        // this.textVal = val;
        this.searchModel(newVal)
			}
		},
    methods:{
      getModels(){
        let params = {
          pageSize:20,
          pageNum:this.pageNum,
          name:this.searchValue
        }
        this.loading = true;
        modelServer.getModel(params).then(res=>{
          this.loading = false;
          if(res.data.list.length<20) this.showMore = false;
          res.data.list = res.data.list.filter(el=>el._id&&el.name);
          this.ModelList = this.ModelList.concat(res.data.list);
        })
        
      },
      modelUploadFn(){
				this.showDiag = true;
      },
      changeMode(data){
        // console.log(data,"emitList")
				var obj = data.data;
				this.ModelList.unshift(obj);
				// this.formateList[this.curCollapse].formref.refid = obj.fid;
				this.showDiag= false;
				// this.modifyForm(this.objectDetail,this.curCollapse);
				// this.checkboxValue(this.formateList[this.curCollapse]);
      },
      // 搜索
      searchModel(val){
        let model = this.arrModelList
        let modelArr = []
        if(val){
          model.forEach(e => {
           var index =  e.name.indexOf(val)
           if(index != -1){
             modelArr.push(e)
           }else{
             //不现实加载更多
             this.showMore = false
           }
          });
           this.ModelList = modelArr
        }else{
          this.ModelList = model
          this.showMore = true
        }

        // modelServer.getModel({pageNum:1,pageSize:20,name:this.searchValue}).then(res=>{
        //   if(res.data.list.length<20) this.more = false;
        //   let lists = res.data.list.filter(el=>el.name);
        //   this.modeLists = this.modeLists.concat(lists);
        //   this.pageNum = res.data.pageNum;
        //   this.loading = false;
        // })

      },
      startSearch(){
        this.pageNum = 1;
        this.ModelList = [];
        this.getModels();
      },
      //加载更多
      searchObject(){
				this.pageNum++;
				this.getModels();
			},
    }
  }
</script>
<style lang='scss' scoped>
  .modelist{
    padding: 10px;
    .search-box{
      .search{
        width: 88%;
      }
    }

    .model-lis{
      li{
        height: 35px;
        padding:2px 8px; 
        border-bottom: 1px solid #eee;
        line-height:35px;
        font-size: 14px;
        &:hover{
          background-color: rgb(245, 240, 240);
        }
      }
    }
  }
</style>