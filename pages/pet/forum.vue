<template>
	<view class="wrap">
		<u-swiper :list="items" name="poster" title :current="current" field="content" mode="round" height="400" border-radius="0" :indicator="{ color: '#F00' }" @click="navToIndex" v-if="items.length"></u-swiper>
		
		<!-- <swiper class="swiper-box" :current="current" circular autoplay indicator-dots indicator-color="#FFF" :indicator-active-color="themeColor.color" :style="{ height: '400rpx' }" v-if="items.length">
			<swiper-item v-for="(item, index) in items" :key="index" @tap="navTo(`/pages/pet/forum-view?id=${item.id}`)">
				<u-image :src="item.poster" width="100%" height="400" mode="aspectFill" /> 
			</swiper-item>
		</swiper> -->
		
		<view class="sticky">
			<view class="sticky-tabs">
				<u-tabs-swiper ref="tabs" :list="tabs" :current="tabsCurrent" @change="tabsChange" :is-scroll="false" bar-height="6" bar-width="60" :active-color="themeColor.color"></u-tabs-swiper>
			</view>
			
			<view class="sticky-post">
				<u-button type="default" size="mini" plain shape="circle" :custom-style="{ color: themeColor.color, borderColor: themeColor.color }" @click="navToCheckLogin('/pages/pet/forum-post')">我要发贴</u-button>
			</view>
		</view>
		
		<swiper :current="swiperCurrent" @transition="swiperTransition" @animationfinish="swiperAnimationfinish" :style="{ height: systemInfo.screenHeight + 'px' }">
			<swiper-item v-for="(item, index) in tabs" :key="index">
				<post-mescroll-item ref="mescrollItem" :i="index" :index="index" :tabs="tabs"></post-mescroll-item>
			</swiper-item>
		</swiper>

		<!--页面加载动画-->
		<rfLoading isFullScreen :active="loading"></rfLoading>
		<!-- <rf-back-top :scrollTop="scrollTop"></rf-back-top> -->
		<!-- <rf-back-home></rf-back-home> -->
	</view>
</template>

<script>
import PostMescrollItem from './mescroll-item/post-mescroll-item';
import { postTopList } from '@/api/pet';

export default {
	components: {
		PostMescrollItem
	},
	data() {
		return {
			appName: this.$mSettingConfig.appName,
			path: '/pages/pet/forum',
			title: '互助社区',
			$mData: this.$mData,
			systemInfo: {},
			current: 0,
			items: [],
			tabs: this.$mData.postCates,
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
		
		this.initData();
	},
	onReady() {

	},
	onShareAppMessage(res) {
		return { 
			title: this.title,
			path: this.path
		};
	},
	methods: {
		initData() {
			this.getItems();
		},
		navTo(route) {
			this.$mRouter.push({ route });
		},
		navToIndex(index) {
			let id = this.items[index].id;
			this.navTo(`/pages/pet/forum-view?id=${id}`)
		},
		navToCheckLogin(route) {
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
		async getItems() {
			await this.$http.get(`${postTopList}`).then(async r => {
				this.items = r.data;
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
		.sticky {
			background: #FFF;
			display: flex;
			align-items: center;
			position: sticky;
			top: var(--window-top);
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
				font-size: 28upx;
			}
		}
	}
}
</style>
