<template>
	<div class='object-list'>
		<div class="tree">
			<div class="tree-box">

				<el-tree 
					class="filter-tree" 
					ref="tree" 
					node-key="id" 
					:highlight-current="true" 
					:default-expanded-keys="[0]"
					@node-click="handleNodeClick" 
					:expand-on-click-node="false" 
					@node-contextmenu="rightEvent"
					:show-checkbox="true" 
					:props="defaultProps" 
					lazy 
					:load="loadNode" 
					:render-content="renderContent">
					<!--  @node-contextmenu="rightEvent" --右键   :default-expand-all="true" --展开所有节点   :expand-on-click-node="false"--点击节点不自动展开,点击三角才展开 -->
				</el-tree>
				
				<div class="right-menus">
					<div class="right-menu" v-if="showContextMenu" :style="{left:left+'px',top:top+'px'}">
						<ul>
							<!-- <li @click="editOsmMenu">编辑OSM</li> -->
							<li @click="editInConstruction">编辑结构</li>
							<li v-show="currentItem.geoBox" @click="location">定位坐标</li>
							<li @click="reloadTreeNode">重新加载</li>
							<li v-show="currentItem.geoBox" @click="deleteTreeNode">删除节点</li>
						</ul>
					</div>
				</div>
				
			</div>
		</div>
		<div class="list">
			<div class="object-tree-search">
				<el-input placeholder="请输入内容" class="object-tree-input" v-model="searchField" @input="filterNode">
					<template slot="append">
						<i class="iconfont icon-sousuo" @click="filterNode"></i>
					</template>
				</el-input>
			</div>
			<o-otype :lists="treeDataList" :pageTotal="pageTotal" @handleCurrentChange="handleCurrentChange"></o-otype>
		</div>
	</div>
</template>
<script>
	import psde from "@/psde";
	import objectService from '@/request/object.service.js';
	import { vm, operate } from "@/script/operate.js";
	import { psdeApi, apiConfig } from '@/psde/config';
	import dmes from '@/script/common';
	import EditManage from '@/script/mapbox/EditManage';

	export default {
		data() {
			return {
				searchField: "",
				defaultProps: {
					label: "name",
					children: "children",
					isLeaf: "leaf"
				},
				treeData: [{
					id: 20,
					type: 1,
					name: "地球",
					children: [{}]
				}],
				treeDataList: [],
				pageTotal: 0,
				pageNumber: 1,
				parentsId: "",
				pageSizeNum: 20,
				times: {},
				
				//右键菜单
			    left: 0,
			    top: 0,
			    currentItem: {},
			    currentNode: {},
			    eventScrollTop: 0,
			    showContextMenu: false,
					ifEdit:false
			};
		},
		props: {},
		components: {
			"o-otype": () =>
				import("./oOtype")
		},
		watch: {
			// ifEdit(bool){
			// 	vm.$emit(operate.ifEdit,{status:bool,data:this.currentItem});
			// }
		},
		computed: {},
		mounted() {
			vm.$on(operate.closeRightMenu, data => {
				this.closeRightMenuFn(data.value);
			});
			vm.$on(operate.ifEdit,obj=>{
				this.ifEdit = obj.status;
			})
		},
		methods: {
			deleteTreeNode(){
				var item = this.currentItem;
				let sobj = new psde.SObject();
				sobj.copyObject(item);
				sobj.deleteObject();
				var arr = [];
				arr.push(sobj);
				psdeApi.post(`/object/saveObject?token=${dmes.getItem("token")}`, arr).then(res => {
			    	if (res.data.status == 200) {
			    		this.currentNode.remove();
			    		EditManage.reset();
			    		vm.$emit(operate.deleteTreeNode , this.currentItem);
			    	}
			    })
			},
			reloadTreeNode(){
				var obj = {
					parents: this.currentItem.id,
					pageNum: 1,
					pageSize: this.pageSizeNum,
					orderType: "ID",
					descOrAsc: true
				}
				objectService.queryObject(obj).then((response) => {
					response.list.forEach((item, index) => {
						if(!item.name) {
							item.name = "Name is default";
						}
						item.leaf = false;
					});
					this.currentItem.children = response.list;
				})
			},
			editOsmMenu(){
				this.closeRightMenuFn(false);
				this.ifEdit = true;
			},
			editInConstruction(){
				this.closeRightMenuFn(false);
				console.log(this.currentItem , "编辑内部结构");
			},
			closeRightMenuFn(val){
				this.showContextMenu = val;
			},
			rightEvent(event, data, node, component) {
				// console.log(event, data, node, component)
				event.stopPropagation();
				event.preventDefault();
				if(this.ifEdit) return;
				this.currentItem = data;
				this.currentNode = node;
				this.closeRightMenuFn(true);
				if(event.clientX + 120 > 300) {
					this.left = event.clientX - 120 + 8;
				} else {
					this.left = event.clientX + 8;
				}
				this.top = event.clientY - 84 + 30;

				if(this.eventScrollTop > 0) {
					this.top = event.clientY - 84 + 30 - 120;
					if(this.top < 0) {
						this.top = event.clientY - 84 + 30;
					}
				}
			},
			handleCurrentChange(page) {
				this.pageNumber = page;
				var obj = {
					names: this.searchField,
					pageNum: this.pageNumber,
				}
				this.requestList(obj);
			},
			filterNode() {
				var obj = {
					names: this.searchField,
					pageNum: 1,
				}
				clearTimeout(this.times);
				this.times = setTimeout(() => {
					this.requestList(obj);
				}, 1000)
			},
			handleNodeClick(data, node, eve) {
				this.closeRightMenuFn(false);
				this.parentsId = data.id;
				var obj = {
					pageNum: this.pageNumber,
				}
				this.requestList(obj);
			},
			requestList(obj) {
				obj.parents = this.parentsId;
				obj.pageSize = this.pageSizeNum;
				obj.loadObjType = true;
				obj.orderType = "ID";
				obj.descOrAsc = true;
				objectService.queryObject(obj).then((response) => {
					response.list.forEach((item, index) => {
						if(!item.name) {
							item.name = "Name is default";
						}
					});
					this.treeDataList = response.list;
					this.pageTotal = response.total;
				})
			},
			loadNode(node, resolve, data) {
				if(node.level === 0) {
					return resolve(this.treeData);
				}
				var obj = {
					parents: node.data.id,
					pageNum: 1,
					pageSize: this.pageSizeNum,
					orderType: "ID",
					descOrAsc: true
				}
				objectService.queryObject(obj).then((response) => {
					response.list.forEach((item, index) => {
						if(!item.name) {
							item.name = "Name is default";
						}
						item.leaf = false;
					});
					resolve(response.list);
				});


			},
			renderContent(h, {
				node,
				data,
				store
			}) {
				return(
					<span class="custom-tree-node">
			            <span>
			            	{node.label}
			            </span>
			            <span>
			            </span>
        			</span>);
			},
			location(){
				if(this.currentItem.geoBox){
					let geoBox = this.currentItem.geoBox;
					let loc = [(geoBox.maxx+geoBox.minx)/2,(geoBox.maxy+geoBox.miny)/2]
					vm.$emit(operate.flyTo,{
						position:loc,
						zoom:14
					})
				}
			}

			//	    <i class="iconfont icon-diqiu2" on-click={ () => this.handleNodeClick(node, data) }></i>

		}
	};
</script>
<style lang='less' scoped>
.object-list {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  overflow: hidden;
  .tree {
    height: 50%;
    width: 100%;
    background-color: #ffffff;
    overflow-y: auto;
    .tree-box {
      height: calc(~"100% - 1px");
      overflow: auto;
      .filter-tree {
        border: none;
      }

      /*右键菜单*/
      .right-menus .right-menu {
        position: absolute;
        display: block;
        width: 100px;
        box-shadow: 0 0 5px #dfe0e1;
        background: #ffffff;
        z-index: 10;
      }
      .right-menus .right-menu ul li {
        list-style: none;
        position: relative;
        width: 100px;
        height: 40px;
        font-size: 14px;
        text-align: center;
        line-height: 40px;
        cursor: pointer;
        color: #333333;
      }
      .right-menus .right-menu ul li:hover {
        background: #edeff2;
      }
    }
    .custom-tree-node {
      width: 100%;
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 14px;
      padding-right: 8px;
    }
  }
  .list {
    position: relative;
    height: 50%;
    width: 100%;
    overflow-y: auto;
    overflow-x: hidden;
    .object-tree-input {
      position: absolute;
      top: 5px;
      left: 15px;
      height: 30px;
      width: 270px;
      z-index: 1;
      .icon-sousuo {
        cursor: pointer;
      }
    }
  }
}
</style>