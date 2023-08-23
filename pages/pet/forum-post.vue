<template>
	<view class="wrap">
		<view class="subwrap">
			<u-form ref="uForm" :model="item" :rules="rules" label-position="top" :border-bottom="false" :errorType="errorType">
				<u-form-item label="视频" prop="video" :border-bottom="false" :label-style="labelStyle">
					<tm-upload ref="videoRef" @change="getUploadVideos" @progress="uploadVideosProgress" @remove="removeVideos" :upload_auto="true" :upimg_move="true"></tm-upload>
				</u-form-item>
				
				<u-divider half-width="100%">视频上传：0-1个，可选项</u-divider>
				
				<u-form-item label="图片" prop="images" :border-bottom="false" :label-style="labelStyle">
					<u-upload ref="uploadRef" :header="uploadHeader" :action="uploadAction" :file-list="uploadFileList" :max-size="5 * 1024 * 1024" max-count="9" @on-success="uploadSuccess" @on-uploaded="uploaded" @on-error="uploadError" @on-remove="uploadRemove" @on-change="uploadChange"></u-upload>
				</u-form-item>
				
				<u-divider half-width="100%">图片上传：0-9张，可选项</u-divider>
				
				<u-form-item label="标题" prop="title" :border-bottom="false" :label-style="labelStyle">
					<u-input v-model="item.title" maxlength="100" height="100" :custom-style="customStyle" :trim="true" placeholder="请输入" />
				</u-form-item>
				
				<u-form-item label="分类" prop="cate" :border-bottom="false" :label-style="labelStyle"></u-form-item>
				<u-subsection :list="$mData.postCates02" :current="item.cate - 1" mode="button" height="68" :bold="false" active-color="#FFF" :button-color="themeColor.color" @change="cateSubsectionChange"></u-subsection>
				
				<u-gap height="20" />
				
				<u-form-item label="正文" prop="content" :border-bottom="false" :label-style="labelStyle">
					<u-input type="textarea" v-model="item.content" height="246" :custom-style="customStyle02" placeholder="请输入" />
				</u-form-item>
				
				<u-line-progress active-color="#FECD32" :percent="progress" v-if="progress && !item.video"></u-line-progress>
				
				<view class="progress-tips" v-if="progress == 100 && !item.video">
					发送完成100%，服务端正在进行接收处理，请稍等...<u-loading mode="circle" color="#F90" :size="26"></u-loading>
				</view>
				
				<u-button type="warning" form-type="submit" @click="submit" :loading="submitLoading" shape="circle" :ripple="true" :custom-style="customStyle03">提交</u-button>
			</u-form>
		</view>
	</view>
</template>

<script>
import { postMyView, postForm, fileImages, fileVideos } from '@/api/pet';

export default {
	data() {
		return {
			$mData: this.$mData,
			errorType: ['toast', 'message', 'border-bottom'],
			submitLoading: false,
			uploadHeader: { 'x-api-key': uni.getStorageSync('accessToken') },
			uploadAction: this.$mConfig.baseUrl + fileImages,
			uploadFileList: [],
			videoContext: {},
			progress: 0,
			id: 0,
			item: {
				title: '',
				cate: 1,
				content: '',
				images: [],
				video: ''
			},
			rules: {
				title: this.$mData.rules.title,
				content: this.$mData.rules.content_forum,
				//images: this.$mData.rules.images,
			},
			cates: [
				{
					cate: 1,
					name: '晒照'
				}, 
				{
					cate: 2,
					name: '求助'
				}, 
				{
					cate: 3,
					name: '科普'
				},
				{
					cate: 4,
					name: '闲置'
				}
			]
		};
	},
	onLoad(option) {
		this.id = option.id ? option.id : this.id;
	},
	onShow() {
		this.initLogin();
	},
	onReady(res) {
		if (this.id) {
			uni.setNavigationBarTitle({
			  title: '编辑帖子'
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
				marginTop: '20rpx'
			}
		},
		customStyle02() {
			return Object.assign(this.customStyle, { padding: '20rpx 30rpx' });
		},
		customStyle03() {
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
			
			if (!hasLogin) {
				this.navTo('/pages/public/logintype');
			}
		},
		async initData() {
			if (this.id) {
				await this.getPostMyView();
			}
			
			this.$nextTick(() => {
				this.$refs.videoRef.type = 'video';
				this.$refs.videoRef.url =`${fileVideos}`;
				this.$refs.videoRef.upload_count = 1;
				this.$refs.videoRef.upload_img_wh = 260 - 60;
				this.$refs.videoRef.upload_max = 200; //MB
				/* this.$refs.videoRef.header = {
					'authorization': `Bearer ` + this.$tui.getAccessToken()
				} */
				
				if (this.item.video) {
					let videos = [];
					let item = JSON.parse(JSON.stringify(this.item));
					
					videos.push({ path: item.video, upload_percent: 100 });
					this.$refs.videoRef.upload_before_list = videos;
				}
			});
		},
		navTo(route) {
			this.$mRouter.push({ route });
		},
		async getPostMyView() {
			await this.$http.get(`${postMyView}`, {
				id: this.id
			}).then(async r => {
				this.loading = false;
				this.item = r.data;
				this.item.datetime_name = this.$u.timeFormat(this.item.datetime, 'yyyy-mm-dd hh:MM');
				
				let images = [];
				this.item.images.forEach((image, index) => {
					images.push({ url: image });
				});
				this.uploadFileList = images;
			}).catch(err => {
				this.loading = false;
			});
		},
		submit() {
			let lists = [];
			let images = [];
			lists = this.$refs.uploadRef.lists.filter(item => {
				return item.progress == 100;
			});
			
			lists.forEach((list, index) => {
				if (list.response) {
					images.push(list.response.data.url);
				} else {
					images.push(list.url);
				}
			});
			
			this.item.images = images;
			this.$refs.uForm.validate(valid => {
				if (valid) {
					this.postItem(this.item);
				}
			});
		},
		postItem(params) {
			this.submitLoading = true;
			let url = `${postForm}`;
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
		},
		cateSubsectionChange(index) {
			this.item.cate = index + 1;
		},
		uploadSuccess(data, index, lists, name) {
			this.$mHelper.toast('上传成功！');
		},
		uploaded(lists, name) {
			//this.$mHelper.toast('上传完成！');
		},
		uploadError(res, index, lists, name) {
			this.$mHelper.toast('上传失败！');
		},
		uploadRemove(index, lists, name) {
			
		},
		uploadChange(res, index, lists, name) {
			
		},
		getUploadVideos(items) {
			let array = [];
			
			items.forEach((item, index) => {
				array.push(item);
			});
			
			this.item.video = array.join(',');
		},
		uploadVideosProgress(progress) {
			this.progress = progress;
		},
		removeVideos() {
			this.item.video = '';
			this.progress = 0;
		}
	}
};
</script>

<style lang="scss">
page {
	background: $color-white;
	.wrap {
		padding: 30upx;
		.subwrap {
			background: $color-white;
			.progress-tips {
				color: $u-type-warning;
				font-size: 24upx;
				padding: 10upx;
			}
		}
	}
}
</style>
