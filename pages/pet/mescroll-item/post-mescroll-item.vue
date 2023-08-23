<template>
	 <mescroll-uni :ref="'mescrollRef' + i" height="100%" top="0" @init="mescrollInit" :up="upOption" @up="upCallback" :down="downOption" @down="downCallback" @emptyclick="emptyClick">
		<view class="item" v-for="(item, index) in items" :key="index" @tap="navTo(`/pages/pet/forum-view?id=${item.id}`)">
			<view class="profile">
				<view class="left"><u-avatar :src="item.member.head_portrait" size="80" /></view>
				
				<view class="right">
					<view class="title">{{item.title}}</view>
					<view class="meta">
						<view class="nickname">{{item.member.nickname}}</view>
						<view class="datetime">{{item.updated_at | datetime}}</view>
						<view class="view">{{item.view}}查看</view>
						<view class="comment">{{item.comment}}评论</view>
					</view>
				</view>
			</view>
			
			<view class="summary u-line-2">{{item.content}}</view>
			
			<view class="images">
				<block v-for="(image, imageIndex) in item.images" :key="imageIndex">
					<u-image :src="image" width="200" height="200" border-radius="10" mode="aspectFill" />
				</block>
			</view>
			
			<view class="cate" v-if="item.cate">
				<u-button type="info" size="mini" plain :custom-style="cateCustomStyle">{{item.cate_name}}</u-button>
			</view>
		</view>
	</mescroll-uni>
</template>

<script>
import moment from '@/common/moment';
import MescrollMixin from '@/components/mescroll-uni/mescroll-mixins';
import MescrollMoreItemMixin from '@/components/mescroll-uni/mixins/mescroll-more-item';
import { postList } from '@/api/pet';

export default {
	mixins: [MescrollMixin, MescrollMoreItemMixin],
	data() {
		return {
			downOption:{
				use: true, // 是否启用下拉刷新; 默认true
				auto: false, // 是否在初始化完毕之后自动执行下拉刷新的回调; 默认true
				textLoading: '刷新中 ...'
			},
			upOption:{
				use: true, // 是否启用上拉加载; 默认true
				auto: false, // 是否在初始化完毕之后自动执行上拉加载的回调; 默认true
				isLock: false, // 是否锁定上拉加载 (可用于不触发upCallback,只保留回到顶部按钮的场景)
				page: {
					num: 0, // 当前页码,默认0,回调之前会加1,即callback(page)会从1开始
					size: 10 // 每页数据的数量,默认10
				},
				noMoreSize: 1 ,// 配置列表的总数量要大于等于5条才显示'-- END --'的提示
				toTop: {
					src: '/static/pet/mescroll-totop.png',
					offset: 200
				},
				empty: {
					icon: '/static/pet/mescroll-empty.png',
					tip: '~ 空空如也 ~',
					// btnText: '去看看'
				},
				lazyLoad: {
					use: true,
					attr: 'imgurl'
				}
			},
			cate: 0,
			items: [],
		}
	},
	props:{
		i: Number,
		index: {
			type: Number,
			default() {
				return 0;
			}
		},
		tabs: {
			type: Array,
			default() {
				return [];
			}
		}
	},
	computed: {
		cateCustomStyle() {
			return {
				height: '38rpx',
				lineHeight: '38rpx',
				color: this.themeColor.color,
				borderColor: this.themeColor.color
			}
		}
	},
	filters: {
		datetime(val) {
			return moment(val * 1000).format('YYYY-MM-DD HH:mm');
		},
	},
	methods: {
		navTo(route) {
			this.$mRouter.push({ route });
		},
		downCallback() {
			this.mescroll.resetUpScroll();
		},
		async upCallback(page) {
			let pageNum = page.num; // 页码, 默认从1开始
			let pageSize = page.size; // 页长, 默认每页10条
			// let q = ''; //this.q
			let params = { page: pageNum, pageSize: pageSize };
			let cate = this.tabs[this.i].key;

			Object.assign(params, { cate: cate });

			await this.$http.get(`${postList}?expand=member`, params).then(async r => {
				if (params.page == 1) this.items = [];
				this.items = this.items.concat(r.data);
				this.mescroll.endByPage(r.data.length, this.pageSize);
				// this.mescroll.endSuccess();
				// this.mescroll.endSuccess(items.length, this.hasNext);
				// this.mescroll.endBySize(items.length, parseInt(r.headers['x-pagination-total-count']));
			}).catch(() => {
				this.mescroll.endErr();
			});
		},
		emptyClick() {
			
		}
	}
}
</script>

<style lang="scss">
.item {
	background: $color-white;
	border-radius: 16upx;
	padding: 30upx;
	margin: 30upx;
	.profile {
		display: flex;
		.left {
			flex-basis: 17%;
		}
		.right {
			flex-basis: 80%;
			.title {
				color: #333;
				font-size: 32upx;
			}
			.meta {
				color: #999;
				font-size: 24upx;
				display: flex;
				justify-content: space-between;
				.nickname {
					color: #666;
					font-size: 24upx;
				}
				.datetime {
					color: #999;
					font-size: 24upx;
				}
				.view {
					color: #999;
					font-size: 24upx;
				}
				.comment {
					color: #999;
					font-size: 24upx;
				}
			}
		}
	}
	.summary {
		color: #666;
		font-size: 24upx;
		margin-top: 10upx;
	}
	.images {
		display: flex;
		flex-wrap: wrap;
		//justify-content: space-between;
		u-image, .u-image {
			margin: 16upx 14upx 0 0;
		}
		u-image:nth-child(3n+3), .u-image:nth-child(3n+3) {
			margin: 16upx 0 0 0;
		}
	}
	::v-deep u-image {
		margin-top: 16upx;
	}
	.cate {
		margin-top: 20upx;
		.tag {
			height: 38upx;
			line-height: 38upx;
			background: #FFF;
			color: #CCC;
			font-size: 24upx;
			border: 2upx #CCC solid;
			border-radius: 10upx;
			padding: 0 20upx;
			display: inline-block;
			text-align: center;
		}
	}
}
</style>
