<template>
  <div class='version-box pd-small'>
    <div class="pointer-shadow pd-small radius-2 flex-between border-bottom" v-for="(version,i) in versions" :key="i" @click="choseVersion(version)">
      <span>
        <i class="el-icon-success" :class="{'font-blue':sobject.version.vid==version.version.vid}" ></i>
        {{version.version.vtime|getDate}}
      </span>
      <el-button type="text">选择版本</el-button>
    </div>
  </div>
</template>
<script>
  import {State} from '@/script/editor/utils/store'
  import {vm,operate,getEditor} from '@/script/operate';
  import {versionServer,objectServer} from '@/script/server'
  export default {
    data(){
      return {
        versions:[],
        pageNum:1,
        
      }
    },
    props:['show','sobject'],
    watch:{
      "sobject.id"(id){
        this.getVersion();
      }
    },
    components:{},
    computed:{},
    mounted(){
      
      this.getVersion();
    },
    filters:{
      getDate(time){
        time = time*1000;
        let date = new Date(time);
        let year = date.getFullYear();
        let mounth = date.getMonth()+1;
        let day = date.getDate();
        let hour = date.getHours();
        let minute = date.getMinutes();
        let seconds = date.getSeconds();
        return `${year}-${mounth}-${day} ${hour}:${minute}:${seconds}`
      }
    },
    methods:{
      getVersion(){
        if(this.sobject.id){
          objectServer.query({
            loadVersion:true,
            ids:this.sobject.id,
            loadForm:true,
            geoEdit:true,
            loadNetwork:true
          }).then(res=>{
            this.versions = res.list.sort((a,b)=>{
              console.log(a.version.vtime<b.version.vtime)
              return a.version.vtime-b.version.vtime;
            })
          })
        }
      },
      choseVersion(version){
        // getEditor().modifyRealTime(this.sobject,version.realTime);
        getEditor().changeVersion(version);
        // State.sobjects[this.sobject.id].realTime = version.realTime;
      }
    }
  }
</script>
<style lang='scss' scoped>
  .version-box{
    width: 300px;
    height: 100%;
    background-color: #fff;
    overflow-y: auto;
    overflow-x: hidden;  
    .border-bottom{
      border-bottom: #eee;
    }
  }

</style>