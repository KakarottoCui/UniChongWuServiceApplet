<template>
	<view class="wrap">
		<view class="subwrap">
			<u-form ref="uForm" :model="item" :rules="rules" label-position="top" :border-bottom="false" :errorType="errorType">
				<u-form-item label="宠物视频" prop="video" :border-bottom="false" :label-style="labelStyle">
					<tm-upload ref="videoRef" @change="getUploadVideos" @progress="uploadVideosProgress" @remove="removeVideos" :upload_auto="true" :upimg_move="true"></tm-upload>
				</u-form-item>
				
				<u-line-progress active-color="#FECD32" :percent="progress" v-if="progress && !item.video"></u-line-progress>
				
				<view class="progress-tips" v-if="progress == 100 && !item.video">
					发送完成100%，服务端正在进行接收处理，请稍等...<u-loading mode="circle" color="#F90" :size="26"></u-loading>
				</view>
				
				<u-divider half-width="50%">视频上传：0-1个，可选项</u-divider>
				
				<u-form-item label="宠物图片" prop="images" :border-bottom="false" :label-style="labelStyle">
					<u-upload ref="uploadRef" :header="uploadHeader" :action="uploadAction" :file-list="uploadFileList" :max-size="5 * 1024 * 1024" max-count="6" @on-success="uploadSuccess" @on-uploaded="uploaded" @on-error="uploadError" @on-remove="uploadRemove" @on-change="uploadChange"></u-upload>
				</u-form-item>
				
				<u-divider half-width="50%">图片上传：1-6张，第1张为封面</u-divider>

				<u-form-item label="发布类型" prop="type" label-position="left" :border-bottom="false" label-width="auto" :label-style="labelStyle"></u-form-item>
				<u-subsection :list="$mData.types" :current="item.type - 1" mode="button" height="68" :bold="false" active-color="#FFF" :button-color="themeColor.color" @change="typeSectionChange" />
				
				<u-gap height="30" />
				
				<u-divider half-width="50%">{{$mData.types[item.type-1].name}}：{{$mData.types[item.type-1].tips}}</u-divider>
				
				<u-form-item :label="$mData.types[item.type-1].name + '标题'" prop="title" :border-bottom="false" :label-style="labelStyle">
					<u-input v-model="item.title" height="100" :custom-style="customStyle" trim placeholder="请输入" />
				</u-form-item>
				
				<u-form-item label="宠物分类" prop="cate" label-position="left" :border-bottom="false" label-width="auto" :label-style="labelStyle"></u-form-item>
				<u-subsection :list="$mData.cates" :current="item.cate - 1" mode="button" height="68" :bold="false" active-color="#FFF" :button-color="themeColor.color" @change="cateSectionChange" />
				
				<u-gap height="20" />
				
				<u-form-item label="宠物性别" prop="gender" label-position="left" :border-bottom="false" label-width="auto" :label-style="labelStyle"></u-form-item>
				<u-subsection :list="$mData.genders" :current="item.gender" mode="button" height="68" :bold="false" active-color="#FFF" :button-color="themeColor.color" @change="genderSectionChange" />
				
				<u-gap height="20" />
				
				<u-form-item label="宠物年龄" prop="age" label-position="left" :border-bottom="false" label-width="auto" :label-style="labelStyle"></u-form-item>
				<u-subsection :list="$mData.ages" :current="item.age - 1" mode="button" height="68" :bold="false" active-color="#FFF" :button-color="themeColor.color" @change="ageSectionChange" />
				
				<u-gap height="20" />

				<block v-if="item.type != 3">
					<u-form-item label="宠物昵称" prop="nickname" :border-bottom="false" :label-style="labelStyle">
						<u-input v-model="item.nickname" height="100" :custom-style="customStyle" trim placeholder="请输入" />
					</u-form-item>
				</block>

				<u-form-item label="宠物品种" prop="breed" :border-bottom="false" :label-style="labelStyle">
					<u-input v-model="item.breed" height="100" :custom-style="customStyle" trim placeholder="请输入" />
				</u-form-item>
				
				<block v-if="item.type == 1">
					<u-form-item label="有偿无偿" prop="mode" label-position="left" :border-bottom="false" label-width="auto" :label-style="labelStyle"></u-form-item>
					<u-subsection :list="$mData.modes" :current="item.mode" mode="button" height="68" :bold="false" active-color="#FFF" :button-color="themeColor.color" @change="modeSectionChange" />
					
					<u-gap height="20" />
				</block>
				
				<block v-if="(item.type == 1 && item.mode > 0) || item.type == 2">
					<u-form-item label="金额" prop="money" :border-bottom="false" :label-style="labelStyle" right-icon="red-packet-fill">
						<u-input type="digit" v-model="item.money" height="100" :custom-style="customStyle" trim placeholder="请输入金额" />
					</u-form-item>
				</block>
				
				<u-divider half-width="50%" v-if="item.type == 1 && item.mode == 1">领养红包：领养人支付红包不超过200元</u-divider>
				
				<u-divider half-width="50%" v-if="item.type == 1 && item.mode == 2">领养押金：领养人支付不超过2000元，平台保管</u-divider>
				
				<u-divider half-width="50%" v-if="item.type == 2">寻宠悬赏：发布人支付悬赏红包不超过10000元</u-divider>
				
				<block v-if="item.type == 1 && item.mode == 2">
					<u-gap height="20" />

					<u-form-item label="押金退还条件" prop="refund_condition" :border-bottom="false" :label-style="labelStyle">
						<u-input type="textarea" v-model="item.refund_condition" height="180" :custom-style="Object.assign(customStyle, customStyle02)" placeholder="请输入" />
					</u-form-item>
				</block>
				
				<block v-if="item.type == 1">
					<u-form-item label="宠物现状" prop="situation" :border-bottom="false" :label-style="labelStyle"></u-form-item>
					
					<!-- <u-form-item prop="vaccine" label-position="left" :border-bottom="false" label-width="auto" :label-style="labelStyle02"></u-form-item> -->
					<u-subsection :list="$mData.vaccines" :current="item.vaccine" mode="button" height="68" :bold="false" active-color="#FFF" :button-color="themeColor.color" @change="vaccineSectionChange" />
					
					<u-form-item prop="sterilize" label-position="left" :border-bottom="false" label-width="auto" :label-style="labelStyle02"></u-form-item>
					<u-subsection :list="$mData.sterilizes" :current="item.sterilize" mode="button" height="68" :bold="false" active-color="#FFF" :button-color="themeColor.color" @change="sterilizeSectionChange" />
					
					<u-form-item prop="deworm" label-position="left" :border-bottom="false" label-width="auto" :label-style="labelStyle02"></u-form-item>
					<u-subsection :list="$mData.deworms" :current="item.deworm" mode="button" height="68" :bold="false" active-color="#FFF" :button-color="themeColor.color" @change="dewormSectionChange" />
					
					<u-form-item prop="source" label-position="left" :border-bottom="false" label-width="auto" :label-style="labelStyle02"></u-form-item>
					<u-subsection :list="$mData.sources" :current="item.source - 1" mode="button" height="68" :bold="false" active-color="#FFF" :button-color="themeColor.color" @change="sourceSectionChange" />
					
					<u-form-item prop="size" label-position="left" :border-bottom="false" label-width="auto" :label-style="labelStyle02"></u-form-item>
					<u-subsection :list="$mData.sizes" :current="item.size - 1" mode="button" height="68" :bold="false" active-color="#FFF" :button-color="themeColor.color" @change="sizeSectionChange" />
					
					<u-form-item prop="hair" label-position="left" :border-bottom="false" label-width="auto" :label-style="labelStyle02"></u-form-item>
					<u-subsection :list="$mData.hairs" :current="item.hair - 1" mode="button" height="68" :bold="false" active-color="#FFF" :button-color="themeColor.color" @change="hairSectionChange" />
					
					<u-gap height="30" />
					
					<u-form-item label="宠物特点" prop="tags" :border-bottom="false" :label-style="labelStyle03">
						<u-checkbox-group @change="tagsCheckboxGroupChange" width="50%" :max="20">
							<u-checkbox @change="tagsCheckboxChange" label-size="24" :active-color="themeColor.color" v-model="tag.checked" v-for="(tag, index) in $mData.tags" :key="index" :name="tag.name">{{tag.name}}</u-checkbox>
						</u-checkbox-group>
					</u-form-item>
					
					<u-form-item label="领养要求" prop="requirements" :border-bottom="false" :label-style="labelStyle03">
						<u-checkbox-group @change="requirementsCheckboxGroupChange" width="50%" :max="20">
							<u-checkbox @change="requirementsCheckboxChange" label-size="24" :active-color="themeColor.color" v-model="requirement.checked" v-for="(requirement, index) in $mData.requirements" :key="index" :name="requirement.name">{{requirement.name}}</u-checkbox>
						</u-checkbox-group>
					</u-form-item>
					
					<u-form-item label="其他要求" prop="other_requirement" :border-bottom="false" :label-style="labelStyle">
						<u-input type="textarea" v-model="item.other_requirement" height="180" :custom-style="Object.assign(customStyle, customStyle02)" placeholder="如有其它要求请输入（选填）" />
					</u-form-item>
				</block>
								
				<block v-if="item.type != 1">
					<u-form-item :label="$mData.types[item.type-1].title + '时间'" prop="datetime_name" :border-bottom="false" :label-style="labelStyle">
						<u-input type="select" v-model="item.datetime_name" height="100" disabled :custom-style="customStyle" placeholder="请选择" @click="datetimeShow = true" />
					</u-form-item>
				</block>
				
				<u-form-item :label="$mData.types[item.type-1].title + '地点'" prop="address" :border-bottom="false" :label-style="labelStyle" right-icon="map">
					<u-input v-model="item.address" height="100" disabled :custom-style="customStyle" placeholder="请选择" @click="chooseLocation" />
				</u-form-item>
				
				<u-form-item :label="$mData.types[item.type-1].content" prop="content" :border-bottom="false" :label-style="labelStyle">
					<u-input type="textarea" v-model="item.content" height="246" :custom-style="Object.assign(customStyle, customStyle02)" placeholder="请尽量详细介绍" />
				</u-form-item>
				
				<u-form-item label="联系方式" :border-bottom="false" :label-style="labelStyle"></u-form-item>
				
				<view class="contact">
					<u-form-item label="发布者" prop="member.nickname" label-position="left" :border-bottom="false" label-width="auto" :label-style="labelStyle02">
						<u-input v-model="item.member.nickname" height="50" input-align="right" :custom-style="customStyle03" trim placeholder="请输入" />
					</u-form-item>
					
					<u-form-item label="微信号" prop="member.wechat" label-position="left" :border-bottom="false" label-width="auto" :label-style="labelStyle02">
						<u-input v-model="item.member.wechat" height="50" input-align="right" :custom-style="customStyle03" trim placeholder="请输入" />
					</u-form-item>
					
					<u-form-item label="QQ号" prop="member.qq" label-position="left" :border-bottom="false" label-width="auto" :label-style="labelStyle02">
						<u-input v-model="item.member.qq" height="50" input-align="right" :custom-style="customStyle03" trim placeholder="请输入（选填）" />
					</u-form-item>
				</view>
				
				<u-button type="warning" form-type="submit" @click="submit" :loading="submitLoading" shape="circle" :ripple="true" :custom-style="customStyle04">提交</u-button>
			</u-form>

			<u-picker v-model="datetimeShow" mode="time" :start-year="2021" :params="datetimeParams" @confirm="datetimeConfirm"></u-picker>
		</view>
		
		<!--页面加载动画-->
		<rfLoading isFullScreen :active="loading"></rfLoading>
		<!-- <rf-back-top :scrollTop="scrollTop"></rf-back-top> -->
		<!-- <rf-back-home></rf-back-home> -->
	</view>
</template>

<script>
import { petMyView, petForm, fileImages, fileVideos } from '@/api/pet';

const QQMapWX = require('@/common/qqmap-wx-jssdk.min.js');

export default {
	data() {
		return {
			qqmapsdk: null,
			$mData: this.$mData,
			hasLogin: false,
			userInfo: {},
			errorType: ['toast', 'message', 'border-bottom'],
			submitLoading: false,
			uploadHeader: { 'x-api-key': uni.getStorageSync('accessToken') },
			uploadAction: this.$mConfig.baseUrl + fileImages,
			uploadFileList: [],
			loading: true,
			videoContext: {},
			progress: 0,
			id: 0,
			item: {
				title: '',
				type: 1,
				cate: 1,
				nickname: '',
				age: 1,
				gender: 0,
				mode: 0,
				money: '0.00',
				refund_condition: '',
				vaccine: 0,
				sterilize: 0,
				deworm: 0,
				source: 1,
				size: 1,
				hair: 1,
				tags: [],
				requirements: [],
				other_requirement: '',
				address: '',
				content: '',
				images: [],
				video: '',
				contact: {
					nickname: '',
					wechat: '',
					qq: ''
				},
				member: {
					nickname: '',
					wechat: '',
					qqq: ''
				}
			},
			datetimeShow: false,
			datetimeParams: {
				year: true,
				month: true,
				day: true,
				hour: true,
				minute: true,
				second: false,
				timestamp: true,
			},
			rules01: {
				images: this.$mData.rules.images,
				title: this.$mData.rules.title,
				nickname: this.$mData.rules.nickname,
				breed: this.$mData.rules.breed,
				money: this.$mData.rules.money,
				refund_condition: this.$mData.rules.refund_condition,
				other_requirement: this.$mData.rules.other_requirement,
				address: this.$mData.rules.address,
				content: this.$mData.rules.content,
				'member.nickname': this.$mData.rules['member.nickname'],
				'member.wechat': this.$mData.rules['member.wechat'],
				'member.qq': this.$mData.rules['member.qq']
			},
			rules02: {
				images: this.$mData.rules.images,
				title: this.$mData.rules.title,
				nickname: this.$mData.rules.nickname,
				breed: this.$mData.rules.breed,
				money: this.$mData.rules.money,
				datetime_name: this.$mData.rules.datetime_name,
				address: this.$mData.rules.address,
				content: this.$mData.rules.content,
				'member.nickname': this.$mData.rules['member.nickname'],
				'member.wechat': this.$mData.rules['member.wechat'],
				'member.qq': this.$mData.rules['member.qq']
			},
			rules03: {
				images: this.$mData.rules.images,
				title: this.$mData.rules.title,
				breed: this.$mData.rules.breed,
				money: this.$mData.rules.money,
				datetime_name: this.$mData.rules.datetime_name,
				address: this.$mData.rules.address,
				content: this.$mData.rules.content,
				'member.nickname': this.$mData.rules['member.nickname'],
				'member.wechat': this.$mData.rules['member.wechat'],
				'member.qq': this.$mData.rules['member.qq']
			}
		};
	},
	onLoad(option) {
		this.id = option.id ? option.id : this.id;
		this.qqmapsdk = new QQMapWX({
			key: this.$mData.maps[0].key
		});
	},
	onShow() {
		this.initLogin();
	},
	onReady(res) {
		if (this.id) {
			uni.setNavigationBarTitle({
			  title: '编辑领养'
			});
		} else {
			this.loading = false;
		}
		this.$refs.uForm.setRules(this.rules01);
	},
	mounted() {
		this.initData();
	},
	computed: {
		rules() {
			return this[`rules0${this.item.type}`];
		},
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
				color: '#999',
				fontSize: '24rpx',
				paddingTop: '0rpx'
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
			return {
				padding: '20rpx 30rpx'
			}
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
	watch: {
		'item.type'(val) {
			uni.setStorageSync('item', this.item);
			this.$refs.uForm.resetFields();
			let item = uni.getStorageSync('item');
			this.item = item;
			this.$refs.uForm.setRules(this.rules);
		}
	},
	methods: {
		async initLogin() {
			this.hasLogin = this.$mStore.getters.hasLogin;
			this.userInfo = uni.getStorageSync('userInfo');
			
			if (this.hasLogin && this.userInfo) {
				this.item.member.nickname = this.userInfo.nickname;
				this.item.member.wechat = this.userInfo.wechat;
				this.item.member.qq = this.userInfo.qq;
			} else {
				this.navTo('/pages/public/logintype');
			}
		},
		async initData() {
			if (this.id) {
				await this.getPetMyView();
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
		datetimeConfirm(e) {
			this.item.datetime_name = e.year + '-' + e.month + '-' + e.day + ' ' + e.hour + ':' + e.minute;
			this.item.datetime = e.timestamp;
		},
		typeSectionChange(index) {
			this.item.type = this.$mData.types[index].key;
		},
		cateSectionChange(index) {
			this.item.cate = this.$mData.cates[index].key;
		},
		genderSectionChange(index) {
			this.item.gender = this.$mData.genders[index].key;
		},
		ageSectionChange(index) {
			this.item.age = this.$mData.ages[index].key;
		},
		modeSectionChange(index) {
			this.item.mode = this.$mData.modes[index].key;
			if (this.item.mode == 0) this.item.money = '0.00';
		},
		vaccineSectionChange(index) {
			this.item.vaccine = this.$mData.vaccines[index].key;
		},
		sterilizeSectionChange(index) {
			this.item.sterilize = this.$mData.sterilizes[index].key;
		},
		dewormSectionChange(index) {
			this.item.deworm = this.$mData.deworms[index].key;
		},
		sourceSectionChange(index) {
			this.item.source = this.$mData.sources[index].key;
		},
		sizeSectionChange(index) {
			this.item.size = this.$mData.sizes[index].key;
		},
		hairSectionChange(index) {
			this.item.hair = this.$mData.hairs[index].key;
		},
		tagsCheckboxGroupChange(e) {
			//this.item.tags = e;
			this.$set(this.item, 'tags', e); //解决不及时更新的问题
		},
		tagsCheckboxChange(detail) {

		},
		requirementsCheckboxGroupChange(e) {
			//this.item.requirements = e;
			this.$set(this.item, 'requirements', e); //解决不及时更新的问题
		},
		requirementsCheckboxChange(detail) {
		
		},
		chooseLocation() {
			let _this = this;
			//#ifdef MP
			uni.authorize({
				scope: 'scope.userLocation',
				success(res) {
			//#endif
					uni.chooseLocation({
						success(res) {
							_this.$set(_this.item, 'address', res.address); //解决不及时更新的问题
							//_this.item.address = res.address;
							_this.item.coords = { lat: res.latitude, lng: res.longitude}; //纬度&经度
							_this.item.location = res.name;
							
							_this.qqmapsdk.reverseGeocoder({
								location: {
									latitude: res.latitude,
									longitude: res.longitude
								},
								success(res) {
									_this.item.province_id = res.result.ad_info.adcode.substring(0, 2) * 10000;
									_this.item.city_id = res.result.ad_info.city_code - 156000000;
									_this.item.area_id = res.result.ad_info.adcode * 1;
									_this.item.province = res.result.ad_info.province;
									_this.item.city = res.result.ad_info.city;
									_this.item.area = res.result.ad_info.district;
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
			//#ifdef MP
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
			//#endif
		},
		async getPetMyView() {
			await this.$http.get(`${petMyView}?expand=member`, {
				id: this.id
			}).then(async r => {
				this.loading = false;
				this.item = r.data;
				this.item.datetime_name = this.$u.timeFormat(this.item.datetime, 'yyyy-mm-dd hh:MM');
				
				let images = [];
				this.item.images.forEach((item, index) => {
					images.push({ url: item });
				});
				this.uploadFileList = images;

				this.$mData.tags.forEach((item, index) => {
					if (this.item.tags.includes(item.name)) {
						item.checked = true;
					}
				});
				
				this.$mData.requirements.forEach((item, index) => {
					if (this.item.requirements.includes(item.name)) {
						item.checked = true;
					}
				});
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
			
			let tags = [];
			this.$mData.tags.forEach((item, index) => {
				if (item.checked) {
					tags.push(item.name);
				}
			});
			
			let requirements = [];
			this.$mData.requirements.forEach((item, index) => {
				if (item.checked) {
					requirements.push(item.name);
				}
			});
			
			this.item.images = images;
			this.item.tags = tags;
			this.item.requirements = requirements;
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
			let url = `${petForm}`;
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
		uploadSuccess(data, index, lists, name) {
			//this.$mHelper.toast('上传成功！');
		},
		uploaded(lists, name) {
			//this.$mHelper.toast('上传完成！');
			/* this.item.images = [];
			
			for (var item of lists) {
				if (item.error == false) {
					this.item.images.push(item.response.data.url);
				}
			} */
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
			.u-tag {
				color: #999;
				font-size: 28upx;
				border: none;
				border-radius: 8px;
				padding: 20upx 30upx;
				margin-left: 20upx;
			}
			.u-tag.active {
				color: #333;
			}
			.u-checkbox {
				margin-bottom: 20upx;
			}
			.contact {
				background: #F6F7FB;
				border-radius: 16upx;
				padding: 10upx 30upx;
			}
			.progress-tips {
				color: $u-type-warning;
				font-size: 24upx;
				padding: 10upx;
			}
		}
	}
}
</style>
