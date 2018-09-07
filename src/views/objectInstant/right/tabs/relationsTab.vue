<template>
	<div class='relations-root' id="relations-root" v-if="objectDetail.id">
		<!--<transition name="public">
			<relation-info v-show="isRelationInfo" ref="parentListRef" :ifEdit="ifEdit" :objectDetail="objectDetail" @openRelationList="openRelationList" @openParentObject="openParentObject"></relation-info>
		</transition>-->
		<transition name="public">
			<relation-list v-show="isRelationList" ref="relationListRef" :objectDetail="objectDetail" @openRelationInfo="openRelationInfo" @openRelationObject="openRelationObject"></relation-list>
		</transition>
		<transition name="public">
			<relation-object v-show="isRelationObject" ref="relationObjectRef" :objectDetail="objectDetail" :currentRelation="currentRelation" @openRelationInfo="openRelationInfo" @openRelationList="openRelationList"></relation-object>
		</transition>
		<transition name="public">
			<relation-parent-object v-show="isParentObject" ref="parentObjectRef" :objectDetail="objectDetail" @openRelationInfo="openRelationInfo" @addObjectParent="addObjectParent"></relation-parent-object>
		</transition>
	</div>
</template>
<script>
	import relationInfo from "./relationInfo";
	import relationList from "./relationList";
	import relationObject from "./relationObject";
	import relationParentObject from "./relationParentObject";
	export default {
		data() {
			return {
				isRelationInfo: true,
				isRelationList: false,
				isRelationObject: false,
				isParentObject: false,
				currentRelation: {}
			}
		},
		props: ["ifEdit", "objectDetail"],
		components: {
			relationInfo,
			relationList,
			relationObject,
			relationParentObject
		},
		watch: {
			/*objectDetail(val) {
				this.openRelationInfo();
			}*/
		},
		activated() {
			this.openRelationInfo();
		},
		mounted(){
			
		},
		methods:{
			openRelationInfo(){
				this.$emit("enterDetail", false);
				/*this.isRelationInfo = true;
				this.isRelationList = false;
				this.isRelationObject = false;
				this.isParentObject = false;*/
			},
			openRelationList(){
				this.isRelationInfo = false;
				this.isRelationList = true;
				this.isRelationObject = false;
				this.isParentObject = false;
			},
			openRelationObject(data){
				this.isRelationInfo = false;
				this.isRelationList = false;
				this.isRelationObject = true;
				this.isParentObject = false;
				this.currentRelation = data;
				setTimeout(() => {
					this.$refs.relationObjectRef.initData();
				},10)
			},
			openParentObject(){
				this.isRelationInfo = false;
				this.isRelationList = false;
				this.isRelationObject = false;
				this.isParentObject = true;
				setTimeout(() => {
					this.$refs.parentObjectRef.startSearch();
				},10)
			},
			addObjectParent(item){
				var obj = {
					data: {
						data: item,
						id: 'object'
					}
				}
				this.$emit("addObjectParent", obj);
			}
			
		}
	}
</script>
<style lang='less' scoped>
	.relations-root {
		/*position: absolute;
		left: 0;
		top: 0;
		right: 0;
		bottom: 0;*/
		background: #f5f7fa;
		overflow: hidden;
	}
</style>