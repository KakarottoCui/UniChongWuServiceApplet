//微信：egvh56ufy7hh ，QQ：821898835 

const urlMap = {
	login: baseUrl + "/login",
	logout: baseUrl + "/logout",
	loginCheck: baseUrl +"/getUserInfo",//获取微信账号信息

	findNmArticleList: baseUrl+ "/nmArticle/queryList",
	findNmArticle: baseUrl+ "/nmArticle/queryObject",
	addNmArticle: baseUrl+ "/nmArticle/addNmArticle",
	editNmArticle: baseUrl+ "/nmArticle/editNmArticle",

	findNmCollectList: baseUrl+ "/nmCollect/queryList",
	findNmCollect: baseUrl+ "/nmCollect/queryObject",
	addNmCollect: baseUrl+ "/nmCollect/addNmCollect",
	editNmCollect: baseUrl+ "/nmCollect/editNmCollect",

	findNmCommentList: baseUrl+ "/nmComment/queryList",
	findNmComment: baseUrl+ "/nmComment/queryObject",
	addNmComment: baseUrl+ "/nmComment/addNmComment",
	editNmComment: baseUrl+ "/nmComment/editNmComment",

	findNmOrderList: baseUrl+ "/nmOrder/queryList",
	findNmOrder: baseUrl+ "/nmOrder/queryObject",
	addNmOrder: baseUrl+ "/nmOrder/addNmOrder",
	editNmOrder: baseUrl+ "/nmOrder/editNmOrder",

	findNmPetList: baseUrl+ "/nmPet/queryList",
	findNmPet: baseUrl+ "/nmPet/queryObject",
	addNmPet: baseUrl+ "/nmPet/addNmPet",
	editNmPet: baseUrl+ "/nmPet/editNmPet",

	findNmPicList: baseUrl+ "/nmPic/queryList",
	findNmPic: baseUrl+ "/nmPic/queryObject",
	addNmPic: baseUrl+ "/nmPic/addNmPic",
	editNmPic: baseUrl+ "/nmPic/editNmPic",

	findNmServiceList: baseUrl+ "/nmService/queryList",
	findNmService: baseUrl+ "/nmService/queryObject",
	addNmService: baseUrl+ "/nmService/addNmService",
	editNmService: baseUrl+ "/nmService/editNmService",

	getPicById : baseUrl + "/nmPic/getPicById/",
	
	editQuUser: baseUrl+ "/quUser/editQuUser",
	
}

const getUserInfo = function(){
	var _this = this;
	try {
		const value = uni.getStorageSync('userInfo');
		console.log("1"+JSON.stringify(value));
		return value ? value : false;
	} catch (e) {
		return false;
	}
}

const login = function(){
	var _this = this;
}

const request = function(requestOpt) {
	try {
		requestOpt = requestOpt || {};
		if (!requestOpt.url) {
			requestFail();
			return;
		}
		var token = "";
		try {
			const value = uni.getStorageSync('userInfo');
			if (value) {
				token = value.token;
			}
		} catch (e) {
			token = "";
		}
		requestOpt.data = requestOpt.data || {};
		requestOpt.data['token'] = token;
		requestOpt.method = requestOpt.method || 'POST';
		requestOpt.header = requestOpt.header || {
			// 'content-type': 'application/x-www-form-urlencoded',
			'token': token
		};
		requestOpt.timeout = requestOpt.timeout || 30000;
		requestOpt.responseType = requestOpt.responseType || 'text';
		requestOpt.dataType = requestOpt.dataType || "json";
		requestOpt.sslVerify = requestOpt.sslVerify || true;
		requestOpt.success = requestOpt.success || function(res) {};
		requestOpt.fail = requestOpt.fail || function(res) {};
		requestOpt.complete = requestOpt.complete || function(res) {};
		uni.showLoading({
			title: "加载中"
		});

		uni.request({
			url: requestOpt.url,
			data: requestOpt.data,
			method: requestOpt.method,
			responseType: requestOpt.responseType,
			sslVerify: requestOpt.sslVerify,
			timeout: requestOpt.timeout,
			dataType: requestOpt.dataType,
			header: requestOpt.header,
			success: function(res) {
				requestOpt.success(res);
				if(res.data.code == 401){
					uni.showToast({
						title:"未登录",
						icon:'none'
					})
					uni.removeStorageSync('user');
				}
			},
			fail: function(res) {
				requestOpt.fail(res);
			},
			complete: function(res) {
				uni.hideLoading();
			}
		});
	} catch (e) {
		//TODO handle the exception
		uni.hideLoading();
		uni.showToast({
			icon: "none",
			title: "请求异常"
		})
	}
}

const sendMsg = function(uid,content,pid,type,creater){
	request({
		method: "POST",
		url: urlMap.addQuMessage,
		data: {
			uid:uid,
			pid:pid,
			stat:0,
			type:type,
			content:content,
			creater: creater,
			validFlag: 1
		},
		success: function(res) {
			
		},
		fail: function(res) {
	
		}
	});
}


export default {
	getUserInfo,
	baseUrl,
	request,
	urlMap,
	login,
	sendMsg
}
