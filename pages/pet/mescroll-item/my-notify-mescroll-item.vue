<template>
	 <mescroll-uni :ref="'mescrollRef' + i" height="100%" top="0" @init="mescrollInit" :up="upOption" @up="upCallback" :down="downOption" @down="downCallback" @emptyclick="emptyClick">
		<view class="item" v-for="(item, index) in items" :key="index" @tap="navToApplyView(item.apply_id)">
			<view class="top">
				<view class="title u-line-2">[{{item.read_name}}]{{item.title}}</view>
				<!-- <view class="summary u-line-2">查看详情</view> -->
			</view>
			
			<view class="bottom">
				<view class="meta">
					<view class="datetime">{{item.created_at | datetime}}</view>
				</view>
				
				<u-line margin="20upx 0 0 0" />
				
				<view class="option">
					<u-button type="primary" size="mini" shape="circle" plain @click="navToApplyView(item.apply_id)">查看</u-button>
					<u-button type="warning" size="mini" shape="circle" plain @click="notifyReadOn(item.id)" v-if="item.read == 0">设为已读</u-button>
					<u-button type="warning" size="mini" shape="circle" plain @click="notifyReadOff(item.id)" v-if="item.read == 1">设为未读</u-button>
					<u-button type="error" size="mini" shape="circle" plain @click="notifyTrash(item.id)">删除</u-button>
				</view>
			</view>
		</view>
	</mescroll-uni>
</template>

<script>
import moment from '@/common/moment';
import MescrollMixin from '@/components/mescroll-uni/mescroll-mixins';
import MescrollMoreItemMixin from '@/components/mescroll-uni/mixins/mescroll-more-item';
import { notifyMyList, notifyReadOn, notifyReadOff, notifyTrash } from '@/api/pet';
import { mapMutations } from 'vuex';

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
		...mapMutations(['setNotifyNum']),
		navTo(route) {
			this.$mRouter.push({ route });
		},
		navToApplyView(apply_id) {
			let route = `/pages/pet/apply-view?id=${apply_id}`;
			this.navTo(route);
		},
		async notifyReadOn(id) {
			await this.$http.get(`${notifyReadOn}`, {
				id: id
			}).then(async r => {
				this.$mHelper.toast('操作成功！');
				this.mescroll.resetUpScroll();
			});
		},
		async notifyReadOff(id) {
			await this.$http.get(`${notifyReadOff}`, {
				id: id
			}).then(async r => {
				this.$mHelper.toast('操作成功！');
				this.mescroll.resetUpScroll();
			});
		},
		async notifyTrash(id) {
			let _this = this;
		
			uni.showModal({
				content: '确定要删除吗？',
				success(res) {
					if (res.confirm) {
						_this.$http.get(`${notifyTrash}`, {
							id: id
						}).then(async r => {
							_this.$mHelper.toast('删除成功！');
							_this.mescroll.resetUpScroll();
						});
					}
				}
			});
		},
		downCallback() {
			this.mescroll.resetUpScroll();
		},
		async upCallback(page) {
			let hasLogin = this.$mStore.getters.hasLogin;
			if (!hasLogin) return false
			
			let pageNum = page.num; // 页码, 默认从1开始
			let pageSize = page.size; // 页长, 默认每页10条
			let params = { page: pageNum, pageSize: pageSize };
			let read = this.tabs[this.i].key;
			
			Object.assign(params, { read: read });
			
			await this.$http.get(`${notifyMyList}`, params).then(async r => {
				if (this.i == 1) this.setNotifyNum(r.data.length);
				
				if (params.page == 1) this.items = [];
				let items = r.data;
				items.forEach((item, index) => {
					item.read_name = '未读';
					if (item.read == 1) {
						item.read_name = '已读';
					}
				});
				this.items = this.items.concat(items);
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
	padding: 24upx;
	margin: 30upx 30upx 0;
	.top {
		.title {
			font-size: 30upx;
		}
		.summary {
			color: #666;
			font-size: 24upx;
			margin-top: 16upx;
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