<script>
export default {
  data() {
    return {};
  },
  props: ["value"],
  mounted() {},
  methods: {}
};
</script>
<template>
    <div class="no-data">
        <div class="no-data-m">
            <div class="no-data-img"></div>
            {{value?value:'暂无结果'}}
        </div>
    </div>
</template>
<style lang="less" scoped>

</style>
