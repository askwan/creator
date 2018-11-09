<template>
  <div class='map fill' @click="appClick">
    <map-content></map-content>
  </div>
</template>
<script>
  import psde from '@/script/editor/psde';
  import {State} from '@/script/editor/utils/store'
  import axios from 'axios'
  import { queryModelFile, downloadFile } from "@/script/editor/psde/config";
  import {vm,operate,getEditor} from '@/script/operate'
  import{diagramServer,modelServer,dictServer} from '@/script/server'
  export default {
    data(){
      return {

      }
    },
    props:{},
    components:{
      'map-content': () => import('../components/editor')
    },
    computed:{},
    mounted(){
      this.getDiagram();
      this.getModels();
      this.getRelationType();
      
    }, 
    beforeRouteLeave(to,from,next){
      let idEdit = getEditor();
      let osmChange = idEdit.idContext.history().hasChanges();
      let objectChange = idEdit.isChanges;
      // console.log(document.getElementById('container'),'dom');
      // document.getElementById('container').innerHTML = '';
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
      getDiagram(){
        let user={};
        if(sessionStorage.getItem('user')){
          user = JSON.parse(sessionStorage.getItem('user'));
        }
        new psde.Diagram()
        .query({
          loadField: true,
          loadModel: true,
          loadForm: true,
          loadParentField: true,
          loadParents: true,
          loadConnector: true,
          uids:user.id
        })
        .then(res => {
          State.getDiagram(res.list);
          vm.$emit(operate.DiagramReady);
        }).catch(err=>{
          vm.$emit(operate.notice,{
            type:'error',
            title:'网络错误',
            message:err.message
          })
        })

        // diagramServer.query({
        //   loadField: true,
        //   loadModel: true,
        //   loadForm: true,
        //   loadParentField: true,
        //   loadParents: true,
        //   loadConnector: true
        // }).then(res=>{
        //   State.getDiagram(res.data.list);
        // })

      },
      getModels(){
        axios.get(queryModelFile.baseURL, {})
          .then(response => {
            State.ModelList = response.data.data.list;
          })
          .catch(function(error) {
            vm.$emit(operate.notice,{
              type:'error',
              title:'网络错误',
              message:error.message
            })
          });
        // modelServer.getModel().then(res=>{
        //   State.ModelList = res.data.list
        // })
        // .catch(error=>{
        //   vm.$emit(operate.notice,{
        //     type:'error',
        //     title:'网络错误',
        //     message:error.message
        //   })
        // })
      },
      getRelationType(){
        new psde.GetDict().query(null,'relation').then(res=>{
          State.relationType = res;
        }).catch(err=>{
          vm.$emit(operate.notice,{
            type:'error',
            title:'网络错误',
            message:error.message
          })
        });

        // dictServer.getDict('relation').then(res=>{
        //   State.relationType = res.data;
        // })
        // .catch(error=>{
        //   vm.$emit(operate.notice,{
        //     type:'error',
        //     title:'网络错误',
        //     message:error.message
        //   })
        // })

      },
      appClick(){
        // setTimeout(() => {
        //   let dom = document.querySelector('.el-date-picker');
        //   if (dom&&dom.style.display!=='none'){
        //     dom.style.display = 'none';
        //   }
        // }, 500);
      }
    }
  }
</script>
<style scoped lang="scss">
  .map{
    overflow: hidden;
  }
</style>

