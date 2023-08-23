<template>
	<view class="integral">
		<view class="header" :class="'bg-' + themeColor.name">
			<view class="title">当前积分</view>
			<text class="num">
				{{
					(userInfo && userInfo.account && userInfo.account.user_integral) ||
						'0'
				}}
			</text>
			<view class="line" />
			<view class="nav">
				<view class="item">
					<text class="num">
						{{
							(userInfo &&
								userInfo.account &&
								userInfo.account.accumulate_integral) ||
								'0'
						}}
					</text>
					<text class="title">累计积分</text>
				</view>
				<view class="item">
					<text class="num">
						{{
							-(
								userInfo &&
								userInfo.account &&
								userInfo.account.consume_integral
							) || '0'
						}}
					</text>
					<text class="title">累计消费</text>
				</view>
				<view class="item">
					<text class="num">
						{{
							(userInfo &&
								userInfo.frozen_integral &&
								userInfo.account.frozen_integral) ||
								'0'
						}}
					</text>
					<text class="title">冻结积分</text>
				</view>
			</view>
			<view class="tab">
				<view
					class="item"
					:class="current === index ? `text-${themeColor.name} on` : ''"
					v-for="(item, index) in navList"
					:key="index"
					@tap="nav(index)"
				>
					{{ item.name }}
				</view>
			</view>
		</view>
		<view class="wrapper">
			<view class="list1" :hidden="current !== 0">
				<view class="tip acea-row row-middle">
					<span class="iconfont icon-shuoming"></span
					>提示：积分可提升荣誉等级或兑换指定商品
				</view>
				<view
					class="list b-b"
					v-for="(item, index) in integralList"
					:key="index"
				>
					<view class="wrapper">
						<view class="address-box">
							{{ item.remark }}
						</view>
						<view class="u-box">
							{{ item.created_at | time }}
						</view>
					</view>
					<text
						class="change-num"
						:class="
							parseFloat(item.num) >= 0 ? 'change-num-add' : 'change-num-reduce'
						"
						>{{ item.num | numFilter }}</text
					>
				</view>
				<rf-load-more class="load-more" :status="loadingType"></rf-load-more>
			</view>
			<view class="list2" :hidden="current !== 1">
				<view class="item">
					<text class="name">发布领养/帖子/提问/评论等可获得积分奖励</text>
					<view class="earn" @tap="toCategory">赚积分</view>
				</view>
			</view>
		</view>
		<!--加载动画-->
		<rfLoading isFullScreen :active="loading"></rfLoading>
	</view>
</template>
<script>
/**
 * @des 积分中心
 *
 * @author stav stavyan@qq.com
 * @date 2020-01-10 15:24
 * @copyright 2019
 */
import { creditsLogList } from '@/api/userInfo';
import rfLoadMore from '@/components/rf-load-more/rf-load-more.vue';

import moment from '@/common/moment';
export default {
	name: 'Integral',
	components: {
		rfLoadMore
	},
	data() {
		return {
			navList: [{ name: '分值明细' }, { name: '分值提升' }],
			current: 0,
			integralList: [],
			loadingType: 'more',
			page: 1,
			userInfo: {},
			loading: true
		};
	},
	onLoad() {
		this.initData();
	},
	filters: {
		time(val) {
			return moment(val * 1000).format('YYYY-MM-DD HH:mm:ss');
		},
		numFilter(val) {
			return val >= 0 ? `+${val.toString()}` : val;
		}
	},
	// 加载更多
	onReachBottom() {
  if (this.loadingType === 'nomore') return;
		this.page++;
		this.getIntegralListList();
	},
	methods: {
		toCategory() {
			this.$mRouter.reLaunch({ route: '/pages/index/index' });
		},
		nav(index) {
			this.loading = true;
			this.current = index;
			this.page = 1;
			this.integralList.length = 0;
			this.getIntegralListList();
		},
		initData() {
			this.userInfo = uni.getStorageSync('userInfo') || undefined;
			this.getIntegralListList();
		},
		async getIntegralListList() {
			await this.$http
				.get(`${creditsLogList}`, {
					page: this.page
				})
				.then(r => {
					this.loading = false;
					this.loadingType = r.data.length < 10 ? 'nomore' : 'more';
					this.integralList = [...this.integralList, ...r.data];
				})
				.catch(() => {
					this.loading = false;
				});
		}
	}
};
</script>
<style scoped lang="scss">
page {
	background-color: $color-white;
}
.integral {
	background-color: $color-white;
	/*  #ifndef H5  */
	height: 100vh;
	/*  #endif  */
	.header {
		opacity: 0.9;
		background-repeat: no-repeat;
		background-size: 100% 100%;
		width: 100%;
		height: 420rpx;
		font-size: $font-base;
		color: #fff;
		padding: 20rpx 0;
		text-align: center;
		position: relative;
		.title {
			font-size: $font-sm;
			margin: 10rpx 0;
		}
		.num {
			/*<!--color: $base-color;-->*/
			font-size: $font-lg + 20rpx;
			font-weight: lighter;
			line-height: 1;
		}
		.line {
			width: 10%;
			height: 3rpx;
			background-color: #fff;
			margin: 20rpx auto 30rpx;
		}
		.nav {
			width: 100%;
			display: flex;
			.item {
				flex: 1;
				.num {
					font-size: $font-lg + 4rpx;
					display: block;
					line-height: 1;
				}
			}
		}
		.tab {
			position: absolute;
			bottom: -2rpx;
			display: flex;
			width: 80%;
			margin: 0 10%;
			border-radius: 20rpx 20rpx 0 0;
			background-color: #f7f7f7;
			height: 80rpx;
			line-height: 80rpx;
			font-size: $font-base;
			color: #bbb;
			.item {
				flex: 1;
				text-align: center;
				line-height: 80rpx;
			}
			.on {
				background-color: #fff;
				font-weight: bold;
				border-radius: 20rpx 0 0 0;
			}
			.on:last-child {
				border-radius: 0 20rpx 0 0;
			}
		}
	}
}
.wrapper .list1 {
	background-color: #fff;
	.tip {
		font-size: $font-sm;
		width: 90%;
		margin: $spacing-base 5%;
		height: 64rpx;
		line-height: 64rpx;
		border-radius: 30rpx;
		background-color: #fff5e2;
		border: 1px solid #ffeac1;
		color: #c8a86b;
		text-align: center;
	}
	.list {
		display: flex;
		align-items: center;
		padding: 20rpx 36rpx;
		background: #fff;
		position: relative;
		.wrapper {
			display: flex;
			flex-direction: column;
			flex: 1;
			.address-box {
				display: flex;
				align-items: center;
				font-size: $font-base;
				color: $font-color-dark;
			}
			.u-box {
				color: $font-color-light;
				font-size: $font-sm;
			}
		}
		.change-num {
			font-size: $font-lg + 4rpx;
			color: $font-color-base;
		}
		.change-num-add {
			color: #16ac57;
		}
		.change-num-reduce {
			color: $base-color;
		}
	}
}
.wrapper .list2 {
	/*background-color: #F76260;*/
}
.wrapper .list2 .item {
	background-image: linear-gradient(to right, #fff7e7 0%, #fffdf9 100%);
	width: 90%;
	margin: $spacing-base 5%;
	height: 120rpx;
	line-height: 120rpx;
	position: relative;
	border-radius: 20rpx;
	padding: 0 20rpx;
	display: flex;
}
.wrapper .list2 .item .pictrue {
	width: 60rpx;
	height: 100rpx;
	margin: 20rpx 0;
	image {
		width: 80%;
		height: 80%;
	}
}
.wrapper .list2 .item .name {
	flex: 1;
	font-size: $font-sm;
	color: #c8a86b;
	margin: 0 20rpx;
}
.wrapper .list2 .item .earn {
	font-size: $font-sm;
	color: #c8a86b;
	border: 2rpx solid #c8a86b;
	text-align: center;
	height: 48rpx;
	margin: 36rpx 0;
	width: 120rpx;
	border-radius: 10rpx;
}
</style>
