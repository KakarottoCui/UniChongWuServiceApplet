// websocket 方法集合
import $mConfig from '@/config/index.config';
import $mWebsocketConfig from '@/config/websocket.config';
import $mHelper from '@/utils/helper';
import $mStore from '@/store';
class websocket {
	constructor() {
		this.conncted = false;
		this.login = false;
		this.serviceList = [];
		this.fd = null;
		this.emojiList = [
			{ url: '0', alt: '[微笑]' },
			{ url: '1', alt: '[撇嘴]' },
			{ url: '2', alt: '[色]' },
			{ url: '3', alt: '[发呆]' },
			{ url: '4', alt: '[得意]' },
			{ url: '5', alt: '[流泪]' },
			{ url: '6', alt: '[害羞]' },
			{ url: '7', alt: '[闭嘴]' },
			{ url: '8', alt: '[睡]' },
			{ url: '9', alt: '[大哭]' },
			{ url: '10', alt: '[尴尬]' },
			{ url: '11', alt: '[发怒]' },
			{ url: '12', alt: '[调皮]' },
			{ url: '13', alt: '[呲牙]' },
			{ url: '14', alt: '[惊讶]' },
			{ url: '15', alt: '[难过]' },
			{ url: '16', alt: '[酷]' },
			{ url: '17', alt: '[冷汗]' },
			{ url: '18', alt: '[抓狂]' },
			{ url: '19', alt: '[吐]' },
			{ url: '20', alt: '[偷笑]' },
			{ url: '21', alt: '[愉快]' },
			{ url: '22', alt: '[白眼]' },
			{ url: '23', alt: '[傲慢]' },
			{ url: '24', alt: '[饥饿]' },
			{ url: '25', alt: '[困]' },
			{ url: '26', alt: '[惊恐]' },
			{ url: '27', alt: '[流汗]' },
			{ url: '28', alt: '[憨笑]' },
			{ url: '29', alt: '[悠闲]' },
			{ url: '30', alt: '[奋斗]' },
			{ url: '31', alt: '[咒骂]' },
			{ url: '32', alt: '[疑问]' },
			{ url: '33', alt: '[嘘]' },
			{ url: '34', alt: '[晕]' },
			{ url: '35', alt: '[疯了]' },
			{ url: '36', alt: '[衰]' },
			{ url: '37', alt: '[骷髅]' },
			{ url: '38', alt: '[敲打]' },
			{ url: '39', alt: '[再见]' },
			{ url: '40', alt: '[擦汗]' },
			{ url: '41', alt: '[抠鼻]' },
			{ url: '42', alt: '[鼓掌]' },
			{ url: '43', alt: '[糗大了]' },
			{ url: '44', alt: '[坏笔]' },
			{ url: '45', alt: '[左哼哼]' },
			{ url: '46', alt: '[右哼哼]' },
			{ url: '47', alt: '[哈欠]' },
			{ url: '48', alt: '[鄙视]' },
			{ url: '49', alt: '[委屈]' },
			{ url: '50', alt: '[快哭了]' },
			{ url: '51', alt: '[阴险]' },
			{ url: '52', alt: '[亲亲]' },
			{ url: '53', alt: '[吓]' },
			{ url: '54', alt: '[可怜]' },
			{ url: '55', alt: '[菜刀]' },
			{ url: '56', alt: '[西瓜]' },
			{ url: '57', alt: '[啤酒]' },
			{ url: '58', alt: '[篮球]' },
			{ url: '59', alt: '[乒乓]' },
			{ url: '60', alt: '[咖啡]' },
			{ url: '61', alt: '[饭]' },
			{ url: '62', alt: '[猪头]' },
			{ url: '63', alt: '[玫瑰]' },
			{ url: '64', alt: '[凋谢]' },
			{ url: '65', alt: '[嘴唇]' },
			{ url: '66', alt: '[爱心]' },
			{ url: '67', alt: '[心碎]' },
			{ url: '68', alt: '[蛋糕]' },
			{ url: '69', alt: '[闪电]' },
			{ url: '70', alt: '[炸弹]' },
			{ url: '71', alt: '[刀]' },
			{ url: '72', alt: '[足球]' },
			{ url: '73', alt: '[瓢虫]' },
			{ url: '74', alt: '[便便]' },
			{ url: '75', alt: '[月亮]' },
			{ url: '76', alt: '[太阳]' },
			{ url: '77', alt: '[礼物]' },
			{ url: '78', alt: '[拥抱]' },
			{ url: '79', alt: '[强]' },
			{ url: '80', alt: '[弱]' },
			{ url: '81', alt: '[握手]' },
			{ url: '82', alt: '[胜利]' },
			{ url: '83', alt: '[抱拳]' },
			{ url: '84', alt: '[勾引]' },
			{ url: '85', alt: '[拳头]' },
			{ url: '86', alt: '[差劲]' },
			{ url: '87', alt: '[爱您]' },
			{ url: '88', alt: '[NO]' },
			{ url: '89', alt: '[OK]' },
			{ url: '90', alt: '[爱情]' },
			{ url: '91', alt: '[飞吻]' },
			{ url: '92', alt: '[跳跳]' },
			{ url: '93', alt: '[发抖]' },
			{ url: '94', alt: '[怄火]' },
			{ url: '95', alt: '[转圈]' },
			{ url: '96', alt: '[磕头]' },
			{ url: '97', alt: '[回头]' },
			{ url: '98', alt: '[跳绳]' },
			{ url: '99', alt: '[投降]' },
			{ url: '100', alt: '[激动]' },
			{ url: '101', alt: '[乱舞]' },
			{ url: '102', alt: '[献吻]' },
			{ url: '103', alt: '[左太极]' },
			{ url: '104', alt: '[右太极]' }
		];
	}

	// 初始化websocketet
	initWebsocket() {
		if (!$mStore.state.accessToken) {
			return;
		}
		// 连接webSocket
		uni.connectSocket({ url: $mConfig.websocketUrl });
		// 监听webSocket连接成功
		uni.onSocketOpen(res => {
			this.conncted = true;
			if ($mStore.state.isImPanel) {
				// let params = {
				// 	tip: true,
				// 	content: '连接成功，正在准备会话连线...'
				// };
				// $mStore.commit('addImHistory', params);
			}
			this.send(
				JSON.stringify({
					route: $mWebsocketConfig.login,
					token: $mStore.state.accessToken
				})
			);
			setInterval(() => {
				this.send(JSON.stringify({ route: $mWebsocketConfig.ping }));
			}, 60 * 1000);
		});

		// 监听webSocket出错
		uni.onSocketError(res => {
			this.conncted = false;
			this.login = false;
			setTimeout(() => {
				this.initWebsocket();
			}, 10 * 1000);
		});

		uni.onSocketClose(res => {
			this.conncted = false;
			this.login = false;
			setTimeout(() => {
				this.initWebsocket();
			}, 10 * 1000);
		});

		uni.onSocketMessage(this.websocketOnMessage);
	}

	// 发送消息
	send(data) {
		if (!this.conncted) {
			if ($mStore.state.isImPanel && !this.login) {
				// let params = {
				// 	tip: true,
				// 	content: '正在重新连接客服服务，请稍候...'
				// };
				// $mStore.commit('addImHistory', params);
			}
			return;
		}
		uni.sendSocketMessage({ data });
	}

	// 关闭
	closeWebSocket() {
		if (!this.conncted) {
			return;
		}
		uni.closeSocket({
			success: () => {
				console.log('调用关闭websocket成功');
			},
			fail: () => {
				console.log('调用关闭websocket失败');
			}
		});
	}

	// 消息处理
	websocketOnMessage = e => {
		const data = JSON.parse(e.data);
		const _this = this;
		let params = {};
		if (data.route === $mWebsocketConfig.login) {
			this.login = true;
			if ($mStore.state.isImPanel) {
				let params = {
					tip: true,
					content: '客服连线成功'
				};
				$mStore.commit('addImHistory', params);
			}
			return;
		}
		if (data.route === $mWebsocketConfig.conversationAll) {
			if (data.data.length === 0) return;
			const imHistory = data.data;
			imHistory.forEach(item => {
				let content = '';
				switch (item.type) {
					case 'text':
						content = item.content.replace(
							new RegExp('\\[(.+?)\\]', 'g'),
							function(r) {
								if (!_this.emojiToText(r)) {
									return r;
								} else {
									return (
										`<img src="${$mConfig.hostUrl}/static/emoji/${_this.emojiToText(r)}.png" />`
									);
								}
							}
						);
						break;
					case 'voice':
						break;
					case 'video':
						break;
					case 'image':
						content =
							'<img style="max-width:200px" src="' +
							item.content +
							'"></img>';
						break;
					case 'longitudeAndLatitude':
						break;
					default:
						content = item.content;
						break;
				}
				item.content = content;
			});
			$mStore.commit('setImHistory', imHistory);
			return;
		}
		if (data.route === $mWebsocketConfig.memberClose) {
			$mStore.commit('setIsStuffService', false);
		}
		if (data.route === $mWebsocketConfig.bubbleClose) {
			$mStore.commit('setIsStuffService', false);
			let params = {
				tip: true,
				content: '会话已结束，现在由机器人精灵为您服务'
			};
			$mStore.commit('addImHistory', params);
			return;
		}
		if (data.route === $mWebsocketConfig.serviceIndex) {
			this.serviceList = data.data;
			this.fd = data.member.fd;
			return;
		}
		switch (parseInt(data.code)) {
			case 1006:
				break;
			case 2000:
        // eslint-disable-next-line
        let content;
				switch (data.data.type) {
					case 'text':
						content = data.data.content.replace(
							new RegExp('\\[(.+?)\\]', 'g'),
							function(r) {
								if (!_this.emojiToText(r)) {
									return r;
								} else {
									return (
										`<img src="${$mConfig.hostUrl}/static/emoji/${_this.emojiToText(r)}.png" />`
									);
								}
							}
						);
						break;
					case 'voice':
						break;
					case 'video':
						break;
					case 'image':
						content =
							'<img style="max-width:200px" src="' +
							data.data.content +
							'"></img>';
						break;
					case 'longitudeAndLatitude':
						break;
					default:
						content = data.data.content;
						break;
				}
				params = {
					user_type: data.data.user_type,
					content,
					serviceNickname:
						data.data.user_type === 'member' ? '' : data.member.nickname,
					avatar:
						data.data.user_type === 'member'
							? 'background-image:url(' + $mStore.state.userInfo.head_portrait + ')'
							: 'background-image:url(' + data.member.head_portrait + ')',
					created_at: data.timestamp
				};
				$mStore.commit('addImHistory', params);
				break;
			case 2001:
				this.fd = data.data.fd;
				if ($mStore.state.isImPanel) {
					// let params = {
					// 	tip: true,
					// 	content: '会话连线成功，正在进行客服连线...'
					// };
					// $mStore.commit('addImHistory', params);
				}
				break;
			case 2002:
				break;
			case 2003:
				$mStore.commit('setIsStuffService', false);
				params = {
					tip: true,
					content: data.data
				};
				$mStore.commit('addImHistory', params);
				break;
			case 2005:
				$mStore.commit('setIsStuffService', true);
				params = {
					tip: true,
					content: data.message
				};
				$mStore.commit('addImHistory', params);
				break;
			case 4000:
				$mStore.commit('setIsStuffService', false);
				params = {
					tip: true,
					content: data.message
				};
				$mStore.commit('addImHistory', params);
				break;
			case 4104:
				$mStore.commit('setIsStuffService', false);
				params = {
					tip: true,
					content: data.message
				};
				$mStore.commit('addImHistory', params);
				break;
			case 4001:
				// 用户验证失败
				$mHelper.toast('您的登录令牌已过期,请重新登录~');
				$mStore.commit('logout', '');
				break;
			case 4002:
				break;
			case 4004:
				break;
			case 4101:
				// 用户在其它地方登录
				$mHelper.toast('您的账户已在其它地方登录');
				$mStore.commit('logout', '');
				break;
			case 4102:
				params = {
					tip: true,
					content: data.message
				};
				$mStore.commit('addImHistory', params);
				break;
			case 5000:
				break;
			default:
				break;
		}
	};

	emojiToText(em) {
		for (let i = 0; i < this.emojiList.length; i++) {
			if (this.emojiList[i].url === em.toString()) {
				return this.emojiList[i].alt;
			}
			if (this.emojiList[i].alt === em.toString().trim()) {
				return this.emojiList[i].url;
			}
		}
	}
}
// eslint-disable-next-line
export default new websocket();
