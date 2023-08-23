<template>
	 <mescroll-uni :ref="'mescrollRef' + i" height="100%" top="0" @init="mescrollInit" :up="upOption" @up="upCallback" :down="downOption" @down="downCallback" @emptyclick="emptyClick">
		<view class="item" v-for="(item, index) in items" :key="index" @tap="navTo(item.pet.id, item.pet.type)" v-if="item.pet">
			<view class="left"><u-image :src="item.pet.poster" width="100%" height="210" border-radius="20" mode="aspectFill" /></view>
			
			<view class="right">
				<view class="title">{{item.pet.title || item.pet.nickname}}</view>
		
				<view class="base">
					<view class="tag">{{item.pet.age_name}}</view>
					<view class="tag">{{item.pet.gender_name}}</view>
					<view class="tag">{{item.pet.area}}</view>
				</view>
				
				<view class="summary u-line-1">{{item.pet.content}}</view>
					
				<view class="status">
					<view class="tag">{{item.pet.vaccine_name}}</view>
					<view class="tag">{{item.pet.deworm_name}}</view>
					<view class="tag">{{item.pet.sterilize_name}}</view>
				</view>
			</view>
			
			<view class="bottom">
				<view class="meta">
					<view class="datetime">{{item.pet.created_at | datetime}}</view>
					<view class="view">{{item.pet.view}}查看</view>
					<view class="share">{{item.pet.share}}转发</view>
				</view>
				
				<!-- <u-line margin="20upx 0 0 0" /> -->
			</view>
		</view>
	</mescroll-uni>
</template>

<script>
import moment from '@/common/moment';
import MescrollMixin from '@/components/mescroll-uni/mescroll-mixins';
import MescrollMoreItemMixin from '@/components/mescroll-uni/mixins/mescroll-more-item';
import { applyMyList } from '@/api/pet';

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
			type: 2,
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
		},
		params: {
			type: Object,
			default() {
				return {};
			}
		}
	},
	filters: {
		datetime(val) {
			return moment(val * 1000).format('YYYY-MM-DD HH:mm');
		},
	},
	methods: {
		navTo(id, type) {
			let route = `/pages/pet/adopt-view?id=${id}`;
			if (type == 2) route = `/pages/pet/pet-view?id=${id}`;
			if (type == 3) route = `/pages/pet/owner-view?id=${id}`;
			this.$mRouter.push({ route });
		},
		downCallback() {
			this.mescroll.resetUpScroll();
		},
		async upCallback(page) {
			let pageNum = page.num; // 页码, 默认从1开始
			let pageSize = page.size; // 页长, 默认每页10条
			let params = { page: pageNum, pageSize: pageSize };

			await this.$http.get(`${applyMyList}?expand=pet`, params).then(async r => {
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
	background: #FFF;
	border-radius: 8px;
	display: flex;
	flex-wrap: wrap;
	padding: 24upx;
	margin: 30upx 30upx 0;
	.left {
		flex-basis: 33%;
	}
	.right {
		//flex-grow: 1;
		//flex-basis: 67%;
		width: 67%;
		padding: 0 24upx;
		.title {
			font-size: 30upx;
		}
		.base {
			margin-top: 10upx;
			.tag {
				height: 38upx;
				line-height: 40upx;
				color: #666;
				font-size: 24upx;
				margin-right: 14upx;
				background: #F6F7FB;
				border-radius: 6upx;
				text-align: center;
				padding: 0 20upx;
				display: inline-block;
			}
			.tag:nth-child(3) {
				margin-right: 0;
			}
		}
		.summary {
			color: #666;
			font-size: 24upx;
			margin-top: 14upx;
		}
		.status {
			margin-top: 14upx;
			.tag {
				height: 38upx;
				line-height: 38upx;
				color: #61BDC6;
				font-size: 24upx;
				margin-right: 14upx;
				background: #FFF;
				border: 2upx #61BDC6 solid;
				border-radius: 6upx;
				text-align: center;
				padding: 0 16upx;
				display: inline-block;
			}
			.tag:nth-child(3) {
				margin-right: 0;
			}
		}
	}
	.bottom {
		flex-basis: 100%;
		margin-top: 20upx;
		.meta {
			color: #999;
			font-size: 22upx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			.datetime {
				font-size: inherit;
			}
			.view {
				font-size: inherit;
				padding: 0 10upx;
			}
			.share {
				font-size: inherit;
			}
		}
		.option {
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-top: 20upx;
		}
	}
}
</style>