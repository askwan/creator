<template>
	<drag-content :childName="childName" :childValue="childValue" :item="item" class="drag-content">
		<div id='styleList' class="style-list field-list">
			<div class="class-template-head cle">
				<div class="tem cle">
					<el-button slot="append" icon="el-icon-search" @click="submitSearch(searchVal)" class="btn"></el-button>
					<el-input placeholder="请输入内容进行搜索" v-model="searchVal" @input="searchInputFn" class="search">
					</el-input>

				</div>
			</div>
			<div class="style-content h-change-wrap">
				<div class="class-bhLists">
					<ul class="h-list" v-if="formList&&formList.length">
						<li v-for="(list,index) in formList" :key="index" v-drag="{data:list,id:'style'}" @mouseenter="bnDetailShow(index)" @mouseleave="bnDetailVanish(index)">
							<div class="class-detail">
								<div class="class-img">
									<i class="iconfont icon-dian2" v-if="list.type == 0"></i>
									<i class="iconfont icon-xian1" v-if="list.type == 1"></i>
									<i class="iconfont icon-mian1" v-if="list.type == 2"></i>
									<i class="iconfont icon-ti1" v-if="list.type == 3"></i>
									<i class="iconfont icon-gezha" v-if="list.type == 4"></i>
									<i class="iconfont icon-wangzhan" v-if="list.type == 5"></i>
									<i class="iconfont icon-foldzhedie" v-if="list.type == 6"></i>
									<i class="iconfont icon-foldzhedie" v-else></i>
								</div>
								<div class="class-content">
									<span :title="list.name">{{list.name}}</span>
									<p class="bn-details" :title="list.des">{{list.des}}</p>
								</div>
								<div class="class-preview" @click="previewFn(list,index)" v-if="false">
									<span :title="list.name">预览</span>
								</div>
								<div class="h-more-box" v-if="isMyself(list.user.uid) && false">
									<div class="more" @click="moreFn(index)">...</div>
									<div class="more-down" :class="{'active':moreIndexShow==index}">
										<a href="javasctipt:;" @click="editFn(list, index)" title="编辑">编辑</a>
										<a href="javasctipt:;" @click="deleteFn(list, index)" title="删除">删除</a>
									</div>
								</div>
								<div class="h-tags-box">
									<el-tooltip effect="dark" :content="'形态：'+getName(list.type)" placement="bottom" v-if="list.type">
										<span class="h-tags h-tags-blue">{{getName(list.type)}}</span>
									</el-tooltip>
									<el-tooltip effect="dark" :content="'类型：'+formstyleType[list.style-1].name" placement="bottom" v-if="formstyleType[list.style-1]">
										<span class="h-tags h-tags-yellow">{{formstyleType[list.style-1].name}}</span>
									</el-tooltip>
								</div>
								<div class="h-user-name">
									<div class="name">
										<img :src="common.getAvatar(list.user.userAvatar)" height="26" alt="头像"><span>{{list.user.userNickName?list.user.userNickName:'未知用户'}}</span>
									</div>
									<div class="time">
										<i v-if="list.mtime">{{common.TimeShift(list.mtime)}}</i>
										<i v-else>2017.12.28</i>
									</div>
								</div>
							</div>
						</li>
						<!--<li class="place" v-for="i in 10" :key="i"></li>-->
					</ul>
					<no-data-model value="暂无样式" v-else/>
				</div>
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
	import { vm, operate } from "@/script/operate";
	import { tabManage } from "@/components/designer/tabmanage";
	import {
		oTypeCtrl,
		formstyleType
	} from "@/views/objectInstant/right/tabs/oTypeCtrl";

	export default {
		data() {
			return {
				common: common,
				item: tabManage.getItemById("styleList"),
				timer: {},
				markInput: false,
				searchVal: "",
				moreIndexShow: -1,
				isMyAll: true,
				formStyle: new psde.FormStyle(),
				formList: [],
				isBnBottom: null,
				checkText: "我的样式",
				getDict: new psde.GetDict(),
				form: [],
				formstyleType: formstyleType,
				page: {
					currentPage: 1,
					pageNum: 1,
					pageSize: 20,
					pageSizeArr: [4, 20, 40],
					total: 0
				},
				times: {}
			};
		},
		props: ["childName", "childValue"],
		mounted() {
			this.myAllMenu();
			let p1 = this.getDict.query({}, "form");
			let p2 = this.getDict.query({}, "formStyleType");
			Promise.all([p1, p2]).then(data => {
				this.form = data[0];
				//this.formstyleType = data[1];
			});
		},
		components: {
			"no-data-model": () =>
				import("@/components/noDataModel")
		},
		watch: {},
		methods: {
			getName(type) {
				var data = "";
				this.form.forEach((item, index) => {
					if(item.value == type) {
						data = item.name;
					}
				});
				return data;
			},
			previewFn(list, index) {
				if(list.style == 1 || list.style == 2 || list.style == 3) {
					vm.$emit("setTabItemAndFloat", {
						tagName: "styleMapbox",
						data: list
					});
				} else if(list.style == 4) {
					vm.$emit("setTabItemAndFloat", {
						tagName: "styleThreeJS",
						data: list
					});
				} else if(list.style == 5) {
					vm.$emit("setTabItemAndFloat", {
						tagName: "styleOther",
						data: list
					});
				} else {
					this.$message({
						message: "请重新编辑该样式,编辑之后就能预览了！",
						type: "info",
						showClose: true
					});
				}
			},
			handleSizeChange(val) {
				var userId = null;
				if(this.isMyAll) {
					userId = common.getInfo("id");
				} else {
					userId = null;
				}
				this.page.pageSize = val;
				this.requestList(userId);
			},
			handleCurrentChange(val) {
				var userId = null;
				if(this.isMyAll) {
					userId = common.getInfo("id");
				} else {
					userId = null;
				}
				this.page.pageNum = val;
				this.requestList(userId);
			},
			searchInputFn() {
				clearTimeout(this.times);
				this.times = setTimeout(() => {
					this.submitSearch(this.searchVal);
				}, 1000);
			},
			submitSearch(val) {
				this.searchVal = val;
				/*clearTimeout(this.timer);
				this.timer = setTimeout(() => {}, 500);*/
				var userId = null;
				if(this.isMyAll) {
					userId = common.getInfo("id");
				} else {
					userId = null;
				}
				this.requestList(userId);
			},
			clickSortFn() {},
			clearFileterFn() {},
			moreFn(i) {
				this.moreIndexShow = i;
				document.addEventListener("click", this.closeMoreDown, true);
			},
			closeMoreDown() {
				this.moreIndexShow = -1;
				document.removeEventListener("click", this.closeMoreDown, true);
			},
			searchBarFn(val) {},
			clickAdd() {
				this.$brouteurl("editStyle");
			},
			myAllMenu(i) {
				this.isMyAll = !this.isMyAll;
				this.submitSearch(this.searchVal);
			},
			requestList(uId) {
				vm.$emit("loading", true);
				this.formList = [];
				let obj = {
					names: this.searchVal,
					pageNum: this.page.pageNum,
					pageSize: this.page.pageSize,
					orderType: "ID",
					descOrAsc: true,
					uids: uId
				};
				this.formStyle.query(obj).then(data => {
					this.formList = data.list;
					this.page.total = data.total;
					vm.$emit("loading", false);
				});
			},
			bnDetailShow(index) {
				this.isBnBottom = index;
			},
			bnDetailVanish(index) {
				this.isBnBottom = null;
			},
			deleteFn(item, index) {
				if(this.isMyself(item.user.uid)) {
					this.$confirm("此操作将永久删除该样式, 是否继续?", "提示", {
							confirmButtonText: "确定",
							cancelButtonText: "取消",
							type: "warning"
						})
						.then(() => {
							this.formStyle
								.delete({
									ids: [item.id]
								})
								.then(() => {
									this.$message({
										message: "删除成功！",
										type: "success",
										showClose: true
									});
									this.formList.splice(index, 1);
								});
						})
						.catch(() => {
							this.$message({
								type: "info",
								message: "已取消删除",
								showClose: true
							});
						});
				} else {
					this.$message({
						message: "不能删除其他人的样式！",
						type: "warning",
						showClose: true
					});
				}
			},
			editFn(item, index) {
				if(this.isMyself(item.user.uid)) {
					this.$brouteurl("editStyle", {
						id: item.id
					});
				} else {
					this.$message({
						message: "不能编辑其他人的样式！",
						type: "warning",
						showClose: true
					});
				}
			}
		}
	};
</script>
<style lang="less" scoped>
	.h-tags-box {
		right: 50px;
		.h-tags {
			max-width: 49%;
		}
	}
	
	.style-list {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: #ffffff;
		overflow: hidden;
	}
	
	.style-list .style-content {
		position: absolute;
		top: 55px;
		left: 0;
		right: 0;
		bottom: 40px;
		background: #ffffff;
		overflow-y: auto;
		overflow-x: hidden;
	}
	
	.class-bhLists ul li {
		position: relative;
		display: inline-block;
		height: 148px;
	}
	
	.class-bhLists ul li.place {
		width: 100%;
		height: 0;
		overflow: hidden;
		border: none;
		margin: 0;
	}
	
	.class-bhLists ul li .class-detail {
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
		background-color: #edeff2;
		box-sizing: border-box;
		border: 1px solid #edeff2;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	
	.class-detail .class-img i {
		font-size: 30px;
		color: #999999;
	}
	
	.class-detail .class-content {
		position: absolute;
		top: 13px;
		left: 72px;
		right: 13px;
		height: 50px;
	}
	
	.class-detail .class-content span {
		font-size: 14px;
		color: #333333;
		vertical-align: middle;
		display: inline-block;
		width: 100%;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		letter-spacing: 1px;
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
		overflow: hidden;
		/* autoprefixer: off */
		-webkit-box-orient: vertical;
		/* autoprefixer: on */
	}
	
	.class-detail .class-preview {
		position: absolute;
		top: 70px;
		right: 5px;
		height: 25px;
		width: 50px;
		color: #67c23a;
		background: #f0f9eb;
		border: 1px solid #c2e7b0;
		border-radius: 5px;
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 10;
	}
	
	.class-detail .class-preview:hover {
		color: #fff;
		background: #67c23a;
		border: 1px solid #67c23a;
	}
</style>