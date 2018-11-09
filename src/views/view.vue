<template>
  <div class='view fill'>
    <div class="search shadow">
      <search-bar @startSearch="search" :searchValue="viewSearchValue" :loading="loading"></search-bar>
    </div>
    <div class="district-bar font-16 flex-between pd-left-small pd-right-mini shadow" >
      <span class="pd-right-small pointer text-ellipsis no-select" @click="showDistrict=true" :title="areaObj.name">{{areaObj.name||'定位'}}</span>
      <i class="el-icon-location pointer-default font-18 no-select" @click="posiCenter"></i>
    </div>
    <transition name="right">
      <div class="position shadow" v-show="showDistrict">
        <common-district @close="showDistrict=false" @select="getPosiObj" :currentObj="areaObj"></common-district>
      </div>
    </transition>
    <div id="mapbox" class="fill"></div>
    <transition name="height">
    <div class="view-left shadow" v-show="showLeft">
      <div class="close-bar flex-between pd-right-mini">
        <i></i>
        <i class="el-icon-close font-20 pointer-default" @click.stop="close"></i>
      </div>
      <div class="left-box fill">
        <component :isShow="showLeft" :is="componentId" :viewSearchValue="viewSearchValue" :sobject="currentObject" @closeLoading='loading=false'></component>
      </div>
    </div>
    </transition>
  </div>
</template>
<script>
  import {vm,operate,getMap} from '@/script/operate'
  import * as mapbox from '@/script/mapbox'
  import psde from '@/script/editor/psde'
  import mapposition from '@/script/mapposition'
  let map;
  export default {
    data(){
      return {
        currentObject:{},
        showLeft:false,
        componentId:'',
        viewSearchValue:"",
        bbox:'',
        showDistrict:false,
        areaObj:{},
        loading:false
      }
    },
    props:{},
    components:{
      'viewLeft':()=>import('@/components/viewLeft/objDetail'),
      'searchBar':()=>import('@/components/common/searchBar'),
      'historyList':()=>import('@/components/viewLeft/historyList'),
      'viewExport':()=>import('@/components/viewLeft/viewExport'),
      'searchResult':()=>import('@/components/viewLeft/searchResult'),
      'commonDistrict':()=>import('@/components/common/district'),
      'modelList':()=>import('@/components/viewLeft/modelList')
    },
    computed:{},
    watch:{
      'currentObject.id'(val){
        // this.showLeft = Boolean(val);
      },
    },
    mounted(){
      map = mapbox.createMapboxMap('mapbox',()=>{
        //定位
        if(this.$route.query.map){
          let str = this.$route.query.map;
          let posi = str.split(',');
          map.setCenter([posi[2],posi[1]],posi[0]);
          map.setZoom(posi[0]);
        }else{
          let position = mapposition.getMapPosition();
          map.setCenter([position.lng, position.lat], position.zoom );
          map.setZoom(position.zoom);
          this.areaObj = mapposition.getArea();
        }
        
      });
      getMap(map);
      this.listenEvent();
    },
    methods:{
      listenEvent(){
        vm.$on(operate.selectObject,obj=>{
          this.showDistrict = false;
          if(!obj.id) {
            this.currentObject = {};
            this.showLeft = false;
            this.viewSearchValue = '';
            return
          }
          psde.objectQuery.getDetailById.query({ids:obj.id}).then(res=>{
            this.currentObject = res.list[0];
            this.componentId = 'viewLeft';
            this.showLeft = true;
          })
        });
        vm.$on(operate.openTab,obj=>{
          this.componentId = obj.name;
          this.showLeft = true;
        });
        vm.$on(operate.mapStatus,obj=>{
          let str = `${obj.zoom},${obj.posi.lat},${obj.posi.lng}`;
          this.$router.replace({
            path:'/view',
            query:{
              map:str
            }
          });
        })
        window.onbeforeunload = ()=> {
            mapposition.saveMapPosition({
              lng: map.getCenter().lng,
              lat: map.getCenter().lat,
              zoom: map.getZoom() 
            });
            mapposition.saveArea(this.areaObj)
        };
        
      },
      search(val){
        this.viewSearchValue = val;
        this.componentId = 'searchResult'
        this.showLeft = true;
        this.loading = true;
      },
      close(e){
        e.preventDefault();
        e.stopPropagation();
        this.showLeft = false;
        // map.onclick({point:{x:0,y:0}});
        vm.$emit(operate.showClickdel);
      },
      getPosiObj(obj){
        this.areaObj = obj;
      },
      posiCenter(){
        if(!this.areaObj.geoBox) return this.showDistrict=true;
        let center = this.getCenter(this.areaObj.geoBox);
        mapbox.flyTo(center.x, center.y, center.z,10);
      },
      getCenter(bbox){
        let center = {};
        center.x = (bbox.minx + bbox.maxx) / 2;
        center.y = (bbox.miny + bbox.maxy) / 2;
        center.z = (bbox.minz + bbox.maxz) / 2;
        return center;
      }
    },
    beforeDestroy(){
      vm.$off([operate.selectObject]);
      
      mapposition.saveMapPosition({
        lng: map.getCenter().lng,
        lat: map.getCenter().lat,
        zoom: map.getZoom() 
      });
      mapposition.saveArea(this.areaObj)
    },
    
  }
</script>
<style lang='scss' scoped>
  .view{
    // background-color: red;
    $width:120px;
    .search{
      position: absolute;
      left:20px;
      top: 10px;
      width: 300px;
      z-index: 10;
    }
    .view-left{
      position: absolute;
      background-color: #fff;
      left: 20px;
      top: 60px;
      height: 80%;
      width: 300px;
      overflow-y: auto;
      overflow-x: hidden;

    }
    .close-bar{
      height: 40px;
      border-bottom: 1px solid #ccc;
    }
    .left-box{
      position: relative;
      height: calc(100% - 41px);
    }
    .position{
      position: absolute;
      right: 20px;
      top: 10px;
      width: 400px;
      height: 50%;
      z-index: 10;
      min-height: 400px;
    }
    .district-bar{
      height: 40px;
      position: absolute;
      background: #fff;
      width:$width;
      right: 20px;
      top: 10px;
      z-index: 5;
      border-top-left-radius: 3px;
      border-top-right-radius: 3px;
      
    }
  }
  .right-enter-active, .right-leave-active {
    transition: all .2s;
  }
  .right-enter, .right-leave-to /* .fade-leave-active below version 2.1.8 */ {
    width: 120px !important;
    min-height: 0 !important;
    height: 0px !important;
  }
  .height-enter-active, .height-leave-active {
    transition: all .2s;
  }
  .height-enter, .height-leave-to /* .fade-leave-active below version 2.1.8 */ {
    height: 0 !important;
  }
</style>