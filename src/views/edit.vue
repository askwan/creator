<template>
  <div class='map fill' v-loading='loading'>
    <map-content></map-content>
  </div>
</template>
<script>
  import psde from '@/script/editor/psde';
  import {State} from '@/script/editor/utils/store'
  import axios from 'axios'
  import { queryModelFile, downloadFile } from "@/script/editor/psde/config";
  import {vm,operate,getEditor} from '@/script/operate'
  import{diagramServer,modelServer,dictServer,connectorServer,styleServer} from '@/script/server'
  import MapContent from '../components/editor'
  export default {
    data(){
      return {
        loading:false
      }
    },
    props:{},
    components:{
      'map-content': MapContent
    },
    computed:{},
    mounted(){
      this.getDiagram();
      this.getModels();
      this.getRelationType();
      this.getStyle();
    }, 
    beforeRouteLeave(to,from,next){
      let idEdit = getEditor();
      let osmChange = idEdit.idContext.history().hasChanges();
      let objectChange = idEdit.isChanges;
      if(osmChange||objectChange){
        this.$confirm('是否忽略此次编辑','信息提示',{
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(()=>{
          next()
        }).catch(()=>{
          next(false);
        })
      }else{
        next();
      }
    },
    methods:{
      async getDiagram(){
        this.loading = true;
        let options = {};
        options.loadField = true;
        options.loadModel = true;
        options.loadForm = true;
        options.loadParentField = true;
        options.loadParents = true;
        options.loadConnector = true;
        options.token = '';
        let user = JSON.parse(sessionStorage.getItem('user'));
        // let a = await diagramServer.queryByUserid({userId:user.id});
        // console.log(a,"a");
        let list = await diagramServer.query(options);
        try {
          State.getDiagram(list);
          let otIds = [];
          for(let id in State.otypes){
            otIds.push(id);
          }
          let str = otIds.join(',');
          this.loading = false;
          vm.$emit(operate.DiagramReady);
        } catch (err) {
          console.log(err)
          vm.$emit(operate.notice,{
            type:'error',
            title:'网络错误',
            message:err.message
          })
        }

      },
      getModels(){
        modelServer.getModel().then(res=>{
          State.ModelList = res.data.list
        })
        .catch(error=>{
          vm.$emit(operate.notice,{
            type:'error',
            title:'网络错误',
            message:error.message
          })
        })
      },
      getRelationType(){
        let p1 = dictServer.getDict('relation');
        let p2 = dictServer.getDict('modelLanguage');
        let p3 = dictServer.getDict('form');

        Promise.all([p1,p2,p3]).then(list=>{
          if(list[0].status==200){
            State.relationType = list[0].data;
          }
          if(list[1].status ==200){
            State.modelLanguage = list[1].data;
          }
          if(list[2].status == 200){
            State.formType = list[2].data;
          }
          
        }).catch(err=>{
          vm.$emit(operate.notice,{
            type:'error',
            title:'网络错误',
            message:err.message
          })
        })

      },
      getStyle(){
        styleServer.getStyles({orderType: "ID",descOrAsc: true,}).then(res=>{
          State.styleList = res.data.list;
        })
      }
    }
  }
</script>
<style scoped lang="scss">
  .map{
    overflow: hidden;
  }
</style>

