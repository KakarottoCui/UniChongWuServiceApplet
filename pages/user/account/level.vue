<template>
	<view class="rf-account-level" v-if="!loading">
		<view class="title">会员级别列表</view>
		<view class="advance-area">
			<view class="flex-box tc thead">
				<view class="item-3">级别</view>
				<view class="item-3">级别名称</view>
				<view class="item-3">升级条件(积分)</view>
				<!-- <view class="item-3">说明</view> -->
			</view>
			<view
				class="flex-box table tc"
				v-for="(item, index) in memberLevelList"
				:key="index"
			>
				<text class="item-3">
					<u-icon name="level" :color="themeColor.color" size="20" />
					{{ item.level }}
				</text>
				<text class="item-3">
					{{ item.name }}
				</text>
				<text class="item-3 font-sm">
					积分满<text :class="'text-' + themeColor.name">{{ item.integral }}</text>
				</text>
				<!-- <text class="item-3 font-sm">
					<text>通过发布救助信息、帖子、评论等获取。</text>
				</text> -->
			</view>
		</view>
		<rfLoading isFullScreen :active="loading"></rfLoading>
	</view>
</template>

<script>
/**
 * @des 用户账户中心
 *
 * @author stav stavyan@qq.com
 * @date 2020-01-10 15:17
 * @copyright 2019
 */
import { memberLevelIndex } from '@/api/userInfo';

export default {
	data() {
		return {
      memberLevelList: [],
			loading: true
		};
	},
	onLoad() {
		this.initData();
	},
	methods: {
		// 初始化数据
		initData() {
			this.getMemberLevelList();
		},
		// 获取用户信息
		async getMemberLevelList() {
			await this.$http
				.get(memberLevelIndex)
				.then(async r => {
					this.loading = false;
					this.memberLevelList = r.data;
				})
				.catch(() => {
					this.loading = false;
				});
		},
		navTo(route) {
			this.$mRouter.push({ route });
		}
	}
};
</script>

<style lang="scss">
page {
	background: $color-white;
}
$color: #e0e0e0;
.rf-account-level {
	padding: 30rpx;
	display: flex;
	flex: 1;
	flex-direction: column;
	.flex-box {
		display: flex;
		flex-wrap: wrap;
	}
	.flex-box > .item-2 {
		flex: 0 0 50%;
	}
	.flex-box > .item-3 {
		flex: 0 0 33.3333%;;
		height: 80rpx;
	}
	.flex-box > .item-4 {
		flex: 0 0 25%;
	}
	.title {
		margin: 30rpx 0;
		font-size: $font-lg;
		font-weight: 600;
		color: #333;
	}
	//普通表格
	.genaral-area {
		.item-2 {
			font-size: 26rpx;
			border: 1rpx solid $color;
			border-width: 1rpx 1rpx 0 0;
			padding: 16rpx 0;
			box-sizing: border-box;
			text-align: center;

			&:first-child {
				border-left-width: 1rpx;
			}

			&:last-child {
				border-right-width: 1rpx;
			}
		}

		.thead {
			.item-2 {
				font-weight: bold;

				box-sizing: border-box;
			}
		}

		.table {
			&:last-child {
				border-bottom: 1rpx solid $color;
			}

			.item-2 {
				display: flex;
				justify-content: center;
				align-items: center;
				box-sizing: border-box;
			}
		}
	}
	// 多行合并表格
	.advance-area {
		.item-3,
		.item-4 {
			font-size: 26rpx;
			border: 1rpx solid $color;
			border-width: 1rpx 1rpx 0 0;
			box-sizing: border-box;
			text-align: center;
			&:first-child {
				border-left-width: 1rpx;
			}

			&:last-child {
				border-right-width: 1rpx;
			}
		}
		.thead {
			.item-3,
			.item-4 {
				font-weight: bold;
				padding: 16rpx 0;
				box-sizing: border-box;
			}
		}
		.table {
			&:last-child {
				border-bottom: 1rpx solid $color;
			}

			.item-3,
			.item-4 {
				display: flex;
				justify-content: center;
				align-items: center;
				box-sizing: border-box;
			}
		}
		.table-flex {
			flex: 1;

			.item {
				border-bottom: 1rpx solid $color;
				padding: 10rpx 0;
				box-sizing: border-box;

				&:last-child {
					border-width: 0;
				}
			}
		}
		.font-sm {
			font-size: $font-sm;
			padding: 0 10rpx;
		}
	}
}

</style>
