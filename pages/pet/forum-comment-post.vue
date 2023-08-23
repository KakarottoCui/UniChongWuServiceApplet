<template>
	<view class="wrap">
		<view class="subwrap">
			<u-form ref="uForm" :model="item" :rules="rules" label-position="top" :border-bottom="false" :errorType="errorType">
				<u-form-item label="评论内容" prop="content" :border-bottom="false" :label-style="labelStyle">
					<u-input type="textarea" v-model="item.content" height="300" :custom-style="customStyle" placeholder="请输入" />
				</u-form-item>
				
				<u-button type="warning" form-type="submit" @click="submit" :loading="submitLoading" shape="circle" :ripple="true" :custom-style="customStyle02">提交</u-button>
			</u-form>
		</view>
	</view>
</template>

<script>
import { postCommentView, postCommentForm } from '@/api/pet';

export default {
	data() {
		return {
			$mData: this.$mData,
			errorType: ['toast', 'message', 'border-bottom'],
			submitLoading: false,
			loading: false,
			id: 0,
			post_id: 0,
			item: {
				post_id: 0,
				content: ''
			},
			rules: {
				content: this.$mData.rules.content_comment,
			}
		};
	},
	onLoad(option) {
		this.id = option.id ? option.id : this.id;
		this.post_id = option.post_id ? option.post_id : this.post_id;
	},
	onShow() {
		this.initLogin();
	},
	onReady(res) {
		if (this.id) {
			uni.setNavigationBarTitle({
			  title: '编辑评论'
			});
		}
		
		this.$refs.uForm.setRules(this.rules);
	},
	mounted() {
		this.initData();
	},
	computed: {
		labelStyle() {
			return {
				height: '30rpx',
				fontSize: '30rpx',
				borderLeft: `6rpx ${this.themeColor.color} solid`,
				borderRadius: '3rpx',
				paddingLeft: '20rpx'
			}
		},
		customStyle() { 
			return {
				background: '#F6F7FB',
				borderRadius: '16rpx',
				padding: '0 30rpx',
				marginTop: '20rpx',
				padding: '20rpx 30rpx'
			}
		},
		customStyle02() {
			return {
				background: this.themeColor.color,
				color: '#FFF',
				fontSize: '30rpx',
				padding: '46rpx 0',
				marginTop: '60rpx'
			}
		}
	},
	methods: {
		async initLogin() {
			let hasLogin = this.$mStore.getters.hasLogin;
			let userInfo = uni.getStorageSync('userInfo');
			
			if (!hasLogin|| !userInfo) {
				this.navTo('/pages/public/logintype');
			}
		},
		async initData() {
			if (this.id) {
				await this.getCommentView();
			}
		},
		navTo(route) {
			this.$mRouter.push({ route });
		},
		async getCommentView() {
			await this.$http.get(`${postCommentView}`, {
				id: this.id
			}).then(async r => {
				this.loading = false;
				this.item = r.data;
			}).catch(err => {
				this.loading = false;
			});
		},
		submit() {
			this.item.post_id = this.post_id;
			this.$refs.uForm.validate(valid => {
				if (valid) {
					this.postItem(this.item);
				}
			});
		},
		postItem(params) {
			this.submitLoading = true;
			let url = `${postCommentForm}`;
			if (this.id) url += `?id=${this.id}`;
			
			this.$http.post(url, {
				...params,
			}).then(async r => {
				this.submitLoading = false;

				let _this = this;
				uni.showModal({
					content: '发布成功！可能需审核通过后显示。',
					showCancel: false,
					success(res) {
						if (res.confirm) {
							_this.$mRouter.back();
						}
					}
				});
			}).catch(err => {
				this.submitLoading = false;
			});
		}
	}
};
</script>

<style lang="scss">
	page {
		background: $color-white;
	}
	.wrap {
		padding: 30upx;
		.subwrap {
			background: $color-white;
			.contact {
				background: #F6F7FB;
				border-radius: 16upx;
				padding: 10upx 30upx;
			}
		}
	}
</style>
