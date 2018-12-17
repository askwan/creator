<template>
  <div class="map-3d" ref="map3d">
    <div id="mapbox-3d"></div>
    <div class="map-btn cle">
      <div :class="{'click':buildShow}" @click="changeBuild">建筑元素</div>
      <div :class="{'click':pipelineShow}" @click="changePipeline">管道</div>
    </div>
  </div>
</template>
<script>
import model_js from "./script/mapbox";
import getColor from "../script/OneSIS/SObjectSceneManager/LayerManager/CustomLayer/manage/getColor";
import otypeList from "../script/OneSIS/SObjectSceneManager/LayerManager/CustomLayer/manage/otypeList";
import { vm, operate } from "@/script/operate";
import { State } from "@/script/editor/utils/store";
export default {
  data() {
    return {
      buildShow:false,
      pipelineShow:false,
    };
  },
  props: {
    show: Boolean,
    sobject: Object
  },
  components: {},
  computed: {},
  mounted() {
    model_js.init();
    getColor.setList(State.styleList);
    otypeList.setlist(State.otypes);

    this.getData();
  },
  methods: {
    getData() {
      // let IdEditor = getEditor();
      // vm.$on("currentObject", data => {
      //   console.log(data)
      //   // console.log(State.otypes[4904]);

      //   return
      //   if (!data.object) {
      //     console.log("没点到");
      //     return;
      //   }
      //   if (!this.show) {
      //     console.log("弹窗已关闭");
      //     return;
      //   }
      //   // if (data.entityId) {
      //   //   model_js.getData(data);
      //   // }
      // });
      vm.$on(operate.hiddenOtypes, () => {
        model_js.getData(State.viewObject);
      });

      console.log(State.otypes);
    },
    changeBuild() {
      this.buildShow=!this.buildShow
      
    },
    changePipeline() {
      this.pipelineShow=!this.pipelineShow
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
  .map-btn {
    position: absolute;
    top: 0;
    left: 0;
    & > div {
      float: left;
      margin-left: 5px;
      color: #409eff;
      font-size: 16px;
      background-color: rgba(0, 0, 0, 0.5);
      padding: 0 5px;
      border-radius: 10px;
      cursor: pointer;
      transition: all linear 0.2s
    }
    .click{
      color: #fff;
      background-color: rgba(64, 158, 255, 1);

    }
  }
}
</style>