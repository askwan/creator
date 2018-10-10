<template>
  <div class="detail-box fill">
    <div class='detail pd-left-small pd-right-small'>
      <el-collapse v-model='activeNames'>
        <el-collapse-item title="属性" name="1">
          <div class="tab-box">
            <property-tab :objectDetail="sobject"></property-tab>
          </div>
        </el-collapse-item>
        <el-collapse-item title="形态" name="2">
          <div class="tab-box">
            <form-tab :objectDetail="sobject"></form-tab>
          </div>
        </el-collapse-item>
        <el-collapse-item title="关系" name="3">
          <div class="tab-box">
            <relation-tab :objectDetail="sobject"></relation-tab>
          </div>
        </el-collapse-item>
        <el-collapse-item title="组成结构" name="6">
          <div class="tab-box">
            <constitute-tab :objectDetail="sobject"></constitute-tab>
          </div>
        </el-collapse-item>
        <el-collapse-item title="行为" name="4">
          <div class="tab-box">
            <behavior-tab :objectDetail="sobject"></behavior-tab>
          </div>
        </el-collapse-item>
        <el-collapse-item title="时空" name="5">
          <div class="tab-box">
            <domain-tab :objectDetail="sobject"></domain-tab>
          </div>
        </el-collapse-item>
      </el-collapse>
    </div>
  </div>
</template>
<script>
import { State, findOtypeById } from "@/script/editor/utils/store";
export default {
  data() {
    return {
      sobject: {},
      otype: {},
      activeNames: ["1"]
    };
  },
  props: {
    currentObject: {
      default: {},
      type: Object
    }
  },
  computed: {},
  watch: {
    currentObject(obj) {
      this.sobject = obj;
    }
  },
  components: {
    propertyTab: () => import("./collapse/propertyTab.vue"),
    formTab: () => import("./collapse/formTab.vue"),
    relationTab: () => import("./collapse/relationTab.vue"),
    behaviorTab: () => import("./collapse/behaviorTab.vue"),
    domainTab: () => import("./collapse/domainTab.vue"),
    constituteTab: () => import("./collapse/constituteTab.vue")
  },
  computed: {},
  activated() {
    this.sobject = this.currentObject;
    console.log(this.sobject);
  },
  methods: {}
};
</script>
<style lang='scss' scoped>
  .detail-box{
    background: #fff;
    overflow: hidden;
    overflow-y: auto;
  }
</style>