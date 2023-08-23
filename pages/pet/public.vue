<template>
	<view >

		
		<!--列表-->
		<view class="pet-wrap u-p-20">
			<u-button :disabled="!userInfo" type="primary" @click="showAdd=true;form=getFormObj()">{{userInfo?"发帖":"游客不能发帖"}}</u-button>
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
			
		</view>
		
		<u-modal v-model="showAdd" title="发帖" :show-cancel-button="true" @confirm="submitComment">
			<view class="slot-content u-p-30">
				<u-input placeholder="请输入标题" v-model="form.title"  />
				
				<u-input placeholder="请输入内容" v-model="form.content" type="textarea" height="200" :auto-height="true" />
				
				<u-input placeholder="请输入标签,空格分隔" v-model="form.tag"  />
				
				<view class="u-p-25 ">
					   <u-icon class="u-m-r-10 u-m-l-10" size="30" color="#3f80de" name="photo-fill"></u-icon>
					   <text>图片</text>
				</view>
				 <view class="u-flex u-direction-row u-p-l-25 u-p-b-25 ">
					          <u-image border-radius="15" @tap="change('pic1Str')" class="u-image-shadow u-p-r-30" height="120rpx"  
						width="120rpx" :src="form.pic1Str" mode="aspectFill">
						           <view slot="error" style="font-size: 24rpx;" class="u-text-center">
							             <u-icon size="30" name="plus"></u-icon><br />选择图片
							            </view>
						           <view slot="loading" style="font-size: 24rpx;" class="u-text-center">
							             <u-icon size="30" name="reload"></u-icon><br />加载中
							            </view>
						          </u-image>   <u-image border-radius="15" @tap="change('pic2Str')" class="u-p-r-30 u-image-shadow" height="120rpx"  
						width="120rpx" :src="form.pic2Str" mode="aspectFill">
						           <view slot="error" style="font-size: 24rpx;" class="u-text-center">
							             <u-icon size="30" name="plus"></u-icon><br />选择图片
							            </view>
						           <view slot="loading" style="font-size: 24rpx;" class="u-text-center">
							             <u-icon size="30" name="reload"></u-icon><br />加载中
							            </view>
						          </u-image> <u-image border-radius="15" @tap="change('pic3Str')" class="u-p-r-30 u-image-shadow" height="120rpx"  
						width="120rpx" :src="form.pic3Str" mode="aspectFill">
						           <view slot="error" style="font-size: 24rpx;" class="u-text-center">
							             <u-icon size="30" name="plus"></u-icon><br />选择图片
							            </view>
						           <view slot="loading" style="font-size: 24rpx;" class="u-text-center">
							             <u-icon size="30" name="reload"></u-icon><br />加载中
							            </view>
						          </u-image>    
				</view>
				
			</view>
		</u-modal>
		
	</view>
</template>

<script>
	import appRequest from "@/common/appRequestUrl.js";
	export default {
		data() {
			return {
				showAdd:false,
				userInfo: {},
				items:[],
				form:{
					title:"",
					content:"",
					tag:"",
					pic1Str:"",
					pic2Str:"",
					pic3Str:"",
					type:2
				}
			};
		},onShow() {
			let userInfo = appRequest.getUserInfo();
			if(!userInfo){
				
			}else{
				this.userInfo = userInfo;
			}
			this.getData();
		},methods:{
			switchTab(route) {
				uni.navigateTo({
					url:route
				})
				//this.$mRouter.switchTab({ route });
			},
			splitTag(text){
				return text.split(" ");
			},
			getFormObj(){
				return {
					title:"",
					content:"",
					tag:"",
					pic1Str:"",
					pic2Str:"",
					pic3Str:"",
					type:2
				}
			},
			getData(){
				var _this = this;
				appRequest.request({
					method: "POST",
					url: appRequest.urlMap.findNmArticleList,
					data:{
						validFlag:1,
						type:2
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
			},submitComment(){
				
				for(let key in this.form){
					let obj = this.form[key];
					if(!obj){
						uni.showToast({
							title:"请填写完整",
							icon:"none"
						})
						return;
					}
				}
				
				
				var _this = this;
				appRequest.request({
					method: "POST",
					url: appRequest.urlMap.addNmArticle,
					data:_this.form,
					success: function(res) {
						if (res.data.code == 200) {
							_this.getData();
						}else{
							uni.showToast({
								title:"失败",
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
			
			},change(name) {
				let _this = this;
				uni.chooseImage({
					count: 1,
					sizeType: ["compressed"],
					success: function(res) {
						let src = res.tempFiles[0].path;
						uni.compressImage({
							src: src,
							width: 450,
							quality: 70,
							success: function(path) {
								let filePath = path.tempFilePath;
								wx.getFileSystemManager().readFile({
									filePath: filePath,
									encoding: 'base64',
									fail: function(errMsg) {
										console.log(errMsg);
									},
									success: function(res) {
										_this.form[name] =
											"data:image/jpeg;base64," + res.data;
									}
								});
							}
						});
					},
					fail: function(errMsg) {
						console.log(errMsg);
					}
				});
			}
		}
	}
</script>

<style lang="scss">
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
</style>
