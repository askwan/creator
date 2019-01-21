<template>
  <div class="map-3d" ref="map3d" :style="{width:width}">
    <div id="mapbox-3d"></div>
  </div>
</template>
<script>
import MapboxGL from "../script/OneSIS/OneSISGL/MapboxGL";

import { vm, operate, getEditor } from "@/script/operate";
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
    width() {
      return window.innerWidth * 0.4 + "px";
    }
  },
  watch: {
    show(val) {
      // console.log(val);
      if (val) {
        this.getSobj();
      }
    }
  },
  mounted() {
    vm.$on(operate.DiagramReady, () => {
      this.init();
    });
  },
  methods: {
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
    },
    getSobj() {
      let obj = getEditor().currentSobject;
      if (obj) {
        map.start(State.viewObject);
      }
    },
    getData() {
      vm.$on(operate.hiddenOtypes, () => {
        if (this.show) {
          map.start(State.viewObject);
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
}
</style>