<template>
	<view class="rf-header" @tap="navToProductList(type)">
		<view class="left">
			<text class="title in1line">{{ title }}</text>
			<text class="sub-title in1line" v-if="subTitle">{{ subTitle }}</text>
<!--			<rf-count-down-->
<!--				v-if="type === 'discount'"-->
<!--				:show-day="false"-->
<!--				:second="1267"-->
<!--				color="#FFFFFF"-->
<!--				:background-color="themeColor.color"-->
<!--				:border-color="themeColor.color"-->
<!--			/>-->
<!--			<view v-if="type === 'wholesale'" class="wholesale-header">-->
<!--				<img class="head-img" v-for="item in 8" :key="item" :src="headImg" alt="">-->
<!--			</view>-->
		</view>
		<view class="more">更多<text class="iconfont iconyou"></text></view>
	</view>
</template>

<script>
// import rfCountDown from '@/components/rf-count-down';
export default {
	name: 'index',
	// components: {
	// 	rfCountDown
	// },
	props: {
		title: {
			type: String,
			default: ''
		},
		cateId: {
			type: String,
			default: ''
		},
		subTitle: {
			type: String,
			default: ''
		},
		type: {
			type: String,
			default: ''
		}
	},
	data() {
		return {
			headImg: this.$mAssetsPath.headImg
		};
	},
	methods: {
		navToProductList(type) {
			console.log('cateId', this.cateId);
			let url;
			switch (type) {
				case 'product':
					if (this.cateId) {
						url = `/pages/product/list?cate_id=${this.cateId}`;
					} else {
						url = '/pages/product/list';
					}
					break;
				case 'like':
					url = '/pages/product/list';
					break;
				case 'new':
					url = `/pages/product/list?param=${JSON.stringify({ is_new: 1 })}`;
					break;
				case 'recommend':
					url = `/pages/product/list?param=${JSON.stringify({ is_recommend: 1 })}`;
					break;
				case 'hot':
					url = `/pages/product/list?param=${JSON.stringify({ is_hot: 1 })}`;
					break;
				case 'bargain':
					url = '/pages/marketing/bargain/list';
					break;
				case 'wholesale':
					url = '/pages/marketing/wholesale/list';
					break;
				case 'presale':
					url = '/pages/marketing/presale/list';
					break;
				case 'group':
					url = '/pages/marketing/group/list';
					break;
				case 'discount':
					url = '/pages/marketing/discount/list';
					break;
				default:
					url = '';
					break;
			}
			if (url) this.$mRouter.push({ route: url });
		}
	}
};
</script>

<style scoped lang="scss">
/*爆款拼团*/
.rf-header {
  padding: $spacing-base $spacing-base $spacing-sm;
	display: flex;
	justify-content: space-between;
	align-items: center;
	.left {
		display: flex;
		justify-content: space-between;
		align-items: center;
		.title {
			min-width: 132rpx;
			font-size: $font-lg;
			//font-weight: 500;
			color: $font-color-dark;
			margin-right: $spacing-sm;
		}
		.sub-title {
			margin-left: $spacing-sm;
			font-size: $font-sm;
			color: $font-color-light;
		}
		.wholesale-header {
			height: 40rpx;
			.head-img {
				width: 40rpx;
				height: 40rpx;
				border-radius: 50%;
				margin-left: -14rpx;
			}
			.head-img:first-child {
				margin-left: $spacing-sm;
			}
		}
	}
	.more {
		text-align: right;
		color: $font-color-light;
    font-size: $font-sm;
		.iconfont {
      font-size: $font-base - 2rpx;
			margin-left: 2rpx;
		}
	}
}
</style>
