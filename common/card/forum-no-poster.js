export default class LastMayday {
	palette(params) {
		return ({
			"width": "720px",
			"height": "500px",
			"background": "#FFF",
			"views": [
				{
					"type": "text",
					"text": params.title,
					"css": {
						"color": "#000",
						"background": "rgba(0,0,0,0)",
						"width": "670px",
						"height": "51.48px",
						"top": "35px",
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
						"lineHeight": "52px",
						"textStyle": "fill",
						"textDecoration": "none",
						"fontFamily": "",
						"textAlign": "center"
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
						"top": "100px",
						"left": "24px",
						"rotate": "0",
						"borderRadius": "",
						"borderWidth": "",
						"borderColor": "#000",
						"shadow": "",
						"padding": "0px",
						"fontSize": "30px",
						"fontWeight": "normal",
						"maxLines": "4",
						"lineHeight": "43.3px",
						"textStyle": "fill",
						"textDecoration": "none",
						"fontFamily": "",
						"textAlign": "left"
					}
				},
				{
					"type": "rect",
					"css": {
						"background": "#FBFBFB",
						"width": "720px",
						"height": "200px",
						"top": "300px",
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
						"top": "324.88px",
						"left": "31px",
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
						"top": "413px",
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
					"text": "长按识别小程序码查看详情",
					"css": {
						"color": "#000",
						"background": "rgba(0,0,0,0)",
						"width": "500px",
						"height": "45.76px",
						"top": "362px",
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
						"lineHeight": "46.18px",
						"textStyle": "fill",
						"textDecoration": "none",
						"fontFamily": "",
						"textAlign": "left"
					}
				}
			]
		});
	}
}
    