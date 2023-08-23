<template>
	<view class="rf-swiper-slide">
		<slot name="header" v-if="list.length > 0"></slot>
		<swiper
			class="rf-swiper"
			:indicator-dots="indicatorDots"
			:autoplay="autoplay"
			:interval="interval"
			:duration="duration"
			vertical="true"
		>
			<swiper-item
				class="rf-swiper-item"
				@tap="navTo"
				v-for="(item, index) in list"
				:key="index"
			>
				<view class="text in1line">
					<text class="news-title">{{
						item.title || `${item.member_nickname} 拼团成功`
					}}</text>
				</view>
<!--				<text class="iconfont iconyou"></text>-->
			</swiper-item>
		</swiper>
	</view>
</template>

<script>
export default {
	name: 'rf-swiper-slide',
	data() {
		return {
			indicatorDots: false,
			autoplay: true,
			interval: 2000,
			duration: 500
		};
	},
	props: {
		list: {
			type: Array,
			default() {
				return [];
			}
		}
	},
	methods: {
		navTo() {
			this.$emit('navTo');
		}
	}
};
</script>

<style scoped lang="scss">
.rf-swiper-slide {
	width: calc(100% - 60rpx);
	margin: 0 30rpx;
	display: flex;
	justify-content: space-between;
	align-items: center;
	height: 72rpx;
	padding: 0 $spacing-sm;
	background-color: $color-white;
	.rf-swiper {
		height: 100%;
		flex: 1;
		.rf-swiper-item {
			display: flex;
			justify-content: space-between;
			align-items: center;
			font-size: $font-sm + 2rpx;
			.iconfont {
				color: $font-color-light;
			}
			.news-title {
				margin-left: $spacing-base;
			}
		}
	}
}
</style>
