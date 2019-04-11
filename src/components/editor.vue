<template>
  <div class='editor-box fill flex' >
    <div class="left shadow" ref="left" >
      <left-content ref="leftContent" :sobject="currentObj" :entity='entity'></left-content>
    </div>
    <ul class="menu-list">
        <el-tooltip v-for="item in menuList" :key="item.id" class="item" effect="light" :content="item.desc" placement="left-end">
          <li class="menu-box pointer flex-center" :class="{actived:item.isShow}" @click="menuTool(item)">
              <i class="font-16 font-white" :class="[item.icon]"></i>
          </li>
        </el-tooltip>
    </ul>
    <transition name="slider" v-for="(bar,i) in menuList" :key="i" >
      <div class="right shadow" :style="{'z-index':bar.zindex,top:bar.id==5?'0px':'50px'}" :class="{animate:bar.isShow &&bar.haveMenu}">
        <div class="right-header flex-between pd-right-mini pd-left-mini">
          <span class="font-16 pd-left-mini">{{bar.title}}</span>
          <i class="el-icon-close font-18 pointer-danger" @click="bar.isShow=false"></i>
        </div>
        <div class="right-content">
          <component :is="bar.componentId" :show="bar.isShow" :sobject="currentObj"></component>
        </div>
      </div>
    </transition>
    <div class="fill" id="container" ref="container"></div>
  </div>
</template>
<script>
  import Editor from '@/script/editor';
  import {vm,operate,getEditor} from '@/script/operate'
  import {State} from '@/script/editor/utils/store'
  import mapposition from '@/script/mapposition'
  let editor
  export default {
    data(){
      return {
        currentObj:{},
        entity:{},
        isShow:true,
        componentId:'rightOtypes',
        showRight:false,
        title:'',
        zIndex:1,
        menuList:[{
          icon:'el-icon-plus',
          id:1,
          desc:'放大',
          title:'放大',
          haveMenu:false,
          zindex:11
        },{
          icon:'el-icon-minus',
          id:2,
          desc:'缩小',
          title:'缩小',
          haveMenu:false,
          zindex:11
        },{
          icon:'el-icon-view',
          id:3,
          desc:'类模板',
          title:'类模板过滤',
          isShow:false,
          haveMenu:true,
          componentId:'rightOtypes',
          zindex:11
        },{
          icon:'el-icon-refresh',
          id:8,
          desc:'高度',
          title:'高度控制',
          isShow:false,
          haveMenu:true,
          componentId:'heightManage',
          zindex:11
        },{
          icon:'el-icon-sort',
          id:4,
          desc:'内部结构',
          title:'结构管理',
          isShow:false,
          haveMenu:true,
          componentId:'floorManage',
          zindex:11
        },{
          icon:'el-icon-tickets',
          id:6,
          desc:'版本',
          title:'版本',
          isShow:false,
          haveMenu:true,
          componentId:'versionObject',
          zindex:11
        },{
          icon:'el-icon-printer',
          id:5,
          desc:'模型视图',
          title:'模型编辑',
          isShow:false,
          haveMenu:true,
          componentId:'mapboxmode',
          zindex:10
        }],
        isLoad:false
      }
    },
    props:{},
    components:{
      'left-content':()=>import('./editorLeft'),
      'rightOtypes':()=>import('./eidtorRight/otypes.vue'),
      'floorManage':()=>import('./eidtorRight/floorManage.vue'),
      'mapboxmode':()=>import('../modelviews/mapboxShow.vue'),
      'versionObject':()=>import('./eidtorRight/version.vue'),
      'heightManage':()=>import('./eidtorRight/heights.vue')
    },
    computed:{},
    mounted(){
      
      this.$nextTick(()=>{
        this.listenEvent();
        // this.initIdEditor();
      });

    },
    
    methods:{
      listenEvent(){
        vm.$on(operate.DiagramReady,()=>{
          // console.log('ooo');
          if(!this.isLoad){
            this.initIdEditor();
          }
        });
        vm.$on(operate.preview,(obj)=>{
          this.componentId = 'mapboxmode';
          this.showRight = true;
          this.currentObj = obj.object;
          // vm.$emit(operate.hiddenOtypes);
        });
        vm.$on(operate.currentEntity,entityId=>{
          // this.entity = editor.idContext(entityId);
          this.entity = editor.currentEntity;
        })
        vm.$on(operate.changeDomain,domain=>{
          if(!editor) return;
          editor.idContext.loadOptions({sdomains:domain.id});
          editor.flush();
          let center = editor.getCenter(domain.geoBox);
          let zoom = editor.idContext.map().zoom();
          editor.idContext.map().centerZoom([center.x,center.y],zoom);
        })
      },
      
      initIdEditor(){
        editor = new Editor();
        this.isLoad = true;
        editor.init(this.$refs.container,context=>{
          let map = context.map();
          let position = mapposition.getMapPosition();
          map.centerZoom([position.lng, position.lat], position.zoom);
          editor.on('currentObject',data=>{
            if(data.object) {
              this.currentObj = data.object;
              // console.log(data.object,'data.object')
              // State.viewObject = editor.copySObject(data.object);
              // vm.$emit(operate.currentSobject,data.object)
              // vm.$emit(operate.hiddenOtypes);
              vm.$emit(operate.changeTab,{name:'objectDetail'});
            }else if(data.entityId){
              this.entity = context.entity(data.entityId);
              vm.$emit(operate.changeTab,{name:'diagramList'});
            }else if(!data.entityId){
              vm.$emit(operate.changeTab,{name:'searchList'});
            }else{
              vm.$emit(operate.changeTab,{name:'searchList'})
            }
          });
          editor.on('notice',obj=>{
            if(obj.message){
              obj.message = obj.message.slice(0,20);
            };
            obj.type = obj.type || 'info';
            obj.title = obj.title || '提示';
            this.$notify(obj);
          });
          let loading;
          editor.on('loading',bool=>{
            if(bool){
              loading = this.$loading({
                lock:true,
                text:'waiting',
                spinner:'el-icon-loading',
                background:'rgba(255,255,255,0.4)'
              })
            }else{
              loading.close();
              vm.$emit('saveReady');
            }
          });
          editor.on('previewModel',()=>{
            vm.$emit(operate.hiddenOtypes);
          })
        });
        window.onbeforeunload = function(event){
          let map = editor.idContext.map();
          mapposition.saveMapPosition({
            lng: map.center()[0],
            lat: map.center()[1],
            zoom: map.zoom()
          });
          return editor.idContext.save();
        }
        getEditor(editor);
      },
      menuTool(item){
        // console.log(item.isShow,'item');
        if(item.id==1){
          return editor.zoomIn();
        }else if(item.id==2){
          return editor.zoomOut();
        }
        if(item.isShow) return item.isShow = false
        if(item.id!==5){
          this.menuList.forEach(tool=>{
            if(tool.id!==5) tool.isShow = false; 
          });
        }
        item.isShow = !item.isShow;
        this.title = item.title || item.desc;
      }
    },
    destroyed(){
      let map = editor.idContext.map();
      mapposition.saveMapPosition({
        lng: map.center()[0],
        lat: map.center()[1],
        zoom: map.zoom()
      });
      
    },
    
  }
</script>
<style lang='scss' scoped>
  .left{
    width: 300px;
    height: 100%;
    flex-shrink: 0;
  }
  .right{
    position: absolute;
    right: 0;
    transition: transform .3s;
    transform: translateX(100%);
    top: 0px;
    bottom: 0px;
    background-color: #fff;
    z-index: 10;
    overflow: hidden;
    .right-header{
      height: 50px;
      border-bottom: 1px solid #ccc;
    }
    .right-content{
      height: calc(100% - 50px);
      background-color: #f1f1f1;
      overflow-y: auto;
      
    }
  }
  .slider-enter-active, .slider-leave-active {
    transition: all .3s;
  }
  .slider-enter, .slider-leave-to /* .fade-leave-active below version 2.1.8 */ {
    transform:translate(100%,0);
  }
  .animate{
    transform: translateX(0);
  }
  .menu-list{
    position: absolute;
    right: 0;
    top:100px;
    width: 40px;
    border-top-left-radius: 5px;
    overflow: hidden;
    border-bottom-left-radius: 5px;
    z-index: 500;
    .menu-box{
      height: 40px;
      background-color: rgba($color: #000000, $alpha: 0.5);
      &:hover{
        background-color: rgba($color: #000000, $alpha: 0.7)
      }
    }
    .actived{
      background-color: rgba($color: #000000, $alpha: 0.8)
    }
    
  }
</style>