<template>
	<view class="user">
		<!--头部-->
		<view class="user-section" :class="'bg-' + themeColor.name">
			<image class="bg" :src="userBg"></image>
			<!--用户信息-->
			<view class="user-info-box">
				<view
					class="portrait-box"
					@tap="navTo(userInfo ? '/pages/user/userinfo/userinfo' : 'login')"
				>
					<image
						class="portrait"
						:src="userInfo.pic || headImg"
					></image>
					<text class="username">
						{{
							userInfo.nickName || "游客"
						}}
					</text>
				</view>

				<!-- <view v-if="hasLogin" class="sign-in" @tap="navTo('/pages/marketing/activity/sign-in')">
					<text class="iconfont iconqiandao"></text>签到领积分
				</view> -->
			</view>
			<!--vip信息-->
			 <view class="vip-card-box">
				<view class="b-btn" >
					{{ userInfo.memberLevel | filterMemberLevel }}
				</view>
				<view class="tit">
					<i class="iconfont iconzuanshi" />
					{{appName}}
				</view>
				<text class="e-m">{{appName}} 版权所有</text>
			</view> 
		</view>
		<!-- 个人中心 内容区-->
		<view
			class="cover-container"
			:style="[
				{
					transform: coverTransform,
					transition: coverTransition
				}
			]"
			@touchstart="coverTouchstart"
			@touchmove="coverTouchmove"
			@touchend="coverTouchend"
		>
			<image class="arc" :src="arc"></image>
			<!--余额 优惠券 积分信息-->
			<view class="promotion-center">
				
				<!-- <view class="tj-sction">
					<view
						class="tj-item"
						v-for="item in amountList"
						:key="item.title"
						@tap="navTo(item.url)"
						v-if="item.title == '积分'"
					>
						<text class="num" :class="item.value > 0 ? 'text-'+themeColor.name : ''">
							{{ item.value }}
						</text>
						<text>{{ item.title }}</text>
					</view>
				</view> -->
				<u-gap height="4" />
			</view>
		
			<!--管理中心-->
			<view class="promotion-center">
				<list-cell
					icon="iconfuwu"
					navigateType=""
					:iconColor="themeColor.color"
					title="管理中心"
				></list-cell>
				<view class="tj-sction">
					<!-- 分类列表 -->
					<view class="category-list">
						<view
							class="category"
							v-for="(item, index) in settingList"
							:key="index"
							:style="{display: settingItemShowFilter(item.title)}"
							@tap.stop="navTo(index)"
						>
							<view v-if="item.title !== '分享'">
								<view class="img">
									<text
										class="iconfont"
										:class="['iconzuanshi', 'text-'+themeColor.name]"
									></text>
								</view>
								<view class="text">{{ item.title }}</view>
							</view>
							
						</view>
					</view>
				</view>
			</view>
		</view>
		<!--页面加载动画-->
		<!-- <rfLoading isFullScreen :active="loading"></rfLoading> -->
		
		<u-modal v-model="showAdd" title="个人信息" :show-cancel-button="true" confirm-text="修改" @confirm="submitComment">
			<view class="slot-content u-p-30">
				
				<u-field
							v-model="form.nickName"
							label="昵称"
							placeholder="昵称"
						>
						</u-field>
						
						
				<u-field
							v-model="form.realName"
							label="姓名"
							placeholder="姓名"
						>
						</u-field>		
				
				<u-field
							v-model="form.address"
							label="地址"
							placeholder="地址"
							type="textarea"
						>
						</u-field>
								
				
		
			</view>
		</u-modal>
		
	</view>
</template>
<script>
/**
 * @des 个人中心
 *
 * @author stav stavyan@qq.com
 * @date 2020-01-10 11:41
 * @copyright 2019
 */
import { footPrintList, memberInfo, notifyUnRreadCount } from '@/api/userInfo';
import listCell from '@/components/rf-list-cell';
import { mapMutations } from 'vuex';
import rfBadge from '@/components/rf-badge/rf-badge';
import $mAssetsPath from '@/config/assets.config';
import appRequest from "@/common/appRequestUrl.js";
let startY = 0, moveY = 0, pageAtTop = true;
export default {
	components: {
		listCell,
		rfBadge
	},
	data() {
		return {
			path: '/pages/profile/profile',
			title: '个人中心',
			settingList: [{
				title:"预约订单",url:"/pages/pet/order"},{
				title:"个人信息"},
				{title:"宠物信息",url:"/pages/pet/petInfo"},{title:"社区",url:"/pages/pet/petInfo"}
			],
			orderSectionList: this.$mConstDataConfig.orderSectionList,
			amountList: this.$mConstDataConfig.amountList,
			isOpenLiveStreaming: this.$mSettingConfig.isOpenLiveStreaming,
			promotionList: this.$mConstDataConfig.promotionList,
			headImg: this.$mAssetsPath.headImg,
			vipCardBg: this.$mAssetsPath.vipCardBg,
			arc: this.$mAssetsPath.arc,
			userBg: this.$mAssetsPath.userBg,
			coverTransform: 'translateY(0px)',
			coverTransition: '0s',
			moving: false,
			userInfo: {
				// 用户信息
				promoter: null // 分销商信息
			},
			footPrintList: [], // 足迹列表
			loading: true,
			appName: this.$mSettingConfig.appName,
			hasLogin: false,
			currentLanguage: '切换语言',
			form:{},
			showAdd:false
		};
	},
	filters: {
		filterMemberLevel(val) {
      if (!val) return '普通用户';
			return val.name;
		},
		marketingTypeTag(marketingType) {
			let tag;
			switch (marketingType) {
				case 'discount':
					tag = $mAssetsPath.discountTag;
					break;
				case 'bargain':
					tag = $mAssetsPath.bargainTag;
					break;
				case 'group_buy':
					tag = $mAssetsPath.groupTag;
					break;
				case 'wholesale':
					tag = $mAssetsPath.wholesaleTag;
					break;
			}
			return tag;
		}
	},
  computed: {
    // 判断推广中心是否显示 当有分销商信息的时候显示
    settingItemShowFilter() {
      return function (val) {
        let type = 'block';
        if ((val === '推广中心' || val === 'Distribution') && this.userInfo.promoter) {
          type = 'none';
        } else if (val === '直播' && !this.isOpenLiveStreaming) {
          type = 'none';
        }
        return type;
      };
    }
	},
	// 小程序分享
	onShareAppMessage() {
		return {
			title: this.title,
			path: `${this.path}?promo_code=${this.userInfo.promo_code}`
		};
	},
	async onShow() {
	  // 初始化数据
	  await this.initData();
	  let _this = this;
	  let userInfo = appRequest.getUserInfo();
	  if(!userInfo){
	   wx.login({
	    success(res) {
	     if (res.code) {
	      let code = res.code;
	      uni.showModal({
	       title: "登录",
	       content: "请授权获取微信信息用于登录",
	       success: function(res) {
	        if (res.confirm) {
	         _this.getUserLogin(code);
	        }
	       }
	      })
	     } else {
	      console.log('登录失败！' + res.errMsg)
	     }
	    }
	   })
	
	  }else{
	   this.userInfo = userInfo;
	  }
	 },
	// #ifndef MP
	onNavigationBarButtonTap(e) {
		const index = e.index;
		if (index === 0) {
			this.navTo('/pages/set/set');
		} else if (index === 1) {
			// #ifdef APP-PLUS
			// eslint-disable-next-line
			const pages = getCurrentPages();
			const page = pages[pages.length - 1];
			const currentWebview = page.$getAppWebview();
			currentWebview.hideTitleNViewButtonRedDot({
				index
			});
			// #endif
			this.$mRouter.switchTab({ route: '/pages/pet/my-notify' });
		}
	},
	// #endif
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
									uni.switchTab({
										url:"/pages/index/index"
									})
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
		...mapMutations(['setNotifyNum', 'setCartNum']),
		// 分享
    share() {
			const url = `${this.$mConfig.hostUrl}/pages/index/index?promo_code=${this.userInfo.promo_code}`;
      // #ifdef H5
			this.$mHelper.h5Copy(url);
			// #endif
      // #ifdef APP-PLUS
			const shareImg = `${this.$mSettingConfig.appLogo}`;
			this.$mHelper.handleAppShare(url, this.appName, `欢迎来到${this.appName}`, shareImg);
			// #endif
		},
		...mapMutations(['login']),
		// 数据初始化
		async initData() {
			//this.hasLogin = this.$mStore.getters.hasLogin;
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
			// if (this.hasLogin) {
			// 	//await this.getMemberInfo();
			// } else {
			// 	this.loading = false;
			// 	this.resetSectionData();
			// }
		},
		// 获取用户信息
		async getMemberInfo() {
			await this.$http
				.get(memberInfo)
				.then(async r => {
					this.loading = false;
					this.userInfo = r.data;
					await this.setCartNum(r.data.cart_num);
					await this.initNotifyNum();
					// 获取足迹列表
					await this.getFootPrintList();
					await this.setSectionData(r.data);
				})
				.catch(() => {
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
			uni.removeTabBarBadge({ index: this.$mConstDataConfig.cartIndex });
			uni.removeTabBarBadge({ index: this.$mConstDataConfig.notifyIndex });
			this.amountList[0].value = 0;
			this.amountList[1].value = 0;
			this.amountList[2].value = 0;
			this.promotionList[0].value = 0;
			this.promotionList[1].value = 0;
			this.promotionList[2].value = 0;
			this.orderSectionList[0].num = 0;
			this.orderSectionList[1].num = 0;
			this.orderSectionList[2].num = 0;
			this.orderSectionList[3].num = 0;
			this.orderSectionList[4].num = 0;
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
			this.promotionList[0].value =
				(data.promoter && data.promoter.accumulate_brokerage) || 0;
			this.promotionList[1].value =
				(data.promoter && data.promoter.user_brokerage) || 0;
			this.promotionList[2].value =
				(data.promoter && data.promoter.amount_drawn_brokerage) || 0;
			// 更新userInfo缓存
			uni.setStorageSync('userInfo', data);
		},
		// 获取足迹列表
		async getFootPrintList() {
			await this.$http.get(`${footPrintList}`).then(r => {
				this.footPrintList = r.data;
			});
		},
		// 统一跳转接口,拦截未登录路由
		navTo(index) {
			switch (index){
				case 0:
					uni.navigateTo({
						url:"/pages/pet/order"
					})
					break;
					case 1:
						this.showAdd = true;
						this.form = this.userInfo;
						break;
						case 2:
						uni.navigateTo({
							url:"/pages/pet/petInfo"
						})
							break;
							case 3:
							uni.switchTab({
								url:"/pages/pet/public"
							})
								break;
				default:
					break;
			}
		},
		/**
		 *  会员卡下拉和回弹
		 *  1.关闭bounce避免ios端下拉冲突
		 *  2.由于touchmove事件的缺陷（以前做小程序就遇到，比如20跳到40，h5反而好很多），下拉的时候会有掉帧的感觉
		 *    transition设置0.1秒延迟，让css来过渡这段空窗期
		 *  3.回弹效果可修改曲线值来调整效果，推荐一个好用的bezier生成工具 http://cubic-bezier.com/
		 */
		coverTouchstart(e) {
			if (pageAtTop === false) {
				return;
			}
			this.coverTransition = 'transform .1s linear';
			startY = e.touches[0].clientY;
		},
		coverTouchmove(e) {
			moveY = e.touches[0].clientY;
			let moveDistance = moveY - startY;
			if (moveDistance < 0) {
				this.moving = false;
				return;
			}
			this.moving = true;
			if (moveDistance >= 80 && moveDistance < 100) {
				moveDistance = 80;
			}
			if (moveDistance > 0 && moveDistance <= 80) {
				this.coverTransform = `translateY(${moveDistance}px)`;
			}
		},
		coverTouchend() {
			if (this.moving === false) {
				return;
			}
			this.moving = false;
			this.coverTransition = 'transform 0.3s cubic-bezier(.21,1.93,.53,.64)';
			this.coverTransform = 'translateY(0px)';
		},
		// 跳转至商品详情
		navToProduct(type, id) {
			let route = `/pages/product/product?id=${id}`;
			switch (type) {
				case 'discount':
					route = `/pages/marketing/discount/product?id=${id}`;
					break;
				case 'bargain':
					route = `/pages/marketing/bargain/product?id=${id}`;
					break;
				case 'group_buy':
					route = `/pages/marketing/group/product?id=${id}`;
					break;
				case 'wholesale':
					route = `/pages/marketing/wholesale/product?id=${id}`;
					break;
			}
			this.$mRouter.push({ route });
		},submitComment(){
			
			let _this = this;
			appRequest.request({
				method: "POST",
				url: appRequest.urlMap.editQuUser,
				data:_this.form,
				success: function(res) {
					if(res.data.code == 200){
						uni.setStorageSync('userInfo', _this.userInfo);
					}else{
						uni.showToast({
							title:"修改失败",
							icon:"none"
						})
					}
					
				},
				fail: function(res) {
					uni.showToast({
						title:"失败",
						icon:"none"
					})
				}
			})
			
		}
	}
};
</script>
<style lang="scss" scoped>
page {
	background-color: $page-color-base;
}
.user {
	.user-section {
		height: 520rpx;
		padding: 100rpx 30rpx 0;
		position: relative;

		.bg {
			position: absolute;
			left: 0;
			top: 0;
			width: 100vw;
			height: 60vw;
			opacity: 0.84;
		}
		.user-info-box {
			height: 180rpx;
			display: flex;
			align-items: center;
			position: relative;
			z-index: 1;
			justify-content: space-between;

			.portrait-box {
				display: flex;
				align-items: center;

				.portrait {
					width: 130rpx;
					height: 130rpx;
					border: 5rpx solid #fff;
					border-radius: 50%;
				}

				.username {
					font-size: $font-lg + 6rpx;
					color: $color-white;
					margin-left: 20rpx;
				}

				button {
					background-color: transparent;
					font-size: $font-lg + 6rpx;
					color: $font-color-dark;
					border: none;
				}

				button::after {
					border: none;
				}
			}
			.sign-in {
				.iconfont {
					font-size: $font-base;
					margin-right: $spacing-sm;
				}
			}
		}

		.vip-card-box {
			display: flex;
			flex-direction: column;
			color: #f7d680;
			height: 240rpx;
			background: url('/static/vip-card.png');
			background-size: 100% 100%;
			border-radius: 16rpx 16rpx 0 0;
			overflow: hidden;
			position: relative;
			padding: 20rpx 24rpx;
			.b-btn{
				position: absolute;
				right: 24rpx;
				top: 24rpx;
				width: 152rpx;
				height: 40rpx;
				text-align: center;
				line-height: 40rpx;
				font-size: 22rpx;
				color: #36343c;
				border-radius: 20px;
				background: linear-gradient(to left, #f9e6af, #ffd465);
				z-index: 1;
			}
			.tit {
				font-size: $font-base + 2rpx;
				color: #f7d680;
				margin-bottom: 28rpx;
				.iconfont {
					color: #f6e5a3;
					display: inline-block;
					margin-right: 16rpx;
				}
			}
		}
	}

	.cover-container {
		margin-top: -150rpx;
		padding: 0 30rpx 20rpx;
		position: relative;
		background-color: $page-color-base;

		.arc {
			position: absolute;
			left: 0;
			top: -34rpx;
			width: 100%;
			height: 36rpx;
		}

		.promotion-center {
			background: #fff;
			margin-bottom: 20rpx;
			/*分类列表*/
			.category-list {
				width: 100%;
				padding: 0 0 30rpx 0;
				border-bottom: solid 2rpx #f6f6f6;
				display: flex;
				flex-wrap: wrap;
				.category {
					width: 33.3%;
					margin-top: 50rpx;
					display: flex;
					justify-content: center;
					flex-wrap: wrap;
					.img {
						width: 100%;
						display: flex;
						justify-content: center;

						.iconfont {
							font-size: $font-lg + 24rpx;
						}
					}

					.text {
						width: 100%;
						display: flex;
						justify-content: center;
						font-size: 24rpx;
						color: #3c3c3c;
					}
					.share-btn {
						height: 142rpx;
						text-align: left;
						background: none;
						padding: 0;
						margin: 0;
					}

					.share-btn:after {
						border: none;
						border-radius: none;
					}
				}
			}
		}

		.tj-sction {
			@extend %section;
			display: flex;

			.tj-item {
				@extend %flex-center;
				flex: 1;
				flex-direction: column;
				margin: 30rpx 0;
				font-size: $font-sm;
				color: #75787d;
				/*border-right: 2rpx solid rgba(0, 0, 0, 0.2);*/
			}

			/*.tj-item:last-child {*/
			/*border-right: none;*/
			/*}*/
			.num {
				font-size: $font-base;
			}

			.red {
				color: $base-color;
			}
		}

		.order-section {
			@extend %section;
			padding: 28rpx 0;

			.order-item {
				@extend %flex-center;
				width: 120rpx;
				height: 120rpx;
				border-radius: 10rpx;
				font-size: $font-sm;
				color: $font-color-dark;
				position: relative;
			}

			.badge {
				position: absolute;
				top: 0;
				right: 4rpx;
			}

			.iconfont {
				font-size: 48rpx;
			}

			.icon-shouhoutuikuan {
				font-size: 44rpx;
			}
		}

		.history-section {
			background: #fff;
			margin-bottom: $spacing-sm;
			.h-list-history {
				margin: 0;
				border-radius: 10rpx;
				white-space: nowrap;
				background-color: $page-color-base;
				.h-item-history {
					background-color: $color-white;
					display: inline-block;
					font-size: $font-sm;
					color: $font-color-base;
					width: 180rpx;
					margin: $spacing-sm $spacing-sm 0 0;
					border-radius: 10rpx;
					position: relative;
					top: 0;
					overflow: hidden;
					.h-item-img {
						width: 180%;
						height: 200rpx;
						border-top-left-radius: 12rpx;
						border-top-right-radius: 12rpx;
						border-bottom: 1rpx solid rgba(0, 0, 0, 0.01);
					}
					.tag {
						position: absolute;
						border-top-left-radius: 12rpx;
						left: 0;
						right: 0;
						width: 60rpx;
						height: 60rpx;
					}
					.h-item-text {
						font-size: $font-sm;
						margin: $spacing-sm 4rpx;
					}
				}
			}
			.no-foot-print {
				text-align: center;
				padding: 48rpx 0;

				.no-foot-print-icon {
					font-size: $font-lg + 2rpx;
					margin-right: 10rpx;
				}
			}
			.share-btn {
				height: 102rpx;
				text-align: left;
				background: none;
				padding: 0;
				margin: 0;
			}

			.share-btn:after {
				border: none;
				border-radius: none;
			}
		}
	}
}
%flex-center {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
}
%section {
	justify-content: space-around;
	display: flex;
	align-content: center;
	background: #fff;
	border-radius: 10rpx;
}
</style>
