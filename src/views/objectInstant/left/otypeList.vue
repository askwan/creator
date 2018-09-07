<template>
	<div class="left">
		<div class="left-detail">
			<div class="drop-down-option">
				<el-select v-model="optionValue" placeholder="选择类视图" @change="changeFilterList">
				    <el-option
					    v-for="item in diagrams"
					    :key="item.id"
					    :label="item.name"
					    :value="item.id">
					    <span style="float: left">{{ item.name }}</span>
				    </el-option>
				</el-select>
        <!-- <el-button class="edit-menu" @click="startEdit">{{btnText}}</el-button> -->
			</div>
			<div class="search-node">
				<div class="search-class-template">
					<common-search-bar @startSearch="searchList"></common-search-bar>
				</div>
				
			</div>

			<div class="h-list-box h-change-wrap" ref="boxScroll">
				<div class="class-lists">
					<ul class="h-list" v-if="filterList&&filterList.length">
						<li v-for="(item,index) in filterList" :key="index" @click="selectOtype(item)">
							<div class="class-detail" :title="item.des">
								<div class="class-img">
									<img :src="ImageManage.getImgUrl(item.icon)" v-if="item.icon" />
									<span v-else>{{item.name|initialName}}</span>
								</div>
								<div class="class-content">
									<span>{{item.name}}</span>
									<div class="bn-details">
                       <div v-for="(operate,k) in item.formStyles.styles" :key="k" @click="modes(item,operate.type)" :class="{active:currentOtypeId==item.id&&type==operate.type,disable:!disable}" v-show="ifEdit">{{operate.type|getName}}</div>
									</div>
									
								</div>
							
							</div>
						</li>
					</ul>
					<no-data-model value="暂无类模板" v-else/>
				</div>
			</div>


		</div>

	</div>
</template>

<script>
import psde from "@/psde";
import common from "@/script/common";
import ImageManage from "@/psde/ImageManage";
import {coreContext} from '@/iD-2.7.1/modules/core/context.js';
import {vm,operate} from '@/script/operate';
import {addPoint,addWay,addArea,filterList,initUi} from './modes'
import noDataModel from '@/components/noDataModel'
import {allOtype} from '@/script/allOtype'
import EditManage from '@/script/mapbox/EditManage'
let context;
export default {
  data() {
    return {
      //当前鼠标指向的元素
      lists: [],
      searchValue: "",
      otypeIdList: "",
      ImageManage,
      common,
      optionValue: "",
      diagramList: [],
      actived:false,
      currentOtypeId:'',
      disable:false,
      type:'',
      ifEdit:false,
      generalEdit:false,
      currentOtype:{}
    };
  },
  props: ['diagrams'],
  components: {
    "common-search-bar": () => import("@/components/common/searchBar/searchBar"),
    noDataModel
  },
  computed: {
    btnText(){
      return this.generalEdit? '退出' : '编辑';
    },
    filterList(){
      // this.list = filterList;
      let lists = [];
      if(!this.ifEdit){
        lists = this.lists;
      }else{
        // console.log(this.lists)
        lists = filterList(this.lists);
      }
      return lists.filter(item => {
        return (
          item.name.includes(this.searchValue) ||
          String(item.id).includes(this.searchValue)
        );
      });
    }
  },
  watch: {
    lists(newVal) {
      // if (newVal.length > 0) {
      //   newVal.forEach((item, index) => {
      //     if (item.tags == null && item.tags == "") {
      //       item.tags = null;
      //     } else {
      //       console.log(item.tagsItem)
      //       item.tagsItem = item.tags.split(",");
      //     }
      //   });
      // }
    },
    diagrams(val){
      // console.log(allOtype.getDiagram(),'sfsd');
      this.lists = allOtype.getDiagram();
    },
    optionValue(val) {
      this.lists = allOtype.getDiagram(val)
    },
    generalEdit(bool){
      // if(bool){
      //   EditManage.startEdit()
      // }else{
      //   EditManage.exitEdit()
      // };
      // vm.$emit('generalEdit',bool)
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
    getName(type){
      let obj = {
        11:'点',
        12:'线',
        13:"面"
      };
      return obj[type]
    }
  },
  mounted() {
    this.listenEvent();
  },
  methods: {
    listenEvent(){
      vm.$on('orginData',lists=>{
        // this.lists = lists;
        // console.log(89988)
        // context = coreContext();
        
      });
      vm.$on(operate.ifEdit,obj=>{
        this.ifEdit = obj.status;
        if(this.ifEdit) this.generalEdit = false;
      })
      vm.$on('updateBtn',context=>{
        let mode = Object.assign({},context.mode());
        switch (mode.id) {
          case 'browse':
            this.type = 10
            break;
          case 'add-point':
            this.type = 11
            break;
          case 'add-line':
            this.type = 12
            break;
          case 'add-area':
            this.type = 13
            break;
        
          default:
            break;
        }
        this.actived = context.mode().id !=='browse';
        this.disable = context.editable()
      })
    },
    selectOtype(otype){
      this.currentOtype = otype;
      vm.$emit('currentOtype',otype);
    },
    editDiagram(item) {},
    changeFilterList(data) {},
    searchList(val) {
      this.searchValue = val;
    },
    getStyle(style){
      // console.log(style)
    },
    startEdit(){
      this.generalEdit = !this.generalEdit;
    },
    modes(otype,type){
      if(!this.disable) return
      this.currentOtypeId = otype.id
      switch (type) {
        case 11:
          addPoint(otype);
          break;
        case 12:
          addWay(otype);
          break;
        case 13:
          addArea(otype);
          break;
        default:
          break;
      }
    }
  }
};



</script>

<style scoped lang="less">
.left .left-detail {
  position: absolute;
  width: 100%;
  left: 0px;
  top: 0px;
  bottom: 0;
}

.left .left-detail .drop-down-option {
  position: absolute;
  top: 15px;
  left: 15px;
  height: 39px;
  width: 270px;
  display: flex;
  justify-content: space-between;
  .el-select {
    border-left: 1px solid #ebeced;
    border-top: 1px solid #ebeced;
    border-right: 1px solid #ebeced;
    width: 100%;
    border-radius: 3px;
  }
}

.left .left-detail .search-node {
  position: absolute;
  top: 60px;
  left: 15px;
  height: 39px;
  width: 270px;
  z-index: 10;
}
.left .left-detail .search-node .search-class-template {
  // width: 180px;
  height: 39px;
  border: 1px solid #ebeced;
}
.left .left-detail .search-node .search-class-tem {
  width: 270px;
}
.left .left-detail .search-node a.add-business {
  width: 75px;
}

#app .h-change-wrap {
  position: absolute;
  top: 110px;
  left: 0;
  right: 0;
  bottom: 10px;
  overflow: auto;
}

#app .calcHeight{
  bottom:200px;
}

.tool-panel{
  position: absolute;
  bottom: 0px;
  left: 0;
  right: 0;
  // background-color: red;
  height: 200px;
  overflow-y: auto;
}

.h-list {
  margin: 0;
  padding-left: 0;
}

.h-list li {
  width: 260px;
}

.class-lists ul li {
  position: relative;
  display: inline-block;
  height: 80px;
  box-sizing: border-box;
  border: 2px solid #edeff2;
}

.class-lists ul li:hover {
  box-shadow: 0px 0px 30px #ededed;
}

.class-lists ul li .class-detail {
  position: relative;
  width: 100%;
  height: 100%;
}

.class-detail .class-img {
  position: absolute;
  top: 13px;
  left: 13px;
  width: 50px;
  height: 50px;
  box-sizing: border-box;
  border-radius: 5px;
  background-color: #b2d2ff;
  display: flex;
  align-items: center;
  justify-content: center;
  img {
    background-color: #ffffff;
    width: 100%;
    height: 100%;
    background-position: center center;
    background-repeat: no-repeat;
  }
  span {
    font-size: 16px;
    color: #ffffff;
  }
}

.class-detail .class-content {
  position: absolute;
  top: 13px;
  left: 72px;
  right: 25px;
  height: 50px;
}

.class-detail .class-content span {
  font-size: 14px;
  color: #333333;
  vertical-align: middle;
  display: inline-block;
  width: 150px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.class-detail .class-content p {
  font-size: 12px;
  color: #999999;
  line-height: 16px;
  height: 32px;
  letter-spacing: 1px;
  word-break: break-all;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.class-detail .class-tags {
  position: absolute;
  top: 62px;
  left: 10px;
  width: 260px;
  height: 25px;
  overflow: hidden;
  white-space: nowrap;
}

.class-detail .class-tags span {
  display: inline-block;
  max-width: 80px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 12px;
  color: #7a8899;
  height: 22px;
  line-height: 22px;
  border-radius: 10px;
  padding: 0 10px;
  background: #edeff2;
  margin-right: 5px;
}

a.add-business {
  position: absolute;
  top: 0;
  right: 0;
  text-decoration: none;
  background: #176de6;
  border-radius: 3px;
  display: block;
  width: 65px;
  height: 38px;
  text-align: center;
  line-height: 38px;
  color: #fff;
  // text-indent: 30px;
  transition: all 0.2s ease;
  &:hover {
    background: #176de6e3;
  }
}
.bn-details{
  display:flex;
  justify-content: flex-end;
  // justify-content: space-around;
  div{
    width: 33.3%;
    height: 30px;
    text-align: center;
    line-height: 30px;
    // background-color: #58B7FF;
    border: 1px solid #c4c4c4;
    user-select: none;
    color: #1f2d3d;
    border-left: none;
  }
  div:hover{
    border-color: #20A0FF;
    border-left: 1px solid #20A0FF !important;
    border-right: 1px solid #20A0FF;
    // color: #fff;
  }
  div:nth-last-of-type(1){
    border-top-right-radius: 3px;
    border-bottom-right-radius: 3px;
  }
  div:nth-of-type(1){
    border-top-left-radius: 3px;
    border-bottom-left-radius: 3px;
    border-left: 1px solid #c4c4c4;
  }
  .active{
    // background-color: #20A0FF;
    border-color: #20A0FF;
    border-left: 1px solid #20A0FF !important;
    border-right: 1px solid #20A0FF;
    color: #20A0FF;
  }
  .disable{
    opacity: 0.2;
  }
  .disable:hover{
    background-color: #fff;
    color: #1f2d3d;
    border-color: #c4c4c4;
    cursor: default;
  }

  
  
}
// .edit-menu{
//     height: 30px;
//     padding: 0 8px;
//   }
// .edit-menu:focus{
//   color: inherit;
//   border-color: #c4c4c4;
//   background-color: #fff;
// }
</style>