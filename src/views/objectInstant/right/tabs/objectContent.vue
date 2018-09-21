<template>
	<div class="object-content">
		<el-collapse v-model="activeNames" @change="handleChange">
			<el-collapse-item title="属性" name="1">
				<div class="tab-box">
					<property-tab :osmData="osmData" :objectDetail="objectDetail" :ifEdit='ifEdit' :diagrams="diagrams" @objectContentEvent="objectContentEvent"></property-tab>
				</div>
			</el-collapse-item>
			<el-collapse-item title="形态" name="3">
				<div class="tab-box">
					<form-tab :objectDetail="objectDetail" :ifEdit='ifEdit'></form-tab>
				</div>
			</el-collapse-item>
			
			
			<el-collapse-item title="关系" name="4">
				<div class="tab-box">
					<!--<relations-tab :osmData="osmData" :objectDetail="objectDetail" :ifEdit='ifEdit' :diagrams="diagrams"></relations-tab>-->
					<relation-info ref="parentListRef" :objectDetail="objectDetail" :ifEdit="ifEdit" @objectContentEvent="objectContentEvent"></relation-info>
				</div>
			</el-collapse-item>
			<el-collapse-item title="行为" name="5">
				<div class="tab-box">
					<behavior-info ref="behaviorInfoRef" :osmData="osmData" :objectDetail="objectDetail" :ifEdit='ifEdit' :diagrams="diagrams" @objectContentEvent="objectContentEvent"></behavior-info>
					<!--<behavior-tab :osmData="osmData" :objectDetail="objectDetail" :ifEdit='ifEdit' :diagrams="diagrams"></behavior-tab>-->
				</div>
			</el-collapse-item>
			<el-collapse-item title="时空" name="2">
				<div class="tab-box">
					<spacetime-tab :osmData="osmData" :objectDetail="objectDetail" :ifEdit='ifEdit' :diagrams="diagrams"></spacetime-tab>
				</div>
			</el-collapse-item>
		</el-collapse>
	</div>
</template>
<script>
	import { vm, operate } from "@/script/operate";
	export default {
		data() {
			return {
				activeNames: ['1', '3'],
				objectDetail:{}
			}
		},
		props: {
			osmData: Object,
			ifEdit: Boolean,
			// objectDetail: Object,
			diagrams: Array
		},
		components: {
			behaviorTab: () => import("./behaviorTab"),
			formTab: () => import("./formTab"),
			propertyTab: () => import("./propertyTab"),
			relationsTab: () => import("./relationsTab"),
			spacetimeTab: () => import("./spacetimeTab"),
			
			relationInfo: () => import("./relationInfo"),
			behaviorInfo: () => import("./behaviorInfo"),
		},
		beforeMount() {
			this.listenEvent();
		},
		mounted() {

		},
		watch:{

		},
		activated() {
			
		},
		methods: {
			listenEvent() {
				vm.$on('currentSobject',obj=>{
					this.objectDetail = obj;
				})
				vm.$on('addObjectBehavior',obj=>{
					this.addObjectBehavior(obj)
				})
			},
			handleChange() {

			},
			//操作中间转换
			objectContentEvent(obj){
				this.$emit("objectContentEvent", obj);
			},
			//添加父对象中间转换
			addObjectParent(obj){
				this.$refs.parentListRef.dropObject(obj);
			},
			//添加行为中间转换
			addObjectBehavior(obj){
				this.$refs.behaviorInfoRef.dropBehavior(obj);
			},

		}
	}
</script>
<style scoped lang="less">
	.tab-box {
		position: relative;
		height: auto;
		width: 96%;
		overflow: hidden;
		margin-left: 2%;
	}
</style>