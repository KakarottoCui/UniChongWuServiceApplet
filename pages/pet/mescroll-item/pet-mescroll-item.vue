<template>
	 <mescroll-uni :ref="'mescrollRef' + i" height="100%" top="0" @init="mescrollInit" :up="upOption" @up="upCallback" :down="downOption" @down="downCallback" @emptyclick="emptyClick">
		<view class="item" v-for="(item, index) in items" :key="index" @tap="navTo(`/pages/pet/pet-view?id=${item.id}`)">
			<view class="left"><u-image :src="item.poster" width="100%" height="220" border-radius="10" mode="aspectFill" /></view>
			
			<view class="right">
				<view class="title u-line-2">{{item.title}}</view>
		
				<view class="base">
					<view class="tag">{{item.cate_name}}</view>
					<view class="tag">{{item.gender_name}}</view>
					<view class="tag">{{item.age_name}}</view>
				</view>
				
				<view class="status" v-if="tabs[i].key == 1">
					<view class="tag">{{item.vaccine_name}}</view>
					<view class="tag">{{item.deworm_name}}</view>
					<view class="tag">{{item.sterilize_name}}</view>
				</view>
				
				<view class="area"><u-icon name="map" :color="themeColor.color" /> {{item.area}}</view>
				
				<view class="reward" v-if="tabs[i].key == 2">悬赏￥<text class="money">{{item.money}}</text></view>
				<view class="summary u-line-2" v-if="tabs[i].key != 2">{{item.content}}</view>
			</view>
			
			<view class="bottom">
				<view class="datetime">{{item.updated_at | datetime}}</view>
				<view class="view">{{item.view}}查看</view>
				<view class="share">{{item.share}}转发</view>
			</view>
		</view>
	</mescroll-uni>
</template>

<script>
import moment from '@/common/moment';
import MescrollMixin from '@/components/mescroll-uni/mescroll-mixins';
import MescrollMoreItemMixin from '@/components/mescroll-uni/mixins/mescroll-more-item';
import { petIndex, petList } from '@/api/pet';

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
		navTo(route) {
			this.$mRouter.push({ route });
		},
		downCallback() {
			this.mescroll.resetUpScroll();
		},
		async upCallback(page) {
			let pageNum = page.num; // 页码, 默认从1开始
			let pageSize = page.size; // 页长, 默认每页10条
			let params = { page: pageNum, pageSize: pageSize };
			let type = this.tabs[this.i].key;
			let city_id = 0;
			let city = uni.getStorageSync('city');
			if (city) city_id = city.id;
			
			Object.assign(params, { type: type, city_id: city_id }, this.params);

			await this.$http.get(`${petList}`, params).then(async r => {
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
	margin: 30upx;
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
			margin-top: -10upx;
		}
		.base {
			margin-top: 12upx;
			.tag {
				height: 40upx;
				line-height: 40upx;
				background: #F6F7FB;
				color: #666;
				font-size: 24upx;
				border-radius: 10upx;
				padding: 0 20upx;
				margin-right: 14upx;
				display: inline-block;
			}
			.tag:nth-child(3) {
				margin-right: 0;
			}
		}
		.status {
			margin-top: 12upx;
			.tag {
				height: 38upx;
				line-height: 38upx;
				color: #CCC;
				font-size: 24upx;
				margin-right: 14upx;
				border: 2upx #CCC solid;
				border-radius: 10upx;
				padding: 0 20upx;
				display: inline-block;
			}
			.tag:nth-child(3) {
				margin-right: 0;
			}
		}
		.area {
			color: #666;
			font-size: 24upx;
			margin-top: 12upx;
		}
		.reward {
			color: #EB568F;
			font-size: 24upx;
			.money {
				color: #EB568F;
				font-size: 40upx;
			}
		}
		.summary {
			color: #666;
			font-size: 24upx;
			margin-top: 12upx;
		}
	}
	.bottom {
		color: #999;
		display: flex;
		flex-basis: 100%;
		margin-top: 20upx;
		.datetime {
			font-size: 22upx;
		}
		.view {
			font-size: 22upx;
			margin-left: 40upx;
		}
		.share {
			font-size: 22upx;
			margin-left: 30upx;
		}
	}
}
</style>