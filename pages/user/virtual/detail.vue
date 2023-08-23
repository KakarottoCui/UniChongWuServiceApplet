<template>
	<view class="virtual-detail">
		<!-- 商品 -->
		<view class="detail" v-if="orderProductVirtualDetail.id">
			<view class="row">
				<view
					class="carrier"
				>
					<view class="left">
						<rf-image
							:preview="false"
							class="image"
							:src="orderProductVirtualDetail.orderProduct.product_picture"
						></rf-image>
					</view>
					<view class="mid">
						<view class="title in2line">{{
							orderProductVirtualDetail.orderProduct.product_name
						}}</view>
						<view class="data">
							{{ orderProductVirtualDetail.orderProduct.sku_name || singleSkuText }} * 1
						</view>
						<view class="bottom">
							<text class="price" :class="'text-' + themeColor.name">{{ moneySymbol }}{{
								orderProductVirtualDetail.orderProduct.price
							}}</text>
						</view>
					</view>
				</view>
			</view>
			<view
				class="list-cell m-t"
				v-if="orderProductVirtualDetail.code"
				hover-class="cell-hover"
				:hover-stay-time="50"
			>
				<text class="cell-tit">卡卷码</text>
				<text class="cell-tip">{{ orderProductVirtualDetail.code }}</text>
				<text class="copy" :class="'text-' + themeColor.name" @click="saveClipboard(orderProductVirtualDetail.code, 'text')">复制</text>
			</view>
			<view
				class="list-cell m-t"
				hover-class="cell-hover"
				:hover-stay-time="50"
			>
				<text class="cell-tit">虚拟商品组别</text>
				<text class="cell-tip">{{ orderProductVirtualDetail.product_group === 'download' ? '下载商品' : '虚拟商品' }}</text>
<!--				<text class="cell-more iconfont iconyou"></text>-->
			</view>
			<view
				class="list-cell m-t"
				hover-class="cell-hover"
				:hover-stay-time="50"
			>
				<text class="cell-tit">使用期限</text>
				<text class="cell-tip" v-if="orderProductVirtualDetail.start_time && orderProductVirtualDetail.end_time">{{orderProductVirtualDetail.start_time | time }} - {{ orderProductVirtualDetail.end_time | time }}</text>
				<text v-else>不限期使用</text>
			</view>
			<view
				class="list-cell m-t"
				hover-class="cell-hover"
				:hover-stay-time="50"
			>
				<text class="cell-tit">已使用次数</text>
				<text class="cell-tip">{{ orderProductVirtualDetail.use_number }}</text>
			</view>
			<view
				class="list-cell m-t"
				hover-class="cell-hover"
				:hover-stay-time="50"
			>
				<text class="cell-tit">限制使用次数</text>
				<text class="cell-tip">{{ orderProductVirtualDetail.confine_use_number === '0' ? '不限' : orderProductVirtualDetail.confine_use_number }}</text>
			</view>
			<view
				class="list-cell"
				hover-class="cell-hover"
				:hover-stay-time="50"
				v-if="!!orderProductVirtualDetail.remark"
			>
				<text class="cell-tit">备注</text>
				<view class="cell-tip">
					<view v-if="JSON.parse(orderProductVirtualDetail.remark || '{}').cloud_address">网盘地址：{{ JSON.parse(orderProductVirtualDetail.remark || '{}').cloud_address }}</view>
					<view v-if="JSON.parse(orderProductVirtualDetail.remark || '{}').cloud_password">网盘密码：{{ JSON.parse(orderProductVirtualDetail.remark || '{}').cloud_password }}</view>
					<view v-if="JSON.parse(orderProductVirtualDetail.remark || '{}').text_download_resources">下载地址：{{ JSON.parse(orderProductVirtualDetail.remark || '{}').text_download_resources }}</view>
					<view v-if="JSON.parse(orderProductVirtualDetail.remark || '{}').unzip_password">解压密码：{{ JSON.parse(orderProductVirtualDetail.remark || '{}').unzip_password }}</view>
				</view>
				<text class="copy" :class="'text-' + themeColor.name" @click="saveClipboard(orderProductVirtualDetail.remark)">复制</text>
			</view>
			<view class="detail-desc" v-if="orderProductVirtualDetail.code">
				<view class="d-header">
					<text>卡券码</text>
				</view>
				<view class="qrcode">
					<rf-qrcode cid="qrcode2229" makeOnLoad :text="orderProductVirtualDetail.code"></rf-qrcode>
				</view>
			</view>
		</view>
		<!-- 404页面 -->
		<view v-if="!orderProductVirtualDetail.id && !loading">
			<rf-no-data class="rf-no-data" :custom="true">
				<view class="title">{{ errInfo || '虚拟码不存在' }}</view>
				<view @tap="getOrderProductVirtualDetail" slot="refresh" class="spec-color"
					>重新加载</view
				>
			</rf-no-data>
		</view>
		<!--页面加载动画-->
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
import { orderProductVirtualView } from '@/api/userInfo';
import moment from '@/common/moment';
import rfQrcode from '@/components/rf-qrcode';
import rfNoData from '@/components/rf-no-data';
export default {
	components: { rfQrcode, rfNoData },
	data() {
		return {
			loading: true,
			orderProductVirtualId: '',
			moneySymbol: this.moneySymbol,
			orderProductVirtualDetail: {
        orderProduct: {}
			},
			errInfo: '',
			singleSkuText: this.singleSkuText
		};
	},
	filters: {
		time(val) {
			return moment(val * 1000).format('YYYY-MM-DD HH:mm');
		}
	},
	onLoad(options) {
		this.initData(options);
	},
	methods: {
		// 数据初始化
		initData(options) {
			this.orderProductVirtualId = options.id;
			this.getOrderProductVirtualDetail();
		},
		// 获取虚拟码详情
		async getOrderProductVirtualDetail() {
			await this.$http
				.get(`${orderProductVirtualView}`, {
					id: this.orderProductVirtualId
				})
				.then(r => {
					this.loading = false;
					this.orderProductVirtualDetail = r.data;
				})
				.catch(err => {
					this.loading = false;
					this.errInfo = err;
				});
		},
			// 复制推广链接
		saveClipboard(data, type) {
			let content = '';
			if (type === 'text') {
				content = data || {};
			} else {
				if (JSON.parse(data).cloud_address) {
					content = `网盘地址：${JSON.parse(data).cloud_address} 网盘密码：${JSON.parse(data).cloud_password}`;
				} else if (JSON.parse(data).text_download_resources) {
					content = `下载地址：${JSON.parse(data).text_download_resources} 解压密码：${JSON.parse(data).unzip_password}`;
				}
			}
			/* #ifdef H5 */
			this.$mHelper.h5Copy(content);
			/* #endif */
			/* #ifndef H5 */
			uni.setClipboardData({
				data: content,
				success: function() {
					this.$mHelper.toast('复制成功');
				}
			});
			/* #endif */
		}
	}
};
</script>
<style scoped lang="scss">
page {
	background-color: $page-color-base;
}
.virtual-detail {
	.detail {
		padding-top: $spacing-base;
		.row {
			margin: 0 auto $spacing-lg;
			width: calc(94%);
			height: calc(22vw + 40rpx);
			border-radius: 15rpx;
			box-shadow: 0rpx 5rpx 20rpx rgba(0, 0, 0, 0.1);
			display: flex;
			align-items: center;
			position: relative;
			overflow: hidden;
			z-index: 4;
			border: 0;
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
				.left {
					width: 22vw;
					height: 22vw;
					margin-left: 20rpx;
					margin-right: 10rpx;
					.image {
						border-radius: 10rpx;
						width: 22vw;
						height: 22vw;
					}
				}
				.mid {
					text-align: left;
					width: 100%;
					margin: 10rpx 10rpx 0;
					.title {
						color: $font-color-dark;
						height: 60rpx;
						line-height: 1.2;
						font-size: $font-base;
					}
					.data {
						width: 100%;
						display: flex;
						align-items: center;
						margin: 10rpx 0 5rpx;
						font-size: $font-base;
						color: $font-color-base;
						.item {
							flex: 1;
						}
						.iconfont {
							color: $font-color-light;
							margin-right: 10rpx;
						}
						.status {
							padding: 6rpx 20rpx;
							opacity: 0.8;
							font-size: $font-sm;
							border-radius: 6rpx;
						}
					}
					.bottom {
						line-height: 1.2;
						width: 100%;
						display: flex;
						justify-content: space-between;
						align-items: center;
						font-size: $font-sm;
						color: $font-color-light;
						.price {
							font-size: $font-lg;
						}
					}
				}
				.data {
					color: $font-color-light;
				}
			}
		}
		.qrcode {
			display: flex;
			justify-content: center;
			align-items: center;
			padding-bottom: $spacing-base;
		}
		.copy {
			margin-left: $spacing-base;
		}
	}
}
</style>
