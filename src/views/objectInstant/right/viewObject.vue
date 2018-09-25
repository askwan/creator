<template>
	<div class="object-list">
		<!--<div class="search-header">
			<common-search-bar @startSearch="searchList" :searchValue="searchNameVal"></common-search-bar>
		</div>-->
		<div class="object-content">
			<div class="search-list" v-if="objectListShow">
				<ul>
					<li v-for="(item,index) in objectList" :key="index" v-if="item.forms && item.forms.length>0 && item.name" :class="{'history-bdcolor': addBgColor==index}" @click="openObject(item,index)">
						<img v-if="item.otype && item.otype.icon" :src="ImageManage.getImgUrl(item.otype.icon)" :onerror="errorOtypeImg" alt="加载失败" />
						<i v-else-if="item.forms[0].type==21" class="iconfont icon-dian"></i>
						<i v-else-if="item.forms[0].type==22" class="iconfont icon-xian1"></i>
						<i v-else-if="item.forms[0].type==23" class="iconfont icon-mian1"></i>
						<i v-else-if="item.forms[0].type==31" class="iconfont icon-yuedengyu"></i>
						<span v-else-if="item.forms[0].type==32">Dem</span>
						<span v-else-if="item.forms[0].type==33">Tin</span>
						<i v-else-if="item.forms[0].type==40" class="iconfont icon-bim"></i>
						<i v-else-if="item.forms[0].type==50" class="iconfont icon-ic_d_rotation"></i>
						<i v-else-if="item.forms[0].type==61" class="iconfont icon-ganlanqiu"></i>
						<i v-else class="iconfont icon-meiyougengduo"></i>
						<span>{{item.name}} (<span>{{getOtypeName(item)}}</span>)</span>
					</li>
				</ul>
			</div>
			<div class="earth-null-list" v-if="nullListShow">
				<ul>
					<li>
						<i class="iconfont icon-weixian"></i>
						<span class="null-span">&nbsp;&nbsp;{{nullTitle}}</span>
					</li>
				</ul>
			</div>
			<div class="earth-null-list" v-if="earthListShow">
				<ul>
					<li>
						<span class="earth-span" @click="searchObject">更多结果</span>
					</li>
				</ul>
			</div>
		</div>
	</div>
</template>
<script>
	import psde from "@/psde";
	import { vm, operate, getContext } from "@/script/operate";
	import EditManage from "@/script/mapbox/EditManage";
	import IdEdit from "@/script/id_edit/IdEdit";
	import ImageManage from "@/psde/ImageManage";
	import { modeSelect } from "@/iD-2.7.1/modules/modes";
	import { getOtypeById } from "@/script/allOtype";
	import * as btMap from "../../../script/mapbox/map";
	import wkt from '@/script/wkt';

	export default {
		data() {
			return {
				ImageManage: ImageManage,
				errorOtypeImg: 'this.src="' + require("../../../../static/images/errorOtype.jpg") + '"',
				searchNameVal: "",
				objectList: [],
				objectListShow: false,
				nullListShow: false,
				earthListShow: false,
				nullTitle: "在可见地图区域没有结果",
				addBgColor: "",
			};
		},
		props: ["viewSearchValue"],
		components: {
			"common-search-bar": () => import("@/components/common/searchBar/searchBar")
		},
		watch: {
			viewSearchValue(val){
				this.searchList(val);
			}
		},
		mounted() {
			this.searchList(this.viewSearchValue);
		},
		methods: {
			//根据id获取otype名称
			getOtypeName(sobject) {
				let otype = getOtypeById(sobject.otype.id);
				if(otype) {
					return otype.name;
				}
				return "未定义";
			},

			searchList(data) {
				this.searchNameVal = data;
				this.objectList = [];
				if(this.searchNameVal.length > 0) {
					var objList = EditManage.getGeometryEdit().sobjectlist;
					var arrList = [];
					for(var key in objList) {
						arrList.push(objList[key]);
					}
					if(arrList.length > 0) {
						this.objectList = arrList.filter(obj => {
							return obj.name.includes(this.searchNameVal);
						});
					} else {
						this.objectList = [];
					}

					if(this.objectList.length > 0) {
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
				var obj = {
					names: this.searchNameVal
				};
				psde.objectQuery.ByNameAndOTName.query(obj).then(response => {
					response.list.forEach((item, index) => {
						var findIndex = this.objectList.findIndex(it => it.id == item.id);
						if(findIndex == -1) {
							this.objectList.push(item);
						}
					});
					//this.objectList = response.list;
					if(this.objectList.length > 0) {
						this.objectListShow = true;
						this.nullListShow = false;
						this.earthListShow = false;
					} else {
						this.objectListShow = false;
						this.nullListShow = true;
						this.earthListShow = false;
						this.nullTitle = "全库也没有含有--" + this.searchNameVal + "--的对象";
					}
				});
			},
			openObject(item, index) {
				this.addBgColor = index;
				if (item.forms && item.forms.length>0) {
					if (item.forms[0].geom) {
						// var obj = wkt(item.forms[0].geom);
						var obj  = JSON.parse(item.forms[0].geom);
						console.log(obj , "wkt")
						if (obj.coordinates && obj.coordinates.length==1 && obj.coordinates[0].length>0) {
							btMap.addMarker(obj.coordinates[0][0]);
						} else if (obj.coordinates && obj.coordinates.length==2) {
							btMap.addMarker(obj.coordinates);
						}
					}
				}
				
			}
		}
	};
</script>
<style scoped lang="less">
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
		.object-content {
			position: relative;
			width: 100%;
			height: calc(~"100vh - 150px");
			display: flex;
			flex-direction: column;
			justify-content: flex-start;
			align-items: flex-start;
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
							padding: 0 5px;
							/*padding-left: 10px;*/
							line-height: 40px;
						}
					}
					/*li:hover {
						background: #dedede;
					}*/
					.history-bdcolor{
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
							cursor: pointer;
						    border: 0;
						    display: inline-block;
						    line-height: 30px;
							margin-top: 5px;
						    width: 120px;
						    height: 30px;
						    color: white;
						    background: #7092FF;
						    text-align: center;
						    border-radius: 2px;
						}
					}
				}
			}
		}
	}
</style>