<template>
	<view :class="'bg-' + themeColor.name">
		<view class="cu-custom">
			<view class="cu-bar fixed" :style="style" :class="[bgImage!=''?'none-bg text-white bg-img':'',bgColor]">
				<view class="action" @tap="BackPage" v-if="isBack">
					<text class="cuIcon-back"></text>
					<slot name="backText"></slot>
				</view>
				<view class="content" :style="[{top:statusBar + 'px'}]">
					<slot name="content"></slot>
				</view>
				<slot name="right"></slot>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			StatusBar: this.StatusBar,
			CustomBar: this.CustomBar
		};
	},
	name: 'cu-custom',
	computed: {
		statusBar() {
			let StatusBar = this.StatusBar;
			// #ifdef MP
			StatusBar += 20;
			// #endif
			return StatusBar;
		},
		style() {
			let StatusBar = this.statusBar;
			const CustomBar = this.CustomBar;
			const bgImage = this.bgImage;
			let style = `height:${CustomBar}px;padding-top:${StatusBar}px;`;
			if (this.bgImage) {
				style = `${style}background-image:url(${bgImage});`;
			}
			return style;
		}
	},
	props: {
		bgColor: {
			type: String,
			default: ''
		},
		isBack: {
			type: [Boolean, String],
			default: false
		},
		bgImage: {
			type: String,
			default: ''
		}
	},
	methods: {
		BackPage() {
			this.$mRouter.back();
		}
	}
};
</script>

<style>
</style>
