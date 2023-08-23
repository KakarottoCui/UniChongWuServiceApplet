
<template>
	<view>
		<!--#ifdef MP-->
		<live-player
			class="video"
			src="http://live.hugoschool.com/live/stavyan.m3u8?auth_key=1596139012-0-0-83be1ac6023f96a7d18140946df5a399"
			autoplay
			@statechange="statechange"
			@error="error"
			style="width: 300px; height: 225px;"
		/>
		<!--#endif-->
		<!--#ifdef APP-PLUS-->
		<video
			muted
			class="video"
			object-fit="contain"
			src="http://play.hanmozhidao.com/live/chifan.flv?auth_key=1590480758-0-0-c01327f67b2c051f5e33c96743932840"
		></video>
		<!--#endif-->
	</view>
</template>

<script>
export default {
	name: 'live',
	methods: {
		statechange(e) {
		},
		error(e) {
		},
		navTo() {
			let roomId = [4]; // 填写具体的房间号，可通过下面【获取直播房间列表】 API 获取
			let customParams = encodeURIComponent(
				JSON.stringify({ path: 'pages/user/live', pid: 1 })
			); // 开发者在直播间页面路径上携带自定义参数（如示例中的path和pid参数），后续可以在分享卡片链接和跳转至商详页时获取，详见【获取自定义参数】、【直播间到商详页面携带参数】章节（上限600个字符，超过部分会被截断）
			this.$mRouter.push({
				route: `plugin-private://wx2b03c6e691cd7370/pages/live-player-plugin?room_id=${roomId}&custom_params=${customParams}`
			});
		}
	}
};
</script>

<style scoped>
.video {
	width: 100%;
	height: 600rpx;
}
</style>
