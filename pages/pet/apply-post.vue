<template>
	<view class="wrap">
		<view class="subwrap">
			<u-alert-tips type="warning" show-icon title="温馨提示" description="领养从真诚开始，以下信息有助于送养人了解您的基本情况，请尽量详细填写。"/>
			
			<u-gap height="30" />
			
			<u-form ref="uForm" :model="item" :rules="rules" label-position="top" :border-bottom="false" :errorType="errorType">
				<u-form-item label="个人昵称" prop="member.nickname" :border-bottom="false" :label-style="labelStyle">
				 	<u-input v-model="item.member.nickname" height="100" :custom-style="customStyle" trim placeholder="请输入" />
				</u-form-item>
				
				<u-form-item label="性别" prop="member.gender" label-position="left" :border-bottom="false" label-width="auto" :label-style="labelStyle02"></u-form-item>
				<u-subsection :list="$mData.member.genders" :current="item.member.gender" mode="button" height="68" :bold="false" active-color="#FFF" :button-color="themeColor.color" @change="genderSectionChange"></u-subsection>
				
				<u-form-item label="婚姻状况" prop="member.marital" label-position="left" :border-bottom="false" label-width="auto" :label-style="labelStyle02"></u-form-item>
				<u-subsection :list="$mData.member.maritals" :current="item.member.marital" mode="button" height="68" :bold="false" active-color="#FFF" :button-color="themeColor.color" @change="maritalSectionChange"></u-subsection>
				
				<u-form-item label="住房情况" prop="member.housing" label-position="left" :border-bottom="false" label-width="auto" :label-style="labelStyle02"></u-form-item>
				<u-subsection :list="$mData.member.housings" :current="item.member.housing" mode="button" height="68" :bold="false" active-color="#FFF" :button-color="themeColor.color" @change="housingSectionChange"></u-subsection>
				
				<u-gap height="30" />
				
				<u-form-item label="出生日期" prop="member.birthday" :border-bottom="false" :label-style="labelStyle">
					<u-input v-model="item.member.birthday" height="100" disabled :custom-style="customStyle" placeholder="请选择" @click="birthdayShow = true" />
				</u-form-item>
				
				<u-form-item label="职业" prop="member.career" :border-bottom="false" :label-style="labelStyle">
					<u-input v-model="item.member.career" height="100" :custom-style="customStyle" trim placeholder="请输入" />
				</u-form-item>
				
				<u-form-item label="手机" prop="member.mobile" :border-bottom="false" :label-style="labelStyle">
					<u-input v-model="item.member.mobile" height="100" :custom-style="customStyle" trim placeholder="请输入" />
				</u-form-item>
				
				<u-form-item label="微信" prop="member.wechat" :border-bottom="false" :label-style="labelStyle">
					<u-input v-model="item.member.wechat" height="100" :custom-style="customStyle" trim placeholder="请输入" />
				</u-form-item>
				
				<u-form-item label="QQ" prop="member.qq" :border-bottom="false" :label-style="labelStyle">
					<u-input v-model="item.member.qq" height="100" :custom-style="customStyle" trim placeholder="请输入（选填）" />
				</u-form-item>
				
				<u-form-item label="地址" prop="member.address" :border-bottom="false" :label-style="labelStyle" right-icon="map">
					<u-input v-model="item.member.address" height="100" disabled :custom-style="customStyle" placeholder="请选择" @click="chooseLocation" />
				</u-form-item>
				
				<u-form-item label="养宠经验" prop="member.pet_experience" :border-bottom="false" :label-style="labelStyle">
					<u-input type="textarea" v-model="item.member.pet_experience" height="246" :custom-style="customStyle02" placeholder="如没有请写“无养宠经验”" />
				</u-form-item>
				
				<u-form-item label="申请语" prop="member.pet_apply" :border-bottom="false" :label-style="labelStyle">
					<u-input type="textarea" v-model="item.member.pet_apply" height="246" :custom-style="customStyle02" placeholder="想对送养人说的话都写在这里~" />
				</u-form-item>
				
				<u-button type="warning" form-type="submit" @click="submit" :loading="submitLoading" shape="circle" ripple :custom-style="customStyle04">提交申请</u-button>
			</u-form>
			<u-picker v-model="birthdayShow" mode="time" :default-time="defaultTime" :start-year="1949" :params="birthdayParams" @confirm="birthdayConfirm"></u-picker>
		</view>
	</view>
</template>

<script>
import { applyForm } from '@/api/pet';

const QQMapWX = require('@/common/qqmap-wx-jssdk.min.js');

export default {
	data() {
		return {
			qqmapsdk: null,
			$mData: this.$mData,
			errorType: ['toast', 'message', 'border-bottom'],
			submitLoading: false,
			loading: false,
			pet_id: 0,
			owner_id: 0,
			item: {
				contact: {},
				member: {
					birthday: '2021-01-01'
				}
			},
			defaultTime: '',
			birthdayShow: false,
			birthdayParams: {
				year: true,
				month: true,
				day: true,
				timestamp: true,
			},
			rules: {
				'member.nickname': this.$mData.rules['member.nickname'],
				'member.birthday': this.$mData.rules['member.birthday'],
				'member.career': this.$mData.rules['member.career'],
				'member.address': this.$mData.rules['member.address'],
				'member.pet_experience': this.$mData.rules['member.pet_experience'],
				'member.pet_apply': this.$mData.rules['member.pet_apply'],
				'member.mobile': this.$mData.rules['member.mobile'],
				'member.wechat': this.$mData.rules['member.wechat'],
				'member.qq': this.$mData.rules['member.qq']
			}
		};
	},
	onLoad(option) {
		this.pet_id = option.pet_id ? option.pet_id : this.pet_id;
		this.owner_id = option.owner_id ? option.owner_id : this.owner_id;
		this.qqmapsdk = new QQMapWX({
			key: this.$mData.maps[0].key
		});
	},
	onShow() {

	},
	onReady(res) {
		if (this.id) {
			uni.setNavigationBarTitle({
			  title: '编辑寻宠'
			});
		}
		
		this.defaultTime = this.item.member.birthday;
		this.$refs.uForm.setRules(this.rules);
	},
	mounted() {
		this.initLogin();
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
		labelStyle02() {
			return {
				height: '30rpx',
				color: '#999',
				fontSize: '26rpx',
			}
		},
		labelStyle03() {
			return Object.assign(this.labelStyle, { marginBottom: '20rpx' });
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
				color: '#333',
				fontSize: '28rpx',
				background: '#F6F7FB',
				padding: '0 30rpx'
			}
		},
		customStyle04() {
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
			
			if (hasLogin && userInfo) {
				this.item.member = userInfo;
			} else {
				this.navTo('/pages/public/logintype');
			}
		},
		navTo(route) {
			this.$mRouter.push({ route });
		},
		genderSectionChange(index) {
			this.item.member.gender = this.$mData.member.genders[index].key;
		},
		maritalSectionChange(index) {
			this.item.member.marital = this.$mData.member.maritals[index].key;
		},
		housingSectionChange(index) {
			this.item.member.housing = this.$mData.member.housings[index].key;
		},
		birthdayConfirm(e) {
			this.item.member.birthday = e.year + '-' + e.month + '-' + e.day;
		},
		chooseLocation() {
			let _this = this;
			// #ifdef MP
			uni.authorize({
				scope: 'scope.userLocation',
				success(res) {
			// #endif
					uni.chooseLocation({
						success(res) {
							//_this.$set(_this.item, 'member.address', res.address); //解决不及时更新的问题
							_this.item.member.address = res.address;
							_this.item.member.coords = { lat: res.latitude, lng: res.longitude}; //纬度&经度
							_this.item.member.location = res.name;
							
							_this.qqmapsdk.reverseGeocoder({
								location: {
									latitude: res.latitude,
									longitude: res.longitude
								},
								success(res) {
									_this.item.member.province_id = res.result.ad_info.adcode.substring(0, 2) * 10000;
									_this.item.member.city_id = res.result.ad_info.city_code - 156000000;
									_this.item.member.area_id = res.result.ad_info.adcode * 1;
									_this.item.member.province = res.result.ad_info.province;
									_this.item.member.city = res.result.ad_info.city;
									_this.item.member.area = res.result.ad_info.district;
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
				},
				fail() {
					uni.showModal({
						content: '位置信息授权才能选择',
						success(res) {
							if (res.confirm) {
								uni.openSetting({
								  success(res) {
								    //console.log(res.authSetting);
								  }
								});
							}
						}
					});
				}
			});
			// #endif
		},
		submit() {
			this.item.contact = this.item.member;
			
			setTimeout(() =>{
			  this.$refs.uForm.validate(valid => {
			  	if (valid) {
			  		this.postItem(this.item);
			  	}
			  });
			}, 300);
		},
		postItem(params) {
			this.submitLoading = true;
			let url = `${applyForm}`;
			url += `?pet_id=${this.pet_id}&owner_id=${this.owner_id}`;
			
			this.$http.post(url, {
				...params,
			}).then(async r => {
				uni.setStorageSync('userInfo', this.item.member);
				this.submitLoading = false;
				
				let _this = this;
				let content = '已提交领养申请，等待送养人处理。';
				
				if (!r.data) content = '不能重复申请同一送养宠物！';

				uni.showModal({
					content: content,
					showCancel: false,
					success(res) {
						if (res.confirm) {
							//_this.$mRouter.back();
							_this.navTo(`/pages/pet/apply-view?id=${r.data.id}`);
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
}
</style>
