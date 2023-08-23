const CONFIG = {
	// 开发环境配置
	development: {
	    assetsPath: '/static', // 静态资源路径
	    basePath: 'https://izhaochong.noooya.com/static', // 网络资源路径
			//baseUrl: 'http://sf3.com/api', // 后台接口请求地址
			baseUrl: 'https://izhaochong.noooya.com/api', // 后台接口请求地址
			hostUrl: 'https://izhaochong.noooya.com/h5', // H5地址(前端运行地址)
	    websocketUrl: '', // websocket服务端地址
	    weixinAppId: 'wxc4bbbe1b3b1b4a71' // 微信公众号appid
	},
	// 生产环境配置
	production: {
	    assetsPath: '/static', // 静态资源路径
			basePath: 'https://izhaochong.noooya.com/static', // 网络资源路径
	    baseUrl: 'https://izhaochong.noooya.com/api', // 后台接口请求地址
	    hostUrl: 'https://izhaochong.noooya.com/h5', // H5地址(前端运行地址)
	    websocketUrl: '', // websocket服务端地址
	    weixinAppId: 'wxc4bbbe1b3b1b4a71' // 微信公众号appid
	}

};
export default CONFIG[process.env.NODE_ENV];
