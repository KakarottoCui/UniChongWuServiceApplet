<template>
	<scroll-view class="rf-coupon" scroll-x>
		<block v-for="(item, index) in list" :key="index">
			<view class="rf-coupon-item-tb"  v-if="type === 'one'">
				<view class="top">
					<view>
						<view class="money" :class="'text-' + themeColor.name">
							<text v-if="item.type === '1'"><text class="symbol">{{ moneySymbol }}</text>{{ item.money }}</text>
							<text v-else>{{	`${item.discount / 10}折` }}</text>
						</view>
						<view class="tip" :class="'text-' + themeColor.name">满{{ item.at_least }}可用</view>
					</view>
				</view>
				<view :class="'bg-' + themeColor.name" class="btn" @tap="navTo(`/pages/user/coupon/detail?id=${item.id}`)">立即领取</view>
			</view>
			<view class="rf-coupon-item-lr"  v-if="type === 'two'">
				<view class="wrapper" :class="'bg-' + themeColor.name">
					<view class="left">
						<view>
							<view class="money" :class="'text-' + themeColor.name">
								<text v-if="item.type === '1'"><text class="symbol">{{ moneySymbol }}</text>{{ item.money }}</text>
								<text v-else>{{	`${item.discount / 10}折` }}</text></view>
							<view class="tip" :class="'text-' + themeColor.name">满{{ item.at_least }}可用</view>
						</view>
					</view>
					<view class="btn-wrapper">
						<view class="btn" @tap="navTo(`/pages/user/coupon/detail?id=${item.id}`)">
							立即领取
						</view>
					</view>
				</view>
			</view>
		</block>
	</scroll-view>
</template>

<script>
export default {
	name: 'index',
	props: {
		list: {
			type: Array,
			default: () => {
				return [];
			}
		},
		type: {
			type: String,
			default: 'one'
		}
	},
	methods: {
		navTo(route) {
			this.$mRouter.push({ route });
		}
	}
};
</script>

<style scoped lang="scss">
.rf-coupon {
	white-space: nowrap;
	width: calc(100% - 60rpx);
	margin: 0 30rpx;
	.rf-coupon-item-tb {
		display: inline-block;
		width: 208rpx;
		background: linear-gradient(#ebbdaa 0%, #f1e0cb 100%);
		border-radius: 8rpx;
		margin-right: $spacing-base;
		padding: $spacing-sm $spacing-sm * 1.2 $spacing-sm * 1.5;
		.top {
			width: 183rpx;
			height: 148rpx;
			background: linear-gradient(#fff2ec 0%, #fff4e6 100%);
			box-shadow: 0rpx 2rpx 9rpx 0rpx rgba(4,0,0,0.05);
			display: flex;
			justify-content: center;
			align-items: center;
			text-align: center;
			border-radius: 6rpx;
			.money {
				width: 100%;
				font-size: 50rpx;
				font-weight: 600;
				line-height: 1.4;
				.symbol {
					font-size: 24rpx;
				}
			}
			.tip {
				text-align: center;
				font-size: $font-sm;
			}
		}
		.btn {
			width: 182rpx;
			height: 60rpx;
			border-radius: 30rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			margin-top: $spacing-sm * 1.5;
		}
	}
	.rf-coupon-item-lr {
		display: inline-block;
		border-radius: 8rpx;
		.wrapper {
			border-radius: 8rpx;
			display: flex;
			width: 300rpx;
			margin-right: $spacing-sm;
			.left {
				flex: 1;
				height: 120rpx;
				margin: $spacing-sm;
				background: linear-gradient(#fff2ec 0%, #fff4e6 100%);
				box-shadow: 0rpx 2rpx 9rpx 0rpx rgba(4, 0, 0, 0.05);
				display: flex;
				justify-content: center;
				align-items: center;
				text-align: center;
				border-radius: 6rpx;
				.money {
					width: 100%;
					font-size: 50rpx;
					font-weight: 600;
					line-height: 1.4;
					.symbol {
						font-size: 24rpx;
					}
				}
			}
			.btn-wrapper {
				display: flex;
				justify-content: center;
				padding-right: $spacing-sm;
				align-items: center;
				.btn {
					width: 60rpx;
					white-space:normal;
					word-break:break-all;
					word-wrap:break-word;
					line-height: 1.3;
				}
			}
		}
	}
}
</style>
