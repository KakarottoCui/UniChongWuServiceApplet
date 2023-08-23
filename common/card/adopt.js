export default class LastMayday {
	palette(params) {
		return ({
			"width": "720px",
			"height": "1234px",
			"background": "#FFFFFF",
			"views": [
				{
					"type": "image",
					"url": params.image,
					"css": {
						"width": "720px",
						"height": "1234px",
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
					"type": "image",
					"url": params.poster,
					"css": {
						"width": "568px",
						"height": "450px",
						"top": "224px",
						"left": "77px",
						"rotate": "360",
						"borderRadius": "12px",
						"borderWidth": "2px",
						"borderColor": "#e3fdff",
						"shadow": "",
						"mode": "aspectFill"
					}
				},
				{
					"type": "text",
					"text": params.nickname,
					"css": {
						"color": "#333",
						"background": "rgba(0,0,0,0)",
						"width": "140px",
						"height": "27px",
						"top": "748px",
						"left": "200px",
						"rotate": "0",
						"borderRadius": "",
						"borderWidth": "",
						"borderColor": "#000000",
						"shadow": "",
						"padding": "0px",
						"fontSize": "24px",
						"fontWeight": "bold",
						"maxLines": "2",
						"lineHeight": "26.64px",
						"textStyle": "fill",
						"textDecoration": "none",
						"fontFamily": "",
						"textAlign": "left"
					}
				},
				{
					"type": "text",
					"text": params.gender_name,
					"css": {
						"color": "#333",
						"background": "rgba(0,0,0,0)",
						"width": "140px",
						"height": "27px",
						"top": "748px",
						"left": "450px",
						"rotate": "0",
						"borderRadius": "",
						"borderWidth": "",
						"borderColor": "#000000",
						"shadow": "",
						"padding": "0px",
						"fontSize": "24px",
						"fontWeight": "bold",
						"maxLines": "2",
						"lineHeight": "26.64px",
						"textStyle": "fill",
						"textDecoration": "none",
						"fontFamily": "",
						"textAlign": "left"
					}
				},
				{
					"type": "text",
					"text": params.age_name,
					"css": {
						"color": "#333",
						"background": "rgba(0,0,0,0)",
						"width": "140px",
						"height": "27px",
						"top": "798px",
						"left": "200px",
						"rotate": "0",
						"borderRadius": "",
						"borderWidth": "",
						"borderColor": "#000000",
						"shadow": "",
						"padding": "0px",
						"fontSize": "24px",
						"fontWeight": "bold",
						"maxLines": "2",
						"lineHeight": "26.64px",
						"textStyle": "fill",
						"textDecoration": "none",
						"fontFamily": "",
						"textAlign": "left"
					}
				},
				{
					"type": "text",
					"text": params.area,
					"css": {
						"color": "#333",
						"background": "rgba(0,0,0,0)",
						"width": "200px",
						"height": "27px",
						"top": "796px",
						"left": "450px",
						"rotate": "0",
						"borderRadius": "",
						"borderWidth": "",
						"borderColor": "#000000",
						"shadow": "",
						"padding": "0px",
						"fontSize": "24px",
						"fontWeight": "bold",
						"maxLines": "2",
						"lineHeight": "26.64px",
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
						"color": "#000000",
						"background": "rgba(0,0,0,0)",
						"width": "500px",
						"height": "97px",
						"top": "892px",
						"left": "126px",
						"rotate": "0",
						"borderRadius": "",
						"borderWidth": "",
						"borderColor": "#000000",
						"shadow": "",
						"padding": "0px",
						"fontSize": "24px",
						"fontWeight": "normal",
						"maxLines": "3",
						"lineHeight": "32px",
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
						"width": "97.55px",
						"height": "97.55px",
						"top": "1013.57px",
						"left": "500.27px",
						"rotate": "0",
						"borderRadius": "",
						"borderWidth": "",
						"borderColor": "",
						"shadow": "",
						"mode": "scaleToFill"
					}
				}
			]
		});
	}
};
  