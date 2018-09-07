<template>
	<drag-content :childName="childName" :childValue="childValue" :item="item" class="drag-content">
		<div id='objectManager' class="style-list field-list">
			对象管理
		</div>
	</drag-content>
</template>

<script>
	import psde from "@/psde";
	import common from "@/script/common";
	import ImageManage from "@/psde/ImageManage";
	import { vm, operate } from "@/script/operate";
	import { tabManage } from "@/components/designer/tabmanage";

	export default {
		data() {
			return {
				common: common,
				item: tabManage.getItemById("objectManager")
			};
		},
		props: ["childName", "childValue"],
		mounted() {},
		components: {},
		watch: {},
		methods: {}
	};
</script>
<style lang="less" scoped>
	.style-list {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: #ffffff;
		overflow: hidden;
	}
</style>