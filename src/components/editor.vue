<template>
  <div class='editor-box fill flex'>
    <div class="left">
      <left-content :sobject="currentObj" :entity='entity'></left-content>
    </div>
    <div class="fill" id="container"></div>
  </div>
</template>
<script>
  import Editor from '@/script/editor';
  import {vm,operate,getEditor} from '@/script/operate'
  import {State,findOtypeById} from '@/script/editor/utils/store'
  import mapposition from '@/script/mapposition'
  let editor
  export default {
    data(){
      return {
        currentObj:{},
        entity:{}
      }
    },
    props:{},
    components:{
      'left-content':()=>import('./editorLeft')
    },
    computed:{},
    mounted(){
      this.$nextTick(()=>{
        this.initIdEditor();
      })
    },
    
    methods:{
      initIdEditor(){
        editor = new Editor();
        editor.init(document.getElementById('container'),context=>{
          console.log('ready');
          //定位
          let map = context.map();
          let position = mapposition.getMapPosition();
          map.centerZoom([position.lng, position.lat], position.zoom);

          editor.on('currentObject',data=>{
            if(data.object) {
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
</style>