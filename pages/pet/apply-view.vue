<template>
	<view class="wrap">
		<view class="subtitle">
			<view class="line" :style="{ background: themeColor.color }" />
			<text v-if="item.member_id == userInfo.id">联系送养人</text>
			<text v-if="item.owner_id == userInfo.id">联系领养人</text>
		</view>
		
		<view class="subwrap" v-if="item.user">
			<view class="user u-p-t-30 u-p-b-10">
				<view class="left"><u-avatar :src="item.user.head_portrait" size="120" /></view>
				
				<view class="right">
					<view class="nickname">{{item.user.nickname}}</view>
					<view class="profile">
						<u-icon name="man" color="#1684FB" size="30" v-if="item.user.gender == 1" />
						<u-icon name="woman" color="#DE3E96" size="30" v-if="item.user.gender == 2" />
						<text v-if="item.user.birthday">{{item.user.age_name}}岁 </text>
						<text v-if="item.user.birthday">{{item.user.astro}} </text>
						<text v-if="item.user.last_time_name">{{item.user.last_time_name}}在线</text>
					</view>
				</view>
			</view>
			
			<u-line />
			
			<view class="contact u-p-t-30 u-p-b-30">
				<view class="contact-item" @tap="makePhoneCall(item.member.mobile)" v-if="item.member.mobile">
					<view class="icon"><u-icon name="phone-fill" :color="themeColor.color" size="66" /></view>
					<view class="name">拨打电话</view>
				</view>
				
				<view class="contact-item" @tap="copyText(item.member.wechat)" v-if="item.member.wechat">
					<view class="icon"><u-icon name="weixin-fill" :color="themeColor.color" size="66" /></view>
					<view class="name">复制微信号</view>
				</view>
				
				<view class="contact-item" @tap="copyText(item.member.qq)" v-if="item.member.qq">
					<view class="icon"><u-icon name="qq-circle-fill" :color="themeColor.color" size="66" /></view>
					<view class="name">复制QQ号</view>
				</view>
			</view>
		</view>
		
		<!-- <view class="tips u-m-t-40">
			温馨提示：如送养人想您索要银行卡账号、运送费等涉及钱财时，
			请您务必提高警惕！
		</view> -->
		
		<view class="subtitle u-m-t-60">
			<view class="line" :style="{ background: themeColor.color }" />
			处理提示
		</view>
		
		<view class="u-m-30 u-m-b-0" v-if="item.owner_id == userInfo.id">
			<u-alert-tips type="warning" title="当前状态：待处理" description="如有兴趣进一步沟通请选择“同意”，如不合适请选择“拒绝”" v-if="item.review == 0" />
			
			<u-alert-tips type="success" title="当前状态：已同意" description="您同意了领养人的申请，请通过上方联系方式及时与领养人取得联系。" v-if="item.review == 1" />
			
			<u-alert-tips type="error" title="当前状态：已拒绝" description="您拒绝了领养人的申请。" v-if="item.review == -1" />
			
			<u-gap height="30" v-if="item.review == -1" />
			
			<u-alert-tips type="error" title="拒绝原因" :description="item.reason" v-if="item.review == -1" />
		</view>
		
		<view class="u-m-30 u-m-b-0" v-if="item.member_id == userInfo.id">
			<u-alert-tips type="warning" title="当前状态：待处理" description="您的申请已通知送养人，请通过上方联系方式主动与送养人取得联系。" v-if="item.review == 0" />
			
			<u-alert-tips type="success" title="当前状态：已同意" description="送养人已同意您的领养申请，有意向继续沟通，请通过上方联系方式及时与送养人取得联系。" v-if="item.review == 1" />
			
			<u-alert-tips type="error" title="当前状态：已拒绝" description="送养人拒绝了您的申请，再看看其他小可爱吧~ " v-if="item.review == -1" />
			
			<u-gap height="30" v-if="item.review == -1" />
			
			<u-alert-tips type="error" title="拒绝原因" :description="item.reason" v-if="item.review == -1" />
		</view>
		
		<view class="subtitle u-m-t-60" v-if="item.member_id == userInfo.id && item.review != -1">
			<view class="line" :style="{ background: themeColor.color }" />
			注意事项
		</view>
		
		<view class="subwrap u-p-0 u-p-t-10 u-p-b-10" v-if="item.member_id == userInfo.id && item.review != -1">
			<!-- <u-cell-group title="注意事项" :border="false" :title-style="{ color: themeColor.color, fontSize: '28rpx' }"> -->
			<u-cell-group :border="false">
				<u-cell-item title="1.联系前请确认符合领养要求；" :arrow="false" :title-style="{ color: themeColor.color, fontSize: '24rpx' }"></u-cell-item>
				<u-cell-item title="2.领养押金需交由平台保管，如涉及押金请联系义工；" :arrow="false" :title-style="{ color: themeColor.color, fontSize: '24rpx' }"></u-cell-item>
				<u-cell-item title="3.如实际领养信息与发布内容不符，或要求支付定金、邮费等情况，请一定不要相信，及时在留言区举报。" :border-bottom="false" :arrow="false" :title-style="{ color: themeColor.color, fontSize: '24rpx' }"></u-cell-item>
			</u-cell-group>
		</view>
		
		<view class="subtitle u-m-t-60">
			<view class="line" :style="{ background: themeColor.color }" />
			申请领养的宠物
		</view>
		
		<view class="item" @tap="navTo(`/pages/pet/pet-view?id=${item.pet.id}`)">
			<view class="left"><u-image :src="item.pet.poster" width="100%" height="230" border-radius="20" mode="aspectFill" /></view>
			
			<view class="right">
				<view class="title">{{item.pet.nickname}}</view>
				
				<view class="base">
					<view class="tag">{{item.pet.cate_name}}</view>
					<view class="tag">{{item.pet.gender_name}}</view>
					<view class="tag">{{item.pet.age_name}}</view>
				</view>
				
				<view class="summary u-line-2">{{item.pet.content}}</view>
							
				<view class="status">
					<view class="tag">{{item.pet.vaccine_name}}</view>
					<view class="tag">{{item.pet.deworm_name}}</view>
					<view class="tag">{{item.pet.sterilize_name}}</view>
				</view>
			</view>
		</view>
		
		<view class="subtitle u-m-t-60" v-if="item.review != -1">
			<view class="line" :style="{ background: themeColor.color }" />
			申请问卷
		</view>
		
		<view class="subwrap u-p-t-30 u-p-b-30 u-m-t-30">
			<u-table>
				<u-tr class="u-tr">
					<u-th class="u-th" width="33%">称呼</u-th>
					<u-td class="u-td">{{item.member.nickname}}</u-td>
				</u-tr>
				<u-tr class="u-tr">
					<u-th class="u-th" width="33%">性别</u-th>
					<u-td class="u-td">{{$mData.member.genders[item.member.gender].name}}</u-td>
				</u-tr>
				<u-tr class="u-tr">
					<u-th class="u-th" width="33%">年龄</u-th>
					<u-td class="u-td">{{item.member.age_name}}岁</u-td>
				</u-tr>
				<u-tr class="u-tr">
					<u-th class="u-th" width="33%">婚姻状况</u-th>
					<u-td class="u-td">{{$mData.member.maritals[item.member.marital].name}}</u-td>
				</u-tr>
				<u-tr class="u-tr">
					<u-th class="u-th" width="33%">住房情况</u-th>
					<u-td class="u-td">{{$mData.member.housings[item.member.housing].name}}</u-td>
				</u-tr>
				<u-tr class="u-tr">
					<u-th class="u-th" width="33%">从事职业</u-th>
					<u-td class="u-td">{{item.member.career}}</u-td>
				</u-tr>
				<u-tr class="u-tr">
					<u-th class="u-th" width="33%">详细地址</u-th>
					<u-td class="u-td">{{item.member.address}}</u-td>
				</u-tr>
				<u-tr class="u-tr">
					<u-th class="u-th" width="33%">养宠经验</u-th>
					<u-td class="u-td">{{item.member.pet_experience}}</u-td>
				</u-tr>
				<u-tr class="u-tr">
					<u-th class="u-th" width="33%">申请语</u-th>
					<u-td class="u-td">{{item.content}}</u-td>
				</u-tr>
			</u-table>
		</view>
		
		<view class="subtitle u-m-t-60" v-if="item.member_id == userInfo.id && item.review == -1">
			<view class="line" :style="{ background: themeColor.color }" />
			更多同城领养
		</view>
		
		<block v-if="item.member_id == userInfo.id && item.review == -1">
			<view class="item" v-for="(item, index) in items" :key="index" @tap="navTo(`/pages/pet/adopt-view?id=${item.id}`)">
				<view class="left"><u-image :src="item.poster" width="100%" height="230" border-radius="20" mode="aspectFill" /></view>
				
				<view class="right">
					<view class="title">{{item.title}}</view>
			
					<view class="base">
						<view class="tag">{{item.cate_name}}</view>
						<view class="tag">{{item.gender_name}}</view>
						<view class="tag">{{item.age_name}}</view>
					</view>
					
					<view class="summary u-line-2">{{item.content}}</view>
			
					<view class="status">
						<view class="tag">{{item.vaccine_name}}</view>
						<view class="tag">{{item.deworm_name}}</view>
						<view class="tag">{{item.sterilize_name}}</view>
					</view>
				</view>
			</view>
		</block>

		<view class="nav-bottom" v-if="item.owner_id == userInfo.id">
			<u-button type="success" size="medium" shape="circle" :disabled="item.review != 0" @click="applyAgree">同意</u-button>
			<u-button type="error" size="medium" shape="circle" :disabled="item.review != 0" @click="applyRefuse">拒绝</u-button>
		</view>
		
		<u-modal ref="uModal" v-model="modalShow" title="拒绝原因" show-cancel-button :async-close="modalSyncClose" @confirm="modalConfirm">
			<view class="slot-content">
				<u-field type="textarea" v-model="item.reason" height="360" :border-bottom="false" maxlength="999" :error-message="errorMessage" placeholder="请输入拒绝原因" label-width="0" :field-style="{ background: '#F5F5F5', borderRadius: '10rpx', padding: '10rpx' }" @input="modalCheck" @blur="modalCheck"	/>
			</view>
		</u-modal>

		<!--页面加载动画-->
		<rfLoading isFullScreen :active="loading"></rfLoading>
		<rf-back-top :scrollTop="scrollTop"></rf-back-top>
		<!-- <rf-back-home></rf-back-home> -->
	</view>
</template>

<script>
import { mapMutations } from 'vuex';
import { applyView, applyAgree, applyRefuse, petList } from '@/api/pet';

export default {
	data() {
		return {
			$mData: this.$mData,
			loading: true,
			scrollTop: 0,
			hasLogin: false,
			userInfo: {},
			modalShow: false,
			modalSyncClose: true,
			errorMessage: '',
			id: 0,
			item: {
				content: '',
				reason: '',
				user: {
					head_portrait: '',
					nickname: '',
					birthday: ''
				},
				member: {
					head_portrait: '',
					nickname: '',
					birthday: '',
					gender: 0,
					marital: 0,
					housing: 0
				},
				owner: {
					head_portrait: '',
					nickname: '',
					birthday: ''
				},
				pet: {
					
				}
			},
			items: []
		};
	},
	onLoad(option) {
		this.id = option.id ? option.id : this.id;
	},
	onShow() {
		
	},
	onPageScroll(e) {
		this.scrollTop = e.scrollTop;
	},
	mounted() {
		this.initLogin();
	},
	computed: {
		
	},
	computed: {
		
	},
	methods: {
		async initLogin() {
			this.hasLogin = this.$mStore.getters.hasLogin;
			this.userInfo = uni.getStorageSync('userInfo');
			
			if (this.hasLogin && this.userInfo) {
				this.initData();
			} else {
				this.navTo('/pages/public/logintype');
			}
		},
		async initData() {
			await this.getApplyView();
		},
		navTo(route) {
			this.$mRouter.push({ route });
		},
		makePhoneCall(phoneNumber) {
			uni.makePhoneCall({
			  phoneNumber: phoneNumber
			});
		},
		copyText(text) {
			let _this = this;

			uni.setClipboardData({
				data: text,
				success(res) {
					_this.$mHelper.toast('复制成功！');
				}
			});
		},
		previewQrcode(url) {
			uni.previewImage({
				urls: [url]
			});
		},
		async applyAgree(){
			let _this = this;
					
			uni.showModal({
				content: '确定要同意吗？',
				success(res) {
					if (res.confirm) {
						_this.$http.get(`${applyAgree}`, {
							id: _this.id
						}).then(async r => {
							_this.initData();
							_this.$mHelper.toast('操作成功！');
						});
					}
				}
			});
		},
		async applyRefuse(){
			this.modalShow = true;
		},
		modalConfirm() {
			if (this.modalCheck()) {
				let url = `${applyRefuse}?id=${this.id}`;
				let params = { reason: this.item.reason };
				
				this.$http.post(url, {
					...params,
				}).then(async r => {
					this.modalShow = false;
					this.initData();
					this.$mHelper.toast('操作成功！');
				});
			} else {
				this.$refs.uModal.clearLoading();
			}
		},
		modalCheck() {
			this.errorMessage = '';
			
			if (this.item.reason ==  '') {
				this.errorMessage = '请输入拒绝原因';
				
				return false;
			}
			
			return true;
		},
		async getApplyView() {
			await this.$http.get(`${applyView}?expand=member,pet,owner`, {
				id: this.id
			}).then(async r => {
				this.loading = false;
				this.item = r.data;
				
				let params = { type: this.item.pet.type, city_id: this.item.pet.city_id };
				this.getPetList(params);
				
				if (this.item.member.birthday) {
					let birthdays = this.item.member.birthday.split('-');
					let date = new Date();
					let year = date.getFullYear();
					
					this.item.member.age_name = year - birthdays[0];
					this.item.member.astro = this.getAstro(birthdays[1], birthdays[2]) + '座';
				}
				
				if (this.item.owner.birthday) {
					let birthdays = this.item.owner.birthday.split('-');
					let date = new Date();
					let year = date.getFullYear();
					
					this.item.owner.age_name = year - birthdays[0];
					this.item.owner.astro = this.getAstro(birthdays[1], birthdays[2]) + '座';
				}

				switch (Number(this.userInfo.id)) {
					case this.item.member.id:
						this.item.user = this.item.owner;
						break;
				  case this.item.owner.id:
						this.item.user = this.item.member;
						break;
				  default:
				}
				
				this.item.user.last_time_name = this.$u.timeFrom(this.item.user.last_time, 'yyyy年mm月dd日');
			}).catch(err => {
				this.loading = false;
			});
		},
		async getPetList(params) {
			await this.$http.get(`${petList}`, params).then(async r => {
				this.items = r.data;
			});
		},
		getAstro(month, day) {    
		  return '魔羯水瓶双鱼牡羊金牛双子巨蟹狮子处女天秤天蝎射手魔羯'.substr(month * 2-  (day < '102223444433' .charAt(month - 1) - -19) * 2, 2);
		}
	}
};
</script>

<style lang="scss">
page {
	background: $color-white;
	.wrap {
		background: #F5F5F5;
		padding: 30upx 0 200upx 0;
		.subtitle {
			color: #333;
			font-size: 30upx;
			margin: 0 30upx;
			.line {
				width: 6upx;
				height: 26upx;
				background: #FFCE0C;
				border-radius: 6upx;
				display: inline-block;
				margin: 10upx 16upx 0 0;
			}
		}
		.subwrap {
			background: $color-white;
			border-radius: 16upx;
			padding: 0 30upx;
			margin: 30upx 30upx 0 30upx;
			.user {
				display: flex;
				.left {
					flex-basis: 22%;
				}
				.right {
					flex-grow: 1;
					.nickname {
						color: #262628;
						font-size: 30upx;
						.level {
							color: #666;
							margin-left: 10upx;
							display: inline-block;
							text {
								font-size: 30upx;
							}
						}
					}
					.profile {
						color: #999;
						font-size: 22upx;
						margin-top: 10upx;
						display: flex;
						text {
							padding: 0 10upx;
						}
					}
				}
			}
			.contact {
				display: flex;
				justify-content: space-around;
				.contact-item {
					text-align: center;
					.icon {
						display: flex;
						justify-content: center;
					}
					.name {
						color: #666;
						font-size: 24upx;
						margin-top: 20upx;
					}
				}
			}
			u-table {
				table-layout: fixed;
				width: 100%;
				u-tr {
					line-height: 60rpx;
					u-th {
						width: 33%;
					}
					u-td {
						width: 67%;
						overflow: hidden;
						text-overflow: ellipsis;
						word-wrap:break-word;
					}
				}
			}
		}
		.tips {
			color: #999;
			font-size: 24upx;
		}
		.item {
			background: #FFF;
			display: flex;
			//flex-wrap: wrap;
			border-radius: 16upx;
			padding: 20upx 20upx;
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
					image {
						width: 152upx;
						height: 38upx;
						vertical-align: top;
						margin-left: 10upx;
					}
				}
				.base {
					margin-top: 12upx;
					.tag {
						height: 40upx;
						line-height: 40upx;
						background: #F6F7FB;
						color: #666;
						font-size: 24upx;
						border-radius: 6upx;
						padding: 0 20upx;
						margin-right: 14upx;
						display: inline-block;
					}
					.tag:nth-child(3) {
						margin-right: 0;
					}
				}
				.summary {
					color: #666;
					font-size: 24upx;
					margin-top: 14upx;
				}
				.status {
					margin-top: 12upx;
					.tag {
						height: 38upx;
						line-height: 38upx;
						color: #CCC;
						font-size: 24upx;
						margin-right: 14upx;
						border: 2upx #CCC solid;
						border-radius: 6upx;
						padding: 0 20upx;
						display: inline-block;
					}
					.tag:nth-child(3) {
						margin-right: 0;
					}
				}
			}
		}
		.nav-bottom {
			width: 100%;
			background: #FFF;
			position: fixed;
			bottom: 0;
			display: flex;
			justify-content: space-around;
			border-top: 2upx #F2F2F2 solid;
			padding: 30upx 0;
		}
	}
}
</style>
