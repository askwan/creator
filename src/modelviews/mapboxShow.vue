<template>
  <div class="map-3d" ref="map3d">
    <div id="mapbox-3d"></div>
  </div>
</template>
<script>
import model_js from "./script/mapbox";
import { vm } from "@/script/operate";
export default {
  data() {
    return {};
  },
  props: {
    show: Boolean,
    sobject: Object
  },
  components: {},
  computed: {},
  mounted() {
    model_js.init();
    // let gui = modelUI.createUI(this.$refs.map3d);
    // console.log(gui)
    this.getData();
  },
  methods: {
    getData() {
      // let IdEditor = getEditor();
      vm.$on("currentObject", data => {
        if (!data.object) {
          console.log("没点到");
          return;
        }
        if (!this.show) {
          console.log("弹窗已关闭");
          return;
        }
        if (data.entityId) {
          model_js.getData(data);
        }
      });
    }
  }
};
</script>
<style lang='scss' scoped>
.map-3d {
  width: 800px;
  height: 100%;
  #mapbox-3d {
    height: 100%;
    background-color: #333333;
  }
}
</style>