<script>
	/* eslint-disable */
	import Vue from 'vue';
	import { configList, bindingEquipment } from '@/api/basic';
	import { verifyAccessToken } from '@/api/login'
	import { mapMutations } from 'vuex';

	export default {
		async onLaunch() {
			await this.initData();

			if (!uni.canIUse('getUpdateManager')) {
				uni.showModal({
					title: '升级提示',
					content: '当前微信版本过低，请升级到最新微信版本后重试。',
					showCancel: false
				});
			
				return false;
			}
			
			const updateManager = uni.getUpdateManager();
			
			updateManager.onCheckForUpdate(function(res) {
				// console.log(res.hasUpdate);
			});
			
			updateManager.onUpdateReady(function() {
				uni.showModal({
					title: '重启提示',
					content: '新版本已经准备好，即将重启小程序。',
					success: (res) => {
						if (res.confirm) {
							updateManager.applyUpdate();
						} else {
							updateManager.applyUpdate();
						}
					}
				});
			});
			
			updateManager.onUpdateFailed(function() {
				uni.showModal({
					title: '已经有新版本了哟~',
					content: '新版本已经上线啦~，请删除当前小程序，重新搜索打开哟~',
					showCancel: false
				});
			});
		},
		onHide() {
			// if(this.$mWebsocket.conncted) {
			// 	this.$mWebsocket.closeWebSocket();
			// }
		},
		onShow() {
			if(!this.$mWebsocket.conncted) {
				this.$mWebsocket.initWebsocket();
			}
		},
		methods: {
			...mapMutations(['setCartNum', 'setNotifyNum']),
			// 数据初始化
			async initData() {
				// 获取页面设置配置
				await this.initConfigList();
				const _this = this;
				const token = uni.getStorageSync('accessToken');
				// #ifdef APP-PLUS
				// 5+ push 消息推送 ps:使用:H5+的方式监听，实现推送
				plus.push.addEventListener(
					'click',
					function(msg) {
						_this.navTo(JSON.parse(msg.content));
					},
					false
				);
				// 监听在线消息事件
				plus.push.addEventListener(
					'receive',
					function(msg) {
						_this.navTo(JSON.parse(msg.content));
					},
					false
				);
				// #endif
				// 获取系统title高度
				await this.initSystemInfo();
				if (token) {
					await this.handleVerifyAccessToken(token);
				}
				if (this.$mStore.getters.hasLogin) {
					// 初始化Websocket
					await this.$mWebsocket.initWebsocket();
					// 初始化购物车数量
					this.setCartNum(uni.getStorageSync('cartNum') || 0);
					this.setNotifyNum(uni.getStorageSync('notifyNum') || 0);
					// #ifdef APP-PLUS
					const info = plus.push.getClientInfo();
					await this.handleBindingEquipment(info.clientid, token);
					// #endif
				}
				// #ifdef H5
				await this.$mPayment.wxConfigH5(window.location.href);
				// #endif
			},
			// 初始化系统信息
			initSystemInfo() {
				try {
					const e = uni.getSystemInfoSync();
					// #ifndef MP
					Vue.prototype.StatusBar = e.statusBarHeight;
					if (e.platform === 'android') {
						Vue.prototype.CustomBar = e.statusBarHeight + 50;
					} else {
						Vue.prototype.CustomBar = e.statusBarHeight + 43;
					}
					// #endif
					// #ifdef MP-WEIXIN
					Vue.prototype.StatusBar = e.statusBarHeight;
					// eslint-disable-next-line
					const custom = wx.getMenuButtonBoundingClientRect();
					Vue.prototype.Custom = custom;
					Vue.prototype.CustomBar = custom.top - e.statusBarHeight;
					// #endif
					// #ifdef MP-ALIPAY
					Vue.prototype.StatusBar = e.statusBarHeight;
					Vue.prototype.CustomBar = e.statusBarHeight + e.titleBarHeight;
					// #endif
				} catch (e) {
					// error
				}
			},
			async initConfigList() {
				const globalConfig = this.$mStore.getters.globalConfig;
				if (globalConfig) {
					this.initSettingConfig(globalConfig)
				}
				await this.$http
					.get(configList, {
						field:
							'app_name,app_logo,app_service_type,' +
							'app_service_qr,app_agreement_default_select,' +
							'is_open_commission,is_open_scan,is_open_live_streaming,' +
							'is_open_live_streaming,style_loading_is_open,' +
							'style_loading_type,style_user_is_open,style_type,' +
							'is_open_recharge,is_open_index_cate,is_open_site,' +
							'product_poster_title,product_poster_cover_type,close_third_party_login,' +
							'close_login,close_register,close_site_date,close_site_explain,' +
							'style_login_type,style_cate_type,product_poster_qr_type,close_register_promo_code,' +
							'product_after_sale_explain,address_select_type,is_open_store_entrance,is_open_index_decoration'
					})
					.then(async r => {
						if (!this.$mHelper.isObjectValueEqual(this.$mStore.getters.globalConfig, r.data)) {
							this.initSettingConfig(r.data)
							await this.$mStore.dispatch('globalConfigChange', r.data);
						}
					});
			},
			// 初始化全局配置
			initSettingConfig(data) {
				this.$mSettingConfig['appName'] = data['app_name'] || this.$mSettingConfig['appName'];
				this.$mSettingConfig['appLogo'] = data['app_logo'] || this.$mSettingConfig['appLogo'];
				this.$mSettingConfig['appServiceType'] = data['app_service_type'] || this.$mSettingConfig['appServiceType'];
				this.$mSettingConfig['appServiceQr'] = data['app_service_qr'] || this.$mSettingConfig['appServiceQr'];
				this.$mSettingConfig['appAgreementDefaultSelect'] = data['app_agreement_default_select'] ? data['app_agreement_default_select'].toString() === '1' : this.$mSettingConfig['appAgreementDefaultSelect'];
				this.$mSettingConfig['isOpenCommission'] = data['is_open_commission'] ? data['is_open_commission'].toString() === '1' : this.$mSettingConfig['isOpenCommission'];
				this.$mSettingConfig['isOpenScan'] = data['is_open_scan'] ? data['is_open_scan'].toString() === '1' : this.$mSettingConfig['isOpenScan'];
				this.$mSettingConfig['isOpenLiveStreaming'] = data['is_open_live_streaming'] ? data['is_open_live_streaming'].toString() === '1' : this.$mSettingConfig['isOpenLiveStreaming'];
				this.$mSettingConfig['styleLoadingIsOpen'] = data['style_loading_is_open'] ? data['style_loading_is_open'].toString() === '1' : this.$mSettingConfig['styleLoadingIsOpen'];
				this.$mSettingConfig['styleLoadingType'] = data['style_loading_type'] || this.$mSettingConfig['styleLoadingType'];
				this.$mSettingConfig['styleUserIsOpen'] = data['style_user_is_open'] ? data['style_user_is_open'].toString() === '1' : this.$mSettingConfig['styleUserIsOpen'];
				this.$mSettingConfig['styleType'] = !this.$mSettingConfig['styleUserIsOpen'] ? data['style_type'] : this.$mSettingConfig['styleType'];
				this.$mSettingConfig['addressSelectType'] = !this.$mSettingConfig['addressSelectType'] ? data['address_select_type'] : this.$mSettingConfig['addressSelectType'];
				this.$mSettingConfig['styleLoginType'] = data['style_login_type'] || this.$mSettingConfig['styleLoginType'];
				this.$mSettingConfig['styleCateType'] = data['style_cate_type'] || this.$mSettingConfig['styleCateType'];
				this.$mSettingConfig['isOpenRecharge'] = data['is_open_recharge'] ? data['is_open_recharge'].toString() === '1' : this.$mSettingConfig['isOpenRecharge'];
				this.$mSettingConfig['isOpenIndexCate'] = data['is_open_index_cate'] ? data['is_open_index_cate'].toString() === '1' : this.$mSettingConfig['isOpenIndexCate'];
				this.$mSettingConfig['isOpenSite'] = data['is_open_site'] ? data['is_open_site'].toString() === '1' : this.$mSettingConfig['isOpenSite'];
				this.$mSettingConfig['productPosterTitle'] = data['product_poster_title'] || this.$mSettingConfig['productPosterTitle'];
				this.$mSettingConfig['productPosterCoverType'] = data['product_poster_cover_type'] || this.$mSettingConfig['productPosterCoverType'];
				this.$mSettingConfig['closeSiteDate'] = data['close_site_date'] || this.$mSettingConfig['closeSiteDate'];
				this.$mSettingConfig['closeSiteExplain'] = data['close_site_explain'] || this.$mSettingConfig['closeSiteExplain'];
				this.$mSettingConfig['productPosterQrType'] = data['product_poster_qr_type'] || this.$mSettingConfig['productPosterQrType'];
				this.$mSettingConfig['closeLogin'] = data['close_login'] ? data['close_login'].toString() === '1' : this.$mSettingConfig['closeLogin'];
				this.$mSettingConfig['closeRegister'] = data['close_register'] ? data['close_register'].toString() === '1' : this.$mSettingConfig['closeRegister'];
				this.$mSettingConfig['closeThirdPartyLogin'] = data['close_third_party_login'] ? data['close_third_party_login'].toString() === '1' : this.$mSettingConfig['closeThirdPartyLogin'];
				this.$mSettingConfig['closeRegisterPromoCode'] = data['close_register_promo_code'] ? data['close_register_promo_code'].toString() === '1' : this.$mSettingConfig['closeRegisterPromoCode'];
				this.$mSettingConfig['isOpenIndexDecoration'] = data['is_open_index_decoration'] ? data['is_open_index_decoration'].toString() === '1' : this.$mSettingConfig['isOpenIndexDecoration'];
				this.$mSettingConfig['productAfterSaleExplain'] = data['product_after_sale_explain'] || this.$mSettingConfig['productAfterSaleExplain'];
				this.$mSettingConfig['isOpenStoreEntrance'] = data['is_open_store_entrance'] ? data['is_open_store_entrance'].toString() === '1' : this.$mSettingConfig['isOpenStoreEntrance'];
				if (!this.$mSettingConfig['styleUserIsOpen']) {
					this.$mConstDataConfig.themeList.forEach(item => {
						if (item.name === this.$mSettingConfig['styleType']) {
							this.$mStore.commit('setThemeColor', item);
						}
					});
				}
				uni.setTabBarStyle({
					selectedColor: this.themeColor.color,
					borderStyle: 'white'
				});
				this.themeColor.tabList && this.themeColor.tabList.forEach((selectedIconPath, index) => {
					uni.setTabBarItem({
						index,
						width: 20,
						selectedIconPath
					});
				});
			},
			// 设备绑定(app推送)
			async handleBindingEquipment(id, token) {
				const oauth_client = uni.getSystemInfoSync().platform;
				await this.$http.post(bindingEquipment, {
					token,
					oauth_client,
					oauth_client_user_id: id
				});
			},
			async handleVerifyAccessToken (token) {
				await this.$http.post(verifyAccessToken, { token }).then(r => {
					if (!r.data.token) {
						this.$mStore.commit('logout');
					}
				});
			},
			// 推送消息跳转
			async navTo(item) {
				let route;
				const id = item.target_id;
				const type = item.target_type;
				switch (type) {
					case 'order_consign':
					case 'order_stock_up_accomplish':
					case 'order_return_money':
					case 'order_bargain_accomplish':
						route = `/pages/order/detail?id=${id}`;
						break;
					case 'order_wholesale_open':
					case 'order_wholesale_join':
					case 'order_wholesale_accomplish':
					case 'order_wholesale_close':
						route = `/pages/marketing/wholesale/detail?id=${id}`;
						break;
					case 'order_bargain_friend_join':
						route = `/pages/marketing/bargain/detail?id=${id}`;
						break;
					case 'order_bargain_close':
						route = `/pages/marketing/bargain/detail?id=${id}`;
						break;
					case 'coupon_give':
						route = '/pages/user/coupon/coupon?type=1';
						break;
					case 'order_virtual':
					case 'order_virtual_card':
					case 'order_virtual_network_disk':
					case 'order_virtual_download':
						route = `/pages/user/virtual/detail?id=${id}`;
						break;
					default:
						route = '/pages/index/index';
						break;
				}
				if (route) this.$mRouter.push({ route });
			}
		}
	};
</script>
<style lang="scss">
	// 导入colorUI
	@import '/static/css/colorui/main.css';
	@import '/static/css/colorui/icon.css';
	@import '/static/css/colorui/animation.css';
	@import './static/pet/iconfont.css';
	// 导入阿里巴巴矢量图标库
	/*#ifdef MP*/
	@import './static/css/iconfont/iconfont.css';
	/*#endif*/
	/*#ifndef MP*/
	//@import url('https://at.alicdn.com/t/font_1681579_y51v4l22i8m.css');
	@import url('https://at.alicdn.com/t/font_1681579_hmekt1val8.css');
	/*#endif*/
	@import './static/css/reset.scss';
	@import './static/css/uni.scss';
	
	@import 'uview-ui/index.scss';
</style>
