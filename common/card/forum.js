export default class LastMayday {
	palette(params) {
		return ({
			"width": "720px",
			"height": "1000px",
			"background": "#FFF",
			"views": [
				{
					"type": "image",
					"url": params.poster,
					"css": {
						"width": "670px",
						"height": "420px",
						"top": "23px",
						"left": "24px",
						"rotate": "0",
						"borderRadius": "",
						"borderWidth": "",
						"borderColor": "#000",
						"shadow": "",
						"mode": "aspectFill"
					}
				},
				{
					"type": "rect",
					"css": {
						"background": "#FBFBFB",
						"width": "720px",
						"height": "200px",
						"top": "800px",
						"left": "0px",
						"rotate": "0",
						"borderRadius": "",
						"shadow": "",
						"color": "#FBFBFB"
					}
				},
				{
					"type": "image",
					"url": params.mpcode,
					"css": {
						"width": "150px",
						"height": "150px",
						"top": "825px",
						"left": "30px",
						"rotate": "0",
						"borderRadius": "",
						"borderWidth": "",
						"borderColor": "#000",
						"shadow": "",
						"mode": "scaleToFill"
					}
				},
				{
					"type": "text",
					"text": "来自糯米萌宠",
					"css": {
						"color": "#999",
						"background": "rgba(0,0,0,0)",
						"width": "306.25px",
						"height": "34.32px",
						"top": "913px",
						"left": "212px",
						"rotate": "0",
						"borderRadius": "",
						"borderWidth": "",
						"borderColor": "#000",
						"shadow": "",
						"padding": "0px",
						"fontSize": "24px",
						"fontWeight": "normal",
						"maxLines": "2",
						"lineHeight": "34.63px",
						"textStyle": "fill",
						"textDecoration": "none",
						"fontFamily": "",
						"textAlign": "left"
					}
				},
				{
					"type": "text",
					"text": params.content,
					"css": {
						"color": "#333",
						"background": "rgba(0,0,0,0)",
						"width": "670px",
						"height": "175px",
						"top": "576px",
						"left": "23px",
						"rotate": "0",
						"borderRadius": "",
						"borderWidth": "",
						"borderColor": "#000",
						"shadow": "",
						"padding": "0px",
						"fontSize": "30px",
						"fontWeight": "normal",
						"maxLines": "4",
						"lineHeight": "44px",
						"textStyle": "fill",
						"textDecoration": "none",
						"fontFamily": "",
						"textAlign": "left"
					}
				},
				{
					"type": "text",
					"text": "长按识别小程序码查看详情",
					"css": {
						"color": "#000",
						"background": "rgba(0,0,0,0)",
						"width": "500px",
						"height": "45.76px",
						"top": "862px",
						"left": "208px",
						"rotate": "0",
						"borderRadius": "",
						"borderWidth": "",
						"borderColor": "#000",
						"shadow": "",
						"padding": "0px",
						"fontSize": "32px",
						"fontWeight": "normal",
						"maxLines": "2",
						"lineHeight": "46.17600000001px",
						"textStyle": "fill",
						"textDecoration": "none",
						"fontFamily": "",
						"textAlign": "left"
					}
				},
				{
					"type": "text",
					"text": params.title,
					"css": {
						"color": "#000",
						"background": "rgba(0,0,0,0)",
						"width": "670px",
						"height": "51.48px",
						"top": "485px",
						"left": "23px",
						"rotate": "0",
						"borderRadius": "",
						"borderWidth": "",
						"borderColor": "#000",
						"shadow": "",
						"padding": "0px",
						"fontSize": "36px",
						"fontWeight": "bold",
						"maxLines": "2",
						"lineHeight": "51.95px",
						"textStyle": "fill",
						"textDecoration": "none",
						"fontFamily": "",
						"textAlign": "center"
					}
				}
			]
		});
	}
}
