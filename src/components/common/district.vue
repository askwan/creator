<template>
  <div class='district fill no-select'>
    <div class="district-nav close-bar flex-between pd-right-mini pd-left-small" >
      <span class="font-16 pointer text-ellipsis" @click="posi()">{{currentObj.name||'定位'}}</span>
      <i class="el-icon-close font-20 pointer-default " @click="closeIt"></i>
    </div>
    <div class="district-list pd-left-mini pd-right-mini">
      <div class="district-el flex" v-for="(province,i) in provinces" :key="i">
        <div class="province-name pd-mini font-14">
          <span class="pointer-default" @click="fly('province',province)" :class="{'font-blue':currentObj.id==province.id}">{{province.name}}</span>
        </div>
        <div class="city-list flex wrap pd-top-mini pd-left-mini">
          <span class="pointer-default mg-right-small mg-bottom-small" v-for="city in province.children" :key='city.id' @click="fly('city',city)" :class="{'font-blue':currentObj.id==city.id}">{{city.name}}</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>

import { flyTo,fitBbox } from "@/script/mapbox";
import {objectServer} from '@/script/server'
export default {
  data() {
    return {
      provinces: []
    };
  },
  props: ['currentObj'],
  components: {},
  computed: {},
  mounted() {
    this.getData();
  },
  methods: {
    getData() {
      objectServer.query({otNames:'省界',uids:''}).then(res=>{
        objectServer.query({otNames:'市界',uids:''}).then(re=>{
          res.list.forEach(el => {
              el.children = this.getCity(re.list, el.code);
            });
        })
        this.provinces = res.list.sort((param1,param2)=>param1.name.localeCompare(param2.name,'zh'));
      })
    },

    getCity(citylist, code) {
      let scode = code.slice(0, 2);
      let result = [];
      // for (let i = 0; i < citylist.length; i++) {
      //   let sobject = citylist[i];
      //   if (sobject.code.slice(0, 2) == scode) {
      //     result.push(sobject);
      //   }
      // };
      result = citylist.filter(el=>el.code.slice(0,2)==scode);
      result = result.sort((param1,param2)=>param1.name.localeCompare(param2.name,'zh'));
      return result
    },
    fly(name, item) {
      let level;
      if (name == "city") {
        level = 11;
      } else {
        level = 9;
      }
      let center = this.getCenter(item.geoBox);
      flyTo(center.x, center.y, center.z, level);
      // fitBbox(item.geoBox);
      this.$emit("select", item);
      this.closeIt();
    },
    posi() {},
    closeIt() {
      this.$emit("close");
    },
    getCenter(bbox) {
      let center = {};
      center.x = (bbox.minx + bbox.maxx) / 2;
      center.y = (bbox.miny + bbox.maxy) / 2;
      center.z = (bbox.minz + bbox.maxz) / 2;
      return center;
    }
  }
};
</script>
<style lang='scss' scoped>
.district {
  background: #fff;
  .district-nav {
    height: 40px;
    background: #fff;
    border-bottom: 1px solid #ccc;
  }
  .district-list {
    height: calc(100% - 41px);
    overflow-y: auto;
    .district-el {
      border-bottom: 1px solid #eee;
      .province-name {
        flex-basis: 120px;
        flex-shrink: 0;
        border-right: 1px solid #eee;
      }
      .city-list {
        flex-grow: 1;
      }
    }
  }
}
</style>