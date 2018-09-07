<template>
  <div class='object-list'>
    <div class="h-list-box h-change-wrap" ref="boxScroll">
				<div class="class-lists">
					<ul class="h-list" v-if="lists&&lists.length">
						<li v-for="(item,index) in lists" :key="index" v-drag="{data:item,id:'object'}">
							<div class="class-detail" @click="showDetail(item,index)">
								<div class="class-img">
									<img :src="ImageManage.getImgUrl(item.otype.icon)" v-if="item.otype && item.otype.icon"/>
									<span v-else-if="item.name">{{item.name|initialName}}</span>
									<span v-else>null</span>
								</div>
								<div class="class-content">
									<span :title="item.name">名称: {{item.name}}</span>
									<p class="bn-details" v-if="item.attributes && item.attributes.length>0" :title="item.attributes|getAttributesName">属性：{{item.attributes|getAttributesName}}</p>
									<p class="bn-details" v-else>属性：默认属性</p>
									<p class="bn-details" v-if="item.otype && item.otype.name">类型：{{item.otype.name}}</p>
									<p class="bn-details" v-else>类型：默认类型</p>
									<p class="bn-details" v-if="item.version && item.version.vid">版本：{{item.version.vid}}</p>
									<p class="bn-details" v-else>版本：默认版本</p>
								</div>
							</div>
						</li>
					</ul>
					<no-data-model value="暂无对象列表" v-else/>
				</div>
			</div>
    <el-pagination
    	v-if="pageTotal>0"
    	:small="true"
    	:pager-count="pageCount"
	    layout="prev, pager, next"
	    @current-change="handleCurrentChange"
	    :page-size="20"
	    :total="pageTotal">
	  </el-pagination>
  </div>
</template>
<script>
import ImageManage from "@/psde/ImageManage";
import objectService from "@/request/object.service.js";
import { vm, operate } from "@/script/operate";
import parse from "@/script/wkt";
import { oTypeCtrl } from "@/views/objectInstant/right/tabs/oTypeCtrl";
export default {
  data() {
    return {
      ImageManage: ImageManage,
      pageCount: 5
    };
  },
  props: ["lists", "pageTotal"],
  components: {
    "no-data-model": () => import("@/components/noDataModel")
  },
  computed: {},
  mounted() {},
  filters: {
    initialName(str) {
      if (str.length > 1) {
        return str.slice(0, 2).toUpperCase();
      } else {
        return str.toUpperCase();
      }
    },
    getAttributesName(data) {
      var arr = [];
      data.forEach((item, index) => {
        if (item.name != "") {
          arr.push(item.name);
        }
      });
      var str = arr.join(",");
      return str;
    }
  },
  watch: {},
  methods: {
    handleCurrentChange(page) {
      this.$emit("handleCurrentChange", page);
    },
    showDetail(item, index) {
      objectService.queryObject({ ids: item.id }).then(response => {
        if (response.list.length > 0) {
          oTypeCtrl.getOTypeDetail(item);
          vm.$emit(operate.changeSlider, { hideRight: false });
					/*if (response.list[0].forms.length > 0) {
            if (response.list[0].forms[0].geom) {
              let point = parse(response.list[0].forms[0].geom);
              //let point = parse("POINT (113.658735232566 34.7485033703073)");
              vm.$emit(operate.flyTo, {
                position: point.coordinates,
                zoom: 16
              });
              console.log(point.coordinates, "坐标地址");
            }
          } */
        } else {
          this.$message({
            message: "请点击对象进行查看，当前点击的是时空域！",
            type: "warning",
            showClose: true
          });
        }
      });
    }
  }
};
</script>
<style lang='less' scoped>
@transition: all 0.2s linear;
.object-list {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background-color: #f7fafc;
  .h-change-wrap {
    top: 40px;
  }
  .h-list {
    margin: 10px 0 0 10px;
    padding-left: 0;
  }
  .class-lists ul li {
    height: 80px;
    width: 250px;
  }
  .no-data {
    height: 200px;
  }
  .class-detail .class-content {
    top: 0px;
    .bn-details {
      width: 175px;
      letter-spacing: 1px;
      word-break: break-all;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 1;
      /* autoprefixer: off */
      -webkit-box-orient: vertical;
      /* autoprefixer: on */
      overflow: hidden;
    }
  }
}
</style>