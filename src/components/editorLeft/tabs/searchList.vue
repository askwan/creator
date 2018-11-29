<template>
	<div class="object-list">
		<div class="search-header">
			<common-search-bar @startSearch="searchList" :searchValue="searchNameVal"></common-search-bar>
		</div>
		<div class="object-content-1">
			<div class="search-list" v-if="objectListShow">
				<ul>
					<li v-for="(item,index) in objectList" :key="index" >
						<img v-if="item.otype && item.otype.icon" :src="ImageManage.getImgUrl(item.otype.icon)" :onerror="errorOtypeImg" alt="加载失败" />
						<!-- <i v-else-if="item.forms[0].type==21" class="iconfont icon-dian"></i>
						<i v-else-if="item.forms[0].type==22" class="iconfont icon-xian1"></i>
						<i v-else-if="item.forms[0].type==23" class="iconfont icon-mian1"></i>
						<i v-else-if="item.forms[0].type==31" class="iconfont icon-yuedengyu"></i>
						<span v-else-if="item.forms[0].type==32">Dem</span>
						<span v-else-if="item.forms[0].type==33">Tin</span>
						<i v-else-if="item.forms[0].type==40" class="iconfont icon-bim"></i>
						<i v-else-if="item.forms[0].type==50" class="iconfont icon-ic_d_rotation"></i>
						<i v-else-if="item.forms[0].type==61" class="iconfont icon-ganlanqiu"></i>
						<i v-else class="iconfont icon-meiyougengduo"></i> -->
						<span @click="openObject(item,index)">{{item.name}} (<span>{{getOtypeName(item)}}</span>)</span>
					</li>
				</ul>
			</div>
			<div class="earth-null-list" v-if="nullListShow">
				<ul v-show="!loading">
					<li>
						<i class="iconfont icon-weixian"></i>
						<span class="null-span">&nbsp;&nbsp;{{nullTitle}}</span>
					</li>
				</ul>
			</div>
      <div v-show="loading" class="pd-large align-center" style="width:100%;">
        <i class="el-icon-loading font-24 font-gray"></i>
      </div>
			<div class="earth-null-list" v-if="earthListShow">
				<ul>
					<li>
						<span class="earth-span" @click="searchObject">在全库搜索...</span>
					</li>
				</ul>
			</div>
		</div>
	</div>
</template>
<script>

import { vm, operate,getEditor } from "@/script/operate";
import {State} from '@/script/editor/utils/store'
import {objectServer,imageServer} from '@/script/server'
export default {
  data() {
    return {
      ImageManage: imageServer,
      errorOtypeImg:
        'this.src="' +
        require("../../../../static/images/errorOtype.jpg") +
        '"',
      searchNameVal: "",
      objectList: [],
      objectListShow: false,
      nullListShow: false,
      earthListShow: false,
      nullTitle: "在可见地图区域没有结果",
      loading:false
    };
  },
  props: [],
  components: {
    "common-search-bar": () => import("@/components/common/searchBar")
  },
  watch: {
    
  },
  mounted() {},
  activated(){
    this.searchNameVal = "";
    this.objectList = [];
    this.objectListShow = false;
    this.nullListShow = false;
    this.earthListShow = false;
  },
  methods: {
    //根据id获取otype名称
    getOtypeName(sobject) {
      let otype = State.otypes[sobject.otype.id];
      if (otype) {
        return otype.name;
      }
      return "未定义";
    },

    searchList(data) {
      this.searchNameVal = data;
      this.objectList = [];
      if (this.searchNameVal.length > 0) {
        var objList = State.sobjects;
        // var objList = [];
        var arrList = [];
        for (var key in objList) {
          arrList.push(objList[key]);
        }
        if (arrList.length > 0) {
        	this.objectList = arrList.filter(obj => {
        	  return obj.name.includes(this.searchNameVal);
        	});
        } else {
        	this.objectList = [];
        }
        
        if (this.objectList.length > 0) {
          this.objectListShow = true;
          this.nullListShow = false;
          this.earthListShow = true;
        } else {
          this.objectListShow = false;
          this.nullListShow = true;
          this.earthListShow = true;
          this.nullTitle = "在可见地图区域没有结果";
        }
      } else {
        this.objectListShow = false;
        this.nullListShow = false;
        this.earthListShow = false;
      }
    },
    searchObject() {
      //this.objectList = [];
      let user = JSON.parse(sessionStorage.getItem('user'));
      let id = `'${user.id}'`;
      var obj = {
        names: this.searchNameVal,
        geoEdit:true,
        uids:id
      };
      this.loading = true;
      this.objectList = [];
      objectServer.ByNameAndOTName(obj).then(response => {
        console.log(response,123)
        response.list.forEach((item, index) => {
          var findIndex = this.objectList.findIndex(it => it.id == item.id);
          // console.log(item.otype.id,State.otypes[item.otype.id]);
          if(State.otypes[item.otype.id]){
            item.otype = State.otypes[item.otype.id];
          }
          if (findIndex == -1) {
            this.objectList.push(item);
          }
        });
        //this.objectList = response.list;
        if (this.objectList.length > 0) {
          this.objectListShow = true;
          this.nullListShow = false;
          this.earthListShow = false;
        } else {
          this.objectListShow = false;
          this.nullListShow = true;
          this.earthListShow = false;
          this.nullTitle = "全库也没有含有--" + this.searchNameVal + "--的对象";
        }
        this.loading = false;
      });
    },
    openObject(item, index) {

      let context = getEditor().idContext;

      if(item.forms.length==0){
        getEditor().setSObject(item);
        return
      }
      
      let bbox = item.geoBox;
      if(bbox.minx!=0&&bbox.miny!=0){
        let x = (bbox.maxx + bbox.minx) / 2;
        let y = (bbox.maxy + bbox.miny) / 2;
        context.map().centerZoom([x, y], 17);
      }
      // return
      //选中对象高亮
      if (item.forms && item.forms.length>0) {
        item.forms.forEach(form=>{
          if(typeof form.geom!='string'){
            
            if(form.geom){
              if(form.geotype==21){
                form.geom= 'n'+form.geom.id;
              }else if(form.geotype==22||form.geotype==23){
                form.geom='w'+form.geom.id;
              }else if(form.geotype==24){
                form.geom = 'r'+form.geom.id;
              }
            }else{
              this.$set(form,'geom',undefined)
            }
          }
        });
	      try{
          setTimeout(()=>{
            getEditor().setSObject(item);
              if(item.forms.length>0&&item.forms[0].geom){
              getEditor().relationOperate.positionEntity(context,[item.forms[0].geom])
            }
			    },1000)
	      }catch(e){
	      	//TODO handle the exception
	      }

      }
      //context.map().center(d.entity.loc);
    }
  }
};
</script>
<style scoped lang="scss">
.object-list {
  position: absolute;
  right: 0;
  left: 0;
  top: 0;
  bottom: 0;
  background: #f6f6f6;
  .search-header {
    margin: 10px;
    border: 1px solid #dcdfe6;
  }
  .object-content-1 {
    position: relative;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    border-top: 1px solid #ccc;
    overflow-x: hidden;
    overflow-y: auto;
    .search-list {
      width: 100%;
      ul {
        width: 100%;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        li {
          width: 100%;
          height: 40px;
          padding-left: 20px;
          border-bottom: 1px solid #ccc;
          background: #ffffff;
          cursor: pointer;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          display: flex;
          flex-direction: row;
          flex-wrap: nowrap;
          justify-content: flex-start;
          i {
            font-size: 16px;
            color: #999999;
            line-height: 40px;
          }
          img {
            width: 20px;
            height: 20px;
            margin-top: 10px;
            background-position: center center;
            background-repeat: no-repeat;
            border-radius: 5px;
            border: 1px solid #ccc;
          }
          span {
            font-size: 12px;
            color: #7092ff;
            padding-left: 10px;
            line-height: 40px;
          }
        }
        li:hover {
          background: #dedede;
        }
      }
    }
    .earth-null-list {
      width: 100%;
      ul {
        width: 100%;
        display: flex;
        flex-direction: column;
        li {
          width: 100%;
          height: 40px;
          line-height: 40px;
          display: flex;
          flex-direction: row;
          flex-wrap: nowrap;
          justify-content: center;
          border-bottom: 1px solid #ccc;
          background: #ffffff;
          cursor: pointer;
          i {
            font-size: 16px;
            color: #999999;
          }
          .null-span {
            font-size: 12px;
            color: #999999;
          }
          .earth-span {
            font-size: 12px;
            color: #333333;
          }
        }
      }
    }
  }
}
</style>