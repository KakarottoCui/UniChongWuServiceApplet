<template>
	<view class="versionUpgrade" v-if="show" @touchmove.stop.prevent="() => {}" @tap="show=false">
		<view v-if="adInfo && adInfo.cover" class="upgrade-wrapper" @tap.stop="indexTopToDetailPage(adInfo)">
			<image mode="aspectFill" class="image" :src="adInfo.cover"></image>
			<view class="close-upgrade" @tap.stop="() => {}">
				<view class="line">
					<view class="close-upgrade-line"></view>
				</view>
				<text class="iconfont iconguanbi1" @tap.stop="close"></text>
			</view>
		</view>
	</view>
</template>
<script>
/* eslint-disable */
export default {
	name: 'rf-popup-add',
	props: {
		adInfo: {
			type: Object,
			default: () => {
				return {}
			}
		}
	},
	data() {
		return {
			show: true
		};
	},
	methods: {
		/* 关闭广告 */
		close() {
			this.show = false;
		},
		// 跳至广告图指定页面
		indexTopToDetailPage(item) {
			this.$mHelper.handleBannerNavTo(item.jump_type, item.jump_link, item.id);
		},
	}
};
</script>
<style lang="scss" scoped>
.versionUpgrade {
	width: 100%;
	height: 100%;
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	z-index: 999999;
	background: rgba(0, 0, 0, 0.4);
	display: flex;
	justify-content: center;
	align-items: center;
}
.upgrade-wrapper {
	margin-top: -100px;
	width: 72vw;
	height: 90vw;
	line-height: 1;
	.image {
		border-radius: 10rpx;
		width: 72vw;
		height: 90vw;
	}
}
.close-upgrade {
	width: 100%;
	text-align: center;
	color: $color-white;
	line-height: 1;
	.line {
		display: flex;
		justify-content: center;
	  text-align: center;
		.close-upgrade-line {
			height: 120rpx;
		}
	}
	.iconfont {
		font-size: $font-lg + 24rpx;
		font-weight: 500;
		color: $color-white;
		display: inline-block;
	}
}
</style>
