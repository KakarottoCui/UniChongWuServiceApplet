<template>
	<view class="rf-rubik-cube" :style="{margin: `0 ${padding * 2}rpx`}">
		<view class="wrapper template1" v-if="params.rubikCubeType === 'template1'">
			<view class="nav-item" :style="{marginRight: `${innerPadding * 2}rpx`}">
				<image :style="{borderRadius: `${radius * 2}rpx`}" class="image" @tap="customNavTo(params.list[0])" :src="params.list[0].cover || defaultImg"/>
			</view>
			<view class="nav-item">
				<image :style="{borderRadius: `${radius * 2}rpx`}" class="image" @tap="customNavTo(params.list[1])" :src="params.list[1].cover || defaultImg"/>
			</view>
		</view>
		<view class="wrapper template2" v-if="params.rubikCubeType === 'template2'">
			<view class="nav-item" :style="{marginRight: `${innerPadding * 2}rpx`}">
				<image :style="{borderRadius: `${radius * 2}rpx`}" @tap="customNavTo(params.list[0])" class="image" :src="params.list[0].cover || defaultImg"/>
			</view>
			<view class="nav-item" :style="{marginRight: `${innerPadding * 2}rpx`}">
				<image :style="{borderRadius: `${radius * 2}rpx`}" @tap="customNavTo(params.list[1])" class="image" :src="params.list[1].cover || defaultImg"/>
			</view>
			<view class="nav-item">
				<image :style="{borderRadius: `${radius * 2}rpx`}" @tap="customNavTo(params.list[2])" class="image" :src="params.list[2].cover || defaultImg"/>
			</view>
		</view>
		<view class="wrapper template3" v-if="params.rubikCubeType === 'template3'">
			<view class="nav-item" :style="{marginRight: `${innerPadding * 2}rpx`}">
				<image :style="{borderRadius: `${radius * 2}rpx`}" class="image" @tap="customNavTo(params.list[0])" :src="params.list[0].cover || defaultImg"/>
			</view>
			<view class="nav-item" :style="{marginRight: `${innerPadding * 2}rpx`}">
				<image :style="{borderRadius: `${radius * 2}rpx`}" class="image" @tap="customNavTo(params.list[1])" :src="params.list[1].cover || defaultImg"/>
			</view>
			<view class="nav-item" :style="{marginRight: `${innerPadding * 2}rpx`}">
				<image :style="{borderRadius: `${radius * 2}rpx`}" class="image" @tap="customNavTo(params.list[2])" :src="params.list[2].cover || defaultImg"/>
			</view>
			<view class="nav-item">
				<image :style="{borderRadius: `${radius * 2}rpx`}" class="image" @tap="customNavTo(params.list[3])" :src="params.list[3].cover || defaultImg"/>
			</view>
		</view>
		<view class="wrapper template4" v-if="params.rubikCubeType === 'template4'">
			<view style="width: 100%;">
				<view class="nav-item-wrapper" :style="{marginBottom: `${innerPadding * 2 - 4}rpx`}">
					<view class="nav-item" :style="{marginRight: `${innerPadding * 2}rpx`}">
						<image :style="{borderRadius: `${radius * 2}rpx`}" @tap="customNavTo(params.list[0])" class="image" :src="params.list[0].cover || defaultImg"/>
					</view>
					<view class="nav-item">
						<image :style="{borderRadius: `${radius * 2}rpx`}" @tap="customNavTo(params.list[1])" class="image" :src="params.list[1].cover || defaultImg"/>
					</view>
				</view>
				<view class="nav-item-wrapper">
					<view class="nav-item" :style="{marginRight: `${innerPadding * 2}rpx`}">
						<image :style="{borderRadius: `${radius * 2}rpx`}" @tap="customNavTo(params.list[2])" class="image" :src="params.list[2].cover || defaultImg"/>
					</view>
					<view class="nav-item">
						<image :style="{borderRadius: `${radius * 2}rpx`}" @tap="customNavTo(params.list[3])" class="image" :src="params.list[3].cover || defaultImg"/>
					</view>
				</view>
			</view>
		</view>
		<view class="wrapper template5" v-if="params.rubikCubeType === 'template5'">
			<view class="nav-item" :style="{marginRight: `${innerPadding * 2}rpx`}">
				<image :style="{borderRadius: `${radius * 2}rpx`, height: `${362 + innerPadding * 2 }rpx`}" @tap="customNavTo(params.list[0])" class="template5-image" :src="params.list[0].cover || defaultImg"/>
			</view>
			<view class="nav-item">
				<image :style="{borderRadius: `${radius * 2}rpx`, marginBottom: `${innerPadding * 2 - 4}rpx`}" @tap="customNavTo(params.list[1])" class="image" :src="params.list[1].cover || defaultImg"/>
				<image :style="{borderRadius: `${radius * 2}rpx`}" @tap="customNavTo(params.list[2])" class="image" :src="params.list[2].cover || defaultImg"/>
			</view>
		</view>
		<view class="wrapper template6" v-if="params.rubikCubeType === 'template6'">
			<view style="width: 100%;">
				<view class="nav-item" :span="24" :style="{marginBottom: `${innerPadding * 2 - 4}rpx`}">
					<image :style="{borderRadius: `${radius * 2}rpx`}" @tap="customNavTo(params.list[0])" class="template6-image" :src="params.list[0].cover || defaultImg"/>
				</view>
				<view class="nav-item-wrapper">
					<view class="nav-item" :style="{marginRight: `${innerPadding * 2}rpx`}">
						<image :style="{borderRadius: `${radius * 2}rpx`}" @tap="customNavTo(params.list[1])" class="image" :src="params.list[1].cover || defaultImg"/>
					</view>
					<view class="nav-item">
						<image :style="{borderRadius: `${radius * 2}rpx`}" @tap="customNavTo(params.list[2])" class="image" :src="params.list[2].cover || defaultImg"/>
					</view>
				</view>
			</view>
		</view>
		<view class="wrapper template7" v-if="params.rubikCubeType === 'template7'">
			<view class="nav-item" :style="{marginRight: `${innerPadding * 2}rpx`}">
				<image class="template7-image" :style="{borderRadius: `${radius * 2}rpx`, height: `${368 + innerPadding * 2 }rpx`}" @tap="customNavTo(params.list[0])" :src="params.list[0].cover || defaultImg"/>
			</view>
			<view class="nav-item">
				<view class="nav-item" :style="{marginBottom: `${innerPadding * 2 - 4}rpx`}">
					<image :style="{borderRadius: `${radius * 2}rpx`}" @tap="customNavTo(params.list[1])" class="image" :src="params.list[1].cover || defaultImg"/>
				</view>
				<view class="nav-item-bottom">
					<view class="nav-item" :style="{marginRight: `${innerPadding * 2}rpx`}">
						<image :style="{borderRadius: `${radius * 2}rpx`}" @tap="customNavTo(params.list[2])" class="template7-image2" :src="params.list[2].cover || defaultImg"/>
					</view>
					<view class="nav-item">
						<image :style="{borderRadius: `${radius * 2}rpx`}" @tap="customNavTo(params.list[3])" class="template7-image2" :src="params.list[3].cover || defaultImg"/>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	name: 'index',
	props: {
		params: {
			type: Object,
			default: () => {
				return {};
			}
		},
		padding: {
			type: Number,
			default: 24
		},
		radius: {
			type: Number,
			default: 0
		},
		innerPadding: {
			type: Number,
			default: 10
		}
	},
	data() {
		return {
			defaultImg: this.$mAssetsPath.defaultImg
		};
	},
	methods: {
		customNavTo(item) {
			this.$mHelper.handleBasicNavTo(item.type, item.link_url, item.id, item.urlType, item.innerLink, item.externalLink);
		}
	}
};
</script>

<style scoped lang="scss">
.rf-rubik-cube {
	.mr {
		margin-right: $spacing-sm;
	}

	.wrapper {
		display: flex;
	}
	.nav-item {
		line-height: 1;
	}

	.template1, .template2, .template3 {
		.nav-item {
			flex: 1;
		}

		.image {
			width: 100%;
			height: 320rpx;
		}
	}

	.template2 {
		.image {
			height: 260rpx;
		}
	}

	.template3 {
		.image {
			height: 190rpx;
		}
	}

	.template4 {
		.nav-item-wrapper {
			width: 100%;
			display: flex;

			.nav-item {
				flex: 1;

				.image {
					width: 100%;
					height: 190rpx;
				}
			}
		}
	}

	.template5 {
		width: 100%;
		.nav-item {
			flex: 1;
			.template5-image {
				width: 100%;
			}

			.image {
				width: 100%;
				height: 180rpx;
			}
		}
	}

	.template6 {
		.template6-image {
			width: 100%;
			height: 192rpx;
		}

		.nav-item-wrapper {
			display: flex;
			.nav-item {
				flex: 1;
				.image {
					width: 100%;
					height: 168rpx;
				}
			}
		}
	}

	.template7 {
		width: 100%;
		.nav-item {
			flex: 1;
			.template7-image {
				width: 100%;
				height: 378rpx
			}

			.image {
				width: 100%;
				height: 184rpx;
			}
		}
		.nav-item-bottom {
			display: flex;
			.nav-item {
				flex: 1;
				.template7-image2 {
					width: 100%;
					height: 184rpx
				}
			}
		}
	}
}
</style>
