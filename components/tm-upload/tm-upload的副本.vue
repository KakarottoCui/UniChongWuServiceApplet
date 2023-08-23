<template name="tm-upimg">
	<view class="tm-upload-bd">
		<view class="tm-upload-files">
			<block v-for="(item, index) in upload_before_list" :key="index">
				<view class="tm-upload-file" :class="[item.upload_percent < 100 ? 'tm-upload-file-status' : '']" :style="'width:' + upload_img_wh + 'rpx; height:' + upload_img_wh + 'rpx;'">
					<image class="tm-upload-img" :style="'width:' + upload_img_wh + 'rpx; height:' + upload_img_wh + 'rpx;'" :src="item.path" mode="aspectFill" @tap="preview(index)" v-if="type === 'image'" />
					<video :id="`myVideo_${index}`" :ref="`myVideo_${index}`" :src="item.path" :data-index="index" @play="videoPlay" @ended="videoEnded"	@error="videoError" controls :enable-play-gesture="true" objectFit="contain" :style="'width:' + upload_img_wh + 'rpx; height:' + upload_img_wh + 'rpx;'" v-if="type === 'video'"></video>
					<view class="tm-img-removeicon right" @tap.stop="remove(index)" v-show="upimg_move">x</view>
					<view class="tm-loader-filecontent" v-if="item.upload_percent < 100">{{item.upload_percent}}%</view>
				</view>
			</block>
			<view v-show="listLength < upload_count" hover-class="tm-upload-hover" class="tm-upload-inputbox" @tap="choose" :style="'width:' + upload_img_wh + 'rpx; height:' + upload_img_wh + 'rpx;'">
				<view :style="'line-height:'+ upload_img_wh + 'rpx;'"><i class="iconfont iconxiangji" style="color: #666;"></i></view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	name: 'tm-upload',
	data() {
		return {
			// 选择图片tempFile
			upload_cache: [],
			// 预览数组->支持从服务器拉取
			upload_cache_list: [],
			// 上传数组
			upload_before_list: [],
			// 图片大小
			upload_img_size: [],
			// 超出限制数组
			upload_exceeded_list: [],
			// 上传数量
			upload_count: 9,
			// 最大上传容量(M)
			upload_max: 1,
			// 图片/选择宽高
			upload_img_wh: 162,
			// 测试接口(建议七牛、阿里云、腾讯云都采用后端对接，直接调用后端上传)
			url: '',
			type: 'image', //image,video
			header: {},
			videoContext: [],
		}
	},
	props: {
		upload_auto: {
			type: Boolean,
			default: true
		},
		upimg_move: {
			type: Boolean,
			default: true
		}
	},
	onReady(res) {
		this.$nextTick(() => {
			for (let i = 0; i < 10; i++) {
				this.videoContext[i] = uni.createVideoContext(`myVideo_${i}`);
			}
		});
	},
	created() {

	},
	mounted() {

	},
	watch: {
		url(val) {
			this.upload_before_list.map((item) => {
				this.upload_cache_list.push(item.path);
			});
			this.emit();
		}
	},
	computed:{
			listLength() {
				return this.upload_before_list.length;
			}
	},
	methods: {
		videoPlay(e) {
			let index = e.currentTarget.dataset.index;
			this.videoContext[index].requestFullScreen();

			for (let i = 0; i < this.upload_before_list.length; i++) {
				if (i != index) this.videoContext[i].pause();
			}
		},
		videoEnded(e) {
			let index = e.currentTarget.dataset.index;
			this.videoContext[index].exitFullScreen();
		},
		videoError(e) {
			uni.showModal({
				content: '网络错误，请稍后重试！',
				showCancel: false
			});
		},
		uploadFile(paths) {
			const promises = paths.map((path) => {
				return this.promisify(this.uploader)({
					url: this.url,
					path: path,
					name: 'file',
					header: this.header,
					extra: {},
				});
			});

			/* uni.showLoading({
				title: `正在上传...`,
			}); */

			Promise.all(promises).then((data) => {
				// uni.hideLoading();
				this.upload_cache_list.push(...data);
				this.emit();
			}).catch((res) => {
				console.log(res);
				// uni.hideLoading();
			});
		},
		choose() {
			switch (this.type) {
				case 'video':					
					uni.chooseVideo({
						count: this.upload_count - this.upload_before_list.length,
						compressed: true,
						sourceType: ['album', 'camera'],
						success: async (res) => {
							res.path = res.tempFilePath;
							res.upload_percent = 0;

							if (Math.ceil(res.size / 1024) < this.upload_max * 1024) {
								await this.upload_img_size.push(Math.ceil(res.size / 1024));
								await this.upload_before_list.push(res);

								for (let i = 0; i < this.upload_before_list.length; i++) {
									this.videoContext[i] = uni.createVideoContext(`myVideo_${i}`);
								}
							} else {
								this.upload_exceeded_list.push(1);

								uni.showModal({
									title: '提示',
									content: `视频超出限制${this.upload_max}MB,已忽略`,
									showCancel: false,
									confirmText: '确认',
									success(res) {

									}
								});
							}
							
							this.upload_cache = [];
							this.upload_cache.push(res.tempFilePath);
							this.upload(this.upload_auto);
						},
						fail: (err) => {
							console.log(err);
						}
					});
					break;
				case 'image':
					uni.chooseImage({
						count: this.upload_count - this.upload_before_list.length,
						sizeType: ['compressed', 'original'],
						sourceType: ['album', 'camera'],
						success: async (res) => {
							for (let i = 0, len = res.tempFiles.length; i < len; i++) {
								res.tempFiles[i].upload_percent = 100;

								if (Math.ceil(res.tempFiles[i].size / 1024) < this.upload_max * 1024) {
									await this.upload_img_size.push(Math.ceil(res.tempFiles[i].size / 1024));
									await this.upload_before_list.push(res.tempFiles[i]);
									// TODO v3.1增加图片格式限制
								} else {
									res.tempFilePaths.splice(i, 1);
									this.upload_exceeded_list.push(i === 0 ? 1 : i + 1);
									uni.showModal({
										title: '提示',
										content: `第${[...new Set(this.upload_exceeded_list)].join(',')}张图片超出限制${this.upload_max}MB,已过滤`,
										showCancel: false,
										confirmText: '确认',
										success(res) {
											if (res.confirm) {
												this.upload_img_size.splice(i--, 1);
												this.upload_exceeded_list.splice(i--, 1);
											}
										}
									});
								}
							}
							this.upload_cache = await res.tempFilePaths;
							this.upload(this.upload_auto);
						},
						fail: (err) => {
							console.log(err);
						}
					});
					break;
				default:
					break;
			}
		},
		async upload(upload_auto) {
			upload_auto ? await this.uploadFile(this.upload_cache) : console.warn(
				`传输参数:this.$refs.xx.upload(true)才可上传,默认false`);
		},
		preview(idx) {
			uni.previewImage({
				current: idx,
				urls: this.upload_cache_list
			});
		},
		remove(idx) {
			this.upload_before_list.splice(idx, 1);
			this.upload_cache_list.splice(idx, 1);
			this.emit();
		},
		emit() {
			this.$emit('change', this.upload_cache_list);
		},
		progress(progress) {
			this.$emit('progress', progress);
		},
		promisify(api) {
			return (options, ...params) => {
				return new Promise((resolve, reject) => {
					api(Object.assign({}, options, {
						success: resolve,
						fail: reject
					}), ...params);
				});
			}
		},
		uploader(options) {
			let url = options.url,
			path = options.path,
			name = options.name,
			header = options.header,
			// data = options.data,
			extra = options.extra,
			success = options.success,
			progress = options.progress,
			fail = options.fail;

			this.$http.upload(url, {
				params: {},
				// #ifdef APP-PLUS || H5
				files: [], // 需要上传的文件列表。使用 files 时，filePath 和 name 不生效。App、H5（ 2.6.15+）
				// #endif
				// #ifdef MP-ALIPAY
				fileType: 'image/video/audio', // 仅支付宝小程序，且必填。
				// #endif
				filePath: path,
				custom: { auth: true },
				name: name,
				header: {},
				formData: extra,
				getTask: (task, options) => {
					task.onProgressUpdate((res) => {
						this.upload_before_list[this.upload_before_list.length-1].upload_percent = res.progress;
						this.progress(res.progress);
						// console.log('上传进度' + res.progress);
						// console.log('已经上传的数据长度' + res.totalBytesSent);
						// console.log('预期需要上传的数据总长度' + res.totalBytesExpectedToSend);

						// 测试条件，取消上传任务。
						/* if (res.progress > 50) {
							task.abort();
						} */
					});
				}
			}).then(res => {
				let data = res.data;

				success(data.url);
			}).catch(err => {
				uni.showModal({
					content: '网络问题，请稍后重试！',
					success: confirmRes => {
					
					}
				});
				
				fail(err);
			});
		}
	}
}
</script>

<style lang="scss">
.iconxiangji {
	font-size: 3em;
}

.tm-upload-image {
	display: block;
	border-radius: 10upx;
}

.tm-upload-video { 
	border-radius: 10upx;
}

.tm-upload-input {
	position: absolute;
	z-index: 1;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	opacity: 0;
}

.tm-upload-inputbox {
	position: relative;
	margin-bottom: 20rpx;
	box-sizing: border-box;
	background-color: #ededed;
	border-radius: 10upx;
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	justify-content: center;
}

.tm-img-removeicon {
	position: absolute;
	color: #fff;
	width: 60upx;
	height: 60upx;
	line-height: 60upx;
	z-index: 2;
	text-align: center;
	background-color: #E54D42;

	&.right {
		top: 0;
		right: 0;
	}
}

.tm-upload-file {
	position: relative;
	margin-right: 16rpx;
	margin-bottom: 16rpx;
}

.tm-upload-file-status:before {
	content: " ";
	position: absolute;
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
	background-color: rgba(0, 0, 0, 0.5);
}

.tm-loader-filecontent {
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	color: #fff;
	z-index: 9;
}

.tm-upload-wrap {
	padding: 0;
	margin: 0;
}

.tm-upload-files {
	display: flex;
	flex-wrap: wrap;
}

.tm-upload-file:nth-child(4n+0) {
	margin-right: 0;
}

.tm-upload-inputbox {
	&>view {
		text-align: center;
	}
}

.tm-upload-file-status:after {
	content: " ";
	position: absolute;
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
	background-color: rgba(0, 0, 0, 0.5);
}

.tm-upload-hover {
	box-shadow: 0 0 0 #e5e5e5;
	background: #e5e5e5;
}
</style>
