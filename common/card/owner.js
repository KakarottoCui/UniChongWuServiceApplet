export default class LastMayday {
	palette(params) {
		return ({
			"width": "720px",
			"height": "1280px",
			"background": "#FFF",
			"views": [
				{
					"type": "image",
					"url": params.image,
					"css": {
						"width": "720px",
						"height": "1280px",
						"top": "0px",
						"left": "0px",
						"rotate": "0",
						"borderRadius": "",
						"borderWidth": "",
						"borderColor": "",
						"shadow": "",
						"mode": "scaleToFill"
					}
				},
				{
					"type": "text",
					"text": params.title,
					"css": {
						"color": "#000",
						"background": "rgba(0,0,0,0)",
						"width": "600px",
						"height": "43px",
						"top": "700px",
						"left": "60px",
						"rotate": "0",
						"borderRadius": "",
						"borderWidth": "",
						"borderColor": "#000",
						"shadow": "",
						"padding": "0px",
						"fontSize": "36px",
						"fontWeight": "normal",
						"maxLines": "2",
						"lineHeight": "43.29px",
						"textStyle": "fill",
						"textDecoration": "none",
						"fontFamily": "",
						"textAlign": "center"
					}
				},
				{
					"type": "text",
					"text": params.baseinfo,
					"css": {
						"color": "#333",
						"background": "rgba(0,0,0,0)",
						"width": "400px",
						"height": "34.32px",
						"top": "765px",
						"left": "252px",
						"rotate": "0",
						"borderRadius": "",
						"borderWidth": "",
						"borderColor": "#000",
						"shadow": "",
						"padding": "0px",
						"fontSize": "24px",
						"fontWeight": "normal",
						"maxLines": "1",
						"lineHeight": "34.63px",
						"textStyle": "fill",
						"textDecoration": "none",
						"fontFamily": "",
						"textAlign": "left"
					}
				},
				{
					"type": "text",
					"text": params.datetime,
					"css": {
						"color": "#333",
						"background": "rgba(0,0,0,0)",
						"width": "400px",
						"height": "34.32px",
						"top": "818px",
						"left": "251px",
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
					"text": params.address,
					"css": {
						"color": "#333",
						"background": "rgba(0,0,0,0)",
						"width": "400px",
						"height": "34.32px",
						"top": "880px",
						"left": "248px",
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
						"width": "260px",
						"height": "120.48px",
						"top": "933px",
						"left": "246px",
						"rotate": "0",
						"borderRadius": "",
						"borderWidth": "",
						"borderColor": "#000",
						"shadow": "",
						"padding": "0px",
						"fontSize": "24px",
						"fontWeight": "normal",
						"maxLines": "3",
						"lineHeight": "39.96px",
						"textStyle": "fill",
						"textDecoration": "none",
						"fontFamily": "",
						"textAlign": "left"
					}
				},
				{
					"type": "image",
					"url": params.mpcode,
					"css": {
						"width": "140px",
						"height": "140px",
						"top": "989px",
						"left": "546px",
						"rotate": "0",
						"borderRadius": "",
						"borderWidth": "",
						"borderColor": "#0",
						"shadow": "",
						"mode": "scaleToFill"
					}
				},
				{
					"type": "image",
					"url": params.poster,
					"css": {
						"width": "559px",
						"height": "430.25px",
						"top": "247px",
						"left": "87px",
						"rotate": "0",
						"borderRadius": "",
						"borderWidth": "",
						"borderColor": "#0",
						"shadow": "",
						"mode": "aspectFill"
					}
				}
			]
		}
		);
	}
}
    