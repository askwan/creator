<template>
  <div class="map-3d" ref="map3d" :style="{width:width}">
    <div id="mapbox-3d"></div>
  </div>
</template>
<script>
import MapboxGL from "../script/OneSIS/OneSISGL/MapboxGL";

import { vm, operate } from "@/script/operate";
import { State } from "@/script/editor/utils/store";

var map;
export default {
  data() {
    return {};
  },
  props: {
    show: Boolean,
    sobject: Object
  },
  components: {},
  computed: {
    width(){
      return window.innerWidth*0.4+'px'
    }
  },
  mounted() {
    let obj = {
      center: [120.433512, 31.324123],
      styleList: State.styleList,
      otypes: State.otypes,
      id: "mapbox-3d"
    };
    map = new MapboxGL(obj);

    this.getData();
  },
  methods: {
    getData() {
      vm.$on(operate.hiddenOtypes, () => {
        map.start(State.viewObject);
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
}
</style>