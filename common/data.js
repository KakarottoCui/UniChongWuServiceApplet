import test from '@/uview-ui/libs/function/test.js';

var data = {
	maps: [
		{
			name: 'qqmap',
			key: 'MT5BZ-BIN6J-FEIFH-KXJOS-TBT4F-GMFZ2'
		}
	],
	member: {
		genders: [
			{
				key: 0,
				name: '保密'
			},
			{
				key: 1,
				name: '男'
			}, 
			{
				key: 2,
				name: '女'
			}
		],
		maritals: [
			{
				key: 0,
				name: '单身'
			}, 
			{
				key: 1,
				name: '已婚'
			},
			{
				key: 2,
				name: '热恋'
			}
		],
		housings: [
			{
				key: 0,
				name: '自有住房'
			}, 
			{
				key: 1,
				name: '整租'
			},
			{
				key: 2,
				name: '合租'
			}
		]
	},
	postCates: [
		{ 
			key: '',
			name: '全部'
		},
		{
			key: 1,
			name: '科普'
		},
		{ 
			key: 2,
			name: '救助'
		},
		{
			key: 3,
			name: '闲置'
		},
		{ 
			key: 4,
			name: '其他'
		}
	],
	postCates02: [
		{
			key: 1,
			name: '科普'
		},
		{ 
			key: 2,
			name: '救助'
		},
		{
			key: 3,
			name: '闲置'
		},
		{ 
			key: 4,
			name: '其他'
		}
	],
	types: [
		{ key: 1, name: '领养', title: '领养', content: 'Ta的故事', tips: '为小可爱找新家' },
		{ key: 2, name: '寻宠', title: '丢失', content: '走失详情', tips: '寻找走失的小可爱' },
		{ key: 3, name: '寻主', title: '拾得', content: '宠物详情', tips: '为小可爱寻找原主人' },
	],
	cates: [
		{
			key: 1,
			name: '猫猫'
		}, 
		{
			key: 2,
			name: '狗狗'
		}, 
		{
			key: 3,
			name: '其他'
		}
	],
	genders: [
		{
			key: 0,
			name: '未知'
		},
		{
			key: 1,
			name: '男孩'
		}, 
		{
			key: 2,
			name: '女孩'
		}
	],
	ages: [
		{
			key: 1,
			name: '幼年'
		},
		{
			key: 2,
			name: '成年'
		},
		{
			key: 3,
			name: '老年'
		},
	],
	modes: [
		{
			key: 0,
			name: '无偿'
		}, 
		{
			key: 1,
			name: '红包'
		}, 
		{
			key: 2,
			name: '押金'
		}
	],
	vaccines: [
		{
			key: 0,
			name: '接种不详'
		},
		{
			key: 1,
			name: '已接种'
		}, 
		{
			key: 2,
			name: '接种中'
		}, 
		{
			key: 3,
			name: '未接种'
		}
	],
	sterilizes: [
		{
			key: 0,
			name: '绝育不详'
		},
		{
			key: 1,
			name: '已绝育'
		}, 
		{
			key: 2,
			name: '未绝育'
		}
	],
	deworms: [
		{
			key: 0,
			name: '驱虫不详'
		},
		{
			key: 1,
			name: '已驱虫'
		}, 
		{
			key: 2,
			name: '未驱虫'
		}
	],
	sources: [
		{
			key: 1,
			name: '个人救助'
		}, 
		{
			key: 2,
			name: '救助站'
		}, 
		{
			key: 3,
			name: '家养'
		}
	],
	sizes: [
		{
			key: 1,
			name: '小型'
		},
		{
			key: 2,
			name: '中型'
		},
		{
			key: 3,
			name: '大型'
		}
	],
	hairs: [
		{
			key: 1,
			name: '无毛'
		},
		{
			key: 2,
			name: '短毛'
		}, 
		{
			key: 3,
			name: '长毛'
		}
	],
	tags: [
		{
			name: '安静稳重'
		},
		{
			name: '活泼调皮'
		},
		{
			name: '运动量大'
		},
		{
			name: '不挑食'
		},
		{
			name: '聪明伶俐'
		},
		{
			name: '粘人'
		},
		{
			name: '不粘人'
		},
		{
			name: '无攻击性'
		},
		{
			name: '会看家'
		},
		{
			name: '不乱叫'
		}
	],
	requirements: [
		{
			name: '仅限同城领养，不可邮寄',
			checked: true
		},
		{
			name: '上门自取',
			checked: true
		},
		{
			name: '签订领养协议',
			checked: true
		},
		{
			name: '互换身份证复印件',
			checked: true
		},
		{
			name: '接受上门家访',
			checked: true
		},
		{
			name: '不接受学生领养',
			checked: true
		},
		{
			name: '须有稳定工作和收入',
			checked: false
		},
		{
			name: '年龄需20岁以上',
			checked: false
		},
		{
			name: '自有住房',
			checked: false
		},
		{
			name: '养猫封窗/养犬牵引',
			checked: false
		},
		{
			name: '接受视频回访',
			checked: false
		},
		{
			name: '不接受合租领养',
			checked: false
		}
	],
	rules: {
		images: [
			{
				validator: (rule, value, callback) => {
					return !test.isEmpty(value); //!!value.length;
				},
				message: '请上传图片',
				trigger: ['blur', 'change'],
			}
		],
		title: [
			{
				required: true,
				message: '请输入标题',
				trigger: ['blur', 'change']
			},
			{
				min: 1,
				max: 100,
				message: '标题长度在1-100个字符之间',
				trigger: ['blur', 'change']
			}
			/* {
				validator: (rule, value, callback) => {
					return test.rangeLength(value, [0, 100]);
				},
				message: '标题在1到100个字符',
				trigger: ['blur', 'change'],
			} */
		],
		money: [
			{
				validator: (rule, value, callback) => {
					return test.amount(value);
				},
				message: '金额格式不正确（小数点后保留两位）',
				trigger: ['blur', 'change']
			},
			{
				validator: (rule, value, callback) => {
					return test.range(value, [0, 999999]);
				},
				message: '金额大小为0-99999',
				trigger: ['blur', 'change']
			}
		],
		refund_condition: [
			{
				max: 200,
				message: '退还条件长度不能超过200个字符',
				trigger: ['blur', 'change']
			}
		],
		nickname: [
			{
				required: true,
				message: '请输入宠物昵称',
				trigger: ['blur', 'change']
			},
			{
				min: 1,
				max: 20,
				message: '宠物昵称长度在1-20个字符之间',
				trigger: ['blur', 'change']
			}
		],
		breed: [
			{
				required: true,
				message: '请输入宠物品种',
				trigger: ['blur', 'change']
			},
			{
				min: 1,
				max: 20,
				message: '宠物品种长度在1-20个字符之间',
				trigger: ['blur', 'change']
			}
		],
		age_name: [
			{
				required: true,
				message: '请选择宠物年龄',
				trigger: ['blur', 'change']
			}
		],
		datetime_name: [
			{
				required: true,
				message: '请选择时间',
				trigger: ['blur', 'change']
			}
		],
		other_requirement: [
			{
				max: 999999,
				message: '其他要求长度不超过999999个字符',
				trigger: ['blur', 'change']
			}
		],
		address: [
			{
				required: true,
				message: '请选择地点',
				trigger: ['blur', 'change']
			}
		],
		content: [
			{
				required: true,
				message: '请输入详情描述',
				trigger: ['blur', 'change']
			},
			{
				min: 1,
				max: 999999,
				message: '详情描述长度在1-999999个字符之间',
				trigger: ['blur', 'change']
			}
		],
		content_forum: [
			{
				required: true,
				message: '请输入正文',
				trigger: ['blur', 'change']
			},
			{
				min: 1,
				max: 999999,
				message: '正文长度在1-999999个字符之间',
				trigger: ['blur', 'change']
			}
		],
		content_comment: [
			{
				required: true,
				message: '请输入留言内容',
				trigger: ['blur', 'change']
			},
			{
				min: 1,
				max: 9999,
				message: '留言内容长度在1-9999个字符之间',
				trigger: ['blur', 'change']
			}
		],
		'member.birthday': [
			{
				required: true,
				message: '请选择出生日期',
				trigger: ['blur', 'change']
			}
		],
		'member.career': [
			{
				required: true,
				message: '请输入职业',
				trigger: ['blur', 'change']
			},
			{
				min: 1,
				max: 20,
				message: '职业长度在1-20个字符之间',
				trigger: ['blur', 'change']
			}
		],
		'member.address': [
			{
				required: true,
				message: '请选择所在地点',
				trigger: ['blur', 'change']
			}
		],
		'member.pet_experience': [
			{
				required: true,
				message: '请输入养宠经验',
				trigger: ['blur', 'change']
			},
			{
				min: 1,
				max: 9999,
				message: '养宠经验长度在1-9999个字符之间',
				trigger: ['blur', 'change']
			}
		],
		'member.pet_apply': [
			{
				required: true,
				message: '请输入申请语',
				trigger: ['blur', 'change']
			},
			{
				min: 1,
				max: 9999,
				message: '申请语长度在1-9999个字符之间',
				trigger: ['blur', 'change']
			}
		],
		'member.nickname': [
			{
				required: true,
				message: '请输入称呼',
				trigger: ['blur', 'change']
			},
			{
				min: 1,
				max: 20,
				message: '称呼长度在1-20个字符之间',
				trigger: ['blur', 'change']
			}
		],
		'member.mobile': [
			{
				required: true,
				message: '请输入手机号码',
				trigger: ['blur', 'change']
			},
			{
				validator: (rule, value, callback) => {
					return 	test.mobile(value);
				},
				message: '请输入11位手机号码',
				trigger: ['blur', 'change']
			}
		],
		'member.wechat': [
			{
				required: true,
				message: '请输入微信号',
				trigger: ['blur', 'change']
			},
			{
				min: 1,
				max: 20,
				message: '微信号长度在1-20个字符之间',
				trigger: ['blur', 'change']
			}
		],
		'member.qq': [
			{
				min: 5,
				max: 12,
				message: 'QQ号长度在5-12个数字之间',
				trigger: ['blur', 'change']
			}
		]
	}
};

export default data;