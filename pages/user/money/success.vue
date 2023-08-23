<template>
	<view class="pay-success" v-if="!loading">
		<cu-custom bgColor="" :isBack="true" :class="'bg-' + themeColor.name">
			<block slot="content">支付成功</block>
		</cu-custom>
		<view class="pay-section" :class="'bg-' + themeColor.name">
			<image class="bg" :src="moneyBg"></image>
			<view class="tips-wrapper">
				<text class="iconfont iconxuanzhong2"></text>
				<view class="content">
					<text class="title">支付成功！</text>
					<view class="tip">感谢您的购买</view>
				</view>
			</view>
		</view>
		<view class="pay-card" v-if="orderId">
			<view class="pay-card-money">{{moneySymbol}}{{ orderDetail.final_payment_money || orderDetail.pay_money }}</view>
			<view class="item"><text class="tit">订单编号：</text>{{ orderDetail.order_sn }}</view>
			<view class="item"><text class="tit">下单时间：</text>{{ orderDetail.pay_time | time }}</view>
			<view class="item"><text class="tit">支付方式：</text>{{ orderDetail.payment_explain }}</view>
			<view class="item"><text class="tit">物流配送：</text>{{ orderDetail.shipping_explain }}</view>
			<view class="item"><text class="tit">订单状态：</text>{{ orderDetail.order_status | orderStatusFilter }}</view>
		</view>
		<view class="btn-group">
			<button
				class="confirm-btn"
				@tap="navTo"
				:class="'bg-' + themeColor.name"
			>查看订单</button
			>
			<button
				class="confirm-btn"
				@tap="toHome"
			>返回首页</button
			>
		</view>
	</view>
</template>
<script>
import { orderDetail } from '@/api/userInfo';
import moment from '@/common/moment';
import mConstDataConfig from '@/config/constData.config';
export default {
	data() {
		return {
			loading: true,
			type: '',
			id: '',
			orderId: '',
			moneyBg: this.$mAssetsPath.moneyBg,
			moneySymbol: this.moneySymbol,
			orderDetail: {}
		};
	},
	onLoad(options) {
		this.type = options.type;
		this.id = options.id;
		this.orderId = options.order_id;
		if (this.orderId) {
			this.getOrderDetail();
		} else {
			this.loading = false;
		}
	},
	filters: {
		time(val) {
			return moment(val * 1000).format('YYYY-MM-DD HH:mm');
		},
		orderStatusFilter(orderStatus) {
			let state = null;
			mConstDataConfig.orderStatus.forEach(orderItem => {
				if (orderItem.key === parseInt(orderStatus, 10)) {
					state = orderItem.value;
				}
			});
			return state;
		}
	},
	methods: {
		// 获取订单详情
		async getOrderDetail() {
			await this.$http
				.get(`${orderDetail}`, {
					id: this.orderId, // 订单id
					simplify: 1 // 获取简化订单详情
				})
				.then(r => {
					this.loading = false;
					this.orderDetail = r.data;
				}).catch(() => {
					this.loading = false;
				});
		},
		navTo() {
			let route;
			switch (this.type) {
				case 'wholesale':
					route = `/pages/marketing/wholesale/detail?id=${this.id}`;
					break;
				default:
					route = '/pages/order/order?state=-1';
					break;
			}
			this.$mRouter.push({ route });
		},
		// 返回主页
		toHome() {
			this.$mRouter.reLaunch({ route: '/pages/index/index' });
		}
	}
};
</script>
<style lang="scss">
page {
	background-color: $page-color-base;
}
.pay-success {
	.pay-section {
		height: 400rpx;
		overflow: hidden;
		display: flex;
		align-items: center;
		justify-content: center;
		.bg {
			position: absolute;
			left: 0;
			top: 0;
			width: 100vw;
			height: 60vw;
		}
		.tips-wrapper {
			display: flex;
			align-items: center;
			justify-content: center;
			color: $color-white;
			.iconfont {
				font-size: 132rpx;
				margin-right: $spacing-base;
			}
			.content {
				.title {
					font-size: $font-lg + 4rpx;
				}
				.tip {
					font-size: $font-sm + 2rpx;
				}
			}
		}
	}
	.pay-card {
		width: 90%;
		height: 520rpx;
		background-color: $color-white;
		border-radius: 12rpx;
		margin: -80rpx 5% 0;
		box-shadow: 0rpx 5rpx 25rpx rgba(0, 0, 0, 0.05);
		.pay-card-money {
			text-align: center;
			font-size: $font-lg + 12rpx;
			padding: $spacing-base 0;
			color: $color-black;
			font-weight: 500;
			border-bottom: 1rpx solid rgba(0, 0, 0, 0.05);
		}
		.item {
			height: 80rpx;
			line-height: 80rpx;
			margin-left: $spacing-lg;
			color: $font-color-dark;
			.tit {
				color: $font-color-light;
			}
		}
	}
	.btn-group {
		padding-top: 60rpx;
		.confirm-btn {
			margin-top: $spacing-lg;
			width: 72%;
		}
	}
}
</style>
