<template>
	<view class="wrap">
		<view class="sticky-tabs">
			<u-tabs-swiper ref="tabs" :list="$mData.postCates" :current="tabsCurrent" @change="tabsChange" :is-scroll="false" bar-height="6" bar-width="40" active-color="#FFCE0C"></u-tabs-swiper>
		</view>
		
		<swiper :current="swiperCurrent" @transition="swiperTransition" @animationfinish="swiperAnimationfinish" :style="{ height: systemInfo.screenHeight + 'px' }">
			<swiper-item v-for="(item, index) in $mData.postCates" :key="index">
				<post-mescroll-item ref="mescrollItem" :i="index" :index="index" :tabs="$mData.postCates"></post-mescroll-item>
			</swiper-item>
		</swiper>
		
		<view class="postbar" @tap="navTo('/pages/pet/forum-post')"><u-avatar src="/static/pet/post.png" size="72" /></view>

		<!--页面加载动画-->
		<rfLoading isFullScreen :active="loading"></rfLoading>
		<!-- <rf-back-top :scrollTop="scrollTop"></rf-back-top> -->
		<!-- <rf-back-home></rf-back-home> -->
	</view>
</template>

<script>
import PostMescrollItem from './mescroll-item/post-mescroll-item';

export default {
	components: {
		PostMescrollItem
	},
	data() {
		return {
			title: '救助圈社区',
			path: '/pages/pet/forum',
			$mData: this.$mData,
			systemInfo: {},
			tabsCurrent: 0,
			swiperCurrent: 0,
			config: {},
			share: {},
			loading: false,
			scrollTop: 0,
			loadingType: 'more',
			page: 1,
			currentCate: 0,
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
	onShareAppMessage(res) {
		return { 
			title: this.title,
			path: this.path
		};
	},
	methods: {
		navTo(route) {
			let hasLogin = this.$mStore.getters.hasLogin;
		
			if (hasLogin) {
				this.$mRouter.push({ route });
			} else {
				this.navToLogin();
			}
		},
		navToLogin() {
			uni.setStorageSync('backToPage', JSON.stringify({ route: this.path }));
		
			let _this = this;
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
			// this.getMescroll(index).triggerDownScroll();
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
		}
	}
};
</script>

<style lang="scss">
page {
	background: #F5F5F5;
	.wrap {
		.sticky-tabs {
			position: sticky;
			top: var(--window-top);
			z-index: 999;
		}
		.postbar {
			position: absolute;
			right: 20upx;
			bottom: 120upx;
			z-index: 999;
		}
	}
}
</style>
