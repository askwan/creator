<template>
  <div class='imagesList'>
    <!-- 影像列表 -->
    <div>
      <ul class="image-lis">
        <li v-for="it in imagesList" :key="it.id" :title="it.name">
          <span style="float: left">{{it.name}}</span>
          <span style="float: right; color: #999999; font-size: 14px">
            <a :href="hdfsServer.downloadUrl(it.dataRef)" style="margin-left: 5px;color: #999999;">
              <i class="el-icon-download"></i>
            </a>
          </span>
        </li>
      </ul>
    </div>
    <!-- 更多结果 -->
    <div class="earth-null-list" v-if="showMore">
      <ul>
        <li>
          <span class="earth-span" @click="searchObject">更多结果</span>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
  import {State} from '@/script/editor/utils/store'
  import { hdfsServer,dobjectServer } from '@/script/server';
  export default {
    data(){
      return {
        imagesList:[], //影像名称列表
        showMore:true,
        pageNum:1, 
        pageSize:20,
        hdfsServer:hdfsServer
      }
    },
    props:{},
    components:{
    },
    computed:{},
    mounted(){
      this.getImages()
    },
    watch: {},
    methods:{
      getImages(){
        let params = {
          pageSize:20,
          pageNum:this.pageNum,
          uids:''
        }

        dobjectServer.query(params).then(res=>{
          // console.log(res,8888);
          this.imagesList = this.imagesList.concat(res.list);
          if(res.list.length<20) this.showMore = false;
        })

      },
      searchObject(){
				this.pageNum++;
				this.getImages();
      },
      modelDownloadFn(a, b) {
        // console.log(a+b)
        return a + b;
      },
    }
  }
</script>
<style lang='scss' scoped>
  .imagesList{
    padding: 10px;
    .image-lis{
      li{
        height: 35px;
        padding:2px 8px; 
        border-bottom: 1px solid #eee;
        line-height:35px;
        font-size: 14px;
        &>span:first-child{
          width: 90%;
          overflow:hidden;
          text-overflow:ellipsis;
          white-space:nowrap;
        }
        &:hover{
          background-color: rgb(245, 240, 240);
        }
      }
    }
  }
</style>