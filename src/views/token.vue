<template>
	<div class="cont-box"></div>
</template>
<script>
	import common from '@/script/common.js'
	export default {
		data() {
			return {}
		},
		created: function() {
			var _token = this.$route.query.token;
			var _url = this.$route.query.url;
			var _url = this.$route.query.url;
			// console.log(_token)
			if(_token) { //判断地址栏是否有token
				common.setItem("token", _token);
				common.getNewUser("get", "/account/authorize", {}, res => {
					common.setUserInfo(res);
					this.$router.push({
						path: "/"
					})

				})
			} else { //地址栏没有token 退出重新登陆
				common.exitUser.exitAddress();
			}
		}
	}
</script>