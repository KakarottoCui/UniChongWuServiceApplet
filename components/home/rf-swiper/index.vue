<template>
	<view class="swiper" v-if="carouselList.length > 0">
		<view class="swiper-box" v-if="type !== 'type2'">
			<swiper :style="{ height: height * 2 + 'rpx',margin: `${tbPadding * 2}rpx ${padding * 2}rpx`,
		width: `calc(100% - ${padding * 4}rpx)` }" @change="handleDotChange" :autoplay="autoplay" :interval="parseInt(interval, 10) * 1000">
				<swiper-item
					v-for="(item, index) in carouselList"
					@tap.stop="customNavTo(item)"
					:key="index"
				>
					<view class="swiper-item " :data-image="item.cover" :style="{ height: height * 2 + 'rpx' }">
						<image :style="{ height: height * 2 + 'rpx', borderRadius: `${radius * 2}rpx` }" :src="item.cover || productImg" mode="aspectFill"></image>
					</view>
				</swiper-item>
			</swiper>
			<view class="rf-swiper-dot">
				<text v-if="type === 'block'">
					<text class="dot1" :class="current === index ? 'active1' : ''" v-for="(item, index) in carouselList.length" :key="item"></text>
				</text>
				<text v-if="type === 'circle'">
					<text class="dot2" :class="current === index ? 'active2' : ''" v-for="(item, index) in carouselList.length" :key="index"></text>
				</text>
				<text v-if="type === 'hollow'">
					<text class="dot3" :class="current === index ? 'active2' : ''" v-for="(item, index) in carouselList.length" :key="index"></text>
				</text>
			</view>
		</view>
		<!--轮播图2-->
		<view class="swiper-card-box">
			<swiper class="rf-card-swiper" :style="{ height: height * 2 + 'rpx',margin: `${tbPadding * 2}rpx ${padding * 2}rpx`,
		width: `calc(100% - ${padding * 4}rpx)` }" v-if="type === 'type2'" :circular="true" @change="handleDotChange" :autoplay="autoplay" :interval="parseInt(interval, 10) * 1000">
				<swiper-item
					v-for="(item, index) in carouselList"
					@tap.stop="customNavTo(item)"
					:key="index">
					<view class="swiper-item">
						<rf-image :style="{ height: height * 2 + 'rpx', borderRadius: `${radius * 2}rpx` }" :src="item.cover || productImg" mode="aspectFill"></rf-image>
					</view>
				</swiper-item>
			</swiper>
			<view class="rf-swiper-dot">
				<text class="dot1" :class="current === index ? 'active1' : ''" v-for="(item, index) in carouselList.length" :key="item"></text>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	name: 'index',
	data() {
		return {
			productImg: this.$mAssetsPath.defaultImg,
			current: 0 // 轮播图index
		};
	},
	props: {
		carouselList: {
			type: Array,
			default () {
				return [];
			}
		},
		autoplay: {
			type: Boolean,
			default: true
		},
		interval: {
			type: Number,
			default: 3
		},
		height: {
			type: Number,
			default: 300
		},
		padding: {
			type: Number,
			default: 24
		},
		tbPadding: {
			type: Number,
			default: 0
		},
		radius: {
			type: Number,
			default: 10
		},
		type: {
			type: String,
			default: 'block'
		}
	},
	methods: {
		// 监听轮播图切换
		handleDotChange(e) {
			this.current = e.detail.current;
		},
		// 自定义装修通用跳转封装
		customNavTo(item) {
			this.$mHelper.handleBasicNavTo(item.type, item.link_url, item.id, item.urlType, item.innerLink, item.externalLink);
		}
	}
};
</script>

<style scoped lang="scss">
/*轮播图*/
.swiper {
	width: 100%;
	.swiper-box {
		width: 100%;
		position: relative;
		z-index: 1;
		swiper {
			height: 100%;
			swiper-item {
				width: 100%;
				height: 100%;
				image {
					width: 100%;
					height: 100%;
					background-color: $page-color-light;
				}
			}
		}
	}
	.rf-card-swiper {
		width: 100%;
		position: relative;
		swiper-item {
			width: calc(100% - 140rpx) !important;
			left: 70rpx;
			box-sizing: border-box;
			.swiper-item {
				width: 100%;
				display: block;
				border-radius: 10rpx;
				transform: scale(0.9);
				transition: all 0.2s ease-in 0s;
				overflow: hidden;
				image {
					width: 100%;
				}
			}
			swiper-item.cur .swiper-item {
				transform: none;
				transition: all 0.2s ease-in 0s;
			}
		}
	}
	.rf-swiper-dot {
		position: absolute;
		bottom: 0;
		left: 50%;
		transform: translate(-50%, 0);
		.dot1 {
			display: inline-block;
			width: $spacing-sm;
			height: $spacing-sm;
			border-radius: $spacing-sm;
			background-color: $color-white;
			margin-right: $spacing-sm;
			opacity: .8;
		}
		.active1 {
			opacity: 1;
			width: $spacing-sm * 3;
		}
		.dot2 {
			display: inline-block;
			border-radius: 50%;
			margin-right: $spacing-sm * 1.2;
			width: $spacing-sm * 1.2;
			height: $spacing-sm * 1.2;
			opacity: .8;
			border: 1rpx solid $color-white;
		}
		.dot3 {
			display: inline-block;
			border-radius: 50%;
			margin-right: $spacing-sm * 1.2;
			width: $spacing-sm * 1.2;
			height: $spacing-sm * 1.2;
			background-color: $color-white;
			opacity: .38;
		}
		.active2 {
			opacity: 1;
			width: $spacing-sm * 1.2;
			height: $spacing-sm * 1.2;
			background-color: $color-white;
		}
	}
	.swiper-card-box {
		width: 100%;
		overflow: hidden;
		border-radius: 20rpx;
		position: relative;
		z-index: 1;
		.swiper-item {
			width: 100%;
		}
		.rf-swiper-dot {
			bottom: 20rpx;
		}
	}
}
</style>
