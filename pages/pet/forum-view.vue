<template>
	<view class="wrap">
		<mescroll-body ref="mescrollRef" @init="mescrollInit" @down="downCallback" @up="upCallback" :down="downOption" :up="upOption">
			<!-- <u-swiper :list="item.images" height="600" border-radius="0" :current="current" field="content" mode="dot" v-if="item.images.length" @click="previewImage"></u-swiper> -->
			
			<swiper class="swiper-box" :current="current" circular :autoplay="!item.video" indicator-dots indicator-color="#FFF" :indicator-active-color="themeColor.color" @change="swiperChange" v-if="item.images.length || item.video">
				<swiper-item v-if="item.video">
					<video id="myVideo" :src="item.video" controls objectFit="contain"></video>
				</swiper-item>
				
				<swiper-item v-for="(image, index) in item.images" :key="index">
					<u-image :src="image" width="100%" height="600" mode="aspectFill" @tap="previewImage" /> 
				</swiper-item>
			</swiper>

			<view class="subwrap">
				<view class="title u-p-t-40">{{item.cate_name}} | {{item.title}}</view>
				
				<view class="info u-m-t-20 u-m-b-20">
					<view class="datetime">{{item.updated_at | datetime}}</view>
					<view class="view">{{item.view}}查看</view>
					<view class="like">{{item.like}}赞</view>
					<view class="share">{{item.share}}转发</view>
				</view>
				
				<u-line />
				
				<view class="subtitle u-m-t-30">
					<view class="line" :style="{ background: themeColor.color }" />
					帖子正文
				</view>
				
				<view class="content u-m-t-30 u-p-b-40">{{item.content}}</view>
			</view>
			
			<view class="subwrap u-m-t-30">
				<view class="subtitle u-p-t-40">
					<view class="line" :style="{ background: themeColor.color }" />
					发布人
				</view>
				
				<view class="user u-p-t-30 u-p-b-10">
					<view class="left"><u-avatar :src="item.member.head_portrait" size="120" /></view>
					
					<view class="right">
						<view class="nickname">
							{{item.member.nickname}}

							<view class="level" @tap="navTo('/pages/user/account/level')" v-if="item.memberLevel">
								(
									{{item.memberLevel.name || '候补志愿者'}}
									<u-icon name="level" :color="themeColor.color" size="24" />
									<text :style="{ color: themeColor.color }">{{item.member.current_level}}</text>
							  )
							</view>
						</view>
						<view class="profile">
							<u-icon name="man" color="#1684FB" size="30" v-if="item.member.gender == 1" />
							<u-icon name="woman" color="#DE3E96" size="30" v-if="item.member.gender == 2" />
							<text v-if="item.member.birthday">{{item.member.age_name}}岁</text>
							<text v-if="item.member.birthday">{{item.member.astro}}</text>
							<text v-if="item.member.last_time">{{item.member.last_time_name}}在线</text>
						</view>
					</view>
				</view>
				
				<u-line v-if="item.member.mobile" />
				
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
			
			<view class="subwrap u-m-t-30 comments-wrap">
				<view class="subtitle u-p-t-40">
					<view class="line" :style="{ background: themeColor.color }" />
					最新评论
				</view>
			
				<view class="comments u-p-b-60">
					<u-read-more ref="uReadMore" close-text="展开全部"	:color="themeColor.color" toggle text-indent="0" show-height="400">
						<u-empty text="暂无评论" mode="message" v-if="!item.comments.length"></u-empty>
						
						<view class="item" v-for="(comment, index) in item.comments" :key="index">
							<view class="left"><u-avatar :src="comment.member.head_portrait" size="80" /></view>
							
							<view class="center">
								<view class="nickname">{{comment.member.nickname}}</view>
								<view class="datetime">{{comment.created_at | datetime}}</view>
							</view>
							
							<view class="right">
								<!-- <view class="reply"><image :src="'/static/pet/reply.png'" /> {{comment.reply}}</view> -->
								<view class="like" @tap="setPostCommentLike(index, comment.id)"><image :src="'/static/pet/like.png'" /> {{comment.like}}</view>
							</view>
							
							<view class="bottom">
								<view class="content">{{comment.content}}</view>
							</view>
						</view>
					</u-read-more>
				</view>
			</view>
		</mescroll-body>

		<view class="nav-bottom">
			<view class="left">
				<button class="item" open-type="share" hover-class="none">
					<image src="/static/pet/share.png" />
					<view class="text">转发好友</view>
				</button>
				<view class="item" @tap="getPoster">
					<image src="/static/pet/favorate.png" />
					<view class="text">生成海报</view>
				</view>
				<view class="item" @tap="setPostLike">
					<image src="/static/pet/favorate.png" />
					<view class="text">点赞 ({{item.like}})</view>
				</view>
			</view>
			<view class="right">
				<u-button type="warning" size="medium" shape="circle" ripple :custom-style="{ width: '80%', background: themeColor.color , marginTop: '5rpx' }" @click="comment">
					我要评论
				</u-button>
			</view>
		</view>
		
		<painter :widthPixels="720" customStyle="position: absolute; left: -9999rpx;" :palette="palette" @imgOK="onImgOk" @imgErr="onImgErr" v-if="painterShow" />
		
		<u-modal width="90%" :show-title="false" :mask-close-able="true" confirm-text="保存海报"	:show-cancel-button="true" cancel-text="关闭" v-model="modalShow" @confirm="modalConfirm">
			<view class="slot-content">
				<u-image :src="poster" width="100%" height="auto" :fade="true" duration="450" mode="widthFix" />
			</view>
		</u-modal>
		
		<rfLoading isFullScreen :active="loading"></rfLoading>
		<!-- <rf-back-top :scrollTop="scrollTop"></rf-back-top> -->
		<!-- <rf-back-home></rf-back-home> -->
	</view>
</template>

<script>
import moment from '@/common/moment';
import Card from '@/common/card/forum';
import CardNo from '@/common/card/forum-no-poster';
import MescrollMixin from '@/components/mescroll-uni/mescroll-mixins.js';
import { postView, postLike, postShare, postCommentLike } from '@/api/pet';

export default {
	mixins: [MescrollMixin],
	data() {
		return {
			path: '/pages/pet/forum-view',
			hasLogin: false,
			modalShow: false,
			poster: '',
			palette: {},
			painterShow: false,
			downOption: {
				native: true
			},
			upOption: {
				use: false
			},
			current: 0,
			videoContext: {},
			loading: true,
			scrollTop: 0,
			item: {
				title: '',
				cate_name: '',
				content: '',
				member: {},
				images: [],
				comments: [],
				updated_at: 0
			}
		};
	},
	onLoad(option) {
		if (option.scene) {
			let scene = decodeURIComponent(option.scene);
			let arr = scene.split('=');
			this.id = arr[1];
		} else {
			this.id = option.id ? option.id : this.id;
		}
	},
	onShow() {
		
	},
	onReady() {
		setTimeout(() => {
			this.$nextTick(() => {
				this.$refs.uReadMore.init();
			});
		}, 1500);
	},
	onPageScroll(e) {
		this.scrollTop = e.scrollTop;
	},
	onShareAppMessage(res) {
		this.setShare();
		return { 
			title: '帖子：' + this.item.title,
			imageUrl: this.item.poster,
			path: `${this.path}?id=${this.item.id}`
		};
	},
	mounted() {
		this.initLogin();
	},
	computed: {

	},
	watch: {
		item(val) {
			let params = {
				poster: this.item.poster,
				mpcode: this.item.mpcode,
				title: this.item.cate_name + '：' + this.item.title,
				content: this.item.content
			}
			
			if (this.item.poster) {
				this.palette = new Card().palette(params);
			} else {
				this.palette = new CardNo().palette(params);
			}
		}
	},
	filters: {
		datetime(val) {
			return moment(val * 1000).format('YYYY-MM-DD HH:mm');
		},
	},
	methods: {
		async initLogin() {
			this.hasLogin = this.$mStore.getters.hasLogin;
		},
		navTo(route) {
			this.$mRouter.push({ route });
		},
		swiperChange(e) {
			this.current = e.detail.current;
			
			if (this.item.video) {
				this.videoContext = uni.createVideoContext('myVideo');
		
				if (this.current) {
					this.videoContext.pause();
				} else {
					this.videoContext.play();
				}
			}
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
		async setPostLike() {
			if (this.hasLogin) {
				let post_ids = JSON.parse(uni.getStorageSync('post_ids') || "[]");
				
				if (post_ids.includes(this.id)) {
					this.$mHelper.toast('不能重复点赞！');
				} else {
					await this.$http.get(`${postLike}`, {
						id: this.id
					}).then(async r => {
						this.item.like = r.data;
						post_ids.push(this.id);
						uni.setStorageSync('post_ids',  JSON.stringify(post_ids));
					});
				}
			} else {
				this.navToLogin();
			}
		},
		getPoster() {
			this.setShare();
			this.painterShow = true;
		
			if (!this.poster) {
				uni.showLoading({
				  title: '加载中...'
				});
			} else {
				this.modalShow = true;
			}
		},
		comment() {
			if (this.hasLogin) {
				this.navTo(`/pages/pet/forum-comment-post?post_id=${this.item.id}`);
			} else {
				this.navToLogin();
			}
		},
		getAstro(month, day) {
		  return '魔羯水瓶双鱼牡羊金牛双子巨蟹狮子处女天秤天蝎射手魔羯'.substr(month * 2-  (day < '102223444433' .charAt(month - 1) - -19) * 2, 2);
		},
		async downCallback() {
			await this.$http.get(`${postView}?expand=member,comments,comments.member`, {
				id: this.id
			}).then(async r => {
				this.loading = false;
				this.item = r.data;
				
				if (this.item.member.birthday) {
					let birthdays = this.item.member.birthday.split('-');
					let date = new Date();
					let year = date.getFullYear();
					
					this.item.member.age_name = year - birthdays[0];
					this.item.member.astro = this.getAstro(birthdays[1], birthdays[2]) + '座';
				}
				
				this.item.member.last_time_name = this.$u.timeFrom(this.item.member.last_time, 'yyyy年mm月dd日');
				this.mescroll.endSuccess();
			}).catch(err => {
				this.loading = false;
			});
		},
		async setShare() {
			await this.$http.get(`${postShare}`, {
				id: this.id
			}).then(async r => {
				this.item.share = r.data;
			});
		},
		async setPostCommentLike(index, id) {
			if (this.hasLogin) {
				let comment_ids = JSON.parse(uni.getStorageSync('post_comment_ids') || "[]");
				
				if (comment_ids.includes(id)) {
					this.$mHelper.toast('不能重复点赞！');
				} else {
					await this.$http.get(`${postCommentLike}`, {
						id: id
					}).then(async r => {
						this.item.comments[index].like = r.data;
						comment_ids.push(id);
						uni.setStorageSync('post_comment_ids', JSON.stringify(comment_ids));
					});
				}
			} else {
				this.navToLogin();
			}
		},
		navToLogin() {
			uni.setStorageSync('backToPage', JSON.stringify({ route: `${this.path}?id=${this.item.id}` }));
	
			let _this = this;
			uni.showModal({
				content: '未登录，是否跳转登录页面？',
				success(res) {
					if (res.confirm) {
						_this.navTo(`/pages/public/logintype`);
					}
				}
			});
		},
		onImgOk(e) {
			this.poster = e.detail.path;
			this.modalShow = true;
			uni.hideLoading();
		},
		onImgErr() {
			this.modalShow = false;
		},
		modalConfirm() {
			let _this = this;
			uni.saveImageToPhotosAlbum({
				filePath: this.poster,
				success() {
					_this.$mHelper.toast('已保存到相册！');
				},
				fail(error) {
					uni.showModal({
						title: '提示',
						content: '须微信授权才能保存到相册！',
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
				},
				complete(res) {
					//console.log(res);
				}
			});
		},
		previewImage(index) {
			let urls = this.item.images;
		
			uni.previewImage({
				urls: urls,
				current: index
			});
		}
	}
};
</script>

<style lang="scss">
page {
	background: $color-white;
	.wrap {
		background: #F5F5F5;
		.swiper-box {
			height: 600upx;
			video {
				width: 100%;
				height: 600upx;
			}
		}
		.slot-content {
			image {
				display: block;
			}
		}
		.subwrap {
			background: $color-white;
			padding: 0 30upx;
			.title {
				font-size: 30upx;
			}
			.reward {
				color: #EB568F;
				font-size: 24upx;
				.money {
					color: #EB568F;
					font-size: 40upx;
				}
			}
			.feature {
				display: flex;
				.left {
					flex-basis: 20%;
				}
				.right {
					flex-basis: 80%;
					.nickname {
						color: #333;
						font-size: 30upx;
					}
					.base {
						margin-top: 10upx;
						.tag {
							height: 38upx;
							line-height: 38upx;
							color: #01040A;
							font-size: 24upx;
							margin-right: 14upx;
							background: #FFF2BF;
							border: 2upx #FFF2BF solid;
							border-radius: 6upx;
							text-align: center;
							padding: 0 20upx;
							display: inline-block;
						}
					}
				}
			}
			.reward {
				color: #EB568F;
				font-size: 24upx;
				.money {
					color: #EB568F;
					font-size: 50upx;
				}
			}
			.summary {
				color: #666;
				font-size: 24upx;
				margin-top: 16upx;
			}
			.info {
				color: #999;
				display: flex;
				justify-content: space-between;
				.datetime {
					flex-basis: 50%;
					font-size: 22upx;
				}
				.like {
					flex-basis: 14%;
					font-size: 22upx;
					margin-left: 40upx;
				}
				.view {
					flex-basis: 18%;
					font-size: 22upx;
					margin-left: 40upx;
				}
				.share {
					flex-basis: 18%;
					font-size: 22upx;
					margin-left: 30upx;
				}
			}
			.sheet {
				color: #999;
				.datetime {
					font-size: 24upx;
				}
				.address {
					font-size: 24upx;
					margin-top: 10upx;
				}
			}
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
			.subtitle {
				color: #333;
				font-size: 30upx;
				.line {
					width: 6upx;
					height: 26upx;
					border-radius: 6upx;
					display: inline-block;
					margin: 10upx 16upx 0 0;
				}
			}
			.content {
				line-height: 48upx;
				color: #666;
				font-size: 30upx;
			}
			.comments {
				.item {
					display: flex;
					flex-wrap: wrap;
					margin-top: 60upx;
					.left {
						flex-basis: 16%;
					}
					.center {
						flex-basis: 76%;
						.nickname {
							color: #333;
							font-size: 24upx;
							margin-top: 6upx;
						}
						.datetime {
							color: #999;
							font-size: 20upx;
						}
					}
					.right {
						flex-basis: 6%;
						text-align: center;
						image {
							width: 28upx;
							height: 28upx;
							vertical-align: middle;
						}
						.like image {
							height: 26upx;
						}
					}
				}
				.bottom {
					flex-basis: 100%;
					.content {
						color: #333;
						font-size: 24upx;
						padding-top: 10upx;
					}
				}
			}
		}
		.comments-wrap {
			margin-bottom: 150upx;
		}
		.nav-bottom {
			width: 100%;
			background: #FFF;
			border: 2upx #F2F2F2 solid;
			position: fixed;
			bottom: 0;
			padding: 16upx 0 10upx 0;
			display: flex;
			.left {
				flex-basis: 50%;
				display: flex;
				justify-content: space-around;
				align-items: center;
				.item {
					text-align: center;
					image {
						width: 40upx;
						height: 38upx;
					}
					.text {
						color: #333;
						font-size: 20upx;
					}
				}
				button.item {
					line-height: 44upx;
					font-size: 28upx;
					border: 0;
					background: none;
					padding: 0;
					margin: 0;
				}
				button:after {
					border: 0;
				}
			}
			.right {
				flex-grow: 1;
				text-align: center;
			}
		}
	}
}
</style>
