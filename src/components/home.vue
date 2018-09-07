<template>
 <div id='id-container'>
 <div id="sidebar" class="col4" ref="sidebar"></div>
 </div>

</template>

<script>
import "../osm/css/00_reset.css";
import "../osm/css/20_map.css";
import "../osm/css/25_areas.css";
import "../osm/css/30_highways.css";
import "../osm/css/35_aeroways.css";
import "../osm/css/40_railways.css";
import "../osm/css/45_waterways.css";
import "../osm/css/50_misc.css";
import "../osm/css/55_cursors.css";
import "../osm/css/60_mapillary.css";
import "../osm/css/70_fills.css";
import "../osm/css/80_app.css";

import * as iD from "../osm/modules";
import { event as d3_event, select as d3_select } from "d3-selection";

export default {
  name: "HelloWorld",
  data() {
    return {
      msg: "Welcome to Your Vue.js App"
    };
  },
  mounted() {
    let id = iD.Context().assetPath("static/");

    //id.features().disable("boundaries");
    let el = this.$refs.sidebar;

    id.ui()(document.getElementById("id-container"), function() {

   

      console.log(aa,"aa");
    });
  }
};
</script>

<style scoped>

</style>
