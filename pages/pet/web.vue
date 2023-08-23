<template>
	<view class="wrap">
		<web-view :src="url" :webview-styles="webviewStyles"></web-view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			title: '推荐',
			url: '',
			webviewStyles: {
				progress: {
					color: '#FFD10D'
				}
			}
		}
	},
	onLoad(option) {
		this.title = option.title ? option.title : '推荐';
		this.url = option.url;
	},
	onShow() {
		
	},
	onReady() {
		uni.setNavigationBarTitle({
		  title: this.title
		});
	},
	computed: {
		
	},
	methods: {
		
	}
};
</script>

<style lang="scss">
page {
	.wrap {
		
	}
}
</style>
