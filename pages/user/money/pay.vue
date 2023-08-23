<template>
	<view class="pay" v-if="!loading">
		<cu-custom bgColor="" :isBack="true" @back="back" :class="'bg-' + themeColor.name">
			<block slot="backText">
				<text class="iconfont iconzhuyedefuben" @tap.stop="toHome"></text>
			</block>
			<block slot="content">支付</block>
		</cu-custom>
		<view class="pay-section" :class="'bg-' + themeColor.name">
			<image class="bg" :src="moneyBg"></image>
			<view class="tips-wrapper">
				<text class="title">支付金额</text>
				<view class="tip">{{ moneySymbol }}{{ money }}</view>
			</view>
		</view>
		<view class="pay-type-list">
			<view
				class="type-item"
				:class="payType === 1 ? 'type-item-active text-' + themeColor.name : ''"
				@tap="changePayType(1)"
				v-if="parseInt(payTypeList.order_wechat_pay, 10) === 1"
			>
				<i class="iconfont iconweixinzhifu" :style="{color: payType === 1 ? '#36cb59' : ''}"></i>
				<view class="con">
					<text class="tit" :class="payType === 1 ? 'text-' + themeColor.name : ''">微信支付</text>
					<text>推荐使用微信支付</text>
				</view>
				<label class="radio">
					<radio size="12" value="" :color="themeColor.color" :checked="payType == 1" />
				</label>
			</view>
			<!-- #ifndef MP-WEIXIN -->
			<view
				class="type-item"
				:class="payType === 2 ? 'type-item-active text-' + themeColor.name : ''"
				@tap="changePayType(2)"
				v-if="parseInt(payTypeList.order_ali_pay, 10) === 1 && !isWechat"
			>
				<i class="iconfont iconalipay" :style="{color: payType === 2 ? '#01aaef' : ''}"></i>
				<view class="con">
					<text class="tit" :class="payType === 2 ? 'text-' + themeColor.name : ''">支付宝支付</text>
					<text>推荐使用支付宝支付</text>
				</view>
				<label class="radio">
					<radio value="" :color="themeColor.color" :checked="payType == 2" />
				</label>
			</view>
			<!-- #endif-->
			<view
				class="type-item"
				:class="payType === 5 ? 'type-item-active text-' + themeColor.name : ''"
				@tap="changePayType(5)"
				v-if="payTypeList.order_balance_pay === '1'"
			>
				<i class="iconfont iconerjiye-yucunkuan" :style="{color: payType === 5 ? '#fe8e2e' : ''}"></i>
				<view class="con">
					<text class="tit" :class="payType === 5 ? 'text-' + themeColor.name : ''">预存款支付</text>
					<text>可用余额 {{ moneySymbol }}{{  userInfo.account.user_money }}</text>
				</view>
				<label class="radio">
					<radio value="" :color="themeColor.color" :checked="payType === 5" />
				</label>
			</view>
		</view>
		<button
			class="confirm-btn"
			:class="'bg-' + themeColor.name"
			:disabled="btnLoading"
			:loading="btnLoading"
			@tap="confirm"
		>
			确认支付
		</button>
	</view>
</template>

<script>
import { orderDetail, memberInfo } from '@/api/userInfo';
import { configList } from '@/api/basic';
import { isBindingCheck } from '@/api/login';
export default {
	data() {
		return {
			isWechat: this.$mPayment.isWechat(),
			payType: 5,
			payTypeList: {},
			money: 0,
			userInfo: {
        account: {}
			},
			moneySymbol: this.moneySymbol,
			orderDetail: {},
			orderInfo: {},
			btnLoading: false,
			loading: true,
			code: '',
			type: '',
			moneyBg: this.$mAssetsPath.moneyBg,
			marketingId: ''
		};
	},
	computed: {},
	onLoad(options) {
		this.initData(options);
		/*  #ifdef H5  */
		this.code = options.code && options.code.split(',')[options.code.split(',').length - 1];
		if (this.$mPayment.isWechat() && !this.code) {
			this.$http
				.post(`${isBindingCheck}`, {
					oauth_client: 'wechat'
				})
				.then(async res => {
					if (!res.data.openid) {
						const href = window.location.href;
						window.location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?
															appid=${this.$mConfig.weixinAppId}&
															redirect_uri=${href}&
															response_type=code&
															scope=snsapi_userinfo&
															state=STATE#wechat_redirect`;
					}
				});
		}
		/*  #endif  */
	},
	methods: {
		// 数据初始化
		async initData(options) {
			this.orderInfo['order_id'] = parseInt(options.id, 10);
			this.type = options.type;
			await this.getOrderDetail(options.id);
			// #ifdef H5
			if (uni.getSystemInfoSync().platform === 'android') {
				await this.$mPayment.wxConfigH5(window.location.href);
			}
			// #endif
		},
		// 获取用户信息
		async getMemberInfo() {
			await this.$http
				.get(memberInfo)
				.then(async r => {
					this.loading = false;
					this.userInfo = r.data;
				});
		},
		// 选择支付方式
		changePayType(type) {
			this.payType = type;
		},
		// 获取订单费用
		async getOrderDetail(id) {
			await this.$http
				.get(`${orderDetail}`, {
					id, // 订单id
					simplify: 1 // 获取简化订单详情
				})
				.then(r => {
					this.marketingId = r.data.wholesale_id;
					this.getPayTypeList();
					this.getMemberInfo();
					// 尾款支付优先显示
					this.money = r.data.final_payment_money || r.data.pay_money;
				}).catch(() => {
					this.loading = false;
				});
		},
		// 获取支付类型列表
		async getPayTypeList() {
			await this.$http
				.get(`${configList}`, {
					field: 'order_balance_pay,order_wechat_pay,order_ali_pay'
				})
				.then(r => {
					this.payTypeList = r.data;
				});
		},
		// 返回上一页
		back() {
			this.$mRouter.back();
		},
		// 返回主页
		toHome() {
			this.$mRouter.reLaunch({ route: '/pages/index/index' });
		},
		// 确认支付
		async confirm() {
			this.btnLoading = true;
			const route = `/pages/user/money/success?type=${this.type}&id=${this.marketingId}&order_id=${this.orderInfo['order_id']}`;
			setTimeout(() => {
				this.btnLoading = false;
			}, 0.5 * 1000);
			switch (parseInt(this.payType, 10)) {
				case 1:
					await this.$mPayment.weixinPay('order', JSON.stringify(this.orderInfo), route, this.code);
					break;
				case 2:
					await this.$mPayment.aliPay('order', JSON.stringify(this.orderInfo), route);
					break;
				case 5:
					await this.$mPayment.balancePay(JSON.stringify(this.orderInfo), route);
					break;
			}
		}
	}
};
</script>

<style lang="scss">
page {
	background-color: $color-white;
}

.pay {
	width: 100%;
	.iconzhuyedefuben {
		font-size: 44rpx;
		color: $color-white;
		font-weight: 600;
		margin-right: 30rpx;
	}
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
			text-align: center;
			margin-top: 100rpx;
			.title {
				font-size: $font-lg;
				margin-bottom: $spacing-base;
			}
			.tip {
				font-size: $font-lg + 42rpx;
			}
		}
	}
}

.price-box {
	background-color: #fff;
	height: 265rpx;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	font-size: 28rpx;
	color: #909399;

	.price {
		font-size: 50rpx;
		color: #303133;
		margin-top: 12rpx;
	}
}
.pay-type-list {
	margin: 60rpx 0;
	background-color: #fff;
	padding: 0 40rpx;
	.type-item {
		padding: 0 $spacing-lg;
		height: 100rpx;
		border-radius: 100rpx;
		margin-bottom: $spacing-lg;
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-size: 30rpx;
		position: relative;
		border: 2rpx solid rgba(0, 0, 0, 0.12);
	}

	.type-item-active {
		border: 2rpx solid;
	}

	.iconfont {
		font-size: 45rpx;
		margin: 0 $spacing-base;
		color: $font-color-light;
	}

	.tit {
		font-size: $font-base;
		margin-bottom: 4rpx;
	}
	.tit-active {
		color: $font-color-dark;
	}

	.con {
		flex: 1;
		font-size: $font-sm;
		color: $font-color-light;
		.tit {
			margin-right: $spacing-base;
		}
	}
	.radio {
		radio {
			transform:scale(0.7)
		}
	}
}
.confirm-btn {
	height: 86rpx;
	line-height: 86rpx;
	width: 70%;
	margin-top: 144rpx;
}
.iconzhuyedefuben {
	font-size: 48rpx;
	margin-left: 20rpx;
}
</style>
