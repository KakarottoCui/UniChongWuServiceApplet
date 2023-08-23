<template>
	<view class="wrap">
		<view class="sticky">
			<view class="sticky-tabs">
				<u-tabs-swiper ref="tabs" :list="tabs" :current="tabsCurrent" @change="tabsChange" :is-scroll="false" bar-height="6" bar-width="40" :active-color="themeColor.color"></u-tabs-swiper>
			</view>
			
			<view class="sticky-post">
				<u-button type="default" size="mini" plain shape="circle" :custom-style="{ borderColor: themeColor.color, color: themeColor.color }"  @click="navTo('/pages/pet/pet-post')">我要发布</u-button>
			</view>
		</view>

		<swiper :current="swiperCurrent" @transition="swiperTransition" @animationfinish="swiperAnimationfinish" :style="{ height: systemInfo.screenHeight + 'px' }">
			<swiper-item v-for="(item, index) in tabs" :key="index">
				<my-pet-mescroll-item ref="mescrollItem" :i="index" :index="index" :tabs="tabs"></my-pet-mescroll-item>
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
import MyPetMescrollItem from './mescroll-item/my-pet-mescroll-item';

export default {
	components: {
		MyPetMescrollItem
	},
	data() {
		return {
			systemInfo: {},
			tabs: [
				{
					key: '',
					name: '全部'
				},
				{ 
					key: 0, 
					name: '进行中'
				},
				{ 
					key: 1,
					name: '已完成'
				}
			],
			tabsCurrent: 0,
			swiperCurrent: 0,
			loading: false,
			scrollTop: 0,
			currentCate: 0,
			customStyle: {}
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
		navTo(route) {
			this.$mRouter.push({ route });
		},
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
		.sticky {
			background: #FFF;
			position: sticky;
			top: var(--window-top);
			display: flex;
			align-items: center;
			z-index: 999;
			padding: 0 30upx;
			.sticky-tabs {
				width: 85%;
			}
			.sticky-post {
				flex-grow: 1;
				height: 80upx;
				line-height: 80upx;
				background: #FFF;
				color: #999;
				font-size: 24upx;
			}
		}
	}
}
</style>
