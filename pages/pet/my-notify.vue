<template>
	<view class="wrap">
		<view class="sticky">
			<view class="sticky-tabs">
				<u-tabs-swiper ref="tabs" :list="tabs" :current="tabsCurrent" @change="tabsChange" :is-scroll="false" bar-height="6" bar-width="40" :active-color="themeColor.color"></u-tabs-swiper>
			</view>
		</view>
		
		<swiper :current="swiperCurrent" @transition="swiperTransition" @animationfinish="swiperAnimationfinish" :style="{ height: systemInfo.screenHeight + 'px' }">
			<swiper-item v-for="(item, index) in tabs" :key="index">
				<my-notify-mescroll-item ref="mescrollItem" :i="index" :index="index" :tabs="tabs"></my-notify-mescroll-item>
			</swiper-item>
		</swiper>
		
		<!--页面加载动画-->
		<rfLoading isFullScreen :active="loading"></rfLoading>
		<!-- <rf-back-top :scrollTop="scrollTop"></rf-back-top> -->
		<!-- <rf-back-home></rf-back-home> -->
	</view>
</template>

<script>
import MyNotifyMescrollItem from './mescroll-item/my-notify-mescroll-item';
import { mapMutations } from 'vuex';

export default {
	components: { MyNotifyMescrollItem },
	data() {
		return {
			path: '/pages/pet/my-notify',
			systemInfo: {},
			hasLogin: false,
			tabs: [
				{
					key: '',
					name: '全部'
				},
				{ 
					key: 0, 
					name: '未读'
				},
				{ 
					key: 1,
					name: '已读'
				}
			],
			tabsCurrent: 0,
			swiperCurrent: 0,
			loading: false,
			scrollTop: 0,
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
	onShow() {
		this.checkLogin();
	},
	mounted() {
		
	},
	methods: {
		checkLogin() {
			let hasLogin = this.$mStore.getters.hasLogin;
		
			if (!hasLogin) this.navToLogin();
		},
		navToLogin() {
			let _this = this;
			uni.setStorageSync('backToPage', JSON.stringify({ route: this.path }));
					
			uni.showModal({
				content: '未登录，是否跳转登录页面？',
				success(res) {
					if (res.confirm) {
						_this.$mRouter.push({ route: `/pages/public/logintype` });
					}
				}
			});
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
			position: sticky;
			top: var(--window-top);
			z-index: 999;
			align-items: center;
		}
	}
}
</style>
