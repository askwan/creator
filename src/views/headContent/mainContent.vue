<template>
	<div class="head-box">
		<div class="head-m-box cle">
			<head-left-content/>
			<head-right-content/>
		</div>
	</div>
</template>
<script>
	export default {
		data() {
			return {

			}
		},
		components: {
			"head-left-content": () => import("./headLeftContent"),
			"head-right-content": () => import("./headRightContent"),
		}
	};
</script>
<style lang="less" scoped>
	.head-m-box {
		min-width: 1426px;
		background: #fff;
		color: #fff;
		/*box-shadow: 0 0 11px 2px #e3e2e2;*/
	}
</style>