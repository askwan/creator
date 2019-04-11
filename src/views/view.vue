<template>
  <div class="view fill" v-loading="gloabLoading">
    <div class="search shadow">
      <search-bar @startSearch="search" :searchValue="viewSearchValue" :loading="loading"></search-bar>
    </div>
    <div class="district-bar font-16 flex-between pd-left-small pd-right-mini shadow">
      <span
        class="pd-right-small pointer text-ellipsis no-select"
        @click="showDistrict=true"
        :title="areaObj.name"
      >{{areaObj.name||'定位'}}</span>
      <i class="el-icon-location pointer-default font-18 no-select" @click="posiCenter"></i>
    </div>
    <transition name="right">
      <div class="position shadow" v-show="showDistrict">
        <common-district @close="showDistrict=false" @select="getPosiObj" :currentObj="areaObj"></common-district>
      </div>
    </transition>
    <div id="mapbox" class="fill"></div>
    
    <!-- <div :class="{'floor-select-container-show':floorShow}" class="floor-select-container">
      <ul>
        <li v-for="(n,i) in 5" :key="i">{{n}}</li>
      </ul>
    </div> -->
    <transition name="height">
      <div class="view-left shadow" v-show="showLeft">
        <div class="close-bar flex-between pd-right-mini">
          <i></i>
          <i class="el-icon-close font-20 pointer-default" @click.stop="close"></i>
        </div>
        <div class="left-box fill">
          <component
            :isShow="showLeft"
            :is="componentId"
            :viewSearchValue="viewSearchValue"
            :sobject="currentObject"
            :loading="loading"
            @closeLoading="loading=false"
          ></component>
        </div>
      </div>
    </transition>
  </div>
</template>
<script>
import { vm, operate, getMap } from "@/script/operate";
import * as mapbox from "@/script/mapbox";
import psde from "@/script/editor/psde";
import mapposition from "@/script/mapposition";
import { objectServer } from "@/script/server";
import { State } from "@/script/editor/utils/store";
let map;
export default {
  data() {
    return {
      currentObject: {},
      showLeft: false,
      componentId: "",
      viewSearchValue: "",
      bbox: "",
      showDistrict: false,
      areaObj: {},
      loading: false,
      gloabLoading:true,
      // floorShow: true
    };
  },
  props: {},
  components: {
    viewLeft: () => import("@/components/viewLeft/objDetail"),
    searchBar: () => import("@/components/common/searchBar"),
    historyList: () => import("@/components/viewLeft/historyList"),
    viewExport: () => import("@/components/viewLeft/viewExport"),
    searchResult: () => import("@/components/viewLeft/searchResult"),
    commonDistrict: () => import("@/components/common/district"),
    modelList: () => import("@/components/viewLeft/modelList"),
    imageList: () => import("@/components/viewLeft/imageList")
  },
  computed: {},
  watch: {
    "currentObject.id"(val) {
      // this.showLeft = Boolean(val);
    },
    // "$router"(from,to){
    //   console.log(from)
    // }
  },
  mounted() {
    this.listenEvent();
    
    
  },
  methods: {
    initMap(options, callback) {
      console.log("initmap");
      this.gloabLoading = false;
      if (this.$route.path == "/edit") return;
      if(map){
        map.remove();
      }
      map = mapbox.createMapboxMap("mapbox", options, () => {
        //定位

        if (typeof callback == "function") {
          callback();
        } else {
          
          if (this.$route.query.map) {
            let str = this.$route.query.map;
            let posi = str.split(",");
            map.setCenter([posi[2], posi[1]], posi[0]);
            map.setZoom(posi[0]);
          } else {
            let position = mapposition.getMapPosition();
            map.setCenter([position.lng, position.lat], position.zoom);
            map.setZoom(position.zoom);
            this.areaObj = mapposition.getArea();
            let str = `${position.zoom},${position.lat},${position.lng}`;
            let sdomain = JSON.parse(sessionStorage.getItem('sdomain'));
            this.$router.replace({
              path: "/view",
              query: {
                map: str,
                sdomains:sdomain.id
              }
            });
          }
        }

        

      });
      getMap(map);
    },
    listenEvent() {
      vm.$on('sdomainReady',list=>{
        let domain = sessionStorage.getItem("sdomain");
        if (domain) {
          domain = JSON.parse(domain);
        }
        domain = domain || {};
        domain.id = domain.id || this.$route.query.sdomains;
        console.log(77787)
        this.initMap({ sdomains: domain.id });
        

      })
      vm.$on(operate.selectObject, obj => {
        this.showDistrict = false;
        if (!obj.id) {
          this.currentObject = {};
          this.showLeft = false;
          this.viewSearchValue = "";
          return;
        }
        let option = {
          ids: obj.id,
          loadForm: true,
          loadObjType: true,
          loadAction: true,
          loadNetwork: true,
          uids:''
        };
        this.loading = true;
        objectServer.query(option).then(res => {
          this.currentObject = res.list[0];
          this.componentId = "viewLeft";
          this.showLeft = true;
          this.loading = false;
          if(this.currentObject.name){
            this.viewSearchValue = this.currentObject.name
          }else{
            this.viewSearchValue = ''
          }
        });
      });
      vm.$on(operate.openTab, obj => {
        this.componentId = obj.name;
        this.showLeft = true;
      });
      vm.$on(operate.mapStatus, obj => {
        let str = `${obj.zoom},${obj.posi.lat},${obj.posi.lng}`;
        let sdomain = sessionStorage.getItem('sdomain');
        sdomain = JSON.parse(sdomain);
        this.$router.replace({
          path: "/view",
          query: {
            map: str,
            sdomains:sdomain.id
          }
        });
        sessionStorage.setItem('href',location.href)
      });
      vm.$on(operate.changeDomain, item => {
        this.showLeft = false;
        this.viewSearchValue = '';
        if(map&&typeof map.remove == 'function') map.remove();
        this.initMap({ sdomains: item.id }, () => {
          let center = this.getCenter(item.geoBox);
          map.setCenter([center.x, center.y], map.getZoom());
          let posi = this.$route.query.map
          this.$router.replace({
            path:'/view',
            query:{
              map:posi,
              sdomains:item.id
            }
          })
          // let center = map.getCenter();
          // map.setCenter([center.lng,center.lat],map.getZoom());
          // mapbox.fitBbox(item.geoBox);
        });
      });
      window.onbeforeunload = () => {
        mapposition.saveMapPosition({
          lng: map.getCenter().lng,
          lat: map.getCenter().lat,
          zoom: map.getZoom()
        });

        mapposition.saveArea(this.areaObj);
      };
      window.onfocus = (event)=>{
        if(this.$route.path=='/view'){
          if(sessionStorage.getItem('href')===location.href){
          }else{
            location.reload();
          }
        }
      }
      vm.$on(operate.readyMap,(sdomain)=>{
        this.initMap({sdomains:sdomain.id,center:[0,0]});
      })
    },
    search(val) {
      this.viewSearchValue = val;
      this.componentId = "searchResult";
      this.showLeft = true;
      this.loading = true;
    },
    close(e) {
      e.preventDefault();
      e.stopPropagation();
      this.showLeft = false;
      // map.onclick({point:{x:0,y:0}});
      vm.$emit(operate.showClickdel);
    },
    getPosiObj(obj) {
      this.areaObj = obj;
    },
    posiCenter() {
      if (!this.areaObj.geoBox) return (this.showDistrict = true);
      let center = this.getCenter(this.areaObj.geoBox);
      mapbox.flyTo(center.x, center.y, center.z, 10);
      // mapbox.fitBbox(this.areaObj.geoBox);
    },
    getCenter(bbox) {
      let center = {};
      center.x = (bbox.minx + bbox.maxx) / 2;
      center.y = (bbox.miny + bbox.maxy) / 2;
      center.z = (bbox.minz + bbox.maxz) / 2;
      return center;
    }
  },
  beforeDestroy() {
    vm.$off([operate.selectObject]);

    mapposition.saveMapPosition({
      lng: map.getCenter().lng,
      lat: map.getCenter().lat,
      zoom: map.getZoom()
    });
    mapposition.saveArea(this.areaObj);
  }
};
</script>
<style lang='scss' scoped>
.view {
  $width: 120px;
  // background: red;
  .search {
    position: absolute;
    left: 20px;
    top: 10px;
    width: 300px;
    z-index: 10;
  }
  .view-left {
    position: absolute;
    background-color: #fff;
    left: 20px;
    top: 60px;
    height: 80%;
    width: 300px;
    // overflow-y: auto;
    overflow-x: hidden;
  }
  .close-bar {
    height: 40px;
    border-bottom: 1px solid #ccc;
  }
  .left-box {
    position: relative;
    height: calc(100% - 41px);
  }
  .position {
    position: absolute;
    right: 20px;
    top: 10px;
    width: 400px;
    height: 50%;
    z-index: 10;
    min-height: 400px;
  }
  .district-bar {
    height: 40px;
    position: absolute;
    background: #fff;
    width: $width;
    right: 20px;
    top: 10px;
    z-index: 5;
    border-top-left-radius: 3px;
    border-top-right-radius: 3px;
  }
  // .floor-select-container {
  //   position: absolute;
  //   z-index: 20;
  //   width: 26px;
  //   right: -30px;
  //   bottom: 291px;
  //   box-shadow: 1px 2px 1px rgba(0, 0, 0, 0.15);
  //   font-size: 0;
  //   -webkit-transition: right 200ms ease-in-out;
  //   transition: right 200ms ease-in-out;
  //   & > ul {
  //     & > li {
  //       width: 26px;
  //       height: 26px;
  //       color: #333;
  //       font-size: 12px;
  //       text-align: center;
  //       background: #fff;
  //     }
  //   }
  // }
  // .floor-select-container-show {
  //   right: 20px;
  // }
}
.right-enter-active,
.right-leave-active {
  transition: all 0.2s;
}
.right-enter, .right-leave-to /* .fade-leave-active below version 2.1.8 */ {
  width: 120px !important;
  min-height: 0 !important;
  height: 0px !important;
}
.height-enter-active,
.height-leave-active {
  transition: all 0.2s;
}
.height-enter, .height-leave-to /* .fade-leave-active below version 2.1.8 */ {
  height: 0 !important;
}
</style>