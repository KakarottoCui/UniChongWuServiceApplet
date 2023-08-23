export default {
	// app应用名称
	appName: '糯米萌宠',

	// 购物车在tab的位置
	cartIndex: 3,

	// 消息在tab的位置
	notifyIndex: 2,

	// 分页个数
	pageSize: 10,

	// 验证码发送间隔
	sendCodeTime: 60,

	// 金额符号
	moneySymbol: '￥',

	// 单商品替代词
	singleSkuText: '基础款',

  // 顶部导航菜单
  menuTop: [
				{
					icon: 'iconxiaoxi1',
					text: '消息',
          urlType: 'tab',
          url: '/pages/notify/notify'
				},
				{
					icon: 'iconzhuyedefuben',
					text: '首页',
          urlType: 'tab',
          url: '/pages/index/index'
				},
				{
					icon: 'iconwode-',
					text: '我的',
          urlType: 'tab',
          url: '/pages/profile/profile'
				},
				{
					icon: 'icongouwuche2',
					text: '购物车',
          urlType: 'tab',
          url: '/pages/cart/cart'
				},
				{
					icon: 'iconbianji',
					text: '我要反馈',
					url: '/pages/set/feedback/feedback'
				},
				{
					icon: 'iconquanbudingdan',
					text: '我的订单',
					url: '/pages/order/order?state=-1'
				}
			],

	// 个人中心-设置中心菜单 e07472 ff4757 ff6b81
	settingList: [
		{ icon: 'iconxiaoxi1', url: '/pages/pet/my-notify', title: '我的消息', color: '#ff6b81' },
		{ icon: 'iconshouye', url: '/pages/pet/my-pet', title: '我的送养', color: '#ff6b81' },
		//{ icon: 'iconremen1', url: '/pages/pet/my-apply', title: '我的申请', color: '#ff6b81' },
		{ icon: 'iconnodata', url: '/pages/pet/my-post', title: '我的帖子', color: '#ff6b81' },
		//{ icon: 'icongonggao', url: '/pages/index/notice/notice', title: '商城公告', color: '#ff6b81' },
		//{ icon: 'iconyouhuiquan-copy', url: '/pages/user/coupon/list', title: '领券中心', color: '#ff6b81' },
		//{ icon: 'iconjifenshangcheng', url: '/pages/marketing/point/point', title: '积分商城', color: '#ff6b81'},
		//{ icon: 'icondizhi1', url: '/pages/user/address/address', title: '地址管理', color: '#ff6b81' },
		//{ icon: 'iconmimazhongzhi', url: '/pages/user/virtual/index', title: '虚拟码', color: '#ff6b81' },
		//{ icon: 'iconpintuandingdan', url: '/pages/marketing/wholesale/my', title: '我的拼团', color: '#ff6b81' },
		//{ icon: 'iconkanjia1', url: '/pages/marketing/bargain/my', title: '我的砍价', color: '#ff6b81' },
		//{ icon: 'iconshoucang3', url: '/pages/user/collection/collection', title: '我的收藏', color: '#ff6b81' },
		//{ icon: 'iconfenxiaozhongxin', url: '/pages/distribution/apply', title: '推广中心', color: '#ff6b81' },
		{ icon: 'iconfenxiang', url: '', title: '分享', color: '#ff6b81' },
		//{ icon: 'iconzhibo', url: '/pages/marketing/live/list', title: '直播', color: '#ff6b81' },
		// { icon: 'iconzhibo', url: '/pages/user/live', title: '直播测试', color: '#ff6b81' },
		//{ icon: 'iconshouhoukefu', url: '/pages/product/service/index', title: '联系客服', color: '#ff6b81' },
		{ icon: 'iconshezhi3', url: '/pages/set/set', title: '设置', color: '#ff6b81' }
	],

	// 设置-设置中心
	setList: [{
		title: '个人资料',
		url: '/pages/user/userinfo/userinfo',
		content: ''
	},
		{
			title: '修改密码',
			url: '/pages/public/password?type=1',
			content: ''
		},
		/* {
			title: '授权管理',
			url: '/pages/set/authorization/list',
			content: ''
		},
		{
			title: '发票管理',
			url: '/pages/set/invoice/invoice',
			content: '',
			class: 'mT'
		},
		{
			title: '开票历史',
			url: '/pages/set/invoice/list',
			content: ''
		}, */
		{
			title: '清除缓存',
			url: 'clearCache',
			content: ''
		},
		{
			title: '关于我们',
			url: '/pages/set/about/about',
			content: '',
			class: 'mT'
		},
		/*  #ifdef APP-PLUS  */
		{
			title: '检查更新',
			url: 'versionUpgrade',
			content: ''
		},
		/*  #endif  */
		{
			title: '站点帮助',
			url: '/pages/set/helper/index',
			content: ''
		},
		{
			title: '意见反馈',
			url: '/pages/set/feedback/list',
			content: ''
		}
	],

	// 个人中心-我的订单
	orderSectionList: [
		{
			title: '待付款',
			icon: 'iconfont icondaifukuan',
			url: '/pages/order/order?state=0',
			num: null
		},
		{
			title: '待发货',
			icon: 'iconfont iconshouye',
			url: '/pages/order/order?state=1',
			num: null
		},
		{
			title: '待收货',
			icon: 'iconfont iconyishouhuo',
			url: '/pages/order/order?state=2',
			num: null
		},
		{
			title: '评价',
			icon: 'iconfont iconpingjia',
			url: '/pages/order/order?state=3',
			num: null
		},
		{
			title: '退款/售后',
			icon: 'iconfont iconshouhoutuikuan',
			url: '/pages/order/refund',
			num: null
		}
	],

	// 个人中心-积分余额
	amountList: [
		{ title: '余额', value: 0, url: '/pages/user/account/account' },
		{ title: '优惠券', value: 0, url: '/pages/user/coupon/coupon?type=1' },
		{ title: '积分', value: 0, url: '/pages/user/account/integral' }
	],

	// 个人中心-推广中心
	promotionList: [
		{
			title: '累计佣金',
			value: 0,
			url: '/pages/distribution/brokerage/detail?state=1&type=promoter_brokerage'
		},
		{
			title: '当前佣金',
			value: 0,
			url: '/pages/distribution/brokerage/brokerage'
		},
		{ title: '已提现佣金', value: 0, url: '/pages/distribution/cash/list' }
	],

	// 订单状态
	orderStatus: [
		{ key: 0, value: '待付款' },
		{ key: 1, value: '待发货' },
		{ key: 2, value: '已发货' },
		{ key: 3, value: '已收货' },
		{ key: 4, value: '已完成' },
		{ key: -1, value: '退货申请' },
		{ key: -2, value: '退款中' },
		{ key: -3, value: '退款完成' },
		{ key: -4, value: '已关闭' },
		{ key: -5, value: '撤销申请' },
		{ key: 101, value: '待成团' },
		{ key: 201, value: '备货中' },
		{ key: 202, value: '待付尾款' }
	],

	// 订单退货状态
	refundStatus: [
		{ key: 1, value: '退款申请' },
		{ key: 2, value: '等待退货' },
		{ key: 3, value: '等待确认收货' },
		{ key: 4, value: '等待确认退款' },
		{ key: 5, value: '已退款' },
		{ key: -1, value: '退款已拒绝' },
		{ key: -2, value: '退款已关闭' },
		{ key: -3, value: '退款不通过' }
	],

	// 订单评价状态
	evaluateStatus: [
		{ key: 0, value: '未评价' },
		{ key: 1, value: '已评价' },
		{ key: 2, value: '已追评' }
	],

	// 订单状态导航
	orderNavList: [
		{ state: undefined, text: '全部' },
		{ state: 0, text: '待付款' },
		{ state: 1, text: '待发货' },
		{ state: 2, text: '待收货' },
		{ state: 3, text: '评价' }
	],

	// 表情列表
	emojiList: [
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
	],

	// 推广中心主页信息显示
	promotionIndexList: [
		{
			title: '累计佣金',
			value: 0,
			url: '/pages/distribution/brokerage/detail?state=1&type=promoter_brokerage'
		},
		{
			title: '当前佣金',
			value: 0,
			url: '/pages/distribution/brokerage/brokerage'
		},
		{ title: '销售笔数', value: 0, url: '/pages/distribution/order/order' },
		{ title: '销售金额', value: 0, url: '/pages/distribution/order/order' }
	],

	// 推广中心主要操作
	promotionOperationList: [
		{
			title: '我的',
			icon: 'iconwode',
			children: [
				{
					title: '自推订单',
					url: '/pages/distribution/order/order',
					icon: 'iconzituidingdan'
				},
				{
					title: '我的团队',
					url: '/pages/distribution/agent/agent',
					icon: 'iconwodetuandui'
				},
				{
					title: '团队订单',
					url: '/pages/distribution/order/order?type=group',
					icon: 'icontuanduidingdan'
				},
				{
					title: '推广二维码',
					url: '/pages/distribution/spread/promote',
					icon: 'iconerweima'
				},
				{
					title: '个人信息',
					url: '/pages/distribution/spread/spread',
					icon: 'icongerenxinxi'
				},
				{
					title: '提现账号',
					url: '/pages/distribution/withdraw/withdraw',
					icon: 'icontixianzhanghao'
				}
			]
		},
		{
			title: '佣金',
			icon: 'iconyongjin1',
			children: [
				{
					title: '我的佣金',
					url: '/pages/distribution/brokerage/brokerage',
					icon: 'iconwodeyongjin'
				},
				{
					title: '进行中佣金',
					url: '/pages/distribution/brokerage/detail?state=0&type=promoter_brokerage',
					icon: 'iconjinhangzhongdeyongjin'
				},
				{
					title: '我要提现',
					url: '/pages/distribution/cash/cash',
					icon: 'iconwoyaotixian'
				},
				{
					title: '提现记录',
					url: '/pages/distribution/cash/list',
					icon: 'icontixianjilu'
				}
			]
		},
		{
			title: '代理商',
			icon: 'icondailishang',
			children: [
				{
					title: '区域代理',
					url: '/pages/distribution/regional/apply',
					icon: 'iconquyudaili'
				},
				{
					title: '区代佣金',
					url: '/pages/distribution/brokerage/detail?type=regional_agent_brokerage',
					icon: 'icontixianjilu'
				}
			]
		}
	],

	// 我的团队级别
	agentTypeList: [
		{
			state: 1,
			text: '上级分销商'
		},
		{
			state: 2,
			text: '下级分销商'
		},
		{
			state: 3,
			text: '下下级分销商'
		}
	],

	// 佣金明细状态
	brokerageTypeList: [
		{
			state: 999,
			text: '全部'
		},
		{
			state: 1,
			text: '已完成'
		},
		{
			state: 0,
			text: '进行中'
		},
		{
			state: -1,
			text: '已关闭'
		}
	],

	// 提现记录类型
	cashTypeList: [
		{
			state: 1,
			text: '已通过'
		},
		{
			state: 0,
			text: '审核中'
		},
		{
			state: -1,
			text: '已拒绝'
		}
	],

	// 拼团类型
	wholesaleTypeList: [
		{
			state: 1,
			text: '开团中'
		},
		{
			state: 2,
			text: '开团成功'
		},
		{
			state: 3,
			text: '开团失败'
		}
	],

	// 直播记录列表
	liveTypeList: [
		{
			state: 101,
			text: '进行中'
		},
		{
			state: 102,
			text: '未开始'
		},
		{
			state: 103,
			text: '已结束'
		}
	],

	// 我的拼团订单
	myWholesaleOrder: [
		{
			state: 1,
			text: '我的拼团'
		},
		{
			state: 2,
			text: '拼团商城'
		}
	],

	// 我的团购订单
	myBargainOrder: [
		{
			state: 1,
			text: '我的砍价'
		},
		{
			state: 2,
			text: '砍价商城'
		}
	],

	// 收货地址/自提点
	addressTypeList: [
		{
			state: 1,
			text: '选择物流配送'
		},
		{
			state: 2,
			text: '选择自提配送'
		}
	],

	// 热门推荐
	hotRecommendList: [
		{
			url: '/pages/marketing/bargain/list',
			icon: '/static/kj.png',
			title: '我要砍价',
			desc: '淘到理想好物'
		},
		{
			url: '/pages/marketing/group/list',
			icon: '/static/tg.png',
			title: '团购专区',
			desc: '发现品质好物'
		},
		{
			url: '/pages/marketing/discount/list',
			icon: '/static/zk.png',
			title: '限时折扣',
			desc: '抢到就是赚到'
		}
	],

  // 消息类型 1:公告;2:提醒;3:私信
  notifyTypeList: [
    { type: 0, content: '' },
    { type: 1, content: '公告' },
    { type: 2, content: '提醒' },
    { type: 3, content: '私信' }
  ],

  // 消息类型 -1:已过期;1:已使用;0:未使用
  orderProductVirtualTypeList: [
    {
      state: 0,
      text: '未使用'
    },
    {
      state: 1,
      text: '已使用'
    },
    {
      state: -1,
      text: '已过期'
    }
  ],

	// 主题列表
	themeList: [
				{
					title: '官方',
					name: 'rf',
					color: '#fa436a',
					tabList: [
						'/static/tab-home-rf.png',
						'/static/tab-pet-rf.png',
						'/static/tab-notify-rf.png',
						'/static/tab-forum-rf.png',
						'/static/tab-my-rf.png'
					]
				},
				{
					title: '嫣红',
					name: 'red',
					color: '#e54d42',
					tabList: [
						'/static/tab-home-red.png',
						'/static/tab-pet-red.png',
						'/static/tab-notify-red.png',
						'/static/tab-forum-red.png',
						'/static/tab-my-red.png'
					]
				},
				{
					title: '桔橙',
					name: 'orange',
					color: '#f37b1d',
					tabList: [
						'/static/tab-home-orange.png',
						'/static/tab-pet-orange.png',
						'/static/tab-notify-orange.png',
						'/static/tab-forum-orange.png',
						'/static/tab-my-orange.png'
					]
				},
				{
					title: '明黄',
					name: 'yellow',
					color: '#fbbd08',
					tabList: [
						'/static/tab-home-yellow.png',
						'/static/tab-pet-yellow.png',
						'/static/tab-notify-yellow.png',
						'/static/tab-forum-yellow.png',
						'/static/tab-my-yellow.png'
					]
				},
				{
					title: '橄榄',
					name: 'olive',
					color: '#8dc63f',
					tabList: [
						'/static/tab-home-olive.png',
						'/static/tab-pet-olive.png',
						'/static/tab-notify-olive.png',
						'/static/tab-forum-olive.png',
						'/static/tab-my-olive.png'
					]
				},
				{
					title: '森绿',
					name: 'green',
					color: '#39b54a',
					tabList: [
						'/static/tab-home-green.png',
						'/static/tab-pet-green.png',
						'/static/tab-notify-green.png',
						'/static/tab-forum-green.png',
						'/static/tab-my-green.png'
					]
				},
				{
					title: '天青',
					name: 'cyan',
					color: '#1cbbb4',
					tabList: [
						'/static/tab-home-cyan.png',
						'/static/tab-pet-cyan.png',
						'/static/tab-notify-cyan.png',
						'/static/tab-forum-cyan.png',
						'/static/tab-my-cyan.png'
					]
				},
				{
					title: '海蓝',
					name: 'blue',
					color: '#0081ff',
					tabList: [
						'/static/tab-home-blue.png',
						'/static/tab-pet-blue.png',
						'/static/tab-notify-blue.png',
						'/static/tab-forum-blue.png',
						'/static/tab-my-blue.png'
					]
				},
				{
					title: '姹紫',
					name: 'purple',
					color: '#6739b6',
					tabList: [
						'/static/tab-home-purple.png',
						'/static/tab-pet-purple.png',
						'/static/tab-notify-purple.png',
						'/static/tab-forum-purple.png',
						'/static/tab-my-purple.png'
					]
				},
				{
					title: '木槿',
					name: 'mauve',
					color: '#9c26b0',
					tabList: [
						'/static/tab-home-mauve.png',
						'/static/tab-pet-mauve.png',
						'/static/tab-notify-mauve.png',
						'/static/tab-forum-mauve.png',
						'/static/tab-my-mauve.png'
					]
				},
				{
					title: '桃粉',
					name: 'pink',
					color: '#e03997',
					tabList: [
						'/static/tab-home-pink.png',
						'/static/tab-pet-pink.png',
						'/static/tab-notify-pink.png',
						'/static/tab-forum-pink.png',
						'/static/tab-my-pink.png'
					]
				},
				{
					title: '棕褐',
					name: 'brown',
					color: '#a5673f',
					tabList: [
						'/static/tab-home-brown.png',
						'/static/tab-pet-brown.png',
						'/static/tab-notify-brown.png',
						'/static/tab-forum-brown.png',
						'/static/tab-my-brown.png'
					]
				},
				{
					title: '玄灰',
					name: 'grey',
					color: '#8799a3',
					tabList: [
						'/static/tab-home-grey.png',
						'/static/tab-pet-grey.png',
						'/static/tab-notify-grey.png',
						'/static/tab-forum-grey.png',
						'/static/tab-my-grey.png'
					]
				},
				{
					title: '草灰',
					name: 'gray',
					color: '#aaaaaa',
					tabList: [
						'/static/tab-home-gray.png',
						'/static/tab-pet-gray.png',
						'/static/tab-notify-gray.png',
						'/static/tab-forum-gray.png',
						'/static/tab-my-gray.png'
					]
				},
				{
					title: '墨黑',
					name: 'black',
					color: '#333333',
					tabList: [
						'/static/tab-home-black.png',
						'/static/tab-pet-black.png',
						'/static/tab-notify-black.png',
						'/static/tab-forum-black.png',
						'/static/tab-my-black.png'
					]
				}
			]
};
