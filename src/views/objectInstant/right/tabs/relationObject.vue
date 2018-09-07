<template>
	<div class="relation-object">
		<div class="relation-head">
			<i class="iconfont icon-shangyibu1" title="返回上一步" @click="backStep"></i>
			<common-search-bar @startSearch="searchList" :searchValue="searchValue"></common-search-bar>
			<!--<span>选择目标对象</span>-->
		</div>
		<div class="h-list-box h-change-wrap relation-style">
			<ul class="h-list list-style" v-if="objectList&&objectList.length">
				<li v-for="(item,index) in objectList" :key="index" v-drag="{data:item,id:'object'}" @click="openRelationInfo(item)">
					<div>
						<span class="r-initial">{{item.name|initialName}}</span>
					</div>
					<div>
						<p class="text-ellipsis" :title="item.name">{{item.name}}&nbsp;(&nbsp;{{getOtypeName(item.otype.id)}}&nbsp;)&nbsp;</p>
						
						<p class="text-ellipsis">
							<span>属性：
								<template v-if="item.attributes&&item.attributes.length">
									<i v-for="(attributes,f) in item.attributes" :key="f">{{attributes.name}}<em v-if="f!=item.attributes.length-1">,</em></i>
								</template>
							</span>
						</p>
					</div>
				</li>
			</ul>
			<no-data-model value="暂无对象" v-else/>
		</div>
	</div>
</template>
<script>
	import psde from "@/psde";
	import ImageManage from "@/psde/ImageManage";
	import * as allotypemgr from "@/script/allOtype";
	import { vm, operate } from "@/script/operate";
	export default {
		data() {
			return {
				ImageManage: ImageManage,
				otypeDetail: {},
				objectList: [],
				copyObjectList: [],
				searchValue: "",
			}
		},
		props: ["objectDetail", "currentRelation"],
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
			this.initData();
		},
		methods: {
			getOtypeName(id){
				var name = "default";
				if (id) {
					var dtype = allotypemgr.getOtypeById(id);
					name = dtype.name;
				}
				return name;
			},
			initData() {
				var val = this.objectDetail;
				if(val.otype && val.otype.id) {
					//根据对象otypeid，获取对象关系列表
					this.otypeDetail = allotypemgr.getOtypeById(val.otype.id);
				}
				var list = [];
				this.objectList = [];
				if(this.otypeDetail.connectors && this.otypeDetail.connectors.connectors && this.otypeDetail.connectors.connectors.length > 0) {
					this.otypeDetail.connectors.connectors.forEach((item, index) => {
						if(item.relation && item.relation.id) {
							if (item.relation.id == this.currentRelation.id) {
								var obj = {
									otNames: item.dType.name,
								};
								psde.objectQuery.ByNameAndOTName.query(obj).then(response => {
									this.objectList = response.list;
									this.copyObjectList = response.list;
								});
							}
						}
					})
				}
			},
			backStep(){
				this.searchList("");
				this.$emit("openRelationList");
			},
			openRelationInfo(data){
				var str = JSON.stringify(this.objectDetail);
				var test = JSON.parse(str);
				var obj = {};
				obj.relation = this.currentRelation;
				obj.srcObject = test;
				obj.tarObject = data;
				var arr = [];
				arr.push(obj);
				vm.$emit(operate.addObjectRalation, {
					sign: "addRelation",
					value: false,
					data: arr
				});
				this.searchList("");
				this.$emit("openRelationInfo");
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
			
		}
	}
</script>
<style scoped lang="less">
	@transition : all .3s linear 0s;
	.relation-object {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: #FFFFFF;
	}
	.relation-head{
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
	.relation-style{
		position: absolute;
	    top: 50px;
	    left: 0;
	    right: 0;
	    bottom: 0;
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
						font-size: 12px;
						overflow: hidden;
						text-overflow:ellipsis;
						white-space: nowrap;
					}
				}
			}
		}
	}
</style>