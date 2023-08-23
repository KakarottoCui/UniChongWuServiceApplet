<template>
	<view class="wrap">
		<view class="sticky">
			<view class="sticky-tabs">
				<u-tabs-swiper ref="tabs" :list="tabs" :current="tabsCurrent" @change="tabsChange" :is-scroll="false" bar-height="6" bar-width="40" active-color="#FFCE0C"></u-tabs-swiper>
			</view>
		</view>

		<swiper :current="swiperCurrent" @transition="swiperTransition" @animationfinish="swiperAnimationfinish" :style="{ height: systemInfo.screenHeight + 'px' }">
			<swiper-item v-for="(item, index) in tabs" :key="index">
				<my-apply-mescroll-item ref="mescrollItem" :i="index" :index="index" :tabs="tabs"></my-apply-mescroll-item>
			</swiper-item>
		</swiper>

		<!--页面加载动画-->
		<rfLoading isFullScreen :active="loading"></rfLoading>
		<!-- <rf-back-top :scrollTop="scrollTop"></rf-back-top> -->
		<!-- <rf-back-home></rf-back-home> -->
	</view>
</template>

<script>
import { petIndex, petList } from '@/api/pet';
import MyApplyMescrollItem from './mescroll-item/my-apply-mescroll-item';

export default {
	components: {
		MyApplyMescrollItem
	},
	data() {
		return {
			systemInfo: {},
			tabs: [
				{
					type: 1,
					name: '领养',
				}
			],
			tabsCurrent: 0,
			swiperCurrent: 0,
			loading: false,
			scrollTop: 0
		};
	},
	onLoad() {
		let _this = this;
		this.systemInfo = uni.getStorageSync('systemInfo');
		
		if (!this.systemInfo) {
			uni.getSystemInfo({
				success(res) {
					_this.systemInfo = res;
					uni.setStorageSync('systemInfo', res);
				}
			});
		}
	},
	methods: {
		tabsChange(index) {
			this.swiperCurrent = index;
		},
		swiperTransition(e) {
			let dx = e.detail.dx;
			this.$refs.tabs.setDx(dx);
		},
		swiperAnimationfinish(e) {
			let tabsCurrent = e.detail.current;
			this.$refs.tabs.setFinishCurrent(tabsCurrent);
			this.swiperCurrent = tabsCurrent;
			this.tabsCurrent = tabsCurrent;
		},
		getMescroll(i) {
			let mescrollItems = this.$refs.mescrollItem;
		
			if (mescrollItems) {
				let item = mescrollItems[i];
				if (item) return item.mescroll;
			}
		
			return null;
		}
	}
};
</script>

<style lang="scss">
page {
	background: #F5F5F5;
	.wrap {
		//background: $color-white;
		.sticky {
			position: sticky;
			top: var(--window-top);
			z-index: 999;
			align-items: center;
			display: none;
		}
	}
}
</style>
