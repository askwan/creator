<template>
	<div class="spinner-anim">
		<div class="bounce1"></div>
		<div class="bounce2"></div>
		<div class="bounce3"></div>
	</div>
</template>

<script>
</script>

<style>
	.spinner-anim {
		margin: 100px auto 0;
		width: 150px;
		text-align: center;
		padding: 0 0 100px 0;
	}
	.spinner-anim>div {
		width: 30px;
		height: 30px;
		background-color: #c8c8c8;
		border-radius: 100%;
		display: inline-block;
		-webkit-animation: bouncedelay 1.4s infinite ease-in-out;
		animation: bouncedelay 1.4s infinite ease-in-out;
		/* Prevent first frame from flickering when animation starts */
		-webkit-animation-fill-mode: both;
		animation-fill-mode: both;
	}
	.spinner-anim .bounce2 {
		-webkit-animation-delay: 0.16s;
		animation-delay: 0.16s;
	}
	.spinner-anim .bounce3 {
		-webkit-animation-delay: 0.32s;
		animation-delay: 0.32s;
	}
	@-webkit-keyframes bouncedelay {
		0%,
		80%,
		100% {
			-webkit-transform: scale(0);
		}
		40% {
			-webkit-transform: scale(1);
		}
	}

	@keyframes bouncedelay {
		0%,
		80%,
		100% {
			transform: scale(0);
			-webkit-transform: scale(0);
		}
		40% {
			transform: scale(1);
			-webkit-transform: scale(1);
		}
	}
</style>