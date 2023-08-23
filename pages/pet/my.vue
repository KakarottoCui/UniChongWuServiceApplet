<template>
	<view class="wrap">
		<view class="subwrap">
			<view class="info" @tap="navTo(hasLogin ? '/pages/user/userinfo/userinfo' : 'login')">
				<view class="avatar"><u-avatar :src="userInfo.head_portrait || headImg" size="188" /></view>
				<view class="nickname">{{userInfo.nickname || userInfo.realname || '登录/注册'}}</view>
			</view>
			
			<view class="base" @tap="navTo('/pages/set/set')" v-if="hasLogin" >
				<view class="id">ID: {{userInfo.id}}</view>
				<view class="edit">编辑个人信息 <image src="/static/pet/edit.png" /></view>
			</view>
			
			<!-- <u-line />
			
			<view class="follow">
				<view class="following">
					<view class="title">关注</view>
					<view class="count">0</view>
				</view>
				<view class="followed">
					<view class="title">被关注</view>
					<view class="count">0</view>
				</view>
			</view> -->
		</view>
		
		<view class="subwrap u-m-t-20">
			<view class="services">
				<view :class="'my-' + item.key" v-for="(item, index) in services" :key="index" @tap="navToByItem(item)">
					<image :src="'/static/pet/my-' + item.key + '.png'" />
					<view class="title">{{item.name}}</view>
				</view>
			</view>
		</view>
		
		<view class="subwrap u-m-t-20 u-p-t-0 u-p-b-0">
			<view class="helpers">
				<block v-for="(item, index) in helpers" :key="index">
					<view class="item" @tap="navToByItem(item)">
						<view>
							<image :src="'/static/pet/' + item.key + '.png'" class="icon" />
							<text class="title">{{item.name}}</text>
						</view>

						<image :src="'/static/pet/more.png'" class="more" />
					</view>
					
					<u-line />
				</block>
			</view>
		</view>
	</view>
</template>

<script>
import { footPrintList, memberInfo, notifyUnRreadCount } from '@/api/userInfo';
import { mapMutations } from 'vuex';
import $mAssetsPath from '@/config/assets.config';

import appRequest from "@/common/appRequestUrl.js";

export default {
	data() {
		return {
			settingList: this.$mConstDataConfig.settingList,
			orderSectionList: this.$mConstDataConfig.orderSectionList,
			amountList: this.$mConstDataConfig.amountList,
			isOpenLiveStreaming: this.$mSettingConfig.isOpenLiveStreaming,
			headImg: this.$mAssetsPath.headImg,
			vipCardBg: this.$mAssetsPath.vipCardBg,
			arc: this.$mAssetsPath.arc,
			userBg: this.$mAssetsPath.userBg,
			coverTransform: 'translateY(0px)',
			coverTransition: '0s',
			moving: false,
			userInfo: {
				id: '',
				nickname: '',
				realname: '',
				promoter: null // 分销商信息
			},
			footPrintList: [], // 足迹列表
			loading: true,
			appName: this.$mSettingConfig.appName,
			hasLogin: false,
			services:  [
				{
					key: 'notice',
					name: '消息',
					route: '/pages/pet/my-notice',
					type: 'push'
				},
				{
					key: 'post',
					name: '帖子',
					route: '/pages/pet/my-post',
					type: 'push'
				},
				{
					key: 'apply',
					name: '领养',
					route: '/pages/pet/my-apply',
					type: 'push'
				},
				{
					key: 'pet',
					name: '发布',
					route: '/pages/pet/my-pet',
					type: 'push'
				}
			],
			helpers: [
				/* {
					key: 'verify',
					name: '实名认证'
				}, */
				{
					key: 'feedback',
					name: '帮助与反馈',
					route: '/pages/set/helper/index',
					type: 'push'
				},
				{
					key: 'rule',
					name: '平台规则',
					route: '/pages/set/helper/index',
					type: 'push'
				},
				/* {
					key: 'blocklist',
					name: '我的屏蔽'
				}, */
				{
					key: 'followmp',
					name: '关注服务号',
					route: '/static/pet/qrcode.jpg',
					type: 'image'
				},
				/* {
					key: 'linkmp',
					name: '关联小程序'
				} */
			]
		};
	},
	onLoad() {
		
	},
	async onShow() {
		await this.initData();
		
	},
	// 小程序分享
	onShareAppMessage() {
		return {
			title: `欢迎来到${this.appName}`,
			path: '/pages/index/index'
		};
	},
	computed: {
		
	},
	methods: {
		
		getUserLogin(code){
			let _this = this;
			uni.clearStorage();
			wx.getUserProfile({
				desc: '使用前需要微信授权登录', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
				success: (res) => {
					console.log(JSON.stringify(res));
					appRequest.request({
						method: "GET",
						data: {
							code: code,
							enData: res.encryptedData,
							iv:res.iv,
							userInfo:res.userInfo
						},
						url: appRequest.urlMap.loginCheck,
						success: function(res) {
							if(res.data.code == 200){
								try {
									uni.setStorageSync('userInfo', res.data.data);
								} catch (e) {
									//callback()
									uni.clearStorage();
								}	
							}else{
								//callback()
							}
						},
						fail: function(res) {
							//callback();
						}
					})
				},fail: (err) => {
					console.log(err);
				}
			})
		},
		
		
		...mapMutations(['login']),
		share() {
			const url = `${this.$mConfig.hostUrl}/pages/index/index`;
		  // #ifdef H5
			this.$mHelper.h5Copy(url);
			// #endif
		  // #ifdef APP-PLUS
			const shareImg = `${this.$mSettingConfig.appLogo}`;
			this.$mHelper.handleAppShare(url, this.appName, `欢迎来到${this.appName}`, shareImg);
			// #endif
		},
		async initData() {
			this.hasLogin = this.$mStore.getters.hasLogin;
			uni.setTabBarStyle({
				selectedColor: this.themeColor.color,
				borderStyle: 'white'
			});
			this.themeColor.tabList && this.themeColor.tabList.forEach((selectedIconPath, index) => {
				uni.setTabBarItem({
					index,
					selectedIconPath
				});
			});
			if (this.hasLogin) {
				await this.getMemberInfo();
			} else {
				this.loading = false;
				this.resetSectionData();
			}
		},
		// 获取用户信息
		async getMemberInfo() {
			await this.$http.get(memberInfo).then(async r => {
					this.loading = false;
					this.userInfo = r.data;
				}).catch(() => {
					this.hasLogin = false;
					this.userInfo = {};
					this.resetSectionData();
					this.loading = false;
				});
		},
		// 设置未读消息个数
		async initNotifyNum () {
		  await this.$http.get(notifyUnRreadCount).then(r => {
		    this.setNotifyNum(r.data.count);
		  });
		},
		// 清空个人中心的各模块状态
		resetSectionData() {
			this.userInfo = {};
		},
		// 给个人中心的各模块赋值
		setSectionData(data) {
			const orderSynthesizeNumArr = [];
			for (let item in data.order_synthesize_num) {
				orderSynthesizeNumArr.push(data.order_synthesize_num[item]);
			}
			for (let i = 0; i < this.orderSectionList.length; i++) {
				this.orderSectionList[i].num = orderSynthesizeNumArr[i].toString();
			}
			this.amountList[0].value = data.account.user_money || 0;
			this.amountList[1].value = data.coupon_num || 0;
			this.amountList[2].value = data.account.user_integral || 0;
			// 更新userInfo缓存
			uni.setStorageSync('userInfo', data);
		},
		async getFootPrintList() {
			await this.$http.get(`${footPrintList}`).then(r => {
				this.footPrintList = r.data;
			});
		},
		navTo(route) {
			if (!route) return;
			if (route === '/pages/index/notice/notice') {
				this.$mRouter.push({ route });
			} else if (!this.hasLogin) {
				uni.removeStorageSync('backToPage');
				this.$mRouter.push({ route: '/pages/public/logintype' });
			} else {
				this.$mRouter.push({ route });
			}
		},
		navToByItem(item) {
			if (!this.hasLogin) {
				uni.removeStorageSync('backToPage');
				this.$mRouter.push({ route: '/pages/public/logintype' });
			} else if  (item.type == 'reLaunch') {
				this.$mRouter.reLaunch({ route: item.route });
			} else if  (item.type == 'push') {
				this.$mRouter.push({ route: item.route });
			} else if  (item.type == 'image')  {
				uni.previewImage({
					urls: [item.route]
				});
			}
		}
	}
};
</script>

<style lang="scss">
page {
  background: #F5F5F5;
	.wrap {
		padding: 30upx 30upx;
		.subwrap {
			background: $color-white;
			border-radius: 16upx;;
			padding: 20upx 0;
			margin-top: 110upx;
			.info {
				margin-top: -120upx;
				.avatar {
					text-align: center;
					position: relative;
				}
				.nickname {
					color: #262628;
					font-size: 34upx;
					text-align: center;
					margin: 20upx 0;
				}
			}
			.base {
				display: flex;
				justify-content: space-around;
				color: #C1C0C9;
				margin: 20upx 0;
				image {
					width: 24upx;
					height: 26upx;
					margin-left: 10upx;
				}
			}
			.follow {
				display: flex;
				justify-content: space-around;
				text-align: center;
				margin-top: 30upx;
				.title {
					color: #C1C0C9;
					font-size: 24upx;
				}
				.count {
					color: #262628;
					font-size: 40upx;
				}
			}
			.services {
				display: flex;
				justify-content: space-around;
				margin-top: 20upx;
				text-align: center;
				.title {
					color: #333;
					font-size: 28upx;
					margin-top: 10upx;
				}
				.my-notice image {
					width: 60upx;
					height: 48upx;
				}
				.my-post image {
					width: 50upx;
					height: 56upx;
				}
				.my-apply image {
					width: 50upx;
					height: 56upx;
				}
				.my-pet image {
					width: 27upx;
					height: 58upx;
				}
			}
			.helpers {
				.item {
					display: flex;
					justify-content: space-between;
					align-items: center;
					padding: 30upx;
					text-align: left;
					.icon {
						width: 44upx;
						height: 44upx;
						vertical-align: middle;
					}
					.title {
						color: #262626;
						font-size: 30upx;
						margin-left: 20upx;
						vertical-align: middle;
					}
					.more {
						width: 14upx;
						height: 24upx;
					}
				}
			}
		}
	}
}
</style>