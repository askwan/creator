<template>
	<div class="parent-object">
		<div class="parent-head">
			<i class="iconfont icon-shangyibu1" title="返回上一步" @click="backStep"></i>
			<!--<common-search-bar @startSearch="searchList" :searchValue="searchValue"></common-search-bar>-->
			<el-input placeholder="对象名称搜" v-model="searchNameVal" @input="searchInputFn" class="search"></el-input>
			<el-input placeholder="otype名称搜" v-model="searchOtypeVal" @input="searchInputFn" class="search"></el-input>
		</div>
		<div class="h-list-box h-change-wrap parent-style">
			<ul class="h-list list-style" v-if="objectList&&objectList.length">
				<li v-for="(item,index) in objectList" :key="index" v-drag="{data:item,id:'object'}" @click="addObjectParentFn(item)">
					<div>
						<span class="r-initial">{{item.name|initialName}}</span>
					</div>
					<div>
						<p class="text-ellipsis" :title="item.name + '(' + getOtypeName(item.otype.id) + ')'">{{item.name}}&nbsp;(&nbsp;{{getOtypeName(item.otype.id)}}&nbsp;)&nbsp;</p>
						
						<p class="text-ellipsis">
							<span>属性：
								<template v-if="item.attributes&&item.attributes.length">
									<i v-for="(attributes,f) in item.attributes" :key="f">{{attributes.name}}<em v-if="f!=item.attributes.length-1">,</em></i>
								</template>
							</span>
						</p>
						<span class="object-delete" @click.prevent.stop="deleteObject(item,index)">删除</span>
					</div>
				</li>
			</ul>
			<no-data-model value="暂无对象" v-else/>
		</div>
			<!--layout="total, sizes, prev, pager, next, jumper"-->
			<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" small :current-page="page.currentPage" :page-sizes="page.pageSizeArr" :page-size="page.pageSize" layout="total, pager" :total="page.total">
			</el-pagination>
	</div>
</template>
<script>
	import psde from "@/psde";
	import ImageManage from "@/psde/ImageManage";
	import * as allotypemgr from "@/script/allOtype";
	
	//删除多余对象时用到了下面这两个
	import { vm, operate } from "@/script/operate";
	import EditManage from "@/script/mapbox/EditManage";
	import { psdeApi, apiConfig } from '@/psde/config';
	import common from "@/script/common";
	
	export default {
		data() {
			return {
				ImageManage: ImageManage,
				objectList: [],
				copyObjectList: [],
				searchValue: "",
				searchNameVal: "",
				searchOtypeVal: "",
				page: {
					currentPage: 1,
					pageNum: 1,
					pageSize: 20,
					pageSizeArr: [4, 20, 40],
					total: 0
				},
			}
		},
		props: ["objectDetail"],
		components: {
			"no-data-model": () => import("@/components/noDataModel"),
			"common-search-bar": () => import("@/components/common/searchBar/searchBar")
		},
		watch: {
			objectDetail(val) {
				if (val) {
					this.$emit("openRelationInfo");
				}
			}
		},
		filters: {
			initialName(str){
				if(str && str.length) {
					return str.slice(0,2).toUpperCase();
				} else {
					return "null";
				}
			}
		},
		mounted() {
			this.startSearch();
		},
		methods: {
			searchInputFn() {
				clearTimeout(this.times);
				this.times = setTimeout(() => {
					this.startSearch();
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
			startSearch() {
				this.page.pageNum = 1;
				this.page.pageSize = 20;
				this.requestMore();
			},
			requestMore() {
				this.objectList = [];
				var obj = {
					names: this.searchNameVal,
					otNames: this.searchOtypeVal,
					pageNum: this.page.pageNum,
					pageSize: this.page.pageSize
				};

				psde.objectQuery.ByNameAndOTName.query(obj).then(response => {
					this.objectList = response.list;
					this.page.total = response.total*response.pages;
				});
			},
			getOtypeName(id){
				var name = "default";
				if (id) {
					var dtype = allotypemgr.getOtypeById(id);
					if (dtype && dtype.name) {
						name = dtype.name;
					}
				}
				return name;
			},
//			initData() {
//				this.objectList = [];
//				psde.objectQuery.ByNameAndOTName.query({}).then(response => {
//					this.objectList = response.list;
//					this.copyObjectList = response.list;
//				});
//			},
			backStep(){
//				this.searchList("");
				// this.$emit("openRelationInfo");
				vm.$emit(operate.currentComp,{name:'objectContent'})
			},
			addObjectParentFn(item){
//				this.searchList("");
				if (item.name) {
					this.$emit("addObjectParent" , item);
				} else{
					this.$message({
						message: "请选择有名称的对象进行添加！",
						type: "warning",
						showClose: true
					});
				}
			},
			searchList(data) {
				this.searchValue = data;
				this.objectList = [];
				if(this.searchValue.length > 0) {
					if(this.copyObjectList && this.copyObjectList.length > 0) {
						var str = JSON.stringify(this.copyObjectList);
						var arr = JSON.parse(str);
						this.objectList = arr.filter(otype => {
							return( otype.name.includes(this.searchValue) );
						});
					}
				} else {
					var s = JSON.stringify(this.copyObjectList);
					var a = JSON.parse(s);
					this.objectList = a;
				}
			},
			deleteObject(item,index){
				this.$confirm('此操作将永久删除此对象, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning',
				}).then(() => {
					let sobj = new psde.SObject();
					sobj.copyObject(item);
					sobj.deleteObject();
					var arr = [];
					arr.push(sobj);
					psdeApi.post(`/object/saveObject?token=${common.getItem("token")}`, arr).then(res => {
				    	if (res.data.status == 200) {
				    		vm.$emit(operate.deleteTreeNode , item);
				    		EditManage.getGeometryEdit().osmContent.flush();
				    		this.startSearch();
				    		//EditManage.reset();
				    	}
				    })
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消删除'
					});
				});
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
	.parent-head{
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
	    .search{
	    	width: 100px;
	    }
	    .search-one{
	    	height: 39px;
	    	margin-left: 20px;
	    	border-left: 1px solid #f1f1f1;
	    	border-right: 1px solid #f1f1f1;
	    }
	    i{
	    	font-size: 20px;
	    	cursor: pointer;
	    }
	    i:hover{
	    	color: #176de6;
	    }
	    span{
	    	font-size: 14px;
	    }
	}
	.parent-style{
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
					.r-initial{
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
					    line-height: 20px;
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
						width: 130px;
						font-size: 12px;
						overflow: hidden;
						text-overflow:ellipsis;
						white-space: nowrap;
					}
				}
			}
		}
		
		.object-delete{
			position: absolute;
		    top: 40px;
		    right: -15px;
		    height: 20px;
		    width: 40px;
	        color: #67c23a;
		    background: #f0f9eb;
		    border: 1px solid #c2e7b0;
		    border-radius: 5px;
		    display: flex;
		    justify-content: center;
		    align-items: center;
		    z-index: 10;
		}
		.object-delete:hover {
			color: #fff;
		    background: #67c23a;
		    border: 1px solid #67c23a;
		}
		
	}
</style>