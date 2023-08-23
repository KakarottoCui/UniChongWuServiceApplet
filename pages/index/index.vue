//微信：egvh56ufy7hh ，QQ：821898835 
<template>
	<view class="wrap">
		<u-navbar :is-back="false" :title="title" title-color="#000">
			<!-- <view class="slot-wrap" @tap="navTo('/pages/pet/city')">	
				<i class="iconfont iconicon-test" :class="'text-' + themeColor.name"/> 
				<view class="city">{{city.title}} <text class="iconfont iconxiajiantou2" /></view>
			</view> -->
		</u-navbar>

		<view class="swiper-adv" v-if="advs.index_top.length">
			<!-- <u-swiper :list="advs.index_top" name="cover" :current="current" field="content" mode="round" height="300" border-radius="15" @click="navToIndex" ></u-swiper> -->
			
			<uni-swiper-dot :info="advs.index_top" :current="current" field="content" mode="round" :dotsStyles="{ backgroundColor: '#FFF', color: themeColor.color, 
		</view>

		<!-- 公告 -->
		<!-- <rf-swiper-slide v-if="notices.length > 0" :list="notices" class="rf-skeleton" @navTo="navTo('/pages/index/notice/notice')">
			<view slot="header" class="swiper-slide-header">
				<text class="iconfont icongonggao" :class="'text-' + themeColor.name"></text>
			</view>
		</rf-swiper-slide> -->
		
		<!-- 频道 -->
		<swiper :indicator-active-color="themeColor.color" indicator-color="#666" :indicator-dots="false" class="channel-wrap">
			<swiper-item class="channel-list">
				<view class="channel" v-for="(item, index) in channels" :key="index" @tap.stop="navToChannel(index)">
					<view class="icon-wrap">
						<!-- <u-image :src="'/static/pet/icon-' + item.key  + '.png'" width="84" height="84" borderRadius="15" mode="aspectFill" /> -->					<u-icon :name="item.icon" custom-prefix="custom-icon" size="66" :color="themeColor.color" />
					</view>
					<view class="text">{{ item.name}}</view>
				</view>
			</swiper-item>
		</swiper>
		
		<!--列表-->
		<view class="pet-wrap">
			<view class="sticky">
				<view class="sticky-tabs">
					<u-tabs-swiper ref="tabs" :list="tabList" :current="tabsCurrent" @change="tabsChange" :is-scroll="false" bar-height="6" bar-width="40" :active-color="themeColor.color"></u-tabs-swiper>
				</view>
				
			</view>
			
			<view>
				<view class="item" v-for="(item, index) in items" :key="index" @tap="switchTab('/pages/pet/pet-view?id='+item.id)">
					<view class="left"><u-image :src="getPicUrl(item.pic1)" width="100%" height="220" border-radius="20" mode="aspectFill" /></view>
					
					<view class="right">
						<view class="title u-line-2">{{item.title}}</view>
							
						<view class="base" >
							<view class="tag" v-for="(item2,index2) in splitTag(item.tag)" :key="index2">{{item2}}</view>
						</view>
						<!-- 
						<view class="reward">悬赏￥<text class="money">{{item.money}}</text></view> -->
						<view class="summary u-line-2">{{item.content}}</view>
					</view>
					<view class="bottom">
						<view class="datetime">{{item.createTime}}</view>
						<!-- <view class="view">{{item.view}}查看</view>
						<view class="share">{{item.share}}转发</view> -->
					</view>
					<u-line color="info" :hair-line="false" margin="30rpx 0 0 0" />
					
				</view>
				
			</view>
			
			<!-- <swiper :current="swiperCurrent" @transition="swiperTransition" @animationfinish="swiperAnimationfinish" style="height:1150rpx;">
				<swiper-item v-for="(item, tabsIndex) in $mData.types" :key="tabsIndex">
					<pet-index-mescroll-item ref="mescrollItem" :i="tabsIndex" :index="tabsIndex" :params="params" :items="items"></pet-index-mescroll-item>
				</swiper-item>
			</swiper> -->
		</view>
		
		<u-gap height="20" />

		<!--备案-->
		<!--#ifdef H5-->
		<view class="copyright" v-if="config.web_site_icp">
			{{ config.copyright_desc }}
			
			<a href="http://www.beian.miit.gov.cn">{{ config.web_site_icp }}</a>
		</view>
		<!-- #endif -->

		<!--页面加载动画-->
		<rfLoading isFullScreen :active="loading"></rfLoading>
		<!-- <rf-back-top :scrollTop="scrollTop"></rf-back-top> -->
		<!-- <rf-back-home></rf-back-home> -->
	</view>
</template>

<script>
import rfSwipeDot from '@/components/rf-swipe-dot';
import rfSwiperSlide from '@/components/rf-swiper-slide';
import { mapMutations } from 'vuex';
import PetIndexMescrollItem from '../pet/mescroll-item/pet-index-mescroll-item';
// import { indexList } from '@/api/product';
// import { petIndex, petList } from '@/api/pet';
import appRequest from "@/common/appRequestUrl.js";
// const QQMapWX = require('@/common/qqmap-wx-jssdk.min.js');

export default {
	components: {
		rfSwipeDot,
		rfSwiperSlide,
		PetIndexMescrollItem,
	},
	data() {
		return {
			userInfo:{},
			items:[],
			$mData: this.$mData,
			appName: this.$mSettingConfig.appName,
			path: '/pages/index/index',
			title: this.$mSettingConfig.appName + '',
			qqmapsdk: null,
			city: { 
				id: 0,
				title: '全国'
			},
			current: 0, // 轮播图index
			advs: {
				index_top: []
			}, // 广告图
			notices: [],
			channels: [
				{
					key: 'find',
					icon: 'pet',
					name: '领养寄养',
					route: '/pages/pet/list',
					type: 'switchTab'
				},
				{
					key: 'mall',
					icon: 'ask',
					name: '养宠宝典',
					route: '/pages/pet/ask',
					type: 'switchTab'
				},
				{
					key: 'blocklist',
					icon: 'forum',
					name: '分享社区',
					route: '/pages/pet/forum',
					type: 'push'
				},
				
			],
			tabsCurrent: 0, // tabs组件的current值，表示当前活动的tab选项
			swiperCurrent: 0, // swiper组件的current值，表示当前那个swiper-item是活动的
			config: {}, // 配置
			loading: true,
			scrollTop: 0,
			kefuShow: true,
			loadingType: 'more',
			newsBg: this.$mAssetsPath.newsBg,
			errorImage: this.$mAssetsPath.errorImage,
			pages: [1, 1, 1, 1],
			// type: 1,
			// cate: 0,
			moneySymbol: this.moneySymbol,
			genders: ['不限', '男孩', '女孩'],
			ages: ['不限', '幼年', '成年', '老年'],
			sizes: ['不限', '小型', '中型', '大型'],
			hairs: ['不限', '长毛', '短毛', '无毛'],
			states: ['不限', '已免疫', '已绝育', '已驱虫'],
			activeStyle: {
				background: '#FFCE0C',
				color: '#01040A'
			},
			filterShow: false,
			params: {},
			tabList:[{ key: 1, name: '领养', title: '领养', content: 'Ta的故事', tips: '为小可爱找新家' },
		{ key: 3, name: '寄养', title: '拾得', content: '宠物详情', tips: '为小可爱寻找原主人' },{ key: 4, name: '养宠宝典', title: '拾得', content: '宠物详情', tips: '为小可爱寻找原主人' }]
		};
	},
	onLoad() {
		// this.qqmapsdk = new QQMapWX({
		// 	key: this.$mData.maps[0].key
		// });
		
		//this.initData();
		this.getData(0);
		this.advs = {index_top:[
		   {"cover": "/static/tab/banner01.png"},
		   {"cover": "/static/tab/banner02.png"},
		   {"cover": "/static/tab/banner03.png"},
		]}
		this.loading = false;
	},
	onShow() {
		let userInfo = appRequest.getUserInfo();
		if(!userInfo){
			
		}else{
			this.userInfo = userInfo;
		}
		// let city = uni.getStorageSync('city');

		// if (city && this.city.id != city.id) {
		// 	this.city = city;
			
		// 	this.$nextTick(() => {
		// 		for (let tab of this.$mData.types) {
		// 			this.getMescroll(tab.key-1).triggerDownScroll();
		// 		}
		// 	});
		// }
	},
	onPageScroll(e) {
		this.scrollTop = e.scrollTop;
	},
	/* onReachBottom() {
		this.mescroll && this.mescroll.onReachBottom();
	},
	onPageScroll(e) {
		this.mescroll && this.mescroll.onPageScroll(e);
	}, */
	onPullDownRefresh() {
		// this.getIndexList('refresh');
	},
	onShareAppMessage(res) {
		return { 
			title: this.title,
			path: this.path
		};
	},
	computed: {
		statusBar() {
			const e = uni.getSystemInfoSync();
			return e.statusBarHeight;
		},
		bottom() {
			let bottom = 0;
			/*  #ifdef H5  */
			bottom = 90;
			/*  #endif */
			return bottom;
		}
	},
	methods: {
		splitTag(text){
			return text.split(" ");
		},
		getPicUrl(info) {
			if(info){
				if( info.length > 10 ){
					return info;
				}else {
					return appRequest.urlMap.getPicById + info;
				}
			}else {
				return "";
			}
		
		},
		getData(type){
			var _this = this;
			appRequest.request({
				method: "POST",
				url: appRequest.urlMap.findNmArticleList,
				data:{
					validFlag:1,
					type:type
				},
				success: function(res) {
					if (res.data.code == 200) {
						let obj = res.data.data;
						_this.items = obj;
					}else{
						uni.showToast({
							title:"获取失败",
							icon:"none"
						})
					}
				},
				fail: function(res) {
					uni.showToast({
						title:"网络异常",
						icon:"none"
					})
				}
			})
		},
		// 数据初始化
		initData() {
			this.getCity();
			this.getIndexList();
		},
		// 监听轮播图切换
		handleDotChange(e) {
			this.current = e.detail.current;
		},
		// 通用跳转
		navTo(route) {
			this.$mRouter.push({ route });
		},
		// Tabbar跳转
		switchTab(route) {
			uni.navigateTo({
				url:route
			})
			//this.$mRouter.switchTab({ route });
		},
		navToChannel(index) {
			if(index==2){
				uni.navigateTo({
					url:"/pages/pet/public"
				})
			}else{
				index = index == 1 ? 2:index;
				this.swiperCurrent = index;
				this.tabsCurrent = index;
				let jump = index == 2 ? 3 :index;
				this.getData(jump);
			}
		},
		navToIndex() {
			switch (this.current) {
				case 0:
					this.navTo(`/pages/index/notice/notice`);
					break;
				case 1:
					this.switchTab(`/pages/pet/list`);
					break;
				case 2:
					this.switchTab(`/pages/pet/forum`);
					break;
				default:
					break;
			}
		},
		// 跳至广告图指定页面
		indexTopToDetailPage(item) {
			this.$mHelper.handleBannerNavTo(item.jump_type, item.jump_link, item.id);
		},
		// 获取主页数据
		async getIndexList(refresh) {
			// await this.$http.get(`${indexList}`, {}).then(async r => {
			// 	uni.setNavigationBarTitle({ title: this.appName });
			// 	if (refresh === 'refresh') uni.stopPullDownRefresh();
			// 	this.initIndexData(r.data);
			// 	this.loading = false;
			// }).catch(() => {
			// 	this.loading = false;
			// 	if (refresh === 'refresh') uni.stopPullDownRefresh();
			// });
		},
		// 首页参数赋值
		initIndexData(data) {
			this.advs = {index_top:[
			   {"cover": "/static/tab/banner01.png"},
			   {"cover": "/static/tab/banner02.png"},
			   {"cover": "/static/tab/banner03.png"},
			]}
			this.notices = data.announce;
			this.config = data.config;
			this.$mHelper.handleWxH5Share(this.share.share_title || this.appName, this.share.share_desc || `欢迎来到${this.appName}`, this.share.share_link || this.$mConfig.hostUrl, this.share.share_cover || this.$mSettingConfig.appLogo);
		},
		// 跳转至商品详情页
		navToDetailPage(data) {
			const { id } = data;
			if (!id) return;
			this.navTo(`/pages/pet/view?id=${id}`);
		},
		animationfinish(e) {
			this.current = e.detail.current;
		},
		// tabs通知swiper切换
		tabsChange(index) {
			this.swiperCurrent = index;
			this.tabsCurrent = index;
			let jump = index == 2 ? 3 :index;
			this.getData(jump);
		},
		// swiper-item左右移动，通知tabs的滑块跟随移动
		swiperTransition(e) {
			let dx = e.detail.dx;
			this.$refs.tabs.setDx(dx);
		},
		// 由于swiper的内部机制问题，快速切换swiper不会触发dx的连续变化，需要在结束时重置状态
		// swiper滑动结束，分别设置tabs和swiper的状态
		swiperAnimationfinish(e) {
			let tabsCurrent = e.detail.current;
			this.$refs.tabs.setFinishCurrent(tabsCurrent);
			this.swiperCurrent = tabsCurrent;
			this.tabsCurrent = tabsCurrent;
			
			this.cate = tabsCurrent;
		},
		getMescroll(i) {
			let mescrollItems = this.$refs.mescrollItem;
		
			if (mescrollItems) {
				let item = mescrollItems[i];
				if (item) return item.mescroll;
			}
		
			return null;
		},
		getCity() {
			let city = uni.getStorageSync('city');
			
			if (city) {
				this.city = city;
			} else {
				let _this = this;
				// #ifdef MP
				uni.authorize({
					scope: 'scope.userLocation',
					success() {
				// #endif
						uni.getLocation({
							type: 'gcj02',
							geocode: true,
							success(res) {
								_this.qqmapsdk.reverseGeocoder({
									location: {
										latitude: res.latitude,
										longitude: res.longitude
									},
									success(res) {
										let city = {
											id: res.result.ad_info.city_code - 156000000,
											title: res.result.ad_info.city
										}
										uni.setStorageSync('city', city);
										_this.city = city;
										_this.getMescroll(_this.swiperCurrent).triggerDownScroll();
									},
									fail(error) {
										console.error(error);
									}
								});
							},
							fail(error) {
								console.error(error);
							}
						});
				// #ifdef MP
					}
				});
				// #endif
			}
		}
	}
};
</script>

<style lang="scss">
page {
	background: #F5F5F5;
	.wrap {
		.slot-wrap {
			display: flex;
			align-items: center;
			/* flex: 1; */
			padding: 0 30rpx;
			.city {
				max-width: 150upx;
				color: #666;
				white-space: nowrap;
				text-overflow: ellipsis; 
				overflow: hidden; 
				// -webkit-line-clamp: 1;
				// -webkit-box-orient: vertical;
			}
		}
		.swiper-adv {
			background: $color-white;
			padding: 10upx 20upx;
			.swiper-box {
				width: 100%;
				height: 300upx;
				overflow: hidden;
				border-radius: 15upx;
				//box-shadow: 0upx 8upx 25upx rgba(0, 0, 0, 0.2);
				//兼容ios，微信小程序
				//position: relative;
				swiper {
					width: 100%;
					height: 40vw;
				}
			}
		}
		/*轮播图2*/
		.swiper-item-text {
			position: absolute;
			bottom: 16upx;
			left: 30upx;
			height: 48upx;
			line-height: 48upx;
			background: rgba(0, 0, 0, 0.2);
			width: 90%;
			color: $color-white;
			border-bottom-left-radius: 12upx;
			padding-left: 20upx;
		}
		/*频道列表*/
		.channel-wrap {
			height: 220upx;
			background-color: #FFF;
			margin-top: 20upx;
			padding: 30upx 50upx 0 50upx;
			.channel-list {
				width: 100%;
				display: flex;
				justify-content: space-between;
				flex-wrap: wrap;
				.channel {
					margin-top: 10upx;
					width: calc(20% - 20upx);
					height: 132upx;
					display: flex;
					text-align: center;
					flex-wrap: wrap;
					.icon-wrap {
						width: 100%;
						display: flex;
						justify-content: center;
					}
					.text {
						width: 100%;
						color: #333;
						font-size: 26upx;
						margin-top: 16upx;
					}
				}
				// .channel:nth-child(2) .text {
				// 	opacity: 0.5;
				// }
			}
		}
		/*宠物列表*/
		.pet-wrap {
			margin-top: 20upx;
			background: $color-white;
			.sticky {
				display: flex;
				align-items: center;
				.sticky-tabs {
					width: 80%;
				}
				.sticky-more {
					width: 20%;
					height: 80upx;
					line-height: 80upx;
					color: #999;
					font-size: 28upx;
					background: #FFF;
					text-align: center;
				}
			}
		}

		/*版权显示*/
		.copyright {
			margin: 10upx 0;
			width: 100%;
			text-align: center;
			color: #666;
			a {
				display: block;
				color: #666;
				text-decoration: none;
			}
		}
	}
}

.item {
	display: flex;
	flex-wrap: wrap;
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
				border: 2upx #CCC solid;
				border-radius: 10upx;
				padding: 0 20upx;
				margin-right: 14upx;
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
	.u-line {
		color: #F1F1F1;
	}
	::v-deep u-line {
		flex-basis: 100%;
		color: #F1F1F1;
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
