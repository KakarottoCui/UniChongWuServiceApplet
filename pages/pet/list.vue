<template>
	<view class="wrap">
		<u-navbar :is-back="false" :title="title" title-color="#000">
			<view class="slot-wrap" @tap="navTo('/pages/pet/city')">
				<i class="iconfont iconicon-test" :class="'text-' + themeColor.name"/> 
				<view class="city">{{city.title}} <text class="iconfont iconxiajiantou2" /></view>
			</view>
		</u-navbar>
		
		<view class="sticky">
			<view class="sticky-tabs">
				<u-tabs-swiper ref="tabs" :list="$mData.types" :current="tabsCurrent" @change="tabsChange" :is-scroll="false" bar-height="6" bar-width="40" :active-color="themeColor.color"></u-tabs-swiper>
			</view>
			
			<view class="sticky-filter" :style="[filterShow ? { color: themeColor.color } : {}]" @tap="filterOpen">
				筛选 <image src="/static/pet/filter.png" mode="aspectFill" />
			</view>
			
			<view class="sticky-post">
				<u-button type="default" size="mini" plain shape="circle" :custom-style="{ borderColor: themeColor.color, color: themeColor.color }" @click="navToCheckLogin('/pages/pet/pet-post')">我要发布</u-button>
			</view>
		</view>
		
		<view class="filter" v-show="filterShow">
			<view class="filter-layer" @tap="filterClose"></view>
			<view class="filter-wrap" :style="{ borderBottomColor: themeColor.color }">
				<view class="filter-title u-m-t-30">分类</view>
				
				<view class="filter-subwrap">
					<button hover-class="hover" :style="[params.cate == index ? filterActiveStyle : {}]" v-for="(cate, index) in cates" :key="index" @tap="cateChange(index)">{{cate}}</button>
				</view>
				
				<view class="filter-title">性别</view>
				
				<view class="filter-subwrap">
					<button hover-class="hover" :style="[params.gender == index ? filterActiveStyle : {}]" v-for="(gender, index) in genders" :key="index" @tap="genderChange(index)">{{gender}}</button>
				</view>
		
				<view class="filter-title">年龄</view>
				
				<view class="filter-subwrap">
					<button hover-class="hover" :style="[params.age == index ? filterActiveStyle : {}]" v-for="(age, index) in ages" :key="index" @tap="ageChange(index)">{{age}}</button>
				</view>
				
				<view class="filter-title">体型</view>
				
				<view class="filter-subwrap">
					<button hover-class="hover" :style="[params.size == index ? filterActiveStyle : {}]" v-for="(size, index) in sizes" :key="index" @tap="sizeChange(index)">{{size}}</button>
				</view>
				
				<view class="filter-title">毛发</view>
				
				<view class="filter-subwrap">
					<button hover-class="hover" :style="[params.hair == index ? filterActiveStyle : {}]" v-for="(hair, index) in hairs" :key="index" @tap="hairChange(index)">{{hair}}</button>
				</view>
				
				<view class="filter-title">身体状况</view>
				
				<view class="filter-subwrap">
					<button hover-class="hover" :style="[params.state == 1 ? filterActiveStyle : {}]"  @tap="stateChange(0)">{{states[0]}}</button>
					<button hover-class="hover" :style="[params.vaccine == 1 ? filterActiveStyle : {}]"  @tap="stateChange(1)">{{states[1]}}</button>
					<button hover-class="hover" :style="[params.sterilize == 1 ? filterActiveStyle : {}]"  @tap="stateChange(2)">{{states[2]}}</button>
					<button hover-class="hover" :style="[params.deworm == 1 ? filterActiveStyle : {}]"  @tap="stateChange(3)">{{states[3]}}</button>
				</view>
				
				<view class="filter-subwrap02">
					<view class="filter-reset" @tap="filterReset">重置</view>
					<view class="filter-confirm" :style="{ background: themeColor.color }" @tap="filterConfirm">确定</view>
				</view>
			</view>
		</view>
		
		<swiper :current="swiperCurrent" @transition="swiperTransition" @animationfinish="swiperAnimationfinish" :style="{ height: systemInfo.screenHeight + 'px' }">
			<swiper-item v-for="(item, index) in $mData.types" :key="index">
				<pet-mescroll-item ref="mescrollItem" :i="index" :index="index" :tabs="$mData.types" :params="params"></pet-mescroll-item>
			</swiper-item>
		</swiper>

		<!--页面加载动画-->
		<rfLoading isFullScreen :active="loading"></rfLoading>
		<!-- <rf-back-top :scrollTop="scrollTop"></rf-back-top> -->
		<!-- <rf-back-home></rf-back-home> -->
	</view>
</template>

<script>
import { petIndex, petList } from '@/api/pet';
import PetMescrollItem from './mescroll-item/pet-mescroll-item';

const QQMapWX = require('@/common/qqmap-wx-jssdk.min.js');

export default {
	components: {
		PetMescrollItem
	},
	data() {
		return {
			path: '/pages/pet/list',
			title: '领养中心',
			$mData: this.$mData,
			systemInfo: {},
			qqmapsdk: null,
			city: {
				id: 0,
				title: '全国'
			},
			tabsCurrent: 0,
			swiperCurrent: 0,
			loading: false,
			scrollTop: 0,
			currentCate: 0,
			customStyle: {},
			cates: ['全部', '猫', '狗', '其他'],
			genders: ['不限', '男孩', '女孩', '未知'],
			ages: ['不限', '幼年', '成年', '老年'],
			sizes: ['不限', '小型', '中型', '大型'],
			hairs: ['不限', '无毛', '短毛', '长毛'],
			states: ['不限', '已免疫', '已绝育', '已驱虫'],
			filterShow: false,
			params: {
				cate: 0,
				gender: 0,
				age: 0,
				state: 1, //非字段临时使用
				vaccine: 0,
				sterilize: 0,
				deworm: 0,
				size: 0,
				hair: 0
			}
		};
	},
	onLoad() {
		let _this = this;
		this.systemInfo = uni.getStorageSync('systemInfo');
		
		if (!this.systemInfo) {
			uni.getSystemInfo({
				success(res) {
					_this.systemInfo = res;
					uni.setStorageSync('systemInfo', res);
				}
			});
		}
		
		this.qqmapsdk = new QQMapWX({
			key: this.$mData.maps[0].key
		});
		
		this.initData();
	},
	onShow() {
		let city = uni.getStorageSync('city');
	
		if (city && this.city.id != city.id) {
			this.city = city;
			
			this.$nextTick(() => {
				for (let tab of this.$mData.types) {
					this.getMescroll(tab.key-1).triggerDownScroll();
				}
			});
		}
	},
	onShareAppMessage(res) {
		return { 
			title: this.title,
			path: this.path
		};
	},
	computed: {
		filterActiveStyle() {
			return {
				background: this.themeColor.color,
				color: '#FFF'
			}
		}
	},
	methods: {
		initData() {
			this.getCity();
		},
		navTo(route) {
			this.$mRouter.push({ route });
		},
		navToCheckLogin(route) {
			let hasLogin = this.$mStore.getters.hasLogin;
		
			if (hasLogin) {
				this.$mRouter.push({ route });
			} else {
				this.navToLogin();
			}
		},
		navToLogin() {
			uni.setStorageSync('backToPage', JSON.stringify({ route: this.path }));
		
			let _this = this;
			uni.showModal({
				content: '未登录，是否跳转登录页面？',
				success(res) {
					if (res.confirm) {
						_this.$mRouter.push({ route: `/pages/public/logintype` });
					}
				}
			});
		},
		tabsChange(index) {
			this.swiperCurrent = index;
		},
		swiperTransition(e) {
			let dx = e.detail.dx;
			this.$refs.tabs.setDx(dx);
		},
		swiperAnimationfinish(e) {
			let tabsCurrent = e.detail.current;
			this.$refs.tabs.setFinishCurrent(tabsCurrent);
			this.swiperCurrent = tabsCurrent;
			this.tabsCurrent = tabsCurrent;
		},
		cateChange(index) {
			this.params.cate = index;
		},
		genderChange(index) {
			this.params.gender = index;
		},
		ageChange(index) {
			this.params.age = index;
		},
		sizeChange(index) {
			this.params.size = index;
		},
		hairChange(index) {
			this.params.hair = index;
		},
		stateChange(index) {
			switch(index) {
				case 0:
					this.params.state = 1;
					this.params.vaccine = 0;
					this.params.sterilize = 0;
					this.params.deworm = 0;
					break;
				case 1:
					this.params.vaccine = Number(!this.params.vaccine);
					break;
				case 2:
					this.params.sterilize = Number(!this.params.sterilize);
					break;
				case 3:
					this.params.deworm = Number(!this.params.deworm);
					break;
				default:
					break;
			}
			
			if (this.params.vaccine || this.params.sterilize || this.params.deworm) {
				this.params.state = 0;
			}
			
			if (!this.params.vaccine && !this.params.sterilize && !this.params.deworm) {
				this.params.state = 1;
			}
		},
		getMescroll(i) {
			let mescrollItems = this.$refs.mescrollItem;
		
			if (mescrollItems) {
				let item = mescrollItems[i];
				if (item) return item.mescroll;
			}
		
			return null;
		},
		filterOpen() {
			this.filterShow = !this.filterShow;
		},
		filterClose() {
			this.filterShow = false;
		},
		filterReset() {
			this.params.cate = 0;
			this.params.gender = 0;
			this.params.age = 0;
			this.params.size = 0;
			this.params.hair = 0;
			this.params.state = 1,
			this.params.vaccine = 0,
			this.params.sterilize = 0,
			this.params.deworm = 0,
			this.filterConfirm();
		},
		filterConfirm() {
			this.filterSubmit();
			this.filterClose();
		},
		filterSubmit() {
			this.getMescroll(this.swiperCurrent).triggerDownScroll();
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
		//background: $color-white;
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
		.sticky {
			background: #FFF;
			position: sticky;
			top: var(--window-top);
			display: flex;
			align-items: center;
			z-index: 999;
			padding: 0 30upx;
			.sticky-tabs {
				width: 65%;
			}
			.sticky-filter {
				width: 20%;
				height: 80upx;
				line-height: 80upx;
				color: #999;
				font-size: 24upx;
				background: #FFF;
				text-align: center;
				image {
					width: 24upx;
					height: 26upx;
					margin-left: 5upx;
					vertical-align: middle;
				}
			}
			.sticky-post {
				flex-grow: 1;
				height: 80upx;
				line-height: 80upx;
				background: #FFF;
				color: #999;
				font-size: 24upx;
			}
		}
		.filter {
			width: 100%;
			height: 100%;
			position: absolute;
			z-index: 10000;
			.filter-layer {
				width: 100%;
				height: 100%;
				background: #000;
				position: absolute;
				opacity: 0.5;
				z-index: 10001;
			}
			.filter-wrap {
				width: 100%;
				background: #FFF;
				border-top: 2upx #F1F1F1 solid;
				border-bottom: 2upx #F1F1F1 solid;
				position: relative;
				opacity: 1;
				z-index: 10002;
				.filter-title {
					color: #999;
					font-size: 26upx;
					padding: 0 30upx;
				}
				.filter-subwrap {
					flex-wrap: wrap;
					padding: 0 30upx;
					margin-top: 10upx;
					button {
						width: 20%;
						height: 50upx;
						line-height: 50upx;
						color: #666;
						font-size: 26upx;
						background: #F6F7FB;
						border-radius: 6upx;
						margin: 0 30upx 10upx 0;
						display: inline-block;
					}
					button:after {
						border: 0;
					}
					.hover {
						background: #FFCE0C;
					}
				}
				.filter-subwrap02 {
					height: 80upx;
					border-top: #F1F1F1 1px solid;
					display: flex;
					justify-content: space-around;
					text-align: center;
					margin-top: 30upx;
					.filter-reset {
						width: 50%;
						line-height: 80upx;
						color: #999;
						font-size: 14px;
					}
					.filter-confirm {
						width: 50%;
						line-height: 80upx;
						background: #FFCE0C;
						color: #FFF;
						font-size: 14px;
					}
				}
			}
		}
	}
}
</style>
