<template>
	<view
		class="rf-coupon-detail"
		:style="{ backgroundColor: !couponDetail.id ? '#fff' : '' }"
	>
		<text class="back-btn iconfont iconzuo" @tap="navBack"></text>
		<block v-if="couponDetail.id">
			<view class="container" :class="'bg-' + themeColor.name">
				<!--顶部返回按钮-->
				<view class="title">
					<view class="tit">可抵扣金额</view>
					<text v-if="couponDetail.type === '1'" class="money"><text class="symbol">{{ moneySymbol }}</text>{{ couponDetail.money }}</text>
					<text class="money" v-else>{{	`${couponDetail.discount / 10}折` }}</text>
				</view>
			</view>
			<!--插画-->
			<view class="coupon-detail">
				<view class="title">基本信息</view>
				<view class="cell">
					<text class="tit">优惠券名称</text>
					<text class="des">{{ couponDetail.title }}</text>
				</view>
				<view class="cell">
					<text class="tit">使用限制</text>
					<text class="des">
						{{ parseInt(couponDetail.range_type, 10) === 2 ? '部分商品' : '全部商品' }}</text>
				</view>
				<view class="cell">
					<text class="tit">使用条件</text>
					<text class="des">满 {{ couponDetail.at_least }} 使用</text>
				</view>
				<view class="cell">
					<text class="tit">领取限制</text>
					<text class="des">
						{{
							parseInt(couponDetail.max_fetch, 10) === 0
								? '不限'
								: `每人限领 ${couponDetail.max_fetch}`
						}}
					</text>
				</view>
				<view class="cell">
					<text class="tit">已被领取</text>
					<text class="des">
						{{ couponDetail.get_count }} 张
					</text>
				</view>
				<view class="cell">
					<text class="tit">优惠券剩余</text>
					<text class="des">
						{{ couponDetail.percentage }} 张
					</text>
				</view>
				<view class="cell">
					<text class="tit">使用时间</text>
					<text class="des">
						{{ couponDetail.start_time | time }} ~ {{ couponDetail.end_time | time }}
					</text>
				</view>
			</view>
			<button
				class="confirm-btn"
				:class="'bg-' + themeColor.name"
				@tap="show(couponDetail)"
				v-if="parseInt(couponDetail.range_type, 10) === 2"
			>
				可用商品
			</button>
			<button
				class="confirm-btn"
				:class="'bg-' + themeColor.name"
				:disabled="btnLoading"
				:loading="btnLoading"
				@tap="getCoupon(couponDetail)"
			>
				领取
			</button>
		</block>
		<!-- 优惠券详情 -->
<!--		<view-->
<!--			class="sub-list valid"-->
<!--			:style="{ marginTop: state === 3 ? '40rpx' : 0 }"-->
<!--		>-->
<!--			<view class="row" v-for="(row, index) in couponList" :key="index">-->
<!--				&lt;!&ndash; content &ndash;&gt;-->
<!--				<view class="carrier">-->
<!--					<view class="left">-->
<!--						<view class="in1line title">-->
<!--							<text class="cell-icon">{{-->
<!--								parseInt(row.range_type, 10) === 2 ? '限' : '全'-->
<!--							}}</text>-->
<!--							{{ row.title }}-->
<!--						</view>-->
<!--						<view class="term" v-if="state !== 2">-->
<!--							{{ row.start_time | time }} ~ {{ row.end_time | time }}-->
<!--						</view>-->
<!--						<view class="term" v-else>-->
<!--							使用时间：{{ row.use_time | timeFull }}-->
<!--						</view>-->
<!--						<view class="icon shixiao" v-if="state === 3" />-->
<!--						<view class="used" v-if="state === 2">已使用</view>-->
<!--						<view class="usage">-->
<!--							{{-->
<!--								parseInt(row.max_fetch, 10) === 0-->
<!--									? '不限'-->
<!--									: `每人限领 ${row.max_fetch}`-->
<!--							}}-->
<!--							总领取 {{ row.get_count }}-->
<!--							<text v-if="row.percentage">剩余{{ row.percentage }}%</text>-->
<!--						</view>-->
<!--					</view>-->
<!--					<view class="right" :class="{ invalid: state !== 1 }">-->
<!--						<view class="ticket">-->
<!--							<view class="num">-->
<!--								{{ row.money ? moneySymbol + row.money : row.discount + '折' }}-->
<!--							</view>-->
<!--						</view>-->
<!--						<view class="criteria"> 满{{ row.at_least }}使用 </view>-->
<!--						<view class="btn-group">-->
<!--							<view-->
<!--								class="use view"-->
<!--								@tap="show(row)"-->
<!--								v-if="parseInt(row.range_type, 10) === 2"-->
<!--							>-->
<!--								商品-->
<!--							</view>-->
<!--							<view class="use" @tap="getCoupon(row)">-->
<!--								领取-->
<!--							</view>-->
<!--						</view>-->
<!--					</view>-->
<!--				</view>-->
<!--			</view>-->
<!--		</view>-->
		<uni-drawer
			class="rf-drawer"
			:visible="showRight"
			mode="right"
			@close="closeDrawer()"
		>
			<view class="rf-drawer-title">可用商品列表</view>
			<view class="rf-drawer-list">
				<view
					class="rf-drawer-item"
					@tap="navTo(`/pages/product/product?id=${item.id}`)"
					v-for="item in currentCoupon.usableProduct"
					:key="item.id"
				>
					<view class="left">
						<view class="title">{{
							item.name
								.split('】')[0]
								.split('【')
								.join('')
						}}</view>
						<text class="desc in2line">{{ item.name.split('】')[1] }}</text>
					</view>
					<text class="iconfont iconyou"></text>
				</view>
			</view>
			<view class="close">
				<button
					class="btn"
					plain="true"
					size="small"
					type="primary"
					@tap="hide"
				>
					关闭
				</button>
			</view>
		</uni-drawer>

		<rf-empty
			:info="'暂无优惠券'"
			v-if="!couponDetail.id && !loading"
		></rf-empty>
		<!--加载动画-->
		<rfLoading isFullScreen :active="loading"></rfLoading>
	</view>
</template>

<script>
/**
 * @des 优惠券详情
 *
 * @author stav stavyan@qq.com
 * @date 2019-12-09 10:13
 * @copyright 2019
 */
import { couponDetail, couponReceive } from '@/api/userInfo';
import moment from '@/common/moment';
// import uniDrawer from '@/components/uni-drawer/uni-drawer';
export default {
	components: {
		// uniDrawer
	},
	data() {
		return {
			couponDetail: {},
			headerTop: 0,
			// 控制滑动效果
			typeClass: 'valid',
			theIndex: null,
			oldIndex: null,
			state: 1,
			isStop: false,
			couponList: [],
			loadingType: 'more',
			token: null,
			page: 1,
			showRight: false,
			currentCoupon: {},
			moneySymbol: this.moneySymbol,
			loading: true,
			btnLoading: false
		};
	},
	filters: {
		time(val) {
			return moment(val * 1000).format('YYYY-MM-DD');
		},
		timeFull(val) {
			return moment(val * 1000).format('YYYY-MM-DD HH:mm:ss');
		}
	},
	onLoad(options) {
		this.initData(options);
	},
	methods: {
		// 返回上一页
		navBack() {
			this.$mRouter.back();
		},
		show(item) {
			if (item.usableProduct.length === 0) return;
			this.currentCoupon = item;
			this.showRight = true;
		},
		hide() {
			this.showRight = false;
		},
		closeDrawer() {
			this.showRight = false;
		},
		// 初始化数据
		initData(options) {
			this.getMyCouponDetail(options.id);
		},
		// 获取优惠券
		async getCoupon(item) {
			if (!this.$mStore.getters.hasLogin) {
				await this.$mHelper.backToLogin();
				return;
			}
			if (parseInt(item.is_get, 10) === 0) {
				this.$mHelper.toast('该优惠券暂不可领取！');
				return;
			}
			this.btnLoading = true;
			await this.$http
				.post(`${couponReceive}`, {
					id: item.id
				})
				.then(() => {
					this.btnLoading = false;
					this.$mHelper.toast('领取成功');
					setTimeout(() => {
						this.couponList = [];
						this.getMyCouponDetail(item.id);
					}, 0.5 * 1000);
				}).catch(() => {
					this.btnLoading = false;
				});
		},
		// 统一跳转接口
		navTo(route) {
			this.$mRouter.push({ route });
		},
		// 获取我的收货地址列表
		async getMyCouponDetail(id) {
			await this.$http
				.get(`${couponDetail}`, {
					id
				})
				.then(r => {
					this.couponDetail = r.data;
					this.loading = false;
					this.couponList.push(r.data);
				})
				.catch(() => {
					this.loading = false;
				});
		}
	}
};
</script>
<style lang="scss">
.rf-coupon-detail {
	.back-btn {
		position: absolute;
		left: 40rpx;
		z-index: 9999;
		padding-top: var(--status-bar-height);
		top: 40rpx;
		font-size: 48rpx;
		color: $color-white;
	}
	.container {
		z-index: 1;
		height: 360rpx;
		width: 100vw;
		overflow: hidden;
		border-bottom-left-radius: 160rpx;
		border-bottom-right-radius: 160rpx;
		.title {
			text-align: center;
			margin-top: 80rpx;
			.tit {
				font-size: $font-base;
				margin-bottom: $spacing-sm;
			}
			.money {
				font-size: $font-lg + 24rpx;
			}
		}
	}
	.coupon-detail {
		z-index: 100;
		margin: -120rpx $spacing-lg $spacing-lg;
		padding: $spacing-lg;
		border-radius: 18rpx;
		background-color: $color-white;
		.title {
			font-size: $font-lg;
			margin-bottom: $spacing-lg;
			color: $font-color-dark;
		}
		.cell {
			padding: $spacing-base 0;
			border-bottom: 1rpx solid rgba(0, 0, 0, .05);
			.tit {
				display: inline-block;
				width: 160rpx;
			}
			.des {
				color: $font-color-light;
			}
		}
		.cell:last-child {
			border-bottom: none;
			padding-bottom: $spacing-sm;
		}
	}
	.confirm-btn {
		margin-bottom: 0;
		margin-top: $spacing-lg * 2;
	}
}
.list {
	display: flex;
	width: 100%;
	position: relative;
}
.sub-list {
	width: 100%;
	padding-top: 10rpx;
	.row {
		width: 92%;
		height: 24vw;
		margin: 10rpx auto;
		border-radius: 8rpx;
		align-items: center;
		position: relative;
		overflow: hidden;
		z-index: 4;
		border: 0;
		.carrier {
			background-color: #fff;
			position: absolute;
			width: 100%;
			padding: 0 0;
			height: 100%;
			z-index: 3;
			display: flex;
			.left {
				flex: 1;
				.title {
					padding-top: 3vw;
					width: 90%;
					margin: 0 5%;
					font-size: 36rpx;
					.cell-icon {
						display: inline-block;
						height: 32rpx;
						margin-top: 15rpx;
						width: 32rpx;
						font-size: 22rpx;
						color: #fff;
						text-align: center;
						line-height: 32rpx;
						background: #f85e52;
						border-radius: 4rpx;
						margin-right: 12rpx;
						&.hb {
							background: #ffaa0e;
						}

						&.lpk {
							background: #3ab54a;
						}
					}
				}
				.term {
					width: 90%;
					margin: 0 5%;
					font-size: 26rpx;
					color: #999;
				}
				.usage {
					width: 90%;
					margin: 0 5%;
					font-size: 26rpx;
					color: $font-color-light;
				}
				position: relative;
				.gap-top,
				.gap-bottom {
					position: absolute;
					width: 20rpx;
					height: 20rpx;
					right: -10rpx;
					border-radius: 100%;
					background-color: #f5f5f5;
				}
				.gap-top {
					top: -10rpx;
				}
				.gap-bottom {
					bottom: -10rpx;
				}
				.used {
					position: absolute;
					right: 10rpx;
					bottom: 5rpx;
					font-size: $font-sm;
					color: $base-color;
				}
				.shixiao {
					position: absolute;
					right: 0;
					top: -20rpx;
					font-size: 150rpx;
					z-index: 6;
					color: rgba(153, 153, 153, 0.2);
				}
			}
			.right {
				width: 28%;
				color: #fff;
				text-align: center;
				background: linear-gradient(
					to right,
					rgba(250, 67, 106, 0.72),
					rgba(250, 67, 106, 0.64)
				);
				.ticket,
				.criteria {
					width: 100%;
				}
				.ticket {
					padding-top: 20rpx;
					.num {
						font-size: $font-lg + 12rpx;
						font-weight: 600;
						line-height: 1.2;
					}
					.unit {
						font-size: 24rpx;
					}
				}
				.criteria {
					font-size: $font-base;
				}
				.btn-group {
					display: flex;
					justify-content: space-between;
					align-items: center;
					.use {
						flex: 1;
						margin: 0 6rpx;
						height: 40rpx;
						justify-content: center;
						align-items: center;
						font-size: 24rpx;
						background-color: #fff;
						color: $base-color;
						border-radius: 40rpx;
						padding: 0 4rpx;
					}
				}
			}
		}
	}
}
.drawer {
	.close {
		.btn {
			width: 320rpx;
			height: 76rpx;
			line-height: 76rpx;
			border-radius: 50px;
			margin-top: 70rpx;
			background: $uni-color-primary;
			color: #fff;
			font-size: $font-lg;
			border: none;
			&:after {
				border-radius: 100px;
			}
		}
	}
}
</style>
