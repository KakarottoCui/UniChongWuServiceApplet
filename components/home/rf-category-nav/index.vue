<template>
	<scroll-view
		scroll-x
		class="index-cate"
		v-if="isOpenIndexCate && categoryList.length > 0">
		<view
			v-for="(item, index) in categoryList"
			:key="index"
			class="index-cate-item"
			:class="tabCurrentIndex === index ? `active` : 'text-white'"
			@tap.stop="tabClick(index, item.id)"
		>
			{{ item.title }}
			<view	:class="tabCurrentIndex === index ? 'integral-active bg-' + themeColor.name : ''"></view>
		</view>
	</scroll-view>
</template>

<script>
export default {
	name: 'index',
	props: {
		categoryList: {
			type: Array,
			default() {
				return [];
			}
		}
	},
	data() {
		return {
			tabCurrentIndex: 0,
			isOpenIndexCate: this.$mSettingConfig.isOpenIndexCate
		};
	},
	methods: {
		tabClick(index, id) {
			this.tabCurrentIndex = index;
			this.$emit('tab', {
				id
			});
		}
	}
};
</script>

<style scoped lang="scss">
// 滑动分类
.index-cate {
	white-space: nowrap;
	z-index: 12;
	color: $font-color-base;
	.index-cate-item {
		display: inline-block;
		padding: $spacing-sm 0 0;
		margin: 0 15rpx 10rpx;
		text-align: center;
		font-size: $font-lg - 2rpx;
		color: $color-white;
		.integral-active {
			margin: $spacing-sm / 2 auto 0;
			width: $spacing-lg + 10rpx;
			height: 6rpx;
			background: #ffa64c;
			border-radius: 3rpx;
		}
	}
	.active {
		font-weight: 500;
		font-size: $font-lg + 2rpx;
	}
}
</style>
