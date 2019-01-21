<template>
	<div class="object-list">
		<div class="object-content">
			<div class="search-list">
				<ul>
					<li v-for="(item,index) in objectList" :key="index" :class="{'history-bdcolor': addBgColor==index}" @click="addBgColorFn(item,index)">
						<img v-if="item.user" :src="common.getAvatar(item.user.userAvatar)" :onerror="errorOtypeImg" alt="加载失败" />
						<div>
							<span v-if="item.user && item.user.userNickName">
						    	{{item.user.userNickName}}
							</span>
							<span v-else>未知用户</span>
							<span>
							    {{item.note}}
							</span>
						</div>
						<div style="width:100%;">
				    	<span>{{item.ctime}}</span>
							<span class="float-right" style="color:#666;">{{item.sdomain|getSdomain}}</span>
						</div>
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
	import { vm, operate } from "@/script/operate";
	import common from "@/script/common.js";
	// import '../../../static/images/errorDiagram'
	import * as btMap from "@/script/mapbox";
	import {versionServer,objectServer} from '@/script/server';
	import {State} from '@/script/editor/utils/store.js'
	
	export default {
		data() {
			return {
				common: common,
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
		props: ['isShow'],
		components: {
			
		},
		watch: {
			isShow(bool){
				if(bool){
					this.objectList = [];
					this.searchListFn(this.currentTime);
				}
			}
		},
		mounted() {
			this.objectList = [];
			this.searchListFn(this.currentTime);
		},
		filters:{
			filterName(str){
				return str ? str : 'default'
			},
			getSdomain(id){
				let result = State.sdomainList.find(el=>el.id==id)
				return result ? result.name : 'default';
			}
		},
		methods: {
			addBgColorFn(item,index){
				this.addBgColor = index;
				let posi = this.getCenter(item.geoBox);
				btMap.flyTo(posi.x,posi.y,posi.z,17);
				// btMap.fitBbox(item.geoBox);

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
				let domain = sessionStorage.getItem('sdomain');
				if(!domain) return alert('请先选择时空域')
				domain = JSON.parse(domain);
				objectServer.getChangesets({pageNum:this.pageNum,pageSize:20,descOrAsc:true,orderType:'TIME',sdomains:domain.id}).then(res=>{
					if(res.list.length==0) this.showMore = false;
					this.pageNum = res.pageNum;
					this.objectList = this.objectList.concat(res.list);
				})
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