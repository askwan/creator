<template>
  <div class='editor-box fill flex' >
    <div class="left shadow" ref="left" >
      <left-content ref="leftContent" :sobject="currentObj" :entity='entity'></left-content>
    </div>
    <ul class="menu-list">
        <el-tooltip v-for="item in menuList" :key="item.id" class="item" effect="light" :content="item.desc" placement="left-end">
          <li class="menu-box pointer flex-center" @click="menuTool(item)">
              <i class="font-16 font-white" :class="[item.icon]"></i>
          </li>
        </el-tooltip>
    </ul>
    <transition name="slider">
      <div v-show="showRight" class="right shadow">
        <div class="right-header flex-between pd-right-mini">
          <span class="font-16 pd-left-mini">{{title}}</span>
          <i class="el-icon-close font-18 pointer" @click="showRight=false"></i>
        </div>
        <div class="right-content">
          <component :is="componentId" :show="showRight" :sobject="currentObj"></component>
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
        menuList:[{
          icon:'el-icon-plus',
          id:1,
          desc:'放大',
          title:'放大'
        },{
          icon:'el-icon-minus',
          id:2,
          desc:'缩小',
          title:'缩小'
        },{
          icon:'el-icon-view',
          id:3,
          desc:'过滤',
          title:'过滤'
        },{
          icon:'el-icon-sort',
          id:4,
          desc:'内部结构',
          title:'结构管理'
        }]
      }
    },
    props:{},
    components:{
      'left-content':()=>import('./editorLeft'),
      'rightOtypes':()=>import('./eidtorRight/otypes.vue'),
      'floorManage':()=>import('./eidtorRight/floorMange.vue')
    },
    computed:{},
    mounted(){

      this.$nextTick(()=>{
        this.listenEvent()
      });

    },
    
    methods:{
      listenEvent(){
        vm.$on(operate.DiagramReady,()=>{
          this.initIdEditor();
        })
      },
      initIdEditor(){
        editor = new Editor();
        editor.init(this.$refs.container,context=>{
          console.log('ready');
          let map = context.map();
          let position = mapposition.getMapPosition();
          map.centerZoom([position.lng, position.lat], position.zoom);

          editor.on('currentObject',data=>{
            if(data.object) {
              // console.log(data.object);
              this.currentObj = data.object;
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
        if(item.id==1){
          editor.zoomOut();
        }else if(item.id==2){
          editor.zoomIn();
        }else if(item.id==3){
          this.componentId = 'rightOtypes';
          this.showRight = !this.showRight;
        }else if(item.id==4){
          this.componentId = 'floorManage'
          this.showRight = !this.showRight;
        }
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
    left: calc(100% - 300px);
    top: 60px;
    bottom: 40px;
    background-color: #fff;
    z-index: 1;
    overflow: hidden;
    .right-header{
      height: 40px;
      border-bottom: 1px solid #ccc;
    }
    .right-content{
      height: calc(100% - 40px);
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
  .menu-list{
    position: absolute;
    right: 0;
    top:100px;
    width: 40px;
    border-top-left-radius: 5px;
    overflow: hidden;
    border-bottom-left-radius: 5px;
    .menu-box{
      height: 40px;
      background-color: rgba($color: #000000, $alpha: 0.5);
      &:hover{
        background-color: rgba($color: #000000, $alpha: 0.7)
      }
    }
    z-index: 2;
  }
</style>