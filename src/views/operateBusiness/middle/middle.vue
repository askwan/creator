<template>
	<div class="my-business">
		<div class="main-tit">类视图管理</div>
		<middle-filter-area :sort-data="sortData" :check-text="checkText" @clickSortFn="clickSortFn" @clickCheckFn="clickCheckFn" @clearFileterFn="clearFileterFn" @startSearch="startSearchFn" />
		<div class="business-lists" v-if="!loading">
			<ul v-if="lists.length">
				<li v-for="(item,index) in lists" :key="index">
					<div class="business-detail">
						<div class="bn-img" :style="{'background-image':'url('+imgUrl(item.icon)+')'}" v-if="item.icon"></div>
						<div class="bn-img bn-img-icon" v-else></div>
						<div class="bn-middle-center">
							<a href="javascript:;" class="center-fl" @click="enterObject(item)">
								<p>打开<br/>类视图</p>
							</a>
						</div>
						<div class="bn-content" :class="{'change-content':isBnBottom == index}">
							<div class="bn-name">
								<span>{{item.name}}</span>
							</div>
							<div class="bn-detail">
								<span class="bn-details">{{item.name}}</span>
							</div>
							<div class="bn-open-view" @click="enterObject(item)">
								<span>打开</span>
								<span>类视图</span>
							</div>
						</div>
						<div class="bn-bottom" v-if="isBnBottom != index">
							<div class="bn-user">
								<img v-if="item.user&&item.user.userAvatar" :src="common.getAvatar(item.user.userAvatar)" alt="头像"/>
								<i v-else class="iconfont icon-meiyougengduo"></i>
								<span v-if="item.user&&item.user.userNickName">{{item.user.userNickName}}</span>
								<span v-else>无名作者</span>
								<span v-if="item.mtime">{{common.TimeShift(item.mtime, 1).date}}</span>
								<span v-else>2018-03-30</span>
								<span v-if="item.mtime">{{common.TimeShift(item.mtime, 1).time}}</span>
								<span v-else>10:22:12</span>
							</div>
							<a href="javascript:;" @click="clickMoreFn(index)" class="bn-time">
								<div class="bt-more">...</div>
							</a>
						</div>
					</div>
					<div class="data-more-down" :class="{'active':currentIndex == index}">
						<a href="javascript:;" @click="enterEdit(item)">编辑</a>
						<a href="javascript:;" @click="enterDelete(item)">删除</a>
					</div>
				</li>
			</ul>
			<div class="no-data" v-else>
				<div class="no-data-m">
					<div class="no-data-img"></div>
					暂无类视图
				</div>
			</div>
		</div>
		<!-- <Loading v-else/> -->
	</div>
</template>

<script>
	import psde from "@/psde";
	import common from "@/script/common";
	import ImageManage from "@/psde/ImageManage";
	import { psdeImgUpload , psdeImgShow , userImgShow } from "@/psde/config";
	export default {
		data() {
			return {
				common: common,
				ImageManage: ImageManage,
				diagram: new psde.Diagram(),
				isBnBottom: null,
				allList: [],
				lists: [],
				currentIndex: -1,
				loading: true,
				sortData: {
					sortList: [{
						text: "创建时间",
						id: 0,
						value: "createTime"
					}],
					current: {}, //当前选中的id
					direction: 1 //选中方向1上0下
				},
				isMine: false,
				checkText: "我参与的",
				searchTxt: "",
			};
		},
		components: {
			"middle-filter-area": () => import("./middleFilterArea")
		},
		mounted() {
//			this.init();
		},
		methods: {
			startSearchFn(data) { //搜索
				this.searchTxt = data;
				this.init();
			},
			enterDelete(item) {
				var arr = [];
				arr.push(item.id);
				this.$confirm("此操作将永久删除---" + item.name + "---是否继续?", "提示", {
						confirmButtonText: "确定",
						cancelButtonText: "取消",
						type: "warning"
					})
					.then(() => {
						this.diagram
							.delete({
								ids: arr
							})
							.then((response) => {
								this.init();
								this.$message({
									message: "删除类视图成功",
									type: "success",
									showClose: true
								});
								sessionStorage.clear();
							});
					})
					.catch(() => {
						this.$message({
							type: "info",
							message: "已取消删除",
							showClose: true
						});
					});
			},
			enterEdit(item) {
				this.$brouteurl('createbusiness', {
					id: item.id
				});
			},
			enterObject(item) {
				
				let ids = '';
				item.otypes.forEach((el,index)=>{
					ids+= el.id+(index==item.otypes.length-1?'':',');
				});
				sessionStorage.setItem("instant", item.id);
				this.$router.push({
					path: "/instant"
				})
			},
			clearFileterFn() {
				//清除筛选
				this.isMine = false;
			},
			clickMoreFn(i) {
				this.currentIndex = i;
				window.addEventListener("click", this.closeDrop, true);
			},
			closeDrop() {
				this.currentIndex = -1;
				window.removeEventListener("click", this.closeDrop, true);
			},
			init() {
				this.loading = true;
				var arr = {
					orderType: "ID",
					descOrAsc: true,
					name: this.searchTxt,
					
				};
				this.diagram.names = this.searchTxt;
				this.diagram.orderType = "ID";
				this.diagram.query(this.diagram).then(data => {
					this.lists = data.list;
					this.allList = data.list;
					this.getDataList();
					this.loading = false;
				})
			},
			navSwitchFn(data) {
				this.navActive = data.value;
//				this.init();
			},
			imgUrl(data) {
				if(data) {
					return psdeImgShow.baseURL + data;
				} else {
					return "./static/images/no-business.png"
				}
			},
			clickSortFn(data) {
				this.getDataList();
			},
			clickCheckFn(data) {
				this.isMine = data;
				if (this.isMine) {
					this.lists = [];
					this.allList.forEach((item,index) => {
						if (item.user.uid == common.getInfo("id")) {
							this.lists.push(item);
						}
					})
				} else{
					this.init();
				}
			},
			getDataList() {
				this.loading = true;
				this.lists = common.sortArray(
					this.allList,
					this.sortData.current.value,
					this.sortData.direction
				);
				this.$nextTick(() => {
					this.loading = false;
				});
			},
			clearFileterFn() {
				this.isMine = false;
				this.init();
			}
		}
	};
</script>

<style scoped lang="less">
	@transition : all .2s linear 0s;
	.bn-img-icon {
		background-image: url("../../../../static/images/no-business.png");
	}
	
	/*.business-lists {
		li {
			&:hover {
				.bn-middle-center {
					opacity: 1;
					transform: translateY(0);
					.center-fl {
						transform: scale(1);
					}
					.center-fr {
						transform: scale(1);
					}
				}
				.bn-content {
					top: 176px;
				}
			}
		}
	}*/
	
	.bn-middle-center {
		position: absolute;
		top: 120px;
		left: 150px;
		z-index: 100;
		width: 200px;
		// transform: translateY(20px);
		opacity: 0;
		transition: all .2s ease;
		.center-fl,
		.center-fr {
			display: block;
			width: 60px;
			height: 60px;
			text-align: center;
			color: #fff;
			border-radius: 50%;
			float: left;
			transform: scale(0);
			transition: all .2s ease;
			p {
				padding: 10px 0 0 0;
				line-height: 20px;
			}
		}
		.center-fl {
			float: left;
			background: #176de6;
			box-shadow: rgb(18, 43, 80) 0px 0px 10px 0px;
			&:hover {
				background: #2e7ae5;
			}
		}
		.center-fr {
			float: right;
			background: #e6a417;
			box-shadow: #e6a417 0px 0px 10px 0px;
			&:hover {
				background: #e5ab2e;
			}
		}
	}
	
	.my-business {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		overflow-y: auto;
		overflow-x: hidden;
	}
	
	.business-lists ul {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		justify-content: flex-start;
		align-items: flex-start;
		align-content: flex-start;
		/*text-align: center;*/
		width: 100%;
		height: 100%;
		padding-top: 20px;
	}
	/*这几个是空的，是为了补全li后面的，要不最后一行如果只剩一个就该居中了*/
	
	.business-lists .null-li {
		display: inline-block;
		height: 0px;
		width: 366px;
		box-sizing: border-box;
	}
	
	.business-lists ul li {
		display: inline-block;
		height: 280px;
		width: 366px;
		margin: 0 0 30px 30px;
		box-sizing: border-box;
		border: 1px solid #e8eaed;
		position: relative;
	}
	
	.business-lists ul li:hover {
		box-shadow: 0px 0px 30px #ededed;
	}
	
	.business-lists ul li .business-detail {
		position: absolute;
		width: 100%;
		top: 0;
		bottom: 0;
	}
	
	.business-detail .bn-img {
		background-position: center top;
		background-repeat: no-repeat;
		background-size: 366px 150px;
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 150px;
		.class-img {
			width: 100%;
			height: 100%;
			box-sizing: border-box;
			border: 1px solid #edeff2;
			border-radius: 2px;
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
				font-size: 30px;
				font-weight: 1000;
				opacity: 0.5;
				color: #ffffff;
			}
		}
	}
	/*中间的圆形图标*/
	
	.business-detail .bn-middle-icon {
		position: absolute;
		top: 118px;
		left: 0;
		width: 100%;
		height: 34px;
		opacity: 0;
		transition: @transition;
	}
	
	.business-detail .change-middle-icon {
		transition: @transition;
		opacity: 1;
		z-index: 10;
	}
	
	.business-detail .bn-middle-icon .bn-midline {
		position: absolute;
		top: 30px;
		left: 0;
		height: 4px;
		width: 100%;
		display: flex;
		flex-direction: row;
		justify-content: center;
	}
	
	.business-detail .bn-middle-icon .bn-midline span:nth-of-type(1) {
		height: 100%;
		flex: 1;
		background: #409eff;
	}
	
	.business-detail .bn-middle-icon .bn-midline span:nth-of-type(2) {
		height: 100%;
		flex: 3;
		background: #409eff;
	}
	
	.business-detail .bn-middle-icon .bn-designer {
		position: absolute;
		top: 0;
		left: 30px;
		width: 60px;
		height: 60px;
		border-radius: 50%;
		cursor: pointer;
		background: #67c23a;
		display: flex;
		justify-content: center;
		box-shadow: 0 0 10px #666;
	}
	
	.business-detail .bn-middle-icon .bn-designer i {
		position: absolute;
		top: 12px;
		text-align: center;
		font-size: 16px;
		color: #ffffff;
	}
	
	.business-detail .bn-middle-icon .bn-designer span {
		position: absolute;
		top: 30px;
		text-align: center;
		font-size: 12px;
		color: #ffffff;
	}
	
	.business-detail .bn-middle-icon .bn-creator {
		position: absolute;
		top: 0;
		left: 140px;
		width: 60px;
		height: 60px;
		border-radius: 50%;
		cursor: pointer;
		background: #409eff;
		display: flex;
		justify-content: center;
		align-items: center;
		box-shadow: 0 0 10px #666;
	}
	
	.business-detail .bn-middle-icon .bn-creator i {
		position: absolute;
		top: 12px;
		text-align: center;
		font-size: 16px;
		color: #ffffff;
	}
	
	.business-detail .bn-middle-icon .bn-creator span {
		position: absolute;
		top: 30px;
		text-align: center;
		font-size: 12px;
		color: #ffffff;
	}
	
	.business-detail .bn-middle-icon .bn-builder {
		position: absolute;
		top: 0;
		left: 250px;
		width: 60px;
		height: 60px;
		border-radius: 50%;
		cursor: pointer;
		background: #fa5555;
		display: flex;
		justify-content: center;
		align-items: center;
		box-shadow: 0 0 10px #666;
	}
	
	.business-detail .bn-middle-icon .creator-bgcolor {
		background: #bebebe;
	}
	
	.business-detail .bn-middle-icon .bn-builder i {
		position: absolute;
		top: 12px;
		text-align: center;
		font-size: 16px;
		color: #ffffff;
	}
	
	.business-detail .bn-middle-icon .bn-builder span {
		position: absolute;
		top: 30px;
		text-align: center;
		font-size: 12px;
		color: #ffffff;
	}
	
	.business-detail .bn-content {
		position: absolute;
		top: 150px;
		left: 0;
		width: 100%;
		height: 85px;
		background: #ffffff;
		transition: @transition;
		.bn-open-view{
			position: absolute;
			top: 25px;
			left: 260px;
			width: 80px;
			height: 40px;
			background: #409eff;
			border-radius: 5px;
			box-shadow: 0 0 10px #999999;
			cursor: pointer;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			span{
				font-size: 12px;
				line-height: 16px;
				letter-spacing: 2px;
				color: #FFFFFF;
			}
		}
	}
	
	.business-detail .change-content {
		top: 180px;
		transition: @transition;
	}
	/*业务名称*/
	
	.business-detail .bn-content .bn-name {
		position: absolute;
		left: 15px;
		top: 15px;
		display: flex;
		justify-content: flex-start;
		width: 200px;
	}
	
	.business-detail .bn-content .bn-name span {
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		color: #333333;
		font-size: 16px;
	}
	/*业务详情*/
	
	.business-detail .bn-content .bn-detail {
		position: absolute;
		left: 15px;
		top: 40px;
		display: flex;
		justify-content: flex-start;
		width: 230px;
	}
	
	.business-detail .bn-content .bn-detail span {
		word-break: break-all;
	    
	    overflow:hidden; 
		text-overflow:ellipsis;
		display:-webkit-box; 
		/* autoprefixer: off */
		-webkit-box-orient: vertical;
		/* autoprefixer: on */
		-webkit-line-clamp:2; 
	    
		letter-spacing: 1px;
		color: #999999;
		font-size: 12px;
		line-height: 18px;
		height: 36px;
	}
	
	/*作者时间*/
	
	.business-detail .bn-bottom {
		position: absolute;
		left: 0;
		top: 235px;
		width: 100%;
		height: 43px;
		background: #f5f7fa;
	}
	
	.business-detail .bn-bottom .bn-user {
		position: absolute;
		left: 15px;
		top: 10px;
		display: flex;
		align-items: center;
	}
	
	.business-detail .bn-bottom .bn-user img {
		display: inline-block;
		width: 25px;
		height: 25px;
		border-radius: 20px;
		border: none;
	}
	
	.business-detail .bn-bottom .bn-user i {
		display: inline-block;
		width: 25px;
		height: 25px;
		line-height: 25px;
		border-radius: 20px;
		border: none;
	}
	
	.business-detail .bn-bottom .bn-user span {
		display: inline-block;
		font-size: 12px;
		color: #666666;
		padding-left: 6px;
	}
	
	.business-detail .bn-bottom .bn-time {
		position: absolute;
		right: 0px;
		top: 0px;
		width: 43px;
		height: 43px;
		text-align: center;
		font-size: 15px;
		color: #b3b3b3;
		line-height: 30px;
		z-index: 10;
		.bt-more {
			font-size: 25px;
			color: #969799;
		}
	}
	
	.data-more-down {
		position: absolute;
		top: 270px;
		right: -10px;
		width: 100px;
		background: #fff;
		box-shadow: 0px 0px 10px #ccc;
		z-index: 100;
		display: none;
		&.active {
			display: block;
		}
		a {
			display: block;
			line-height: 40px;
			text-decoration: none;
			color: #333;
			text-align: center;
			&:hover {
				background: #edeff2;
			}
		}
	}
	
	.main-tit {
		font-size: 16px;
		color: #333;
		position: relative;
		line-height: 60px;
		text-indent: 10px;
		margin: 0 0 0 30px;
		&:after {
			content: "";
			display: block;
			position: absolute;
			top: 23px;
			left: 0;
			width: 2px;
			height: 16px;
			background: #999;
		}
	}
	
	@media screen and (max-width: 1920px) {}
</style>