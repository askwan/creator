<template>
	<div class="object-list">
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
			<div v-show="loading" class="align-center pd-large" style="width:100%;">
				<i class="el-icon-loading font-20 font-gray"></i>
			</div>
			<div class="earth-null-list" v-show="nullListShow&&!loading">
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
	import { vm, operate, getContext } from "@/script/operate";
	import ImageManage from "@/script/editor/psde/ImageManage";
	import * as btMap from "@/script/mapbox";
	import {objectServer} from '@/script/server'
	export default {
		data() {
			return {
				ImageManage: ImageManage,
				errorOtypeImg: 'this.src="' + require("../../../static/images/errorOtype.jpg") + '"',
				searchNameVal: "",
				objectList: [],
				objectListShow: false,
				nullListShow: false,
				earthListShow: false,
				nullTitle: "在可见地图区域没有结果",
				addBgColor: "",
				loading:false
			};
		},
		props: ["viewSearchValue"],
		components: {

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
				return sobject.otype.name || "未定义";
			},

			searchList(data) {
				this.searchNameVal = data;
				this.objectList = [];
				if(this.searchNameVal.length > 0) {
          // var objList = EditManage.getGeometryEdit().sobjectlist;
          var objList = {};
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
				this.$emit('closeLoading');
			},
			searchObject() {
				//this.objectList = [];
				let user = JSON.parse(sessionStorage.getItem('user'));
        let id = `'${user.id}'`;
				var obj = {
					names: this.searchNameVal,
					uids:id
				};
				this.loading = true;
				objectServer.ByNameAndOTName(obj).then(response => {
					this.objectList = [];
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
					this.loading = false;
				});
			},
			openObject(item, index) {
				this.addBgColor = index;
				if(item.geoBox){
					let x = (item.geoBox.maxx+item.geoBox.minx)/2;
					let y = (item.geoBox.maxy+item.geoBox.miny)/2;
					let z = (item.geoBox.maxz+item.geoBox.minz)/2;
					btMap.flyTo(x,y,z);
				}

				
				
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
		.object-content {
			position: relative;
			width: 100%;
			// height: calc(100vh - 150px);
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