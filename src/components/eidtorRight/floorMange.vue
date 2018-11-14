<template>
  <div class='root fill pd-small floor-manage' v-loading="loading">
    <el-checkbox-group class="flex check-floor-box" v-model="checkedObjects" >
      <el-checkbox v-for="item in list" border v-model="floor" class="mg-bottom-small mg-left-small" :label="item.name||item.id" :key="item.id" @change="handleChanged(item)"></el-checkbox>
      
    </el-checkbox-group>
  </div>
</template>
<script>
  import {State} from '@/script/editor/utils/store'
  import {vm,operate,getEditor} from '@/script/operate';
  import {connectorServer,objectServer} from '@/script/server'
  let idEditor;
  export default {
    data(){
      return {
        floor:0,
        checkedObjects:[],
        list:[],
        loading:false
      }
    },
    props:['show','sobject'],
    components:{},
    computed:{},
    mounted(){
      this.getObjects();
    },
    watch:{
      floor(val){
        // if(typeof val =='number'){
        //   console.log(val);
        // }
      },
      show(bool){
        if(bool){
          this.getObjects();
        }
      },
      'sobject.id'(id){
        this.getObjects();
      }
    },
    methods:{
      handleChanged(val,b,c){
        let disableds = [];
        this.list.forEach(el=>{
          let obj = this.checkedObjects.find(ev=>ev==el.name||ev==el.id);
          if(obj){

          }else{
            disableds.push(el);
          }
        });
        State.toggleObject(val);
        idEditor = getEditor();
        let history = idEditor.idContext.graph();
        console.log(history);
        let entitys =history.entities.__proto__;
        for(let id in entitys){
          State.entitys.push(entitys);
        }
        
        idEditor.flush();
      },
      getObjects(){
        idEditor = getEditor();
        if(!this.sobject.id) return;
        this.loading = true;
        objectServer.query({
          parents:this.sobject.id,
          loadForm:true,
          geoEdit:true,
          loadNetWork:true
        }).then(res=>{
          let arr = res.list.filter(el=>{
            let otype = State.otypes[el.otype.id];
            if(otype){
              el.otype = otype;
              return true;
            }else{
              return false
            }
          });
          this.list = arr;
          let _arr = [];
          this.list.forEach(el=>{
            let aim = State.hiddenObjects().find(ev=>ev==el.id);
            if(!aim) _arr.push(el);
          });
          this.checkedObjects = _arr.map(el=>el.name||el.id);
          this.loading =false;
        })
        // console.log(idEditor.currentSobject);
      }
    },
    destroyed() {
      console.log('destoryed')
    },
    deactivated() {
      console.log('close')
    },
  }
</script>
<style lang='scss' scoped>
  .floor-manage{
    background-color: #fff;
    overflow-y: auto;
    .check-floor-box{
      flex-direction: column;
      justify-content: flex-start;
    }
  }
</style>