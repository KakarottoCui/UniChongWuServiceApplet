<template>
	<view class="rf-search-bar" :class="'bg-' + themeColor.name">
		<image class="bg" mode="top" :src="userBg"></image>
		<!-- 顶部搜索栏 -->
		<view class="merchant" v-if="merchantShow" @tap="getCity" :style="{marginTop:inputTop+'px'}">
			<text class="iconfont iconshouhuodizhi"></text>
			<text class="title">{{ merchantData.title || '选择商户' }}</text>
			<text class="iconfont iconxiajiantou1"></text>
		</view>
		<view
			class="header"
			:style="{width:merchantShow ? '100vw' : width+'px', marginTop: merchantShow ? 0 : inputTop+'px'}"
		>
			<!-- 搜索框 -->
			<view class="input-box" @tap="toSearch">
				<input
					disabled
				/>
				<view class="wrapper">
					<text class="iconfont iconsousuo2"></text>
					<text class="keyword in1line">{{ placeholder }}</text>
				</view>
			</view>
			<!-- 扫一扫 -->
			<view class="addr" @tap.stop="link">
				<text class="iconfont" v-if="isOpenScan" :class="[icon]"></text>
				<image class="logo" :src="appLogo" v-else></image>
			</view>
		</view>
		<scroll-view
			scroll-x
			class="index-cate"
			:class="'bg-' + themeColor.name"
			v-if="isOpenIndexCate && categoryList.length > 0">
			<view
				v-for="(item, index) in categoryList"
				:key="index"
				class="index-cate-item"
				@tap.stop="tabClick(index, item.id)"
			>
				<text :class="tabCurrentIndex === index ? 'active' : ''">{{ item.title }}</text>
				<text :class="tabCurrentIndex === index ? 'integral-active' : ''"></text>
			</view>
		</scroll-view>
	</view>
</template>

<script>
import { productVirtualVerificationVerify } from '@/api/userInfo';
// #ifdef H5
import jweixin from '@/common/jweixin';
// #endif
export default {
	props: {
		headerShow: {
			type: Boolean,
			default: true
		},
		merchantData: {
			type: Object,
			default() {
				return {};
			}
		},
		merchantShow: {
			type: Boolean,
			default: false
		},
		categoryList: {
			type: Array,
			default() {
				return [];
			}
		},
		inputDisabled: {
			type: Boolean,
			default: false
		},
		placeholder: {
			type: String,
			default: '请输入关键字'
		},
		icon: {
			type: String,
			default: null
		},
		title: {
			type: String,
			default: null
		}
	},
	data() {
		return {
			CustomBar: this.CustomBar,
			searchValue: this.placeholder,
			isOpenIndexCate: this.$mSettingConfig.isOpenIndexCate,
			isOpenScan: this.$mSettingConfig.isOpenScan,
			appLogo: this.$mSettingConfig.appLogo,
			userBg: this.$mAssetsPath.userBg,
			height: 0,
			width: 0,
			inputTop: 0,
			tabCurrentIndex: 0
		};
	},
	created() {
		let obj = {};
		// #ifdef MP-WEIXIN
		// eslint-disable-next-line
		obj = wx.getMenuButtonBoundingClientRect();
		// #endif
		uni.getSystemInfo({
			success: (res) => {
				this.width = obj.left || res.windowWidth;
				this.height = obj.top ? (obj.top + obj.height + 8) : (res.statusBarHeight + 44);
				this.inputTop = obj.top ? (obj.top + (obj.height - 30) / 2) : (res.statusBarHeight + 7);
			}
		});
	},
	methods: {
		tabClick(index, id) {
			this.tabCurrentIndex = index;
			this.$emit('tab', {
				id
			});
		},
		// 获取定位信息
		getCity() {
			this.$mRouter.push({ route: '/pages/index/location/merchant' });
		},
		discard() {
		},
		// 扫一扫
		link() {
			const _this = this;
			/*  #ifndef H5  */
			uni.scanCode({
				success: function(res) {
					if (res.result.indexOf('http') !== -1) {
						if (res.result.indexOf(_this.$mConfig.hostUrl) !== -1) {
							if (
								res.result.indexOf('/pages/profile/profile') !== -1 ||
								res.result.indexOf('/pages/cart/cart') !== -1 ||
								res.result.indexOf('/pages/index/index') !== -1 ||
								res.result.indexOf('/pages/notify/notify') !== -1 ||
								res.result.indexOf('/pages/category/category') !== -1
							) {
								_this.$mRouter.reLaunch({ route: res.result.substring(_this.$mConfig.hostUrl.length) });
							} else {
								_this.$mRouter.redirectTo({ route: res.result.substring(_this.$mConfig.hostUrl.length) });
							}
						} else {
							_this.$mHelper.toast('不能识别该二维码');
						}
					} else {
						_this.$http.post(productVirtualVerificationVerify, { code: res.result }).then(() => {
							_this.$mHelper.toast('核销成功');
						});
					}
				},
				fail(res) {
					// 支付成功后的回调函数
					_this.$mHelper.toast('扫描失败：' + res.errMsg);
				}
			});
			/*  #endif  */
			/*  #ifdef H5  */
			if (this.$mPayment.isWechat()) {
				jweixin.ready(() => {
					jweixin.scanQRCode({
						needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
						success(res) {
							if (res.result.indexOf('http') !== -1) {
								if (res.result.indexOf(_this.$mConfig.hostUrl) !== -1) {
									if (
										res.result.indexOf('/pages/profile/profile') !== -1 ||
										res.result.indexOf('/pages/cart/cart') !== -1 ||
										res.result.indexOf('/pages/index/index') !== -1 ||
										res.result.indexOf('/pages/notify/notify') !== -1 ||
										res.result.indexOf('/pages/category/category') !== -1
									) {
										_this.$mRouter.reLaunch({ route: res.result.substring(_this.$mConfig.hostUrl.length) });
									} else {
										_this.$mRouter.redirectTo({ route: res.result.substring(_this.$mConfig.hostUrl.length) });
									}
								} else {
									_this.$mHelper.toast('不能识别该二维码');
								}
							} else {
								_this.$http.post(productVirtualVerificationVerify, { code: res.result }).then(() => {
									_this.$mHelper.toast('核销成功');
								});
							}
						},
						fail(res) {
							// 支付成功后的回调函数
							_this.$mHelper.toast('扫描失败：' + res.errMsg);
						}
					});
				});
			} else {
				this.$mHelper.toast('请在微信H5进行相关操作');
			}
			/*  #endif  */
		},
		async toSearch() {
			await this.$emit('search', {
				searchValue: this.searchValue
			});
		}
	}
};
</script>

<style lang="scss">
.rf-search-bar {
	position: fixed;
	width: 100%;
	top: 0;
	left: 0;
	z-index: 10;
	.bg {
		position: absolute;
		left: 0;
		top: 0;
		width: 100vw;
		height: 20vw;
		opacity: 0.9;
	}
	.merchant {
		line-height: 1;
		width: 100%;
		display: flex;
		align-items: center;
		z-index: 12;
		font-weight: 500;
		font-size: $font-lg;
		padding: $spacing-sm $spacing-lg 14rpx;
		.iconshouhuodizhi {
			font-size: 40rpx;
			font-weight: 600;
			margin-right: $spacing-sm;
		}
		.iconxiajiantou1 {
			margin-left: 4rpx;
			font-size: $font-base;
		}
	}
	.header {
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 12;
		padding-bottom: 10rpx;
		.addr {
			margin: 0 $spacing-base;
			height: 60rpx;
			line-height: 60rpx;
			z-index: 9999;
			.iconfont {
				font-weight: 500;
				font-size: 56rpx;
			}
			.logo {
				width: 45rpx;
				height: 45rpx;
				border-radius: 8rpx;
				margin-left: 10rpx;
			}
		}
		.input-box {
			flex: 1;
			height: 60rpx;
			line-height: 60rpx;
			background-color: $color-white;
			border-radius: 30rpx;
			position: relative;
			display: flex;
			align-items: center;
			margin: 6rpx 0 0 $spacing-base;
			.wrapper {
				display: flex;
				align-items: center;
				position: absolute;
				top: 50%;
				left: 50%;
				font-size: $font-sm + 2rpx;
				color: $font-color-light;
				transform: translate(-50%, -50%);
				.iconsousuo2 {
					font-size: 34rpx;
					margin-right: $spacing-base;
				}
			}
			input {
				width: 100%;
				padding-left: 28rpx;
				height: 28rpx;
				color: #888;
				font-size: 28rpx;
			}
		}
	}
}
</style>
