<template>
  <div class="map-3d" ref="map3d" :style="{width:width}">
    <div id="mapbox-3d"></div>
    <div class="tool" v-show="showList">
      <div class="slide" v-show="shows=='scale'">
        <el-slider
          v-model="scaleNum"
          :show-tooltip="false"
          :show-input="false"
          :step="1"
          :min="1"
          :max="200"
          @input="changeSlider"
          @change="changeSliderEnd"
        ></el-slider>
      </div>

      <div class="btn">
        <span @click="change('translate')" :class="{sel:shows=='translate'}">平移</span>
        <span @click="change('rotate')" :class="{sel:shows=='rotate'}">旋转</span>
        <span @click="change('scale')" :class="{sel:shows=='scale'}">缩放</span>
        <!-- <el-input type='number' min="0.01" max="100" v-model="sNum" class="show-num" @change="inputChange"></el-input> -->
        <span v-show="shows=='scale'" class="show-num">{{sNum}}</span>
      </div>
    </div>
  </div>
</template>
<script>
import MapboxGL from "../script/OneSIS/OneSISGL/MapboxGL";

import { vm, operate, getEditor } from "@/script/operate";
import { State } from "@/script/editor/utils/store";
import { MapEvent, EventAll } from "../script/OneSIS/evented/Event.js";
var map;
export default {
  data() {
    return {
      shows: "translate",
      showList: false,
      scaleNum: 100,
      sNum: 0
    };
  },
  props: {
    show: Boolean,
    sobject: Object
  },
  components: {},
  computed: {
    width() {
      return window.innerWidth * 0.4 + "px";
    }
    // sNum() {
    //   if (this.scaleNum > 100) {
    //     return this.scaleNum - 100;
    //   } else if (this.scaleNum <= 100) {
    //     return this.scaleNum / 100;
    //   }
    // }
  },
  watch: {
    show(val) {
      if (val) {
        this.getSobj();
      }
    },
    scaleNum() {
      if (this.scaleNum > 100) {
        this.sNum = this.scaleNum - 100;
      } else if (this.scaleNum <= 100) {
        this.sNum = this.scaleNum / 100;
      }
    }
  },
  mounted() {
    vm.$on(operate.DiagramReady, () => {
      this.init();
    });

    EventAll.on(MapEvent.changeLoc, data => {
      // console.log('接到', data);
      map.changed = true;
      let obj = {
        entityId: data.id,
        lat: data.lat,
        lng: data.lng,
        top: data.top,
        rotateZ: data.rotateZ,
        scale: {
          x: data.scale.x,
          y: data.scale.y,
          z: data.scale.z
        }
      };
      getEditor().changeLoc(obj);
    });
    EventAll.on(MapEvent.setScale, data => {
      this.inputChange(Number(data.scale));
    });
  },
  methods: {
    inputChange(val) {
      if (val > 1) {
        this.scaleNum = val + 100;
      } else if (val <= 1) {
        this.scaleNum = val * 100;
      }
    },
    changeSlider(val) {
      if (map) {
        map.changeSlider(this.sNum);
      }
    },
    changeSliderEnd(val) {
      if (map) {
        map.changeSliderEnd();
      }
    },
    change(val) {
      this.shows = val;
      map.setType(val);
    },
    init() {
      let obj = {
        center: [120.433512, 31.324123],
        styleList: State.styleList,
        otypes: State.otypes,
        id: "mapbox-3d"
      };
      map = new MapboxGL(obj);

      // this.getSobj();
      this.getData();
      // map.on('changeLoc',obj=>{
      // obj = {
      //   entityId:'n1086762917686247425',
      //   lat:114.2869953716,
      //   lng:9.714908723
      // }
      // getEditor().changeLoc(obj)
      // })
    },
    getSobj() {
      let obj = getEditor().currentSobject;
      if (obj) {
        map.start(State.viewObject);
        this.showList = map.getModelSobject();
      }
    },
    getData() {
      vm.$on(operate.hiddenOtypes, () => {
        if (this.show) {
          map.start(State.viewObject);
          this.showList = map.getModelSobject();
        }
      });

      // vm.$on(operate.heightManager, e => {
      //   console.log(e, 6666666);
      // });
      // console.log(State.otypes, 323);
    }
  }
};
</script>
<style lang='scss' scoped>
.map-3d {
  width: 800px;
  height: 100%;
  position: relative;
  #mapbox-3d {
    height: 100%;
    background-color: #333333;
  }
  .tool {
    position: absolute;
    left: 10%;
    bottom: 10px;
    overflow: hidden;
    padding: 0 10px;
    width: 300px;
    .btn {
      line-height: 26px;
      & > span {
        font-size: 16px;
        background-color: #ffffff;
        padding: 2px 3px;
        cursor: pointer;
        vertical-align: middle;
        transition: all linear 0.2s;
        border-radius: 5px;
      }
      .show-num {
        display: inline-block;
        margin-left: 10px;
        width: 60px;
        height: 25px;
        line-height: 25px;
        font-size: 14px;
        padding: 0 3px;
        text-align: center;
      }
      .sel {
        background-color: #409eff;
        color: #ffffff;
      }
    }
  }
}
</style>