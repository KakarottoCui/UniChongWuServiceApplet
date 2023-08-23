<template>
	<view class="rf-swiper-category">
		<block v-if="type === 'swiper'">
			<swiper
				:disable-touch="productCateList.length <= 10"
				@change="handleCateSwiperChange"
				:style="{height: productCateList.length <= 5 ? '200rpx' : '410rpx'}"
				v-if="productCateList.length > 0">
				<swiper-item
					class="category-list"
					v-for="(fItem, fIndex) in swipeCateList"
					:key="fIndex"
				>
					<view
						class="category"
						v-for="(sItem, sIndex) in fItem" :key="sIndex" @tap.stop="navToCategory(sItem)">
						<view class="img">
							<image :src="sItem.cover || errorImage" mode="aspectFill"></image>
						</view>
						<view class="text in1line">{{sItem.cate_title || sItem.title || '导航'}}</view>
					</view>
				</swiper-item>
			</swiper>
			<view class="rf-swiper-category-dot" v-if="productCateList.length > 10">
				<text class="dot" :class="current === index ? 'active bg-' + themeColor.name : 'normal'" v-for="(item, index) in Math.ceil(productCateList.length / 10)" :key="item"></text>
			</view>
		</block>
		<scroll-view scroll-x class="swiper-scroll" v-if="type === 'swiperSubTit'">
			<view
				class="category-scroll-list"
				v-for="(fItem, fIndex) in productCateList"
				:key="fIndex"
				@tap.stop="navToCategory(fItem)"
			>
				<view class="title">
					{{ fItem.cate_title || fItem.title || '导航'}}
				</view>
				<view class="sub-tit">
					{{ fItem.subhead || '精选好物'}}
				</view>
			</view>
		</scroll-view>
		<scroll-view scroll-x class="swiper-scroll swiper-default" v-if="type === 'swiperDefault'">
			<view
				class="category-scroll-list "
				v-for="(fItem, fIndex) in productCateList"
				:key="fIndex"
				@tap.stop="navToCategory(fItem)"
			>
				<view class="title">
					{{ fItem.cate_title || fItem.title}}
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
export default {
	name: 'index',
	props: {
		productCateList: {
			type: Array,
			default: () => {
				return [];
			}
		},
		type: {
			type: String,
			default: 'swiper'
		},
		categoryType: {
			type: String,
			default: ''
		},
		swipeCateList: {
			type: Array,
			default: () => {
				return [];
			}
		}
	},
	data() {
		return {
			current: 0,
			errorImage: this.$mAssetsPath.errorImage
		};
	},
	methods: {
		// 跳转至分类模块
		navToCategory(item) {
			const id = item.id;
			if (this.categoryType === 'diy') {
				this.customNavTo(item);
			} else {
				if (this.$mSettingConfig.appCateType === '2') {
					uni.setStorageSync('indexToCateId', id);
					this.$mRouter.reLaunch({ route: '/pages/category/category' });
				} else {
					this.$mRouter.push({
						route: `/pages/product/list?cate_id=${id}`
					});
				}
			}
		},
		// 自定义装修通用跳转封装
		customNavTo(item) {
			this.$mHelper.handleBasicNavTo(item.type, item.link_url, item.id, item.urlType, item.innerLink, item.externalLink);
		},
		handleCateSwiperChange (e) {
			this.current = e.detail.current;
		}
	}
};
</script>

<style scoped lang="scss">
/*分类列表*/
.rf-swiper-category {
	width: calc(100% - 60rpx);
	margin: 0 30rpx;
	white-space: nowrap;
	.category-list {
			width: 100%;
			display: flex;
			flex-wrap: wrap;
			.category {
				width: calc(20% - 20rpx);
				height: 132rpx;
				display: flex;
				text-align: center;
				flex-wrap: wrap;
				margin: $spacing-sm $spacing-base 0 0;
				.img {
					width: 16vw;
					height: 16vw;
					display: flex;
					justify-content: center;
					image {
						width: 16vw;
						height: 16vw;
						border-radius: 50%;
					}
				}
				.text {
					margin-top: $spacing-sm;
					width: 100%;
					display: flex;
					justify-content: center;
					font-size: 24rpx;
					color: #3c3c3c;
				}
			}
		}
	.rf-swiper-category-dot {
		display: flex;
		justify-content: center;
		.dot {
			display: inline-block;
			height: 6rpx;
			width: $spacing-lg;
			border-radius: 3rpx;
		}
		.active {
			width: $spacing-lg * 1.5;
		}
		.normal {
			background-color: #e5e5e5;
		}
	}
	.swiper-scroll {
		width: 100%;
		background-color: $color-white;
		padding: $spacing-base;
		border-radius: 12rpx;
		.category-scroll-list {
			padding: 0 15rpx;
			text-align: center;
			display: inline-block;
			.title {
				line-height: 1;
				font-size: $font-lg;
				font-weight: 400;
				color: $font-color-dark;
			}
			.sub-tit {
				margin-top: 10rpx;
				font-size: $font-sm;
				color: $font-color-light
			}
		}
	}
	.swiper-default {
		.category-scroll-list {
			border-right: 5rpx solid rgba(0, 0, 0, 0.15);
		}
		.category-scroll-list:last-child {
			border-right: none;
		}
	}
}
</style>
