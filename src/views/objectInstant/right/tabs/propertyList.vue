<template>
	<div class="filter-list">
		<transition name="public">
			<property-otype v-show="propertyOtypeList" :diagrams="diagrams" @enterDetail='enterDetail' :entityObj="entityObj"></property-otype>
		</transition>
		<transition name="public">
			<property-object v-show="propertyObjectList" :entityObj="entityObj" :clearContent="clearContent"></property-object>
		</transition>
		<transition name="public">
			<relation-operate ref="relationOperateRef" v-show="relationOperateShow" :ifEdit="ifEdit" :objectDetail="objectDetail"></relation-operate>
		</transition>
	</div>
</template>
<script>
	import propertyOtype from "./propertyOtype";
	import propertyObject from "./propertyObject";
	import relationOperate from "./relationOperate";
	import { vm, operate } from "@/script/operate";
	export default {
		data() {
			return {
				propertyOtypeList: false,
				propertyObjectList: false,
				entityObj: {},
				clearContent: false,
				relationOperateShow: false, //复合多边形
			}
		},
		props: ["diagrams", "objectDetail", "component", "ifEdit"],
		components: {
			propertyOtype,
			propertyObject,
			relationOperate
		},
		mounted() {
			this.listenEvent();
		},
		methods: {
			//进入到复合多边形列表
			relationOperateFn(bool){
				this.propertyOtypeList = bool;
				this.propertyObjectList = bool;
				this.relationOperateShow = !bool;
				setTimeout(() => {
					this.$refs.relationOperateRef.initData();
				},10)
			},
			listenEvent() {
				this.propertyOtypeList = false;
				this.propertyObjectList = true;
				this.relationOperateShow = false;
				
				vm.$on(operate.getOsmType, obj => {
					if(obj.entityId) {
						this.propertyOtypeList = true;
						this.propertyObjectList = false;
						this.relationOperateShow = false;
					} else {
						this.propertyOtypeList = false;
						this.propertyObjectList = true;
						this.relationOperateShow = false;
					}
					this.entityObj = obj;
				});
			},
			enterDetail(bool) {
				this.$emit("enterDetail", bool);
			},

		},
		watch: {
			propertyOtypeList(val){
				this.clearContent = !this.clearContent;
			},
			objectDetail(val) {
				if(val.id && val.id != "" && val.id > 0) {
					this.clearContent = !this.clearContent;
				}
			},
			component(val){
				if(val == "relationOperate"){
					this.relationOperateFn(false);
				} else {
					this.propertyOtypeList = true;
					this.propertyObjectList = false;
					this.relationOperateShow = false;
				}
			}
		}

	}
</script>
<style scoped lang="less">
	.filter-list {
		position: absolute;
		left: 0px;
		top: 0;
		width: 100%;
		height: 100%;
		overflow: hidden;
	}
</style>