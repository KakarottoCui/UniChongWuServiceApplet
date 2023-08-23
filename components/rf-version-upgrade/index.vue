<template>
	<view class="versionUpgrade" v-if="isShow && show" @touchmove.stop.prevent="() => {}">
		<view class="upgrade-wrapper">
			<view class="rf-version-upgrade" @tap.stop="discard">
				<view class="upgrade-top-img"><image :src="upgradeTop"></image></view>
				<view class="versionUpgradeViewV2">
					<view class="upgrade-info">
						<view class="content-title">{{ upgradeInfo.title }} {{ upgradeInfo.version }}</view>
						<rich-text class="content-text" :nodes="upgradeInfo.content.replace(/\n/g, '<br/>')"></rich-text>
					</view>
					<button
						class="confirm-btn"
						:class="'bg-' + themeColor.name"
						@click="downUpdate()"
						v-if="!is_force && !start"
					>
						立即更新
					</button>
					<view
						class="versionUpgradeViewIs_force0"
						v-if="is_force && start"
					>
						<text class="downloadIs_force1" @click="downUpdate()">立即更新</text>
					</view>
					<view class="versionUpgradeViewStartTrue" v-if="start">
						<text class="title">下载进度</text>
						<progress
							:percent="start"
							:activeColor="themeColor.color"
							:show-info="true"
							stroke-width="6"
						></progress>
					</view>
					<view class="versionUpgradeViewStartTrue" v-if="start >= 100">
						<button
							class="confirm-btn"
							:class="'bg-' + themeColor.name"
							@click="install()"
						>立即安装</button
						>
					</view>
				</view>
			</view>
			<view class="close-upgrade">
				<view class="line">
					<view class="close-upgrade-line"></view>
				</view>
				<text class="iconfont iconguanbi1" @tap="close"></text>
			</view>
		</view>
	</view>
</template>
<script>
/* eslint-disable */
import { versionsIndex, versionsView } from '@/api/basic';
export default {
	name: 'rf-version-upgrade',
	props: {
		isIos: {
			type: Boolean,
			default: false
		},
		versionType: {
			type: String,
			default() {
				return 'android';
			}
		},
		isShow: {
			type: Boolean,
			default: true
		},
		isIos: {
			type: Boolean,
			default: true
		},
		is_force: {
			type: Boolean,
			default() {
				return false;
			}
		},
		isTipsShow: {
			type: Boolean,
			default() {
				return false;
			}
		}
	},
	data() {
		return {
			upgradeTop: this.$mAssetsPath.upgradeTop,
			url: '',
			show: false,
			start: 0,
			installPath: '',
			upgradeInfo: {}
		};
	},
	created() {
		this.getVersionsInfo(plus.runtime.version);
	},
	computed: {
		versionTypes() {
			return this.getPlatform(); //版本获取
		}
	},
	methods: {
		/* 版本比较是否需要更新 */
		async getVersionsInfo(version) {
			const _this = this;
			const type = this.versionType == 'android' && this.versionTypes == 'android' ? 1 : 2;
			await this.$http
				.get(`${versionsIndex}`, { type, version })
				.then(r => {
					this.upgradeInfo = r.data;
					if (!r.data && this.isTipsShow) {
						this.$emit('tip', true);
						return;
					}
					this.version = r.data.version;
					this.url = r.data.download_url;
					if (this.versionType == 'android' && this.versionTypes == 'android') {
						this.show = true;
						uni.hideTabBar();
						_this.getVersionsView(r.data.id);
						this.update();
						return;
					} else {
						if (!this.isIos) return;
						uni.showModal({
							content: `发现新版本 [${this.upgradeInfo.version}], 是否跳转至App Store更新?`,
							success: confirmRes => {
								if (confirmRes.confirm) {
									_this.getVersionsView(r.data.id);
									// eslint-disable-next-line
									plus.runtime.launchApplication({
										action: `itms-apps://itunes.apple.com/cn/app/id${this.url}?mt=8`
									}, function(e) {
										this.$mHelper.log('Open system default browser failed: ' + e.message);
									});
								}
							}
						});
					}
				});
		},
		discard() {},
		// 升级检测
		update() {
			let self = this;
			/* 5+环境锁定屏幕方向 */
			plus.screen.lockOrientation('portrait-primary'); //锁定
			//客户端信息
			plus.runtime.getProperty(plus.runtime.appid, function(res) {
				let isupdate = self.isUpdate(res.version, self.version);
				if (isupdate) {
					self.versionShow();
					return;
				}
			});
		},
		// 增加下载记录
		async getVersionsView(id) {
			await this.$http
				.get(`${versionsView}`, {
					id
				});
		},
		/**
		 * 比较版本大小，如果新版本nv大于旧版本ov则返回true，否则返回false
		 * @param {String} ov
		 * @param {String} nv
		 * @return {Boolean}
		 */
		isUpdate(ov, nv) {
			if (!ov || !nv || ov == '' || nv == '') {
				return false;
			}
			var b = false,
				ova = ov
					.replace('V', '')
					.replace('v', '')
					.replace(' ', '')
					.split('.', 4),
				nva = nv
					.replace('V', '')
					.replace('v', '')
					.replace(' ', '')
					.split('.', 4);
			for (var i = 0; i < ova.length && i < nva.length; i++) {
				var so = ova[i],
					no = parseInt(so),
					sn = nva[i],
					nn = parseInt(sn);
				if (nn > no || sn.length > so.length) {
					return true;
				} else if (nn < no) {
					return false;
				}
			}
			if (nva.length > ova.length && 0 == nv.indexOf(ov)) {
				return true;
			} else {
				return false;
			}
		},
		/* 获取版本类别 android/ios */
		getPlatform() {
			return uni.getSystemInfoSync().platform.toLowerCase();
		},
		/* 开启升级 */
		versionShow() {
			this.show = true;
		},
		/* 取消升级 */
		close() {
			if (this.upgradeInfo.is_enforce.toString() === '1') {
				this.$mHelper.toast('本次更新无法取消');
			} else {
				uni.showTabBar();
				if (this.isTipsShow) {
					this.$emit('close');
				} else {
					this.show = false;
				}
			}
		},
		downUpdate() {
			//平台判断
			if (this.versionTypes == 'ios') {
				plus.nativeUI.alert('无法进行在线升级，请到AppStore进行升级..', '提示');
				this.close();
				return;
			}
			//检测是否下载过更新
			let self = this;
			self.installPath = uni.getStorageSync('update_path');
			plus.io.resolveLocalFileSystemURL(
				self.installPath,
				function(entry) {
					self.install();
					return;
				},
				function(err) {
					const dtask = plus.downloader.createDownload(self.url, {
						filename: '_downloads/'
					});
					dtask.addEventListener('statechanged', onStateChanged, false);
					dtask.start();
				}
			);
			//下载状态
			function onStateChanged(download, status) {
				let totalSize = download.totalSize;
				let useSize = download.downloadedSize;
				self.start = ((useSize / totalSize) * 100).toFixed(0);
				// 下载完成
				if (download.state == 4 && status == 200) {
					self.installPath = download.filename;
					uni.setStorageSync('update_path', self.installPath);
					//需要用户点击立即安装才能安装去掉注释掉self.install();
					//self.install();
				}
			}
		},
		//安装提示
		install() {
			this.close();
			plus.nativeUI.showWaiting('安装中,请稍后...');
			plus.runtime.install(
				this.installPath,
				{},
				res => {
					plus.nativeUI.closeWaiting();
					plus.runtime.restart();
					uni.removeStorageSync('update_path');
				},
				err => {
					plus.nativeUI.closeWaiting();
					plus.nativeUI.alert('error ' + err.code, '', '提示');
				}
			);
		}
	}
};
</script>
<style lang="scss" scoped>
.versionUpgrade {
	width: 100%;
	height: 100%;
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	z-index: 999999;
	background: rgba(0, 0, 0, 0.4);
	display: flex;
	justify-content: center;
	align-items: center;
}
.upgrade-wrapper {
	margin-top: -80rpx;
	width: 500rpx;
	min-height: 500rpx;
	max-height: 800rpx;
}
.rf-version-upgrade {
	z-index: 9999999;
	width: 100%;
	border-radius: 12rpx;
	background: #ffffff;
	.upgrade-top-img {
		image {
			width: 100%;
			height: 240rpx;
		}
	}
	.versionUpgradeViewV2 {
		display: flex;
		flex-direction: column !important;
		padding: 30rpx;
		.upgrade-info {
			.content-title {
				font-size: $font-base;
				color: $font-color-dark;
				margin-bottom: 10rpx;
			}
			.content-text {
				font-size: $font-sm;
				color: $font-color-light;
			}
		}
		.confirm-btn {
			width: 90%;
			height: 60rpx;
			line-height: 60rpx;
			margin-top: 20rpx;
		}
		.versionUpgradeViewIs_force0 {
			display: flex;
			flex-direction: row !important;
			justify-content: space-between;
			.text {
				padding: 10rpx 70rpx;
				border-radius: 30rpx;
				font-size: 16px;
				color: #ffffff;
			}
			.butClose {
				background: #e2e2e2;
			}
			.download {
				background: #ff5722;
			}
			.downloadIs_force1 {
				width: 100%;
				display: flex;
				justify-content: center;
				align-items: center;
				padding: 10rpx 0;
				border-radius: 30rpx;
				font-size: 16px;
				color: #ffffff;
				background: #ff5722;
			}
		}
		.versionUpgradeViewStartTrue {
			display: flex;
			flex-direction: column !important;
			.title {
				font-size: 14px;
				color: #626262;
				padding: 10rpx 0;
			}
			.btn-text {
				width: 100%;
				display: flex;
				justify-content: center;
				align-items: center;
				padding: 10rpx 0;
				border-radius: 30rpx;
				font-size: 16px;
				color: #ffffff;
			}
			.downloadStartTrue {
				background: #ff5722;
			}
			.downloadStartFalse {
				background: #e2e2e2;
			}
		}
	}
}
.close-upgrade {
	width: 100%;
	text-align: center;
	color: $color-white;
	.line {
		display: flex;
		justify-content: center;
		text-align: center;
		.close-upgrade-line {
			width: 1rpx;
			height: 72rpx;
			background: $color-white;
			opacity: 0.6;
		}
	}
	.iconfont {
		font-size: $font-lg;
		margin-top: -12rpx;
		display: inline-block;
	}
}
</style>
