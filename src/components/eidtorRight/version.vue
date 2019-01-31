<template>
  <div class='version-box pd-small' v-loading='loading' >
    <div class="pointer-shadow pd-small radius-2 flex-between border-bottom" v-for="(version,i) in versions" :key="i" @click="choseVersion(version,i)">
      <span>
        <i class="el-icon-success" :class="{'font-blue':sobject.version && sobject.version.vid==version.version.vid}" ></i>
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
        index:null,
        loading:false
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
      
      // this.getVersion();
      this.listenEvent();
    },
    filters:{
      getDate(time){
        if(time.length<=11) time = time*1000;
        time = Number(time)
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
      listenEvent(){
        vm.$on('saveReady',()=>{
          this.getVersion();
        })
      },
      getVersion(){
        if(this.sobject.id){
          this.loading = true;
          objectServer.query({
            loadVersion:true,
            ids:this.sobject.id,
            loadForm:true,
            geoEdit:true,
            loadNetwork:true,
            uids:''
          }).then(res=>{
            this.loading = false;
            this.versions = res.list.sort((a,b)=>{
              return a.version.vtime-b.version.vtime;
            })
          })
        }else{
          this.versions = [];
        }
      },
      choseVersion(version,index){
        // getEditor().modifyRealTime(this.sobject,version.realTime);
        getEditor().changeVersion(version);
        // this.sobject = version;
        this.sobject.version = version.version;
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