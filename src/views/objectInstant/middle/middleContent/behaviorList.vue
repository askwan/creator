<template>
    <drag-content :childName="childName" :childValue="childValue" :item="itemData" class="drag-content">
        <div id='behaviorList' class="object-query">
          <div class="class-template-head cle">
                <div class="tem cle">
                    <el-button slot="append" icon="el-icon-search" @click="startSearch(searchVal)" class="btn"></el-button>
                    <el-input placeholder="请输入内容进行搜索" v-model="searchVal" @input="searchInputFn" class="search">
                    </el-input>
                </div>
            </div>
            <div class="h-list-box h-change-wrap" ref="boxScroll" v-if="!loading">
                <div class="class-lists">
                    <ul class="h-list" v-if="bhLists&&bhLists.length">
                        <li v-for="(item,index) in bhLists" :key="index" v-drag="{data:item,id:'behavior'}">
                            <div class="class-detail" @click="showDetail(item,index)">
                                <div class="class-img">
                                    <img :src="ImageManage.getImgUrl(item.icon)" v-if="item.icon" />
                                    <span v-else-if="item.name">{{item.name|initialName}}</span>
                                    <span v-else>null</span>
                                </div>
                                <div class="class-content">
                                    <span :title="item.name">name: {{item.name}}</span>
                                    <p class="bn-details">输入：{{item.inTypes|compairString}}</p>
                                    <p class="bn-details">输出：{{item.outTypes|compairString}}</p>
                                </div>
                                <div class="h-tags-box">
                                    <el-tooltip effect="dark" :content="filtersName(item.mdef.type)" placement="bottom" v-if="item.mdef.type">
                                        <span class="h-tags h-tags-blue">{{filtersName(item.mdef.type)}}</span>
                                    </el-tooltip>
                                    <el-tooltip effect="dark" :content="'所属类别：'+item.mdef.name" placement="bottom" v-if="item.mdef.name">
                                        <span class="h-tags h-tags-yellow">{{item.mdef.name}}</span>
                                    </el-tooltip>
                                </div>
                                <div class="h-user-name">
                                    <div class="name">
                                        <img :src="common.getAvatar(item.user.userAvatar)" height="26" alt="头像"><span>{{item.user.userNickName?item.user.userNickName:'未知用户'}}</span>
                                    </div>
                                    <div class="time">
                                        <i v-if="item.mtime">{{common.TimeShift(item.mtime)}}</i>
                                    </div>
                                </div>
                            </div>
                        </li>
                    </ul>
                    <no-data-model value="暂无行为列表" v-else/>
                </div>
            </div>
            <div v-else>
                <loading></loading>
            </div>
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page.currentPage" :page-sizes="page.pageSizeArr" :page-size="page.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="page.total">
            </el-pagination>
        </div>
    </drag-content>
</template>

<script>
import psde from "@/psde";
import common from "@/script/common";
import ImageManage from "@/psde/ImageManage";
import { tabManage } from "@/components/designer/tabmanage";
import objectService from "@/request/object.service.js";
import { oTypeCtrl } from "@/views/objectInstant/right/tabs/oTypeCtrl";

export default {
  data() {
    return {
      oTypeCtrl: oTypeCtrl, //总数据

      common,
      model: new psde.Model(),
      getDict: new psde.GetDict(),
      modelDef: new psde.ModelDef(),
      ImageManage,
      currentItem: {},
      bhLists: [],
      itemData: tabManage.getItemById("behaviorList"),
      searchVal: "",
      page: {
        currentPage: 1,
        pageNum: 1,
        pageSize: 20,
        pageSizeArr: [4, 20, 40],
        total: 0
      },
      loading: false,
      times: "",
      options: [],
      checked: false
    };
  },
  components: {
    "no-data-model": () => import("@/components/noDataModel")
  },
  props: ["childName", "childValue"],

  watch: {
    "oTypeCtrl.oTypeContent"(val) {
      if (val.id) {
        this.checked = true;
      }
      console.log(this.bhLists, "bhLists");
    }
  },
  filters: {
    initialName(str) {
      if (str.length > 1) {
        return str.slice(0, 2).toUpperCase();
      } else {
        return str.toUpperCase();
      }
    },
    compairString(str) {
      if (str) {
        if (str.length > 30) {
          return str.slice(0, 28) + "...";
        } else {
          return str;
        }
      } else {
        return "暂无";
      }
    }
  },
  mounted() {
    if (this.oTypeCtrl.oTypeContent.id) {
      this.checked = true;
    }
    this.getDict.query(null, "modelDefType").then(response => {
      this.options = response;
    });
    this.requestMore();
  },
  methods: {
    filtersName(num) {
      for (let item of this.options) {
        if (item.value == num) {
          return item.name;
        }
      }
    },
    searchInputFn() {
      clearTimeout(this.times);
      this.times = setTimeout(() => {
        this.startSearch(this.searchVal);
      }, 1000);
    },
    handleSizeChange(val) {
      this.page.pageSize = val;
      this.requestMore();
    },
    handleCurrentChange(val) {
      this.page.pageNum = val;
      this.requestMore();
    },
    startSearch(value) {
      this.searchVal = value;
      this.page.pageNum = 1;
      this.page.pageSize = 20;
      this.requestMore();
    },
    requestMore() {
      this.bhLists = [];
      this.loading = true;
      this.model
        .query({
          names: this.searchVal,
          pageNum: this.page.pageNum,
          pageSize: this.page.pageSize,
          orderType: "ID",
          descOrAsc: true
        })
        .then(response => {
          this.bhLists = response.list;
          this.page.total = response.total;
          this.loading = false;
        });
    },
    showDetail(item, index) {
      //记录当前点击item，以便于修改后同步更新
      this.currentItem = item;
      //请求详情在右边显示
      item.clickSign = "classTemplate";
    }
  }
};
</script>

<style scoped lang="less">
@transition : all .3s linear 0s;
.object-query {
  position: absolute;
  height: 100%;
  width: 100%;
  background-color: #ffffff;
  .class-template-head {
    .check {
      margin-left: 20px;
      height: 35px;
      line-height: 32px;
      border: 1px solid #ccc;
      border-radius: 5px;
      padding: 0 8px;
    }
  }
}
</style>