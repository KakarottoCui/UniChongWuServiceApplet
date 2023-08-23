<template>
	<view class="virtual">
		<!--顶部账单类型 全部/充值/消费-->
		<view class="navbar">
			<view
				v-for="(item, index) in orderProductVirtualTypeList"
				:key="index"
				class="nav-item"
				:class="tabCurrentIndex === index ? `text-${themeColor.name} current` : ''"
				@tap="tabClick(index, item.state)"
			>
				{{ item.text }}
			</view>
		</view>
		<!--账单明细列表-->
		<view class="rf-list" v-if="orderProductVirtualList.length > 0">
			<view
				class="rf-list-item"
				@tap="navTo(`/pages/user/virtual/detail?id=${item.id}`)"
				v-for="(item, index) in orderProductVirtualList"
				:key="index"
			>
				<view class="left">
					<image class="image" :src="item.orderProduct.product_picture"></image>
				</view>
				<view class="mid">
					<view class="title in2line">
						{{ item.product_name }}
					</view>
					<view class="time">
						{{ item.created_at | time }}
					</view>
				</view>
				<view class="right">
					<view>可用次数</view>
					<text
						class="change-num"
						:class="'text-' + themeColor.name"
						>{{ item.confine_use_number === '0' ? '不限制' : item.confine_use_number }}
					</text>
				</view>
			</view>
			<rf-load-more
				class="load-more"
				:status="loadingType"
				v-if="orderProductVirtualList.length > 0"
			></rf-load-more>
		</view>
		<rf-empty
			:info="'暂无虚拟码'"
			v-if="orderProductVirtualList.length === 0 && !loading"
		></rf-empty>
		<!--加载动画-->
		<rfLoading isFullScreen :active="loading"></rfLoading>
	</view>
</template>
<script>
/**
 * @des 账单明细
 *
 * @author stav stavyan@qq.com
 * @date 2020-01-13 11:18
 * @copyright 2019
 */
import { orderProductVirtualIndex } from '@/api/userInfo';
import rfLoadMore from '@/components/rf-load-more/rf-load-more.vue';
import moment from '@/common/moment';

export default {
	components: {
		rfLoadMore
	},
	data() {
		return {
			loading: true,
			typeClass: 'valid',
			state: 0,
			tabCurrentIndex: 0,
			orderProductVirtualTypeList: this.$mConstDataConfig.orderProductVirtualTypeList,
			orderProductVirtualList: [],
			loadingType: 'more',
			page: 1
		};
	},
	filters: {
		time(val) {
			return moment(val * 1000).format('YYYY-MM-DD HH:mm:ss');
		}
	},
	// 下拉刷新
	onPullDownRefresh() {
		this.page = 1;
		this.orderProductVirtualList = [];
		this.getOrderProductVirtualList('refresh');
	},
	// 加载更多
	onReachBottom() {
  if (this.loadingType === 'nomore') return;
		this.page++;
		this.getOrderProductVirtualList();
	},
	onLoad(options) {
		this.initData(options);
	},
	methods: {
		// 顶部tab点击
		tabClick(index, state) {
			this.page = 1;
			this.orderProductVirtualList.length = 0;
			this.loading = true;
			this.tabCurrentIndex = index;
			this.state = state;
			this.getOrderProductVirtualList();
		},
		// 数据初始化
		initData() {
			this.getOrderProductVirtualList();
		},
		// 获取虚拟码列表
		async getOrderProductVirtualList(type) {
			const params = {};
			params.state = this.state;
			params.page = this.page;
			await this.$http
				.get(`${orderProductVirtualIndex}`, {
					...params
				})
				.then(r => {
					this.loading = false;
					if (type === 'refresh') {
						uni.stopPullDownRefresh();
					}
					this.loadingType = r.data.length < 10 ? 'nomore' : 'more';
					this.orderProductVirtualList = [...this.orderProductVirtualList, ...r.data];
				})
				.catch(() => {
					this.loading = false;
					if (type === 'refresh') {
						uni.stopPullDownRefresh();
					}
				});
		},
		// 通用跳转
		navTo (route) {
			this.$mRouter.push({ route });
		}
	}
};
</script>
<style scoped lang="scss">
page {
	background-color: $page-color-base;
}
.virtual {
	.left {
		.image {
			width: 160rpx;
			height: 140rpx;
			border-radius: 12rpx;
			margin-right: $spacing-base;
		}
	}
	.mid {
		.title {
			margin-top: 10rpx;
			font-size: $font-base;
			color: $font-color-dark;
		}
		.time {
			margin-top: 10rpx;
			font-size: $font-sm;
			color: $font-color-light;
		}
	}
	.right {
		margin-left: $spacing-lg;
		text-align: center;
		.change-num {
			font-size: $font-base;
		}
	}
}
</style>
