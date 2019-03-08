<template>
  <div class="map-3d" ref="map3d" :style="{width:width}">
    <div id="mapbox-3d"></div>
    <div class="tool" v-show="showList">
      <div class="slide" v-show="shows=='scale'">
        <el-slider
          v-model="showScaleNum"
          :show-tooltip="false"
          :show-input="false"
          :step="0.01"
          :min="1"
          :max="300"
          @change="changeSliderEnd"
        ></el-slider>
      </div>

      <div class="btn">
        <span @click="change('translate')" :class="{sel:shows=='translate'}">平移</span>
        <span @click="change('rotate')" :class="{sel:shows=='rotate'}">旋转</span>
        <span @click="change('scale')" :class="{sel:shows=='scale'}">缩放</span>
        <span v-show="shows=='scale'" class="show-num">{{scaleNum}}</span>
      </div>
    </div>
  </div>
</template>
<script>
import MapboxGL from "../script/OneSIS/OneSISGL/MapboxGL";

import { vm, operate, getEditor } from "@/script/operate";
import { State } from "@/script/editor/utils/store";
import { MapEvent, EventAll } from "../script/OneSIS/evented/Event.js";
import { objectServer} from '@/script/server'
var map;
export default {
  data() {
    return {
      shows: "translate",
      showList: false,
      scaleNum: 0,
      showScaleNum: -1
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
  },
  watch: {
    show(val) {
      if (val) {
        this.getSobj();
      }
    },
    //滑竿变化  改变输入框值
    showScaleNum(val) {
      if (val > 100) {
        this.scaleNum = ((val - 100) / 8 + 1).toFixed(2);
      } else if (val <= 100) {
        this.scaleNum = (val / 100).toFixed(2);
      }
      if (map) {
        map.changeSlider(this.scaleNum);
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
    //显示值改变
    inputChange(val) {
      if (val > 1) {
        this.showScaleNum = (val - 1) * 8 + 100;
      } else if (val <= 1) {
        this.showScaleNum = val * 100;
      }
    },
   
    //滑竿改变结束
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

      this.getData();
    },
    getSobj() {
      let obj = getEditor().currentSobject;
      if (obj) {
        map.start(State.viewObject);
        this.showList = map.getModelSobject();
      }
      // map.changed = false;
    },
    getData() {
      vm.$on(operate.hiddenOtypes, () => {
        if (this.show ) {
          // console.log(getEditor().currentEntity,'entity',State.viewObject)
          map.start(State.viewObject,getEditor().currentEntity);
          this.showList = map.getModelSobject();
          // objectServer.query({ids:State.viewObject.id,loadForm:true}).then(res=>{
          //   console.log(res,'res')
          // })

        }
        // map.changed = false;
      });
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
    width: 80%;
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