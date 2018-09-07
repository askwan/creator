<template>
  <ul class='tool-edit'>
    <li class="tool-list" v-for="(style,i) in styleList" :key="i" @click="select(i,style)" :class="{active:current==i}">
      <div class="text-type">{{style.typeName}}</div>
      <div class="text-type"><i class="iconfont" :class="type[style.positions[0]]"></i></div>
    </li>
  </ul>
</template>
<script>
import { allOtype } from "@/script/allOtype";
import EditManage from "../../../script/mapbox/EditManage";
import * as formCtrl from "../right/tabs/formCtrl";
let dict;
export default {
  data() {
    return {
      current: null,

      type: {
        21: "icon-dian",
        22: "icon-xian1",
        23: "icon-mian1"
      }
    };
  },
  props: ["otype"],
  components: {},
  computed: {
    styleList() {
      if (!this.otype.formStyles) return [];
      let arr = this.otype.formStyles.styles.filter(el => {
        if (
          el.positions &&
          el.positions.length > 0 &&
          el.type &&
          el.type != 11 &&
          el.type != 12 &&
          el.type != 13
        ) {
          el.typeName = formCtrl.getFromByType(el.type).label;
          return true;
        }
        return false;
      });
      this.current = null;
      return arr;
    },
    filterOsm() {}
  },
  mounted() {
    this.request();
  },
  methods: {
    select(i, style) {
      this.current = i;
      //this.$emit("select", style);
      //设置当前编辑工具
      EditManage.setTool(style, this.otype);
    },
    request() {
      dict = allOtype.dict();
      // console.log(this.dict)
    }
  },
  filters: {
    getType(type) {
      if (!type) return "null";
      if (type == "null" || type == "undefined") return "null";
      dict = allOtype.dict();
      let aim = dict.find(el => el.value == type);
      return aim.name || "";
    }
  }
};
</script>
<style lang='less' scoped>
.tool-edit {
  position: absolute;
  left: 600px;
  height: 40px;
  // overflow-y: auto;
  top: 20px;
  border-radius: 5px;
  // padding: 5px 10px;
  background-color: #fff;
  overflow: hidden;
  display: flex;
  .tool-list {
    height: 40px;
    width: 70px;
    border-left: 1px solid #f1f1f1;
    cursor: pointer;
    display: flex;
    justify-content: space-around;
    .text-type {
      line-height: 40px;
    }
  }

  .tool-list:hover {
    background-color: #ecf5ff;
  }

  .active {
    background-color: #ecf5ff;
  }
}
</style>
