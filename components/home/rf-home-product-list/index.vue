<template>
	<view class="rf-home-product-list">
		<view class="rf-product-list-container one" v-if="showType === 'oneLine'">
			<view v-for="(item, index) in list" :key="index">
				<!--商品列表-->
				<view
					@tap="navToProductUrl(type, item.id)"
					class="rf-product-item rf-product-flex-list"
					hover-class="hover"
					:hover-start-time="150"
				>
					<view class="rf-product-image-wrapper">
						<image :src="item.picture || productImg" mode="widthFix" class="rf-product-list-img"/>
<!--						<view class="triangle-wrapper">-->
<!--							<image class="triangle-tag" :src="item | filterTagName" />-->
<!--						</view>-->
					</view>
					<view class="rf-pro-content">
						<view class="wrapper">
							<view class="rf-pro-tit in2line" v-if="contentValue.toString().includes('title')">{{ item.name }}</view>
							<view class="rf-pro-tags in1line" v-if="contentValue.toString().includes('sub')">
								<block v-if="item.tags && item.tags.length.length > 0">
									{{ item.tags.join(' | ') }}
								</block>
								<view v-else class="in1line">
									<uni-tag class="tag" v-if="item.commissionRate" inverted size="mini" text="分销"></uni-tag>
									<uni-tag class="tag" v-if="item.is_open_presell === '1'" inverted size="mini" text="预售"></uni-tag>
									<uni-tag class="tag" v-if="item.is_virtual === '1'" inverted size="mini" text="虚拟"></uni-tag>
									<uni-tag class="tag" v-if="item.shipping_type === '1'" inverted size="mini" text="包邮"></uni-tag>
								</view>
							</view>
						</view>
						<view class="rf-pro-price">
							<view class="rf-price-wrapper">
								<text class="rf-sale-price" :class="'text-'+themeColor.name"><text class="symbol">{{ moneySymbol }}</text>{{ item | currentProductPrice(type) }}</text>
								<text class="rf-factory-price" v-if="item.market_price > item.price && contentValue.toString().includes('marketPrice')"><text class="symbol">{{ moneySymbol }}</text>{{ item.market_price }}</text>
								<view class="num" v-if="contentValue.toString().includes('sales')">
									已销售{{ item.total_sales || 0 }}件
								</view>
							</view>
							<text v-if="type === 'product'" @tap.stop="toggleSpec(item)" class="iconfont icongouwuche3" :class="'text-' + themeColor.name"></text>
							<button v-else class="btn" :class="'bg-' + themeColor.name">{{ type | handleTypeToDesc }}</button>
						</view>
					</view>
				</view>
				<!--商品列表-->
			</view>
		</view>
		<view class="rf-product-list-container two" v-if="showType === 'twoLine'">
			<view style="width: 100%;columns: 2;column-gap: 10rpx">
				<view class="rf-home-product-list-item" v-for="(item, index) in list" :key="index">
					<!--商品列表-->
					<view
						@tap="navToProductUrl(type, item.id)"
						class="rf-product-item"
						:hover-start-time="150"
					>
						<view class="rf-product-image-wrapper">
							<image :src="item.picture || productImg" mode="aspectFill" class="rf-product-img"/>
							<!--            <text class="sketch in1line">商品促销语{{ index + 1 }}</text>-->
						</view>
						<view class="rf-pro-content">
							<view class="wrapper">
								<view class="rf-pro-tit in2line" v-if="contentValue.toString().includes('title')">{{ item.name }}</view>
								<view class="rf-pro-tags in1line" v-if="item.tags && item.tags.length && contentValue.toString().includes('sub')">{{ item.tags.join(' | ') }}</view>
								<view v-else class="in1line">
									<uni-tag class="tag" v-if="item.commissionRate" inverted size="mini" text="分销"></uni-tag>
									<uni-tag class="tag" v-if="item.is_open_presell === '1'" inverted size="mini" text="预售"></uni-tag>
									<uni-tag class="tag" v-if="item.is_virtual === '1'" inverted size="mini" text="虚拟"></uni-tag>
									<uni-tag class="tag" v-if="item.shipping_type === '1'" inverted size="mini" text="包邮"></uni-tag>
								</view>
							</view>
							<view class="rf-pro-price">
								<view class="rf-price-wrapper">
									<view class="in1line">
										<text class="rf-sale-price" :class="'text-'+themeColor.name"><text class="symbol">{{ moneySymbol }}</text>{{ item | currentProductPrice(type) }}</text>
										<text class="rf-factory-price" v-if="item.market_price > item.price && contentValue.toString().includes('marketPrice')"><text class="symbol">{{ moneySymbol }}</text>{{ item.market_price }}</text>
									</view>
									<view class="num" v-if="contentValue.toString().includes('sales')">
										已销售{{ item.total_sales || 0 }}件
									</view>
								</view>
								<text v-if="type === 'product'" @tap.stop="toggleSpec(item)" class="iconfont icongouwuche3" :class="'text-' + themeColor.name"></text>
								<button v-else class="btn" :class="'bg-' + themeColor.name">{{ type | handleTypeToDesc }}</button>
							</view>
						</view>
					</view>
					<!--商品列表-->
				</view>
			</view>
		</view>
		<view class="rf-product-list-container three" v-if="showType === 'threeLine'">
			<view style="width: 100%;">
				<view class="rf-home-product-list-item" v-for="(item, index) in list" :key="index">
					<!--商品列表-->
					<view
						@tap="navToProductUrl(type, item.id)"
						class="rf-product-item"
						:hover-start-time="150"
					>
						<view class="rf-product-image-wrapper">
							<image :src="item.picture || productImg" mode="aspectFill" class="rf-product-img"/>
							<!--            <text class="sketch in1line">商品促销语{{ index + 1 }}</text>-->
						</view>
						<view class="rf-pro-content">
							<view class="wrapper">
								<block v-if="contentValue.toString().includes('title')">
									<view class="rf-pro-tit in2line">{{ item.name }}</view>
								</block>
<!--								<block v-if="contentValue.toString().includes('sub')">-->
<!--									<view class="rf-pro-tags in1line">-->
<!--										<block v-if="item.tags && item.tags.length > 0">-->
<!--											{{ item.tags.join(' | ') }}-->
<!--										</block>-->
<!--									</view>-->
<!--								</block>-->
							</view>
							<view class="rf-pro-price">
								<view>
									<text class="rf-sale-price font-base in1line" :class="'text-'+themeColor.name">
										<text class="symbol">{{ type | priceTitFilter }}{{ moneySymbol }}</text>
										<text class="font-base">{{ item | currentProductPrice(type) }}</text>
									</text>
									<view class="num in1line" v-if="contentValue.toString().includes('sales')">
										已销售{{ item.total_sales || 0 }}件
									</view>
								</view>
								<text v-if="type === 'product'" @tap.stop="toggleSpec(item)" class="iconfont icongouwuche3" :class="'text-' + themeColor.name"></text>
							</view>
						</view>
					</view>
					<!--商品列表-->
				</view>
			</view>
		</view>
		<view class="rf-product-list-container" v-if="showType === 'onePic'">
			<view class="rf-product-bargain" v-for="(item, index) in list" :key="index">
				<!--商品列表-->
				<view
					@tap="navToProductUrl(type, item.id)"
					class="rf-product-bargain-item"
					hover-class="hover"
					:hover-start-time="150"
				>
					<image mode="center" :src="item.picture || productImg" class="cover"/>
					<view class="title in2line" v-if="contentValue.toString().includes('title')">{{ item.name}}</view>
					<view class="rf-pro-tags in1line" v-if="contentValue.toString().includes('sub')">
						<block v-if="item.tags && item.tags.length > 0">
							{{ item.tags.join(' | ') }}
						</block>
						<view v-else class="in1line">
							<uni-tag v-if="type === 'wholesale'" class="tag" circle size="small" :text="`${item.discount && item.discount.num}人团`"></uni-tag>
							<uni-tag class="tag" v-if="item.commissionRate" inverted size="mini" text="分销"></uni-tag>
							<uni-tag class="tag" v-if="item.is_open_presell === '1'" inverted size="mini" text="预售"></uni-tag>
							<uni-tag class="tag" v-if="item.is_virtual === '1'" inverted size="mini" text="虚拟"></uni-tag>
							<uni-tag class="tag" v-if="item.shipping_type === '1'" inverted size="mini" text="包邮"></uni-tag>
						</view>
					</view>
					<view class="price-wrapper">
						<view class="rf-pro-price">
              <text class="rf-sale-price" :class="'text-' + themeColor.name">
								<text class="tit">{{ type | priceTitFilter }}</text>
								<text class="symbol">{{ moneySymbol }}</text>
								{{ item | currentProductPrice(type) }}
							</text>
							<text class="rf-factory-price" v-if="item.market_price > item.price && contentValue.toString().includes('marketPrice')">
								<text class="symbol">{{ moneySymbol }}</text>{{ item.market_price }}</text>
							<view class="num in1line" v-if="contentValue.toString().includes('sales')">
								已销售{{ item.total_sales || 0 }}件
							</view>
						</view>
						<button class="btn" :class="'bg-' + themeColor.name">
							{{ type | handleTypeToDesc }}
						</button>
					</view>
				</view>
				<!--商品列表-->
			</view>
		</view>
		<view class="rf-product-list-container" v-if="showType === 'slide'">
			<scroll-view scroll-x class="rf-product-presale">
				<view class="rf-product-presale-item" v-for="(item, index) in list" :key="index" @tap="navToProductUrl(type, item.id)">
					<image :src="item.picture || productImg" class="cover"/>
					<view class="num in1line" v-if="contentValue.toString().includes('sales')" :class="'bg-' + themeColor.name">
						已销售{{ item.total_sales || 0 }}件
					</view>
					<block v-if="contentValue.toString().includes('title')">
						<view class="rf-pro-tit in2line font-sm">{{ item.name }}</view>
					</block>
<!--					<block v-if="contentValue.toString().includes('sub')">-->
<!--						<view class="rf-pro-tags in1line">-->
<!--							<block v-if="item.tags && item.tags.length > 0">-->
<!--								{{ item.tags.join(' | ') }}-->
<!--							</block>-->
<!--							<view v-else class="in1line">-->
<!--								<uni-tag class="tag" v-if="item.commissionRate" inverted size="mini" text="分销"></uni-tag>-->
<!--								<uni-tag class="tag" v-if="item.is_open_presell === '1'" inverted size="mini" text="预售"></uni-tag>-->
<!--								<uni-tag class="tag" v-if="item.is_virtual === '1'" inverted size="mini" text="虚拟"></uni-tag>-->
<!--								<uni-tag class="tag" v-if="item.shipping_type === '1'" inverted size="mini" text="包邮"></uni-tag>-->
<!--							</view>-->
<!--						</view>-->
<!--					</block>-->
					<view class="rf-pro-price">
						<view class="rf-sale-price font-sm in1line" :class="'text-'+themeColor.name">
							{{ moneySymbol }}{{ item | currentProductPrice(type) }}
						</view>
						<text v-if="type === 'product'" @tap.stop="toggleSpec(item)" class="iconfont icongouwuche3" :class="'text-' + themeColor.name"></text>
					</view>
				</view>
			</scroll-view>
		</view>
		<!-- 规格-模态层弹窗 -->
		<view
			class="popup spec show"
			v-if="specClass === 'show'"
			@touchmove.stop.prevent="stopPrevent"
			@tap="hideSpec"
		>
			<!-- 遮罩层 -->
			<view class="mask" @tap="hideSpec"></view>
			<view class="layer" :style="{bottom: bottom ? `${bottom}rpx` : 0}" @tap.stop="stopPrevent">
				<rf-attr-content
					:product="productDetail"
					@toggle="toggleSpec"
					:showBuyBtn="true"
				></rf-attr-content>
			</view>
		</view>
	</view>
</template>
<script>
/**
 * @des 商品列表
 *
 * @author stav stavyan@qq.com
 * @date 2020-05-15 10:49
 */
import { productDetail, cartItemCount, cartItemCreate } from '@/api/product';
import rfAttrContent from '@/components/rf-attr-content';
import $mAssetsPath from '@/config/assets.config';
import { mapMutations } from 'vuex';

export default {
	name: 'rfProductList',
	props: {
		list: {
			type: Array,
			default() {
				return [];
			}
		},
		contentValue: {
			type: Array,
			default() {
				return [];
			}
		},
		// 显示类型
		showType: {
			type: String,
			default: 'oneLine'
		},
		// 商品类型
		type: {
			type: String,
			default: ''
		},
		// 是否以列表展示 | 列表或大图
		bottom: {
			type: Number,
			default: 0
		}
	},
	components: {
		rfAttrContent
	},
	data() {
		return {
			specClass: 'none',
			moneySymbol: this.moneySymbol,
			productImg: this.$mAssetsPath.defaultImg,
			productDetail: {}
		};
	},
	filters: {
		filterTotalSales(val) {
			if (val > 10000) {
				val = `${(val / 10000).toFixed(2)}w`;
			}
			return val;
		},
		filterTagName(val) {
			if (val.commissionRate) {
				// 分销商品
				return $mAssetsPath.distribution;
			}
			if (val.is_open_presell === '1') {
				// 预售商品
				return $mAssetsPath.presale;
			}
			if (val.is_virtual === '1') {
				// 虚拟产品
				return $mAssetsPath.virtual;
			}
			if (val.shipping_type === '1') {
				// 包邮产品
				return $mAssetsPath.pinkage;
			}
		},
		filterTagNameStr(val) {
			if (val.commissionRate) {
				// 分销商品
				return '分销';
			} else if (val.is_open_presell === '1') {
				// 预售商品
				return '预售';
			} else if (val.is_virtual === '1') {
				// 虚拟产品
				return '虚拟';
			} else if (val.shipping_type === '1') {
				// 包邮产品
				return '包邮';
			}
		},
		currentProductPrice (item, type) {
			let price;
			switch (type) {
				case 'product':
					price = item.price;
					break;
				case 'bargain':
					price = parseFloat(item.price * item.bargain.min_rate / 100);
					break;
				case 'wholesale':
					price = item.wholesale_price;
					break;
				case 'presale':
					price = item.price;
					break;
				case 'group':
					price = item.group_buy && item.group_buy.ladder.price;
					break;
				case 'discount':
					// eslint-disable-next-line no-case-declarations
					let decimal = item.discount && item.discount.decimal_reservation_number;
					// eslint-disable-next-line no-case-declarations
					let discount = item.discount && item.discount.discount;
					price = item.price;
					switch (parseInt(decimal, 10)) {
						case -1:
							price = (price * discount / 100).toFixed(2);
							break;
						case 0:
							price = (price * discount / 100).toFixed(0);
							break;
						case 1:
							price = (price * discount / 100).toFixed(1);
							break;
						default:
							price = (price * discount / 100).toFixed(2);
							break;
					}
					break;
				default:
					price = item.price;
					break;
			}
			return parseFloat(price || '0').toFixed(2);
		},
		priceTitFilter (type) {
			let str = '';
			switch (type) {
				case 'product':
					// str = '促销价';
					break;
				case 'bargain':
					// str = '底价';
					break;
				case 'wholesale':
					// str = '拼团价';
					break;
				case 'presale':
					str = '';
					break;
				case 'group':
					// str = '团购价';
					break;
				case 'discount':
					// str = '秒杀价';
					break;
				case 'hot':
					// str = '抢先价';
					break;
				default:
					// str = '促销价';
					break;
			}
			return str;
		},
		handleTypeToDesc (type) {
			let str = '查看详情';
			switch (type) {
				case 'product':
					str = '查看详情';
					break;
				case 'bargain':
					str = '立即砍价';
					break;
				case 'wholesale':
					str = '立即拼团';
					break;
				case 'presale':
					str = '立即预定';
					break;
				case 'group':
					str = '立即抢购';
					break;
				case 'discount':
					str = '立即秒杀';
					break;
				default:
					str = '查看详情';
					break;
			}
			return str;
		}
	},
	methods: {
		...mapMutations(['setCartNum']),
		// 跳转详情
		navTo(route) {
			this.$mRouter.push({ route });
		},
		navToProductUrl(type, id) {
			let url;
			switch (type) {
				case 'product':
					url = `/pages/product/product?id=${id}`;
					break;
				case 'bargain':
					url = `/pages/marketing/bargain/product?id=${id}`;
					break;
				case 'wholesale':
					url = `/pages/marketing/wholesale/product?id=${id}`;
					break;
				case 'presale':
					url = `/pages/product/product?id=${id}`;
					break;
				case 'group':
					url = `/pages/marketing/group/product?id=${id}`;
					break;
				case 'discount':
					url = `/pages/marketing/discount/product?id=${id}`;
					break;
				case 'hot':
					url = `/pages/product/product?id=${id}`;
					break;
				default:
					url = `/pages/product/product?id=${id}`;
					break;
			}
			if (url) this.navTo(url);
		},
		// 获取产品详情
		async getProductDetail(row) {
			await this.$http
				.get(`${productDetail}`, {
					id: row.id
				})
				.then(async r => {
					this.productDetail = await r.data;
					this.productDetail.sku_name = row.sku_name;
					this.specClass = 'show';
				});
		},
		// 规格弹窗开关
		toggleSpec(row) {
			if (parseInt(row.status, 10) === 0) return;
			if (this.specClass === 'show') {
				this.specClass = 'hide';
				if (row.stock === 0) {
					this.$mHelper.toast('库存不足');
					return;
				}
				if (row.type.toString() === '1') {
					// 加入购物车
					this.handleCartItemCreate(row.skuId, row.cartCount);
				} else if (row.type.toString() === '2') {
					// 立即购买
					const list = {};
					const data = {};
					data.sku_id = row.skuId;
					data.num = row.cartCount;
					if (
						this.productDetail.point_exchange_type.toString() === '2' ||
						this.productDetail.point_exchange_type.toString() === '4' ||
						(this.productDetail.point_exchange_type.toString() === '3' &&
							this.isPointExchange)
					) {
						list.type = 'point_exchange';
					} else {
						list.type = 'buy_now';
					}
					list.data = JSON.stringify(data);
					this.navTo(`/pages/order/create/order?data=${JSON.stringify(list)}`);
				}
				setTimeout(() => {
					this.specClass = 'none';
				}, 250);
			} else if (this.specClass === 'none') {
				this.getProductDetail(row);
			}
		},
		stopPrevent() {
		},
		hideSpec() {
			this.specClass = 'hide';
			setTimeout(() => {
				this.specClass = 'none';
			}, 250);
		},
		// 添加商品至购物车
		async handleCartItemCreate(skuId, cartCount) {
			await this.$http
				.post(`${cartItemCreate}`, {
					sku_id: skuId,
					num: cartCount
				})
				.then(async () => {
					this.$emit('cart');
					await this.$http.get(`${cartItemCount}`).then(async r => {
						this.setCartNum(r.data);
					});
					this.$mHelper.toast('添加购物车成功');
				});
		}
	}
};
</script>
<style lang="scss" scoped>
.rf-home-product-list {
	border-radius: 12rpx;
	.btn {
		min-width: 150rpx;
		height: 50rpx;
		line-height: 50rpx;
		border-radius: 50rpx;
		font-size: $font-sm;
	}
	.tag {
		height: 32rpx;
		margin-right: $spacing-sm;
		font-size: $font-sm;
	}
	.rf-product-list-container {
		padding-bottom: $spacing-sm / 2 !important;
		flex: 1;
		margin-right: 8rpx;
		background-color: $page-color-light;
	}

	.rf-product-list-container:last-child {
		margin-right: 0;
	}

	.rf-product-item {
		width: 100%;
		box-sizing: border-box;
		background-color: $color-white;
		line-height: 1;
		overflow: hidden;
		border-radius: 6rpx;
		transition: all 0.15s ease-in-out;
	}

	.rf-product-list-item {
		width: 48%;
	}

	.rf-product-flex-list {
		display: flex;
	}

	.rf-product-image-wrapper {
		overflow: hidden;
		position: relative;
		min-width: 225rpx;
		.rf-product-img {
			width: 100%;
			height: 300rpx !important;
			display: block;
			border-radius: 12rpx
		}

		.rf-product-list-img {
			width: 215rpx;
			height: 215rpx !important;
			display: block;
			flex-shrink: 0;
			border-radius: 12rpx;
		}

		.sketch {
			width: 100%;
			background-color: rgba(0, 0, 0, 0.4);
			position: absolute;
			bottom: 0;
			padding: 0 15rpx;
			right: 0;
			color: $color-white;
		}

		.triangle-wrapper {
			position: absolute;
			overflow: hidden;
			top: 0;
			left: 0;

			.triangle-tag {
				width: 64rpx;
				height: 64rpx;
			}
		}
	}

	.rf-pro-content {
		flex: 1;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		box-sizing: border-box;
		padding: $spacing-sm 0 $spacing-sm $spacing-sm;
		//.wrapper {
		//	height: 120rpx;
		//}
		.rf-pro-tit {
			font-weight: 400;
			line-height: 30rpx;
			height: 60rpx;
			word-break: break-all;
			margin-bottom: $spacing-sm;
		}
		.rf-pro-tags {
			font-size: $font-sm;
			color: $font-color-light;
		}
		.rf-sub-tit {
			color: $font-color-light;
			font-size: $font-sm;
			margin-top: $spacing-sm;
		}
		.rf-pro-price {
			display: flex;
			justify-content: space-between;
			align-items: flex-end;
			.rf-price-wrapper {
				flex: 1;
			}
			.num {
				font-size: $font-sm;
				color: $font-color-light;
				line-height: 1;
			}
			.symbol {
				font-size: $font-sm;
			}
			.rf-sale-price {
				font-size: $font-lg;
				font-weight: 500;
				padding-right: $spacing-sm;
			}
			.rf-factory-price {
				color: $font-color-light;
				font-size: $font-sm;
				text-decoration: line-through;
			}
			.iconfont {
				font-size: 40rpx;
				font-weight: 500;
				padding-right: $spacing-base;
			}
		}
	}

	.one {
		background-color: $color-white;
		padding: 0 $spacing-base;
		width: 100%;
		.rf-product-flex-list {
			margin-bottom: $spacing-sm !important;
		}
	}

	.two {
		background-color: $color-white;
		padding: 0 $spacing-base;
		width: 100%;
		.rf-product-item {
			margin-bottom: $spacing-sm !important;
		}
		.rf-pro-tit {
			line-height: 30rpx;
			height: 60rpx;
		}
		.rf-home-product-list-item {
			overflow: hidden;
			width: 100%;
			//width: calc(50% - 10rpx);
			//display: inline-block;
			//vertical-align: top;
			break-inside: avoid;
			.rf-product-image-wrapper {
				width: 100%
			}
		}
		.rf-home-product-list-item:nth-of-type(odd) {
			margin-right: $spacing-sm;
		}
	}
	.three {
		background-color: $color-white;
		padding: 0 $spacing-base;
		.wrapper {
			.font-base {
				font-size: $font-base;
			}
			.rf-pro-tit {
				line-height: 32rpx;
				height: 64rpx;
			}
			.rf-pro-tags {
				height: 40rpx;
				font-size: $font-sm;
				color: $font-color-light;
			}
		}
		.rf-product-list-img {
			width: 100%;
		}
		.rf-product-img {
			width: 100%;
			height: 220rpx !important;
			border-radius: 12rpx
		}
		.rf-home-product-list-item {
			width: calc(33% - 6rpx);
			display: inline-block;
			margin-bottom: $spacing-sm !important;
			margin-right: $spacing-sm;
			.rf-product-image-wrapper {
				width: 100%
			}
		}
		.rf-home-product-list-item:nth-child(3n+3) {
			margin-right: 0;
		}
		.iconfont {
			font-size: $font-sm;
		}
	}
	.font-sm {
		font-size: $font-sm;
	}
	.font-base {
		font-size: $font-base;
	}
}
.bargain {
	width: 100%;
	.bottom {
		width: 100%;
		display: flex;
		justify-content: space-between;
		align-items: flex-end;
		.rf-sale-price {
			flex: 1;
		}
	}

	.rf-factory-price {

		margin-top: 4px;
		display: flex;
		align-items: flex-end;
	}

	.symbol {
		font-size: 10px;
		font-weight: 400;
	}

}
.rf-product-bargain {

	.rf-product-bargain-item {
		width: 100%;
		background-color: $color-white;
		margin-bottom: 5px;
		padding-bottom: 10px;
		border-radius: 6px;
		.tag {
			margin-left: 10rpx;
		}
		.cover {

			display: block;
			width: 100%;
			height: 160px;
			margin-bottom: 10px;
			border-top-left-radius: 6px;
			border-top-right-radius: 6px;
		}

		.title {
			color: #333;
			padding: 0 10px;
			margin-bottom: 8px;
		}
		.rf-pro-tags {
			color: $font-color-light;
			padding: 0 10px;
		}

		.price-wrapper {
			display: flex;
			justify-content: space-between;
			align-items: flex-end;
			padding: 0 $spacing-base;
			.tit {
				font-size: $font-sm;
			}

			.symbol {
				font-size: $font-sm;
			}

			.rf-pro-price {
				flex: 1;
				.num {
					font-size: $font-sm;
					color: $font-color-light;
				}
			}
			.rf-sale-price {
				font-size: $font-lg;
			}

			.rf-factory-price {
				margin-left: $spacing-sm;
				font-size: $font-sm;
				text-decoration: line-through;
				color: $font-color-light;
			}
		}
	}
}
.rf-product-presale {
	padding: 0 $spacing-base;
	width: 100%;
	display: flex;
	background-color: $color-white;
	border-radius: 16rpx;
	white-space: nowrap;
	.rf-product-presale-item {
		display: inline-block;
		margin: 0 $spacing-base $spacing-sm 0;
		width: 180rpx;
		position: relative;
		.cover {
			width: 180rpx !important;
			height: 180rpx;
			background: #e6e6e6;
			border-radius: 8rpx;
			margin-right: $spacing-sm;
		}

		.rf-pro-tit {
			white-space: normal;
			line-height: 30rpx;
			height: 60rpx;
		}
		.rf-pro-tags {
			height: 40rpx;
			white-space: normal;
			font-size: $font-sm;
			color: $font-color-light;
		}
		.num {
			padding: 0 $spacing-sm;
			height: 32rpx;
			line-height: 32rpx;
			font-size: $font-sm;
			border-radius: 0 16rpx 16rpx 0;
			position: absolute;
			top: 148rpx;
		}
		.rf-pro-price {
			display: flex;
			justify-content: space-between;
			align-items: flex-end;
			.tit {
				font-size: $font-sm;
			}
			.symbol {
				font-size: $font-sm;
			}
			.rf-sale-price {
				white-space: normal;
			}
			.rf-factory-price {
				margin-left: $spacing-sm;
				font-size: $font-sm;
				text-decoration: line-through;
			}
		}
	}
}
.btn::after {
	border: none !important;
}
</style>
