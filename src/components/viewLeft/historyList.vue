<template>
	<div class="object-list">
		<div class="object-content">
			<div class="search-list">
				<ul>
					<li v-for="(item,index) in objectList" :key="index" :class="{'history-bdcolor': addBgColor==index}" @click="addBgColorFn(item,index)">
						<img v-if="item.user" :src="common.getAvatar(item.user.userAvatar)" :onerror="errorOtypeImg" alt="加载失败" />
						<!-- <img v-else-if="item.otype && item.otype.icon" :src="ImageManage.getImgUrl(item.otype.icon)" :onerror="errorOtypeImg" alt="加载失败" /> -->
						<!-- <i v-if="item.forms[0].type==21" class="iconfont icon-dian"></i>
						<i v-else-if="item.forms[0].type==22" class="iconfont icon-xian1"></i>
						<i v-else-if="item.forms[0].type==23" class="iconfont icon-mian1"></i>
						<i v-else-if="item.forms[0].type==31" class="iconfont icon-yuedengyu"></i>
						<span v-else-if="item.forms[0].type==32">Dem</span>
						<span v-else-if="item.forms[0].type==33">Tin</span>
						<i v-else-if="item.forms[0].type==40" class="iconfont icon-bim"></i>
						<i v-else-if="item.forms[0].type==50" class="iconfont icon-ic_d_rotation"></i>
						<i v-else-if="item.forms[0].type==61" class="iconfont icon-ganlanqiu"></i>
						<i v-else class="iconfont icon-meiyougengduo"></i> -->
						<div>
							<span v-if="item.user && item.user.userNickName">
						    	{{item.user.userNickName}}
							</span>
							<span v-else>未知用户</span>
							<span>
							    {{item.msg}}
							</span>
						</div>
				    	<span>{{commonTimeShift(item.vtime)}}</span>
					</li>
					<!-- <div v-for="(item,i) in objectList" :key="i">
						{{item.name|filterName}}
					</div> -->
				</ul>
			</div>
			<div class="earth-null-list" v-if="showMore">
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
	import psde from "@/script/editor/psde";
	import { vm, operate } from "@/script/operate";
	import ImageManage from "@/script/editor/psde/ImageManage";
	import common from "@/script/common.js";
	// import '../../../static/images/errorDiagram'
	import * as btMap from "@/script/mapbox";
	
	export default {
		data() {
			return {
				common: common,
				ImageManage: ImageManage,
				errorOtypeImg: 'this.src="' + require("../../../static/images/errorDiagram.jpg") + '"',
				searchNameVal: "",
				objectList: [],
				objectListShow: true,
				earthListShow: true,
				currentTime: new Date().getTime(),
				backCurrentTime: "",
				addBgColor: 1000,
				pageNum:1,
				showMore:true
			};
		},
		props: [],
		components: {
			
		},
		watch: {
			
		},
		mounted() {
			this.objectList = [];
			this.searchListFn(this.currentTime);
		},
		filters:{
			filterName(str){
				return str ? str : 'default'
			}
		},
		methods: {
			addBgColorFn(item,index){
				this.addBgColor = index;
				// if (item.forms && item.forms.length>0) {
				// 	if (item.forms[0].geom) {
				// 		var obj = JSON.parse(item.forms[0].geom);
				// 		if (obj.coordinates && obj.coordinates.length==1 && obj.coordinates[0].length>0) {
				// 			btMap.addMarker(obj.coordinates[0][0]);
				// 		} else if (obj.coordinates && obj.coordinates.length==2) {
				// 			btMap.addMarker(obj.coordinates);
				// 		}
				// 	}
				// };
				console.log(item)
				let posi = this.getCenter(item.bbox);
				btMap.flyTo(posi.x,posi.y,posi.z,17);

			},
			getCenter(bbox){
				let posi ={};
				posi.x = (bbox.minx+bbox.maxx)/2;
				posi.y = (bbox.miny+bbox.maxy)/2;
				posi.z = (bbox.minz+bbox.maxz)/2;
				return posi;
			},
			//根据id获取otype名称
			getOtypeName(sobject) {
				// let otype = getOtypeById(sobject.otype.id);
				// if(otype) {
				// 	return otype.name;
				// }
				return sobject.otype.name || "未定义";
			},
			commonTimeShift(timeStamp) { //时间戳格式转换日期
				if(timeStamp == "") {
					var time = new Date();
				} else {
					var time = new Date(JSON.parse(timeStamp));
				}
				var year = time.getFullYear();
				var month = time.getMonth() + 1;
				var date = time.getDate();
				var hour = time.getHours();
				var minute = time.getMinutes();
				var second = time.getSeconds(); //+ "   " + hour + ":" + minute + ":" + second
				hour < 10 ? hour = "0" + hour : '';
				minute < 10 ? minute = "0" + minute : '';
				second < 10 ? second = "0" + second : '';
				month < 10 ? month = "0" + month : '';
				date < 10 ? date = "0" + date : '';
				return year + "-" + month + "-" + date + " " + hour + ":" + minute + ":" + second;
			},
			searchListFn(data) {
				//当前时间戳
				this.currentTime = data;
				//一周前的时间戳
				this.backCurrentTime = this.currentTime - 604800000;
				var cur = this.commonTimeShift(this.currentTime);
				var bac = this.commonTimeShift(this.backCurrentTime);
				let filter = {
					// beginTime: bac,
					// endTime: cur,
					loadVersion: true,
					loadAttr: true,
					loadNetwork: true,
					loadObjType: true,
					loadForm: true,
					loadAction: true,
					geoEdit:false,
					pageNum:this.pageNum,
					pageSize:20,
					descOrAsc:false,
					orderType:'VID'
					}
					
				psde.versionServer.query({pageSize:20,descOrAsc:true,orderType:'VID',pageNum:this.pageNum,}).then(res=>{
					console.log(res,7777777)
					if(res.list==0) this.showMore = false
					this.objectList = this.objectList.concat(res.list);
				})

				// psde.objectQuery.query(filter).then(res => {
				// 	if(res.list==0) this.showMore = false
				// 	this.objectList = this.objectList.concat(res.list);
				// })
			},
			searchObject(){
				this.pageNum++;
				this.searchListFn(this.backCurrentTime);
			},
			searchList(){
				console.log(123)
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
		overflow-y: auto;
		.search-header {
			margin: 10px;
			border: 1px solid #dcdfe6;
		}
		.object-content {
			position: relative;
			width: 100%;
			// height: calc(~"100vh - 150px");
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
						height: auto;
						padding-left: 20px;
						border-bottom: 1px solid #ccc;
						background: #ffffff;
						cursor: pointer;
						display: flex;
						flex-direction: row;
						flex-wrap: wrap;
						justify-content: flex-start;
						align-items: center;
						i {
							font-size: 16px;
							color: #999999;
							line-height: 30px;
						}
						img {
							display: inline-block;
							width: 20px;
							height: 20px;
							background-position: center center;
							background-repeat: no-repeat;
							border-radius: 5px;
							border: 1px solid #ccc;
						}
						div{
							width: 90%;
						    display: flex;
						    flex-direction: row;
						    justify-content: space-between;
						}
						span {
							display: inline-block;
							font-size: 12px;
							color: #7092ff;
							padding: 0 5px;
							line-height: 30px;
						}
						span:nth-of-type(1){
							color: #666;
						}
						> span:nth-of-type(1){
							padding-left: 25px;
							color: #666;
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