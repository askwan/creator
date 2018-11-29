<template>
  <div class="map-3d" ref="map3d">
    <div id="mapbox-3d"></div>
  </div>
</template>
<script>
import model_js from "./script/3Dmodel_js";
// import modelUI from "./script/ui.js";
export default {
  data() {
    return {};
  },
  props: {},
  components: {},
  computed: {},
  mounted() {
    model_js.init();

    // let gui = modelUI.createUI(this.$refs.map3d);
    // console.log(gui)

  },
  methods: {}
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