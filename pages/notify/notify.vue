<template>
	<view class="notify">
		<view class="notify-list" v-if="notifyList.length > 0">
			<view class="read" :class="'text-'+themeColor.name">
				<text @tap="handleClearAll">全部清空</text>
				<text @tap="handleReadAll">全部已读</text>
			</view>
			<view v-for="(item, index) in notifyList" :key="index" class="row" @tap="navTo(item)">
				<!-- 删除按钮 -->
				<view class="menu" :class="'bg-'+themeColor.name" @tap.stop="handleClearNotify(item.notify_id)">
					<i class="iconfont iconiconfontshanchu1"></i>
				</view>
				<!-- 商品 -->
				<view
					class="carrier"
					:class="[
						theIndex === index ? 'open' : oldIndex === index ? 'close' : ''
					]"
					@touchstart="touchStart(index, $event)"
					@touchmove="touchMove(index, $event)"
					@touchend="touchEnd(index, $event)"
				>
					<view class="notify-wrapper">
						<view class="title in1line">{{item.notify.title}}</view>
						<view class="content in2line">{{item.notify.content}}</view>
						<view class="time">{{item.created_at | time}}</view>
						<uni-tag
								class="type"
								type="error"
								:text="item.type | notifyTypeFilter"
								size="small"
								/>
						<view class="un-read" :class="'bg-'+themeColor.name" v-if="item.is_read.toString() === '0'"></view>
					</view>
				</view>
				<rf-load-more v-if="notifyList.length > 0" :status="loadingType" />
			</view>
		</view>
		<!--消息为空-->
		<rf-empty
			:bottom="bottom"
			info="您还没有推送消息"
			v-if="notifyList.length === 0 && !loading && hasLogin"
		></rf-empty>
		<view v-if="!hasLogin" class="notify-empty">
			<text class="iconfont iconxiaoxi-" :class="'text-'+themeColor.name"></text>
			<view class="empty-tips">
				暂未登录
				<view class="navigator" :class="'text-'+themeColor.name" @tap="navToLogin('/pages/public/logintype')"
					>登录/注册 ></view
				>
			</view>
		</view>
		<!--页面加载动画-->
		<rfLoading isFullScreen :active="loading"></rfLoading>
	</view>
</template>
<script>
import { notifyIndex, notifyRead, notifyReadAll, notifyClear, notifyClearAll, notifyUnRreadCount } from '@/api/userInfo';
import rfLoadMore from '@/components/rf-load-more/rf-load-more';
import moment from '@/common/moment';
import mConstDataConfig from '@/config/constData.config';
import { mapMutations } from 'vuex';
export default {
  components: { rfLoadMore },
	data() {
		return {
			loading: true,
			notifyList: [],
			logo: this.$mSettingConfig.appLogo,
			loadingType: 'more',
			page: 1,
			hasLogin: false,
			list: [
				{ title: '评论', logo: this.$mSettingConfig.appLogo },
				{ title: '粉丝', logo: this.$mSettingConfig.appLogo },
				{ title: '点赞', logo: this.$mSettingConfig.appLogo }
			],
			// 控制滑动效果
			theIndex: null,
			oldIndex: null
		};
	},
	filters: {
		time(val) {
			return moment(val * 1000).format('YYYY-MM-DD HH:mm:ss');
		},
		notifyTypeFilter(val) {
			return mConstDataConfig.notifyTypeList[val].content;
		}
	},
	onShow() {
		this.initData();
	},
	computed: {
		bottom () {
			let bottom = 0;
			/*  #ifdef H5  */
      bottom = 90;
			/*  #endif */
			return bottom;
		}
	},
	// 下拉刷新
	onPullDownRefresh() {
		this.page = 1;
		this.notifyList = [];
		this.loading = true;
		this.getNotifyList('refresh');
	},
	// 加载更多
	onReachBottom() {
  if (this.loadingType === 'nomore') return;
		this.page++;
		this.getNotifyList();
	},
	methods: {
		...mapMutations(['setNotifyNum']),
		// 控制左滑删除效果
		touchStart(index, event) {
			// 多点触控不触发
			if (event.touches.length > 1) {
				this.isStop = true;
				return;
			}
			this.oldIndex = this.theIndex;
			this.theIndex = null;
			// 初始坐标
			this.initXY = [event.touches[0].pageX, event.touches[0].pageY];
		},
		touchMove(index, event) {
			// 多点触控不触发
			if (event.touches.length > 1) {
				this.isStop = true;
				return;
			}
			let moveX = event.touches[0].pageX - this.initXY[0];
			let moveY = event.touches[0].pageY - this.initXY[1];

			if (this.isStop || Math.abs(moveX) < 5) {
				return;
			}
			if (Math.abs(moveY) > Math.abs(moveX)) {
				// 竖向滑动-不触发左滑效果
				this.isStop = true;
				return;
			}

			if (moveX < 0) {
				this.theIndex = index;
				this.isStop = true;
			} else if (moveX > 0) {
				if (this.theIndex != null && this.oldIndex === this.theIndex) {
					this.oldIndex = index;
					this.theIndex = null;
					this.isStop = true;
					setTimeout(() => {
						this.oldIndex = null;
					}, 150);
				}
			}
		},
		touchEnd(index, $event) {
			// 结束禁止触发效果
			this.isStop = false;
		},
		// 数据初始化
		initData() {
			this.hasLogin = this.$mStore.getters.hasLogin;
			this.page = 1;
			this.loading = true;
			this.notifyList = [];
			this.oldIndex = null;
			this.theIndex = null;
			this.getNotifyList();
		},
		// 获取消息列表
		async getNotifyList(type) {
			if (!this.hasLogin) {
        this.loading = false;
				if (type === 'refresh') uni.stopPullDownRefresh();
				uni.removeTabBarBadge({ index: this.$mConstDataConfig.notifyIndex });
        return;
			}
			await this.$http.get(notifyIndex, {
				page: this.page
			}).then(r => {
				this.loading = false;
				if (type === 'refresh') {
					uni.stopPullDownRefresh();
				}
				this.initNotifyNum();
				this.loadingType = r.data.length < 10 ? 'nomore' : 'more';
				this.notifyList = [...this.notifyList, ...r.data];
			}).catch(() => {
				if (type === 'refresh') {
					uni.stopPullDownRefresh();
				}
				this.loading = false;
			});
		},
		// 已读消息
		async handleReadAll () {
      await this.$http.get(notifyReadAll).then(() => {
				/*  #ifdef APP-PLUS  */
				this.clearBadge();
				/*  #endif  */
				this.page = 1;
				this.loading = true;
				this.notifyList = [];
				this.getNotifyList();
				this.oldIndex = null;
				this.theIndex = null;
      });
    },
		// 设置未读消息个数
		async initNotifyNum () {
      await this.$http.get(notifyUnRreadCount).then(r => {
        this.setNotifyNum(r.data.count);
				/*  #ifdef APP-PLUS  */
        if (parseInt(r.data.count, 10) === 0) {
					this.clearBadge();
				}
				/*  #endif  */
      });
    },
		async handleClearAll () {
      uni.showModal({
				content: '是否清空消息列表，清空将无法找回',
				success: async e => {
					if (e.confirm) {
            await this.$http.post(notifyClearAll).then(() => {
							/*  #ifdef APP-PLUS  */
							this.clearBadge();
							/*  #endif  */
							this.page = 1;
							this.loading = true;
							this.notifyList = [];
							this.getNotifyList();
							this.oldIndex = null;
							this.theIndex = null;
            });
					}
				}
			});
    },
    clearBadge() {
			// eslint-disable-next-line
			if (plus.os.name.toLowerCase() == 'ios') {
				// 导入ios UIApplication
        // eslint-disable-next-line
				const UIApplication = plus.ios.import("UIApplication");
				// const app = UIApplication.sharedApplication();
				// 获取应用图标的数量
				// var oldNum = app.applicationIconBadgeNumber();
				// var newNum = oldNum - 1;
				// 设置应用图标的数量
        // eslint-disable-next-line
				plus.runtime.setBadgeNumber(0);
				// 导入个推原生类
        // eslint-disable-next-line
				const GeTuiSdk = plus.ios.importClass('GeTuiSdk');
				GeTuiSdk.setBadge(0);
			}
		},
		// 通用跳转
		async navTo(item) {
			let route;
			const id = item.notify.target_id;
			const type = item.notify.target_type;
			const notifyId = item.notify.id;
			if (item.is_read.toString() === '0') {
        await this.$http.get(notifyRead, { notify_id: notifyId }).then(() => {
          this.page = 1;
          this.loading = true;
          this.notifyList = [];
          this.getNotifyList();
        });
			}
			switch (type) {
				case 'order_consign':
				case 'order_stock_up_accomplish':
				case 'order_return_money':
				case 'order_bargain_accomplish':
					route = `/pages/order/detail?id=${id}`;
					break;
				case 'order_wholesale_open':
				case 'order_wholesale_join':
				case 'order_wholesale_accomplish':
				case 'order_wholesale_close':
					route = `/pages/marketing/wholesale/detail?id=${id}`;
					break;
				case 'order_bargain_friend_join':
					route = `/pages/marketing/bargain/detail?id=${id}`;
					break;
				case 'order_bargain_close':
					route = `/pages/marketing/bargain/detail?id=${id}`;
					break;
				case 'coupon_give':
					route = '/pages/user/coupon/coupon?type=1';
					break;
				case 'order_virtual':
				case 'order_virtual_card':
				case 'order_virtual_network_disk':
				case 'order_virtual_download':
          route = `/pages/user/virtual/detail?id=${id}`;
					break;
				default:
					route = '/pages/index/index';
					break;
			}
			if (route) this.$mRouter.push({ route });
		},
		// 通用跳转
		navToLogin(route) {
			this.$mRouter.push({ route });
		},
		async handleClearNotify(id) {
      await this.$http.post(notifyClear, { notify_ids: id }).then(() => {
        this.page = 1;
        this.loading = true;
        this.notifyList = [];
        this.getNotifyList();
				this.oldIndex = null;
				this.theIndex = null;
      });
    }
	}
};
</script>
<style lang="scss">
page {
	background-color: $page-color-base;
}
.notify {
	.header {
		width: 100%;
		padding-left: $font-lg;
		height: 100rpx;
		display: flex;
		align-items: center;
		position: fixed;
		top: 0;
		z-index: 10;
		background-color: #fff;
		/*  #ifdef  APP-PLUS  */
		top: var(--status-bar-height);
		/*  #endif  */
		.title {
			font-size: 36rpx;
		}
	}
	.place {
		background-color: #ffffff;
		height: 100rpx;
		/*  #ifdef  APP-PLUS  */
		margin-top: var(--status-bar-height);
		/*  #endif  */
	}
	.notify-list {
		.read {
			text-align: right;
			margin-right: $spacing-base;
			margin-top: $spacing-base;
			margin-bottom: $spacing-sm;
			text {
				margin-left: $spacing-base;
			}
		}
		.row {
			width: calc(94%);
			height: calc(22vw + 40rpx);
			margin: 0 auto $spacing-base;
			border-radius: 15rpx;
			box-shadow: 0rpx 5rpx 20rpx rgba(0, 0, 0, 0.1);
			display: flex;
			align-items: center;
			position: relative;
			overflow: hidden;
			z-index: 4;
			border: 0;
			.menu {
				.iconfont {
					color: #fff;
					font-size: 60rpx;
				}
				position: absolute;
				width: 29%;
				height: 100%;
				right: 0;
				display: flex;
				justify-content: center;
				align-items: center;
				color: #fff;
				z-index: 2;
			}
			.carrier {
				@keyframes showMenu {
					0% {
						transform: translateX(0);
					}
					100% {
						transform: translateX(-30%);
					}
				}
				@keyframes closeMenu {
					0% {
						transform: translateX(-30%);
					}
					100% {
						transform: translateX(0);
					}
				}
				&.open {
					animation: showMenu 0.25s linear both;
				}
				&.close {
					animation: closeMenu 0.15s linear both;
				}
				background-color: #fff;
				position: absolute;
				width: 100%;
				padding: 0 0;
				height: 100%;
				z-index: 3;
				display: flex;
				align-items: center;
			}
		}
		.notify-wrapper {
			background-color: $color-white;
			width: 100%;
			padding: $spacing-base $spacing-lg $spacing-base 80rpx;
			margin: $spacing-base 0 0;
			border-radius: 15rpx;
			position: relative;
			.title {
				font-size: $font-lg;
				color: $font-color-dark;
				font-weight: 500;
				margin: 0 0 $spacing-sm;
			}
			.content {
				font-size: $font-sm;
				color: $font-color-base;
				height: 75rpx;
				line-height: 36rpx;
			}
			.time {
				font-size: $font-base;
				color: $font-color-light;
			}
			.type {
				position: absolute;
				top: 26rpx;
				left: -10rpx;
				border: none;
				font-size: $font-sm;
				opacity: 0.8;
			}
			.un-read {
				display: inline-block;
				width: 12rpx;
				height: 12rpx;
				border-radius: 50%;
				position: absolute;
				top: 32rpx;
				right: 30rpx;
			}
		}
	}
	.notify-empty {
		position: fixed;
		left: 0;
		top: 0;
		width: 100%;
		height: 100vh;
		padding-bottom: 100rpx;
		display: flex;
		justify-content: center;
		flex-direction: column;
		align-items: center;
		background: #fff;
		.iconfont {
			font-size: $font-lg + 100rpx;
		}

		.empty-tips {
			display: flex;
			font-size: $font-sm + 2rpx;
			color: $font-color-disabled;

			.navigator {
				margin-left: 16rpx;
			}
		}
	}
}
</style>
