<template>
	<div class="parent-object" v-if="objectDetail.id">
		<div class="parent-head">
			<i class="iconfont icon-shangyibu1" title="返回上一步" @click="backStep"></i>
			<common-search-bar @startSearch="searchInputFn" :searchValue="searchValue"></common-search-bar>
		</div>
		<div class="h-list-box h-change-wrap parent-style" v-if="!loading">
			<ul class="h-list list-style" v-if="bhLists&&bhLists.length">
				<li v-for="(item,index) in bhLists" :key="index" v-drag="{data:item,id:'behavior'}" @click="addObjectBehaviorFn(item)">
					<div>
						<span class="r-initial">{{item.name|initialName}}</span>
					</div>
					<div>
                        <p class="text-ellipsis" :title="item.name">{{item.name}}</p>

						<p class="text-ellipsis" v-if="typeof item.mdef =='object'">
							<el-tooltip effect="dark" :content="filtersName(item.mdef.type)" placement="bottom" v-if="item.mdef.type">
									<span class="h-tags h-tags-blue">{{filtersName(item.mdef.type)}}</span>
							</el-tooltip>
							<el-tooltip effect="dark" :content="'所属类别：'+item.mdef.name" placement="bottom" v-if="item.mdef.name">
									<span class="h-tags h-tags-yellow">{{item.mdef.name}}</span>
							</el-tooltip>
						</p>
					</div>
				</li>
			</ul>
			<no-data-model value="暂无行为" v-else/>
		</div>
		<div v-else>
            <loading></loading>
        </div>
		<!--layout="total, sizes, prev, pager, next, jumper"-->
		<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" small :current-page="page.currentPage" :page-sizes="page.pageSizeArr" :page-size="page.pageSize" layout="total, prev, pager, next" :total="page.total">
		</el-pagination>
	</div>
</template>
<script>
	import psde from "@/psde";
	import ImageManage from "@/psde/ImageManage";
	import { vm, operate } from "@/script/operate";
	export default {
		data() {
			return {
				ImageManage: ImageManage,
				model: new psde.Model(),
				getDict: new psde.GetDict(),
				modelDef: new psde.ModelDef(),
				bhLists: [],
				options: [],
				searchValue: "",
				loading: false,
				times: {},
				page: {
					currentPage: 1,
					pageNum: 1,
					pageSize: 20,
					pageSizeArr: [4, 20, 40],
					total: 0
				},
				// objectDetail:{}
			}
		},
		props: ["objectDetail"],
		components: {
			"no-data-model": () =>
				import("@/components/noDataModel"),
			"common-search-bar": () =>
				import("@/components/common/searchBar/searchBar")
		},
		watch: {
			'objectDetail.id'(val) {
				if(val) {
					this.backStep();
				}
			}
		},
		filters: {
			initialName(str) {
				if(str && str.length) {
					return str.slice(0, 2).toUpperCase();
				} else {
					return "null";
				}
			}
		},
		mounted() {
			// this.getDict.query(null, "modelDefType").then(response => {
			// 	this.options = response;
			// });
			// this.startSearch();
			// this.listenEvent();
			// console.log('behavior')
		},
		activated() {
			this.listenEvent();
			this.getDict.query(null, "modelDefType").then(response => {
				this.options = response;
			});
			this.startSearch();
		},
		methods: {
			listenEvent(){
				
			},
			filtersName(num) {
				for(let item of this.options) {
					if(item.value == num) {
						return item.name;
					}
				}
			},
			searchInputFn(value) {
				clearTimeout(this.times);
				this.times = setTimeout(() => {
					this.startSearch(value);
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
				this.page.pageNum = 1;
				this.page.pageSize = 20;
				this.requestMore(value);
			},
			requestMore(value) {
				this.bhLists = [];
				this.loading = true;
				this.model
					.query({
						names: value,
						pageNum: this.page.pageNum,
						pageSize: this.page.pageSize,
						orderType: "ID",
						descOrAsc: true
					})
					.then(response => {
						this.loading = false;
						this.bhLists = response.list;
						this.page.total = response.total;
					});
			},
			backStep() { 
				// if (this.searchValue=="") {
				// 	this.searchValue = null;
				// } else {
				// 	this.searchValue = "";
				// }
				// this.$emit("openBehaviorInfo");
				vm.$emit(operate.currentComp,{name:'objectContent'});
			},
			addObjectBehaviorFn(item) {
				if (this.searchValue=="") {
					this.searchValue = null;
				} else {
					this.searchValue = "";
				}
				var obj = {
					data: {
						data: item,
						id: 'behavior'
					}
				}
				vm.$emit(operate.currentComp,{name:'objectContent'});
				setTimeout(() => {
					vm.$emit("addObjectBehavior", obj);

				}, 10);
			},

		}
	}
</script>
<style scoped lang="less">
	@transition : all .3s linear 0s;
	.parent-object {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: #FFFFFF;
	}
	
	.parent-head {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		height: 40px;
		border-bottom: 1px solid #f1f1f1;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		line-height: 40px;
		color: #666666;
		padding: 0 30px;
		.search-one {
			height: 39px;
			margin-left: 20px;
			border-left: 1px solid #f1f1f1;
			border-right: 1px solid #f1f1f1;
		}
		i {
			font-size: 20px;
			cursor: pointer;
		}
		i:hover {
			color: #176de6;
		}
		span {
			font-size: 14px;
		}
	}
	
	.parent-style {
		position: absolute;
		top: 50px;
		left: 0;
		right: 0;
		bottom: 40px;
		.list-style {
			margin: 0;
			padding-left: 10px;
			li {
				position: relative;
				height: 80px;
				width: 250px;
				vertical-align: middle;
				>div:nth-of-type(1) {
					margin: 13px;
					width: 50px;
					height: 50px;
					border-radius: 5px;
					background-color: #b2d2ff;
					color: #fff;
					font-size: 14px;
					line-height: 50px;
					text-align: center;
					.r-initial {
						font-size: 14px;
						color: #FFFFFF;
					}
				}
				>div:nth-of-type(2) {
					position: absolute;
					left: 72px;
					right: 20px;
					top: 10px;
					height: 50px;
					p:nth-of-type(1) {
						color: #333;
						font-size: 14px;
						overflow: hidden;
						font-size: 14px;
						line-height: 30px;
						width: 170px;
						letter-spacing: 1px;
						word-break: break-all;
						text-overflow: ellipsis;
						display: -webkit-box;
						-webkit-line-clamp: 2;
						/* autoprefixer: off */
						-webkit-box-orient: vertical;
						/* autoprefixer: on */
					}
					p:nth-of-type(2),
					p:nth-of-type(3) {
						color: #999;
						font-size: 12px;
						overflow: hidden;
						text-overflow: ellipsis;
						white-space: nowrap;
					}
					.h-tags{
						max-width: 50%;
					}
				}
			}
		}
	}
</style>