<template>
	<view class="live-wrap" @tap="navTo(info.room_id)">
		<image mode="aspectFill" class="default-img" :src="info.cover || defaultImg" alt="" />
		<view class="top">
			<view class="wrapper">
				<text class="tag" :class="'bg-' + themeColor.name"><i class="iconfont iconzhibo31"></i>直播中</text>
			</view>
		</view>
		<view class="bottom">
			<view>
				<view class="wrapper">
					<image class="head" :src="headImg" alt="" />
					<span class="info">主播：{{ info.anchor_name || '主播' }}</span>
				</view>
				<view class="title">{{ info.name || '直播间标题直播间标题直播间标题' }}</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	name: 'index',
	props: {
		info: {
			type: [Object, Array],
			default: () => {
				return {};
			}
		}
	},
	data() {
		return {
			defaultImg: this.$mAssetsPath.defaultImg,
			headImg: this.$mAssetsPath.headImg
		};
	},
	methods: {
		navTo(id) {
			// #ifdef MP-WEIXIN
			const url = `plugin-private://wx2b03c6e691cd7370/pages/live-player-plugin?room_id=${[id]}`;
			this.$mRouter.push({ route: url });
			// #endif
			// #ifndef MP-WEIXIN
			this.$mHelper.toast('请从微信小程序进入直播间');
			// #endif
		}
	}
};
</script>

<style scoped lang="scss">
.live-wrap {
	width: calc(100% - 60rpx);
	margin: 0 30rpx $spacing-base;
	border-radius: 20rpx;
	height: 320rpx;
	position: relative;
	background-size: 100% 100%;
	.default-img {
		border-radius: 20rpx;
		width: 100%;
		height: 320rpx;
		opacity: 0.8;
	}
	.top {
		position: absolute;
		top: 0;
		color: #fff;
		.wrapper {
			padding: $spacing-base;
			.tag {
				border-radius: 42rpx;
				padding: $spacing-sm / 2 $spacing-base;
			}
			.iconfont {
				font-size: $font-sm;
				margin-right: $spacing-sm;
			}
		}
	}
	.bottom {
		width: 100%;
		height: 110rpx;
		position: absolute;
		bottom: 0;
		background: linear-gradient(to bottom, rgba(0, 0, 0, 0), rgba(0, 0, 0, .64));
		border-bottom-left-radius: 15rpx;
		border-bottom-right-radius: 15rpx;
		display: flex;
		align-items: center;
		color: #fff;
		.wrapper {
			padding: 0 $spacing-base;
			display: flex;
			align-items: center;
			.head {
				width: $spacing-base * 2;
				height: $spacing-base * 2;
				margin-right: $spacing-base;
			}
			.info {
				font-size: $font-sm + 2rpx;
			}
		}
		.title {
			display: inline-block;
			padding: 0 $spacing-base;
			margin-top: $spacing-sm;
			font-weight: 400;
		}
	}
}
</style>
