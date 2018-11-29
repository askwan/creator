<template>
  <div class='root fill pd-small floor-manage' v-loading="loading">
    <el-tree :data="objectTree" default-expand-all :props="prop" :expand-on-click-node="false">
      <span class="flex-between" slot-scope="{node,data}">
        <i class="el-icon-view font-14 icon-view" :class="{show:isView(node)}" @click="changeView(node)"></i>
        <span>{{node.label}}</span>
        <span class="mg-left-big">
        </span>
      </span>
    </el-tree>
  </div>
</template>
<script>
  import {State} from '@/script/editor/utils/store'
  import {vm,operate,getEditor} from '@/script/operate';
  import {connectorServer,objectServer,otypeServer} from '@/script/server'
  let idEditor;
  export default {
    data(){
      return {
        floor:0,
        checkedObjects:[],
        list:[],
        loading:false,
        objectTree:[],
        hiddens:[],
        prop:{
          children:'children',
          label:'name'
        },
        rootObj:{
          id:'',
          name:'',
          children:[]
        }
      }
    },
    props:['show','sobject'],
    components:{},
    computed:{},
    mounted(){
      this.getObjects();
    },
    watch:{
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
      handleChanged(val,bool){
        idEditor = getEditor();
        if( !State.sobjects[val.id]) return;
        let forms = State.sobjects[val.id].forms;
        if(!bool){
          idEditor.enableSobject(val.id);
          State.showObject(val);
        }else{
          idEditor.disableSobject(val.id);
          State.hiddenObject(val);
        };
      },
      async getObjects(){
        if(!this.sobject.id) return;
        this.hiddens = State.hiddenObjects();
        this.rootObj.name = this.sobject.name;
        this.rootObj.id = this.sobject.id;
        this.rootObj.children = [];
        await this.queryChildren(this.rootObj);
        this.objectTree.push(this.rootObj);
      },
      async queryChildren(object){
        let res = await objectServer.query({parents:object.id,geoEdit:true});
        try {
          res.list.forEach(obj=>{
            object.children.push(obj)
            this.queryChildren(obj);
          })
        } catch (error) {
          console.log(error,res)  
        }
        
      },
      changeView(node){
        idEditor = getEditor();
        let hidden = this.hiddens.find(el=>el==node.data.id);
        let list = this.getChildObjFromTree(node.data);
        list.forEach(obj=>{
          this.handleChanged(obj,!Boolean(hidden));
        });
        this.hiddens = State.hiddenObjects();
      },
      isView(node){
        let hidden = this.hiddens.find(el=>node.data.id==el);
        return !hidden;
      },
      getChildObjFromTree(root){
        let list = [];
        list.push(root);
        root.children.forEach(child=>{
          list = list.concat(this.getChildObjFromTree(child))
        })
        return list;
      }
    }
  }
</script>
<style lang='scss' scoped>
  .floor-manage{
    width: 300px;
    background-color: #fff;
    overflow-y: auto;
    .check-floor-box{
      flex-direction: column;
      justify-content: flex-start;
    }
    
  }
  .icon-view{
    padding-top: 1px;
    padding-right: 5px;
  }
  .show{
    color: #409EFF;
  }
</style>