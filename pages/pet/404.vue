<template>
	<view class="wrap">
		<u-empty mode="search" :text="tips" margin-top="180" icon-color="#999" icon-size="200" color="#333" font-size="28"></u-empty>
		
		<u-gap height="50" />

		<u-button type="warning" shape="circle" :custom-style="customStyle" @click="switchTab(`/pages/pet/list`)">返回领养中心</u-button>
	</view>
</template>

<script>
export default {
	data() {
		return {
			tips: '您中意的毛孩子成功找到家 \n \n 返回领养中心看看其他的小可爱吧~'
		}
	},
	onLoad(option) {

	},
	onShow() {
		
	},
	onReady() {
		
	},
	computed: {
		customStyle() {
			return {
				background: this.themeColor.color,
				color: '#FFF'
			}
		}
	},
	methods: {
		switchTab(route) {
			this.$mRouter.switchTab({ route });
		}
	}
};
</script>

<style lang="scss">
page {
	background: $color-white;
	.wrap {
		padding: 0 30upx;
	}
}
</style>
