<template>
  <view class="rf-product-detail">
		<!--顶部返回按钮-->
		<!--#ifdef MP-WEIXIN-->
		<text class="back-btn iconfont iconzuo" @tap="navBack"></text>
		<!--#endif-->
		<!--header-->
		<view class="detail" v-if="product.name">
			<!--顶部商品轮播图-->
			<view class="carousel">
				<view class="video-wrapper" v-if="product.video_url">
					<video :poster="product.covers[0]" object-fit="contain" :src="product.video_url">
					</video>
				</view>
				<swiper indicator-dots circular="true" duration="400" controls touchable v-else>
					<swiper-item
						class="swiper-item"
						v-for="(item, index) in product.covers"
						:key="index"
					>
						<view class="image-wrapper">
							<image :src="item" class="loaded" mode="aspectFill"></image>
						</view>
						<uni-tag class="content" circle size="small" :text="`${index + 1}  / ${product.covers.length}`"></uni-tag>
					</swiper-item>
				</swiper>
<!--				<view class="carousel-tab" v-if="product.video_url">-->
<!--					<view class="carousel-tab-item" @tap.stop="handleCarouselTabClick('1')" :class="carouselTabActive === '1' ? 'bg-' + themeColor.name : 'normal text-' + themeColor.name">图片</view>-->
<!--					<view class="carousel-tab-item" @tap.stop="handleCarouselTabClick('2')" :class="carouselTabActive === '2' ? 'bg-' + themeColor.name : 'normal text-' + themeColor.name">视频</view>-->
<!--				</view>-->
			</view>
			<!--商品信息-->
			<view class="introduce-section">
				<view
					class="price-block price-block-mt"
					:style="{height: product.video_url ? '150rpx' : '140rpx' }"
					v-if="type !== 'buy_now' || product.is_open_presell === '1'"
					:class="'bg-' + themeColor.name"
				>
					<view class="bg2"></view>
					<image class="bg" :src="type | marketingTagFilter" :style="{
						right: type === 'bargain' ? '-100rpx' : 0,
						height: (type === 'discount' || product.is_open_presell === '1') ? '128rpx' : '100%',
						height: (type === 'wholesale' || type === 'group_buy') ? '180rpx' : '200rpx',
						width: (type === 'group_buy') ? '120rpx' : '200rpx',
					}"></image>
					<view class="wrapper" :style="{marginTop: product.video_url ? '14rpx' : 0 }">
						<view class="price-wrapper">
							<view
								class="price-box point-box"
								v-if="product.point_exchange_type == 4"
							>
								该商品仅需
								<text class="price">{{ product.point_exchange }} 积分</text>
							</view>
							<view class="price-box" v-else>
								<view class="price-first-line">
									<image
										class="member-level"
										mode="aspectFit"
										v-if="product.memberDiscount != [] && product.memberDiscount && product.memberDiscount.discount > 0 && userInfo"
										:src="vipPrice">
									</image>
									<text class="price" :style="{fontSize: currentProductPrice.length > 6 ? '30rpx' : '34rpx'}">
										<text class="symbol">{{ moneySymbol }}</text>{{ currentProductPrice }}
										
									</text>
									<view class="m-price-wrapper" v-if="product.market_price > product.price">
									<text class="m-price-wrapper" style="margin: 10rpx auto;">原价<text class="symbol">{{ moneySymbol }}</text>{{ product.market_price }}</text>
								    </view>
									<view class="product-tag">
										<uni-tag
											v-if="product.is_virtual == 1"
											class="tag"
											type="base"
											text="虚拟物品"
											size="small"
										/>
										<uni-tag
											round
											v-if="product.is_open_presell === '1'"
											class="tag"
											type="base"
											text="预售价"
											size="small"
										/>
										<!--										<uni-tag-->
										<!--											round-->
										<!--											v-if="type === 'group_buy'"-->
										<!--											class="tag"-->
										<!--											type="base"-->
										<!--											text="团购价"-->
										<!--											size="small"-->
										<!--										/>-->
										<uni-tag
											round
											v-if="type === 'discount'"
											class="tag"
											type="base"
											text="限时折扣"
											size="small"
										/>
										<uni-tag
											round
											v-if="type === 'bargain'"
											class="tag"
											type="base"
											text="底价"
											size="small"
										/>
										<uni-tag
											round
											v-if="type === 'wholesale'"
											class="tag"
											type="base"
											text="拼团价"
											size="small"
										/>

										<uni-tag
											v-if="product.marketing && product.marketing.max_num && type === 'group_buy'"
											class="tag"
											type="base"
											:text="`${product.marketing && product.marketing.min_num}起购 限购${product.marketing && product.marketing.max_num}`"
											size="small"
										/>
										<uni-tag
											v-if="type === 'wholesale'"
											class="tag"
											type="base"
											:text="product.marketing.num + '人团'"
											size="small"
										/>
									</view>
								</view>
								
							</view>
						</view>
						<view class="rf-time-down" v-if="type === 'group_buy' || type === 'bargain' || type === 'discount'">
							<rf-count-down
								v-if="
								bargainSecondFlag(product.marketing && product.marketing.start_time, product.marketing && product.marketing.end_time) && (bargainSecond(product.marketing && product.marketing.start_time, product.marketing && product.marketing.end_time) > 0)"
								splitor-color="#fff"
								font-size="28rpx"
								:show-day="true"
								:tip="bargainSecondFlag(product.marketing && product.marketing.start_time, product.marketing && product.marketing.end_time)"
								:second="bargainSecond(product.marketing && product.marketing.start_time, product.marketing && product.marketing.end_time)"
								@timeup="bargainTimeUp(product.marketing && product.marketing.start_time, product.marketing && product.marketing.end_time)"
								color="#FFFFFF"
								:background-color="themeColor.color"
								:border-color="themeColor.color"
							/>
							<text v-else>活动已结束</text>
						</view>
					</view>
				</view>
				<view v-else class="price-block">
					<view class="price-wrapper price-wrapper-pd">
						<view
							class="price-box point-box"
							v-if="product.point_exchange_type == 4"
						>
							该商品仅需
							<text class="price">{{ product.point_exchange }} 积分</text>
						</view>
						<view class="price-box" v-else :style="{marginTop: product.video_url ? '10rpx' : 0 }">
							<view class="price-first-line">
								<image
									class="member-level"
									mode="aspectFit"
									v-if="product.memberDiscount != [] && product.memberDiscount && product.memberDiscount.discount > 0 && userInfo"
									:src="vipPrice">
								</image>
								<text class="price" :style="{fontSize: currentProductPrice.length > 7 ? '30rpx' : '34rpx'}" :class="'text-' + themeColor.name"><text class="symbol">{{ moneySymbol }}</text>{{ currentProductPrice }}</text>
								<view class="product-tag">
									<!-- <uni-tag
										v-if="product.is_virtual == 1"
										class="tag"
										type="base"
										text="虚拟物品"
										size="small"
									/> -->
									<uni-tag
										round
										v-if="product.is_open_presell === '1'"
										class="tag"
										type="base"
										text="预售价"
										size="small"
									/>
									<!--									<uni-tag-->
									<!--										round-->
									<!--										v-if="type === 'group_buy'"-->
									<!--										class="tag"-->
									<!--										type="base"-->
									<!--										text="团购价"-->
									<!--										size="small"-->
									<!--									/>-->
									<uni-tag
										round
										v-if="type === 'discount'"
										class="tag"
										type="base"
										text="限时折扣"
										size="small"
									/>
									<uni-tag
										round
										v-if="type === 'bargain'"
										class="tag"
										type="base"
										text="底价"
										size="small"
									/>
									<uni-tag
										round
										v-if="type === 'wholesale'"
										class="tag"
										type="base"
										text="拼团价"
										size="small"
									/>
									<uni-tag
										v-if="product.marketing && product.marketing.max_num && type === 'group_buy'"
										class="tag"
										type="base"
										:text="`${product.marketing && product.marketing.min_num}起购 限购${product.marketing && product.marketing.max_num}`"
										size="small"
									/>
									<uni-tag
										v-if="type === 'wholesale'"
										class="tag"
										type="base"
										:text="product.marketing.num + '人团'"
										size="small"
									/>
								</view>
							</view>
							<!-- <view class="m-price-wrapper" v-if="product.market_price > product.price">
								<text class="m-price">原价<text class="symbol">{{ moneySymbol }}</text>{{ product.market_price }}</text>
							</view> -->
						</view>
					</view>
				</view>
				<view class="product-info-wrapper">
					<view class="title">
						<text>{{ product.name }}</text>
						<text class="sketch">{{ product.sketch }}</text>
					</view>
					<view class="btn-tag">
						<view class="btn-tag-item" @tap="openPoster">
							<text class="iconfont icontupian1" :class="'text-' + themeColor.name"></text>
							<text>生成海报</text>
						</view>
						<view class="btn-tag-item" @tap="toFavorite">
							<text class="iconfont" :class="[ favorite ? `text-${themeColor.name} iconshoucang6` : `text-${themeColor.name} iconshoucang5`]"></text>
							<text>收藏</text>
						</view>
						<view class="btn-tag-item share">
							<button class="share-btn" open-type="share" @tap.stop="share()">
								<text class="iconfont iconfenxiang-copy" :class="'text-' + themeColor.name"></text>
								<text>分享</text>
							</button>
						</view>
					</view>
				</view>
				<!-- <view class="data" v-if="product">
					<text class="item">快递: {{ product.shipping_type === '1' ? '包邮' : '买家自付' }}</text>
					<text class="item-fill in1line">{{ product.address_name }}</text>
					<text class="item">月销 {{ product.total_sales }}</text>
				</view> -->
			</view>
			<block v-if="type === 'wholesale'">
				<!--拼团公告-->
				<rf-swiper-slide @navTo="navTo(`/pages/marketing/wholesale/group?id=${product.id}&state=2`)" class="rf-swiper-slide" :list="wholesaleSuccess && wholesaleSuccess.list" v-if="wholesaleSuccess && wholesaleSuccess.list.length > 0">
					<view slot="header">
						<text class="iconfont iconSoundFilled" :class="'text-' + themeColor.name"></text>
						<text class="label" :class="'text-' + themeColor.name"
							>成功拼团 {{ wholesaleSuccess.total }} 次</text
						>
					</view>
				</rf-swiper-slide>
				<!--正在拼团-->
				<view class="play-way" v-if="wholesaleOn && wholesaleOn.list.length > 0">
					<view class="title" @tap="navTo(`/pages/marketing/wholesale/group?id=${product.id}&state=1`)">
						<text>{{ wholesaleOn.total }}个人在拼团，可直接参与</text>
						<view class="arrow"
							>查看全部 <text class="iconfont iconyou"></text
						></view>
					</view>
					<view class="assemble">
						<view
							class="assemble-item"
							v-for="(item, index) in wholesaleOnList"
							:key="index"
						>
							<view class="pictxt">
								<view class="picture">
									<image
										mode="aspectFill"
										:src="item.member_head_portrait || headImg"
										class="image"
									/>
									<view
										class="text in1line"
										v-text="item.member_nickname || '匿名用户'"
									></view>
								</view>
								<view class="right">
									<view class="time-wrapper">
										<view class="lack">
											还差<text
												class="font-color-red"
												:class="'text-' + themeColor.name"
												v-text="item.total_number - item.number"
											></text
											>人成团
										</view>
										<rf-count-down
											:show-day="false"
											:second="second(item.end_time)"
											color="#FFFFFF"
											:background-color="themeColor.color"
											:border-color="themeColor.color"
										/>
									</view>
									<!--<view class="spellBnt" @click="addCart('buy', item.id)">-->
									<text class="spellBnt" :class="'bg-' + themeColor.name" @tap="showWholesaleOn(item.id)">
										去拼团
									</text>
								</view>
							</view>
						</view>
					</view>
				</view>
				<!--拼团玩法-->
				<view class="play-way">
					<view class="title acea-row row-between-wrapper">
						<view>拼团玩法</view>
					</view>
					<view class="way">
						<view class="item"><text class="num">①</text>开团/参团</view>
						<view class="arrow"><text class="iconfont iconforward"></text></view>
						<view class="item"><text class="num">②</text>邀请好友</view>
						<view class="arrow"><text class="iconfont iconforward"></text></view>
						<view class="item">
							<view><text class="num">③</text>满员发货</view>
						</view>
					</view>
				</view>
			</block>
			<!--商品参数-->
			<view class="c-list">
				<!--商品库存-->
				<rf-item-popup
					title="商品库存"
					v-if="parseInt(product.is_stock_visible, 10) == 1"
					:isEmpty="parseInt(currentStock, 10) === 0"
					empty="库存不足"
				>
					<view slot="content">
						{{ currentStock || product.stock || 0 }} {{ product.unit || '件' }}
					</view>
				</rf-item-popup>
				<!--满减送-->
				<rf-item-popup
					v-if="product.fullGiveRule.length > 0"
					title="满减送"
					@hide="hideService"
					@show="
						showPopupService(
							'fullGiveClass',
							product.fullGiveRule
						)
					"
					:specClass="fullGiveClass"
				>
					<view slot="content" class="con-list">
						<text :class="'text-' + themeColor.name">{{ product.fullGiveRule[0] }}</text>
					</view>
					<view slot="right" v-if="product.fullGiveRule.length > 0"
						><text class="iconfont iconyou"></text
					></view>
					<view slot="popup" class="service">
						<view class="content">
							<view
								class="row"
								v-for="(item, index) in product.fullGiveRule"
								:key="index"
							>
								<text>{{ item }}</text>
							</view>
						</view>
						<button class="btn" :class="'bg-' + themeColor.name" @tap="hideService">完成</button>
					</view>
				</rf-item-popup>
				<!--满包邮-->
				<rf-item-popup
					v-if="product.fullMail && product.fullMail.is_open === '1' && product.shipping_type !== '1'"
					title="满包邮"
				>
					<view slot="content" :class="'text-' + themeColor.name">满{{ product.fullMail.full_mail_money }}元包邮</view>
				</rf-item-popup>
				<!--购买类型-->
				<rf-item-popup
					title="购买类型"
					@hide="hideService"
					:specClass="specClass"
					@show="toggleSpec"
				>
					<view slot="content">
						<text class="selected-text" v-if="currentSkuName === singleSkuText">{{ currentCartCount }} {{ product.unit || '件' }}</text>
						<text class="selected-text" v-else-if="currentSkuName">{{ currentSkuName }} * {{ currentCartCount }}</text>
						<text class="selected-text" v-else>请选择规格</text>
					</view>
					<view slot="right"><text class="iconfont iconyou"></text></view>
					<view slot="popup" @click.stop="stopPrevent">
						<rf-attr-content
							:type="type"
							:product="product"
							:minNum="minNum"
							:maxNum="maxNum"
							@toggle="toggleSpec"
							></rf-attr-content>
					</view>
				</rf-item-popup>
				<!--优惠券-->
				<rf-item-popup
					title="优惠券"
					@hide="hideService"
					:specClass="couponClass"
					@show="showPopupService('couponClass', product.canReceiveCoupon)"
					:isEmpty="product.canReceiveCoupon.length === 0"
					empty="暂无可领取优惠券"
				>
					<view slot="content">
						<text class="con t-r">领取优惠券</text>
					</view>
					<view slot="right" v-if="product.canReceiveCoupon.length > 0"><text class="iconfont iconyou"></text></view>
					<view slot="popup" class="service">
						<!-- 优惠券列表 -->
						<scroll-view scroll-y style="max-height: 800rpx;" class="sub-list">
							<view
								class="row"
								v-for="(item, index) in product.canReceiveCoupon"
								:key="index"
								@tap.stop="getCoupon(item)"
							>
								<view class="carrier" :class="item.is_get === 0 ? 'rf-opacity' : ''">
									<view class="title">
										<view>
											<text class="cell-icon" :class="'bg-' + themeColor.name">{{
												parseInt(item.range_type, 10) === 2 ? '限' : '全'
											}}</text>
											<text class="cell-title">{{ item.title }}</text>
										</view>
										<view :class="'text-' + themeColor.name">
											<text class="price" v-if="item.type === '1'">{{ moneySymbol }}{{ item.money }}</text>
											<text class="price-discount" v-else>{{ `${item.discount / 10}折` }}</text>
										</view>
									</view>
									<view class="term">
										<text v-if="item.term_of_validity_type === '1'">领取之日起{{ item.fixed_term }}天内有效</text>
										<text v-else-if="item.start_time === item.end_time">限{{ item.start_time | dayTime }}当日使用</text>
										<text v-else>使用时间：{{ item.start_time | dayTime }} - {{ item.end_time | dayTime }}</text>
										<text class="at_least">满{{ item.at_least }}可用</text>
									</view>
									<view class="usage">
										<text>
											{{
												parseInt(item.range_type, 10) === 2
													? '部分产品使用'
													: '全场产品使用'
											}}
										</text>
										<view>
											{{
												parseInt(item.max_fetch, 10) === 0
													? '不限'
													: `每人限领${item.max_fetch}`
											}}
											已领{{ item.get_count }}
											<text class="last" v-if="item.percentage"
												>剩余{{ item.percentage }}%</text
											>
										</view>
									</view>
								</view>
							</view>
						</scroll-view>
					</view>
				</rf-item-popup>
				<!--限购说明-->
				<rf-item-popup title="限购说明" v-if="type === 'buy_now' && parseInt(product.max_buy, 10) > 0">
					<view slot="content">
						<text>{{ `${product.max_buy} ${product.unit || '件'}` }}</text>
					</view>
				</rf-item-popup>
				<!--积分活动-->
				<rf-item-popup title="积分活动" v-if="parseInt(product.give_point, 10) > 0 || product.point_exchange != 0">
					<view slot="content" class="con-list">
						<text v-if="product.point_exchange_type > 1">兑换类型: {{ product.point_exchange_type | pointExchangeTypeFilter }}</text>
<!--						<text v-if="parseInt(product.give_point, 10) > 0">赠送类型: {{ product.integral_give_type | integralGiveTypeFilter }}</text>-->
						<text v-if="parseInt(product.give_point, 10) > 0">下单可获得: {{ product | givePointFilter }}积分</text>
						<text v-if="product.point_exchange != 0">兑换所需积分: {{ product.point_exchange }}</text>
						<text v-if="product.max_use_point != 0">可使用抵扣积分: {{ product.max_use_point }}</text>
						<text
							class="buy-now"
							@tap="addCart('buy', true)"
							v-if="product.point_exchange_type == 3"
							>积分兑换 >>
						</text>
					</view>
				</rf-item-popup>
				<!--服务-->
				<rf-item-popup
					v-if="product.tags.length > 0"
					title="服务"
					@hide="hideService"
					@show="showPopupService('serviceClass', product.tags)"
					:specClass="serviceClass"
				>
					<view slot="content">
						<text>{{ product.tags[0] }}</text>
					</view>
					<view slot="right" v-if="product.tags.length > 0"
						><text class="iconfont iconyou"></text
					></view>
					<view slot="popup" class="service">
						<view class="content">
							<view
								class="row"
								v-for="(item, index) in product.tags"
								:key="index"
							>
								<view class="description">{{ item }}</view>
							</view>
						</view>
						<button class="btn" :class="'bg-' + themeColor.name" @tap="hideService">完成</button>
					</view>
				</rf-item-popup>
				<!--阶梯优惠-->
				<rf-item-popup
					title="阶梯优惠"
					@hide="hideService"
					@show="
						showPopupService(
							'ladderPreferentialClass',
							product.ladderPreferential
						)
					"
					:specClass="ladderPreferentialClass"
					v-if="product.ladderPreferential.length > 0"
				>
					<view slot="content" class="con-list">
						<text>
							满{{
								product.ladderPreferential &&
									product.ladderPreferential[0] &&
									product.ladderPreferential[0].quantity
							}}{{ product.unit || '件' }}
							<text
								v-if="
									parseInt(
										product.ladderPreferential &&
											product.ladderPreferential[0] &&
											product.ladderPreferential[0].type,
										10
									) === 1
								"
							>
								每{{ product.unit || '件' }}减{{
									product.ladderPreferential &&
										product.ladderPreferential[0] &&
										product.ladderPreferential[0].price
								}}元</text
							>
							<text
								v-if="
									parseInt(
										product.ladderPreferential &&
											product.ladderPreferential[0] &&
											product.ladderPreferential[0].type,
										10
									) === 2
								"
							>
								每{{ product.unit || '件' }}{{
									parseInt(
										product.ladderPreferential &&
											product.ladderPreferential[0] &&
											product.ladderPreferential[0].price,
										10
									)
								}}折</text
							>
						</text>
					</view>
					<view slot="right" v-if="product.ladderPreferential.length > 0"
						><text class="iconfont iconyou"></text
					></view>
					<view slot="popup" class="service">
						<view class="content">
							<view
								class="row"
								v-for="(item, index) in product.ladderPreferential"
								:key="index"
							>
								<view class="title"
									>满{{ item.quantity }}{{ product.unit || '件' }}
									<text v-if="parseInt(item.type, 10) === 1"
										>每{{ product.unit || '件' }}减{{ item.price }}元</text
									>
									<text v-if="parseInt(item.type, 10) === 2"
										>每{{ product.unit || '件' }}{{ parseInt(item.price, 10) }}折</text
									>
								</view>
							</view>
						</view>
						<button class="btn" :class="'bg-' + themeColor.name" @tap="hideService">完成</button>
					</view>
				</rf-item-popup>
				<!--商品参数-->
				<rf-item-popup
					title="商品参数"
					@hide="hideService"
					@show="
						showPopupService(
							'attributeValueClass',
							product.attributeValue
						)
					"
					:specClass="attributeValueClass"
					v-if="product.attributeValue.length > 0"
				>
					<view slot="content">
						<text>
							{{
								`${product.attributeValue &&
									product.attributeValue[0] &&
									product.attributeValue[0]
										.title}: ${product.attributeValue &&
									product.attributeValue[0] &&
									product.attributeValue[0].value}`
							}}</text
						>
					</view>
					<view slot="right" v-if="product.attributeValue.length > 0"
						><text class="iconfont iconyou"></text
					></view>
					<view slot="popup" class="service">
						<view class="content">
							<view
								class="row"
								v-for="(item, index) in product.attributeValue"
								:key="index"
							>
								<view class="title">
									{{ `${item.title}: ${item.value}` }}
								</view>
							</view>
						</view>
						<button class="btn" :class="'bg-' + themeColor.name" @tap="hideService">完成</button>
					</view>
				</rf-item-popup>
			</view>
			<!-- 组合套餐 -->
			<view class="eva-section" v-if="product.combination.length > 0">
				<view class="e-header">
					<text class="tit">组合套餐({{ product.combination.length || 0 }})</text>
					<text class="tip" v-if="product.combination.length === 0">暂无组合套餐</text>
				</view>
					<scroll-view
						scroll-x
						v-if="product.combination.length > 0"
						class="h-list"
					>
						<view
							class="h-item"
							v-for="item in product.combination"
							:key="item.id"
							@tap.stop="
								navTo(`/pages/marketing/combination/list?id=${item.id}`)
							"
						>
							<view class="combination-product-item" v-for="cItem in item.combinationProduct" :key="cItem.id">
								<image class="combination-product-img" :src="cItem.product.picture"></image>
								<text class="combination-product-price">{{ moneySymbol }}{{ cItem.product.price }}</text>
							</view>
							<view class="combination-product-title">{{ item.name }}</view>
						</view>
					</scroll-view>
			</view>
			<!-- 评价 -->
			<view class="eva-section" @tap="toEvaluateList">
				<view class="e-header">
					<text class="tit">评价({{ product.evaluateStat && product.evaluateStat.total_num || 0 }})</text>
					<text class="tip" v-if="product.match_ratio"
						>好评率 {{ product.match_ratio }}%</text
					>
					<text class="tip" v-else>暂无评价信息</text>
					<i class="iconfont iconyou"></i>
				</view>
				<view
					class="eva-box"
					v-if="product.evaluate && product.evaluate.length > 0"
				>
					<image
						class="portrait"
						:src="
							(product.evaluate &&
								product.evaluate[0] &&
								product.evaluate[0].member_head_portrait) ||
								headImg
						"
						mode="aspectFill"
					></image>
					<view class="right">
						<view class="name">
							<text>
								{{
									(product.evaluate &&
										product.evaluate[0] &&
										product.evaluate[0].member_nickname) ||
										'匿名用户'
								}}
							</text>
							<rf-rate
								v-if="evaluateList.length > 0"
								size="16"
								disabled="true"
								:value="evaluateList[0].scores"
								:active-color="themeColor.color"
							/>
						</view>
						<text class="con in2line">{{
							(product.evaluate &&
								product.evaluate[0] &&
								product.evaluate[0].content) ||
								'这个人很懒，什么都没留下~'
						}}</text>
						<view class="bot">
							<text class="attr"
								>购买类型：{{
									(product.evaluate &&
										product.evaluate[0] &&
										product.evaluate[0].sku_name) ||
										singleSkuText
								}}</text>
							<text class="time">{{
								product.evaluate &&
									product.evaluate[0] &&
									product.evaluate[0].created_at | time
							}}</text>
						</view>
					</view>
				</view>
			</view>
			<!--底部商品详情-->
			<view class="detail-desc">
				<view class="d-header">
					<text>商品详情</text>
				</view>
				<rf-parser :html="product.intro" lazy-load></rf-parser>
			</view>
			<!--购买须知-->
			<view class="detail-desc" v-if="product.is_virtual === '1'">
				<view class="d-header">
					<text>购买须知</text>
				</view>
				<view class="desc-wrapper" v-if="product.virtualType && product.virtualType.value && product.virtualType.value.text_rule">
					<view class="header" :class="'text-' + themeColor.name">使用规则</view>
					{{ product.virtualType && product.virtualType.value && product.virtualType.value.text_rule }}
				</view>
				<view class="desc-wrapper" v-if="product.virtualType && product.virtualType.value && product.virtualType.value.text_use_time">
					<view class="header" :class="'text-' + themeColor.name">可用时间说明</view>
					{{ product.virtualType && product.virtualType.value && product.virtualType.value.text_use_time }}</view>
				<view class="desc-wrapper" v-if="product.virtualType && product.virtualType.group">
					<view class="header" :class="'text-' + themeColor.name">商品类型</view>
					{{ product.virtualType && product.virtualType.group | virtualTypeFilter }}</view>
				<view class="desc-wrapper" v-if="product.virtualType && product.virtualType.period">
					<view class="header" :class="'text-' + themeColor.name">有效期</view>
					购买后 {{ product.virtualType && product.virtualType.period }} 天内</view>
				<view class="desc-wrapper">
					<view class="header" :class="'text-' + themeColor.name">限制使用次数</view>
					{{ product.virtualType && product.virtualType.confine_use_number == '0' ? '不限制' : product.virtualType && product.virtualType.confine_use_number }}</view>
			</view>
			<!--价格保障说明-->
			<view class="detail-desc" v-if="productAfterSaleExplain">
				<view class="d-header">
					<text>价格说明</text>
				</view>
				<view style="padding: 0 30rpx;">
					<rf-parser :html="productAfterSaleExplain" lazy-load></rf-parser>
				</view>
			</view>
			<!-- 底部操作菜单 -->
			<view class="page-bottom">
				<view class="page-bottom-bth-wrapper">
					<navigator
						url="/pages/index/index"
						open-type="switchTab"
						class="p-b-btn"
					>
						<i class="iconfont iconzhuyedefuben"></i>
						<text>首页</text>
					</navigator>
					<navigator
						url="/pages/cart/cart"
						open-type="switchTab"
						class="p-b-btn cart"
					>
						<i class="iconfont icongouwuche3"></i>
						<text>购物车</text>
						<rf-badge
							v-if="hasLogin && cartNum && cartNum > 0"
							type="error"
							size="small"
							class="badge"
							:text="cartNum"
						></rf-badge>
					</navigator>
					<view @tap="navTo(`/pages/product/service/service`)" class="p-b-btn">
						<i class="iconfont iconkefu2"></i>
						<text>客服</text>
					</view>
				</view>
				<view
					v-if="product.is_open_presell === '1' && parseInt(this.currentStock || this.product.stock, 10) > 0">
					<button
						:disabled="addCartBtnDisabled"
						class="action-btn-submit in1line"
						:class="'bg-' + themeColor.name"
						@tap="addCart('presell')"
					>
						定金 {{ moneySymbol }}{{ product.presell_price }}
					</button>
				</view>
				<view
					class="action-btn-group"
					v-else-if="type === 'buy_now' && parseInt(this.currentStock || this.product.stock, 10) > 0"
				>
					<button
						:disabled="addCartBtnDisabled"
						class="action-btn"
						:class="'bg-' + themeColor.name"
						@tap="addCart('cart')"
					>
						加入购物车
					</button>
					<button
						class="action-btn"
						:class="'bg-' + themeColor.name"
						:disabled="buyBtnDisabled"
						@tap="addCart('buy')"
					>
						立即购买
					</button>
				</view>
				<view
					class="action-btn-group"
					v-else-if="type === 'wholesale' && parseInt(this.currentStock || this.product.stock, 10) > 0"
				>
					<button
						class="btnIn2Line no-border"
						:class="'bg-' + themeColor.name"
						@tap="navTo(`/pages/product/product?id=${product.id}`)"
					>
						<view class="text">直接购买</view>
						<view class="text in1line">{{ moneySymbol }}{{ product.minSkuPrice }}</view>
					</button>
					<button
						:disabled="
							product.point_exchange_type == 2 ||
								product.point_exchange_type == 4
							"
						class="btnIn2Line no-border"
						:class="'bg-' + themeColor.name"
						@tap="addCart('buy')"
					>
						<view class="text">开团抢购</view>
						<view class="text in1line"> {{ moneySymbol }}{{ currentProductPrice }}</view>
					</button>
				</view>
				<view
					class="action-btn-group"
					v-else-if="type === 'bargain' && parseInt(this.currentStock || this.product.stock, 10) > 0"
				>
					<button
						class="action-btn no-border buy-now-btn in1line"
						:class="'bg-' + themeColor.name"
						@tap="navTo(`/pages/product/product?id=${product.id}`)"
					>
						直接购买
					</button>
					<button
						:disabled="
							product.point_exchange_type == 2 ||
								product.point_exchange_type == 4 || bargainSecondFlag(product.marketing && product.marketing.start_time, product.marketing && product.marketing.end_time) !== '距结束还有'
						"
						class="action-btn no-border add-cart-btn in1line"
						:class="'bg-' + themeColor.name"
						@tap="addCart('bargain')"
					>
						发起砍价
					</button>
				</view>
				<view
					class="action-btn">
					<button
						v-if="type === 'group_buy' && parseInt(this.currentStock || this.product.stock, 10) > 0"
						:disabled="
							product.point_exchange_type == 2 ||
								product.point_exchange_type == 4|| bargainSecondFlag(product.marketing && product.marketing.start_time, product.marketing && product.marketing.end_time) !== '距结束还有'
						"
						class="action-btn-submit"
						:class="'bg-' + themeColor.name"
						@tap="addCart('buy')"
					>
						立即团购  {{ moneySymbol }}{{ product.marketing.ladder.price }}
					</button>
					<button
						v-if="type === 'discount' && parseInt(this.currentStock || this.product.stock, 10) > 0"
						:disabled="
							product.point_exchange_type == 2 ||
								product.point_exchange_type == 4 || bargainSecondFlag(product.marketing && product.marketing.start_time, product.marketing && product.marketing.end_time) !== '距结束还有'
						"
						class="action-btn-submit"
						:class="'bg-' + themeColor.name"
						@tap="addCart('buy')"
					>
						立即抢购 {{ moneySymbol }}{{ currentPrice }}
					</button>
					<button
						v-if="parseInt(this.currentStock || this.product.stock, 10) === 0 && product.is_open_presell !== '1'"
						class="action-btn-submit"
						:disabled="buyBtnDisabled"
					>
						库存不足
					</button>
				</view>
			</view>
		</view>
		<!-- 分享引导 -->
		<view
			class="popup spec show"
			v-if="shareClass === 'show'"
			@touchmove.stop.prevent="stopPrevent"
			@tap="hideShareSpec"
		>
			<!-- 遮罩层 -->
			<view class="mask" @tap="hideShareSpec"></view>
			<view class="share-bg">
				<image :src="shareBg"></image>
			</view>
		</view>
		<view class="hideCanvasView" v-if="canvasShow">
			<canvas class="hideCanvas" canvas-id="default_PosterCanvasId" :style="{width: (poster.width||10) + 'px', height: (poster.height||10) + 'px'}"></canvas>
		</view>
		<!-- 收货地址/自提点弹窗 -->
		<view
			class="popup spec"
			:class="addressClass"
			@touchmove.stop.prevent="stopPrevent"
			@tap="hideAddressSpec"
		>
			<!-- 遮罩层 -->
			<view class="mask" @tap="hideAddressSpec"></view>
			<view class="layer" @tap.stop="stopPrevent">
				<view class="navbar">
					<view
						v-for="(item, index) in addressTypeList"
						:key="index"
						class="nav-item"
						:class="tabCurrentIndex === index ? `text-${themeColor.name} current` : ''"
						@tap="tabClick(index, item.state)"
					>
						{{ item.text }}
					</view>
				</view>
				<scroll-view class="rf-list" scroll-y>
					<view
						class="rf-list-item"
						v-for="(item, index) in addressList"
						@tap.stop="handleBargainCreate(item.id)"
						:key="index"
					>
					<view
						class="mid"
					>
						<view class="address-box">
							<text v-if="parseInt(item.is_default, 10) === 1" class="tag"
								>默认</text
							>
							<text class="address in1line"
								>{{ item.address_name }} {{ item.address_details || item.address }}</text
							>
						</view>
						<view class="u-box">
							<text class="name">{{ item.name }}</text>
							<text class="name">{{ item.realname || item.contact }}</text>
							<text class="mobile">{{ item.mobile }}</text>
						</view>
					</view>
					<view class="right">
						<text
							class="iconfont iconyou"
						></text>
					</view>
				</view>
					<view class="no-data" v-if="addressList.length === 0">
						{{ tabCurrentIndex === 1 ? '请联系管理员添加自提点' : '请进入个人中心-我的服务-收货地址添加地址' }}
					</view>
				</scroll-view>
			</view>
		</view>
		<!-- 去拼团 -->
		<view
			class="popup wholesale-popup spec"
			v-if="wholesaleOnClass === 'show'"
			:class="wholesaleOnClass"
			@tap="hideService"
		>
			<!-- 遮罩层 -->
			<view class="mask"></view>
			<view class="layer" @tap.stop="stopPrevent">
				<view class="content">
					<view class="title"
						>参与{{ currentWholesaleOn.member_nickname }}的拼团</view
					>
					<view
						v-if="currentWholesaleOn.total_number - currentWholesaleOn.number > 0"
						>仅剩
						<text
							class="font-color-red"
							v-text="
								currentWholesaleOn.total_number - currentWholesaleOn.number
							"
						></text>
						个名额</view
					>
					<view class="time-wrapper">
						剩余 <rf-count-down
							class="count-down"
							:show-day="false"
							:second="second(currentWholesaleOn && currentWholesaleOn.end_time)"
							color="#FFFFFF"
							:background-color="themeColor.color"
							:border-color="themeColor.color"
						/>结束
					</view>
					<view class="avatar-wrapper">
						<view
							class="avatar"
							v-for="item in currentWholesaleOn.order"
							:key="item.id"
						>
							<uni-tag
								v-if="
									item.member.id === currentWholesaleOn.member_id &&
										item.order_status != -4
								"
								class="avatar-tag"
								:circle="true"
								text="团长"
								type="warning"
								size="small"
							/>
							<uni-tag
								v-if="item.pay_status == 0 && item.order_status != -4"
								class="avatar-tag"
								:circle="true"
								text="待付"
								type="warning"
								size="small"
							/>
							<uni-tag
								v-if="item.pay_status == 1 && item.member.id !== currentWholesaleOn.member_id && item.order_status != -4"
								class="avatar-tag"
								:circle="true"
								text="成员"
								type="warning"
								size="small"
							/>
							<image
								v-if="item.order_status != -4"
								:src="item.member.head_portrait || headImg"
								mode="aspectFill"
							/>
						</view>
					</view>
				</view>
				<view class="btn-group">
					<button class="confirm-btn" :class="'bg-' + themeColor.name" v-if="!wholesaleBtnDisabled" :disabled="currentWholesaleOn.total_number - currentWholesaleOn.number === 0" @tap="addCart('buy', currentWholesaleOn.id)">
						直接参与拼团
					</button>
					<button class="confirm-btn" :class="'bg-' + themeColor.name" v-else disabled @tap="addCart('buy', currentWholesaleOn.id)">
						不能加入自己的团
					</button>
					<button class="confirm-btn" :class="'bg-' + themeColor.name" :disabled="currentWholesaleOn.total_number - currentWholesaleOn.number === 0" @tap="navTo(`/pages/marketing/wholesale/detail?id=${currentWholesaleOn.id}`)">
						邀请好友拼团
					</button>
				</view>
			</view>
		</view>
		<!--回到顶部-->
		<rf-live v-if="product.name"></rf-live>
		<!--#ifdef MP-->
    <rf-nav></rf-nav>
		<!--#endif-->
		<view
			class="popup spec show"
			v-if="kefuShow"
			@touchmove.stop.prevent="stopPrevent"
			@tap="hide"
		>
			<!-- 遮罩层 -->
			<view class="mask" @tap="hide"></view>
			<view class="kefu-bg">
				<image :src="appServiceQr"></image>
			</view>
		</view>
		<!--海报分享-->
		<rf-poster :show="posterShow" :poster="poster.itempFilePathmg" @hidePoster="hidePoster"></rf-poster>
  </view>
</template>
<script>
	/**
	 *@des 封装商品详情
	 *@author stav stavyan@qq.com
	 *@blog https://stavtop.club
	 *@date 2020/05/15 16:22:24
	 */
	import rfItemPopup from '@/components/rf-item-popup';
	import moment from '@/common/moment';
	import rfAttrContent from '@/components/rf-attr-content';
	import rfPoster from '@/components/rf-poster';
	import { getSharePoster } from '@/utils/poster/QS-SharePoster';
	import rfRate from '@/components/rf-rate/rf-rate';
	import rfBadge from '@/components/rf-badge/rf-badge';
	import uniTag from '@/components/uni-tag/uni-tag';
	import rfNav from '@/components/rf-nav';
	import rfLive from '@/components/rf-live';
	import { cartItemCount, cartItemCreate, bargainLaunchCreate, wholesaleView, thirdPartyQrCode } from '@/api/product';
	import { collectCreate, collectDel, pickupPointIndex, transmitCreate } from '@/api/basic';
  import { couponReceive, addressList } from '@/api/userInfo';
	import rfCountDown from '@/components/rf-count-down';
	import rfSwiperSlide from '@/components/rf-swiper-slide';
	import { mapMutations } from 'vuex';
	import $mAssetsPath from '@/config/assets.config';
  export default {
    name: 'rfProductDetail',
    props: {
			product: {
				type: Object,
				default() {
					return {
					};
				}
			},
			wholesale: {
				type: Array,
				default() {
					return [];
				}
			},
			userInfo: {
				type: Object,
				default() {
					return {};
				}
			},
			url: {
				type: String,
				default: ''
			},
			marketType: {
				type: String,
				default: 'buy_now'
			}
    },
		components: {
			rfNav,
			rfItemPopup,
			rfBadge,
			rfLive,
			rfRate,
			uniTag,
			rfPoster,
			rfAttrContent,
			rfCountDown,
			rfSwiperSlide
		},
		data() {
			return {
				carouselTabActive: '1',
        appServiceQr: this.$mSettingConfig.appServiceQr,
				productAfterSaleExplain: this.$mSettingConfig.productAfterSaleExplain,
				kefuShow: false,
				addressClass: 'none',
				canvasShow: true,
				logo: this.$mSettingConfig.appLogo,
				vipPrice: this.$mAssetsPath.vipPrice,
				posterShow: false,
				serviceClass: 'none', // 服务弹窗
				ladderPreferentialClass: 'none', // 阶梯优惠弹窗
				attributeValueClass: 'none', // 商品参数弹窗
				specClass: 'none', // 商品参数弹窗
				couponClass: 'none', // 优惠券弹窗
				shareClass: 'none', // 分享引导弹窗
				fullGiveClass: 'none', // 满减送弹窗
				cartType: null, // 下单类型
				couponList: [], // 优惠券列表
				currentStock: null,
				currentSkuPrice: null,
				currentSkuName: null,
				currentCartCount: 1,
				evaluateList: [],
				hasLogin: this.$mStore.getters.hasLogin,
				cartNum: uni.getStorageSync('cartNum'),
				addressTypeList: this.$mConstDataConfig.addressTypeList,
				tabCurrentIndex: 0,
				loading: true,
				errorInfo: '',
				headImg: this.$mAssetsPath.headImg,
				isPointExchange: false,
				shareBg: this.$mAssetsPath.shareBg,
				appServiceType: this.$mSettingConfig.appServiceType,
				productPosterQrType: this.$mSettingConfig.productPosterQrType,
				appName: this.$mSettingConfig.appName,
				shareFrom: '',
				poster: {},
				promoCode: '',
				addressList: [],
				currentWholesaleOn: {
          order: []
				},
				wholesaleOnClass: 'none',
				wholesaleId: '',
        moneySymbol: this.moneySymbol,
				state: 1,
        singleSkuText: this.singleSkuText,
				thirdPartyQrCodeImg: ''
			};
		},
		async onShareAppMessage () {
      // #ifdef MP
      await this.$http.post(`${transmitCreate}`, {
        topic_type: 'product',
        topic_id: this.productId
      }).then(() => {
        return {
          title: this.productDetail.name,
          path: `/pages/product/product?id=${this.productId}`
        };
      });
      // #endif
		},
		filters: {
			time(val) {
				return moment(val * 1000).format('YYYY-MM-DD HH:mm');
			},
			dayTime(val) {
				return moment(val * 1000).format('YYYY-MM-DD');
			},
			pointExchangeTypeFilter(val) {
				const type = [
					'',
					'非积分兑换',
					'积分加现金',
					'积分兑换或直接购买',
					'只支持积分兑换'
				];
				return type[parseInt(val, 10)];
			},
			integralGiveTypeFilter(val) {
				const type = ['固定积分', '百分比'];
				return type[parseInt(val, 10)];
			},
			givePointFilter(val) {
				return val.integral_give_type === '1'
					? Math.round((parseInt(val.give_point, 10) / 100) * parseInt(val.minSkuPrice, 10))
					: parseInt(val.give_point, 10);
			},
			marketingTagFilter(type) {
				let tag = $mAssetsPath.columnTag;
				switch (type) {
					case 'discount':
						tag = $mAssetsPath.columnTag;
						break;
					case 'bargain':
						tag = $mAssetsPath.squareTag;
						break;
					case 'group_buy':
						tag = $mAssetsPath.circleTag;
						break;
					case 'wholesale':
						tag = $mAssetsPath.triangleTag;
						break;
				}
				return tag;
			}
		},
		computed: {
      type() {
        if (this.product.marketing_type) {
          return this.marketType;
        } else {
          return 'buy_now';
        }
      },
      typeName() {
        let typeName;
        switch (this.product.marketing_type) {
          case 'discount':
            typeName = '秒杀商品';
            break;
          case 'bargain':
            typeName = '砍价商品';
            break;
          case 'group_buy':
            typeName = '团购商品';
            break;
          case 'wholesale':
            typeName = '拼团商品';
            break;
        }
        if (this.marketType === 'buy_now') typeName = '';
        return typeName;
      },
			// 购买按钮禁用
			buyBtnDisabled() {
				return parseInt(this.currentStock || this.product.stock, 10) === 0;
			},
			// 添加购物车按钮禁用
			addCartBtnDisabled() {
				return (
					this.product.point_exchange_type === '2' ||
					this.product.point_exchange_type === '4' ||
					parseInt(this.currentStock || this.product.stock, 10) === 0 ||
					this.product.is_virtual === '1'
				);
			},
			// 最小购买数量
			minNum() {
				let minNum;
				if (this.type === 'group_buy') {
					minNum = parseInt(this.product.marketing && this.product.marketing.min_num, 10);
				} else {
          minNum = parseInt(this.product.min_buy, 10) || 1;
				}
				return minNum;
			},
			// 最小购买数量
			maxNum() {
				let maxNum;
				if (this.type === 'group_buy') {
					maxNum = parseInt(this.product.marketing && this.product.marketing.max_num, 10);
				} else if (this.type === 'bargain' || this.type === 'wholesale') {
					maxNum = 1;
				} else {
          maxNum = 0;
				}
				return maxNum;
			},
			currentPrice() {
        const decimal = this.product.marketing && this.product.marketing.decimal_reservation_number;
        const discount = this.product.marketing && this.product.marketing.discount;
        const price = this.currentSkuPrice || this.product.minSkuPrice;
				switch (parseInt(decimal, 10)) {
					case -1:
						return (price * discount / 100).toFixed(2);
					case 0:
						return (price * discount / 100).toFixed(0);
					case 1:
						return (price * discount / 100).toFixed(1);
					default:
						return (price * discount / 100).toFixed(2);
				}
			},
			favorite () {
				return !!this.product.myCollect;
			},
			wholesaleOn () {
				return this.wholesale[0];
			},
			wholesaleOnList () {
				return this.wholesale && this.wholesale[0] && this.wholesale[0].list;
			},
			wholesaleSuccess () {
				return this.wholesale[1];
			},
			// 计算倒计时时间
			second() {
				return function(val) {
					return Math.floor(val - new Date() / 1000);
				};
			},
			bargainSecond() {
				return function(startTime, endTime) {
					const now = parseInt(new Date() / 1000, 10);
					if (now < startTime) {
						return Math.floor(startTime - now);
					} else if (now < endTime && now >= startTime) {
						return Math.floor(endTime - now);
					} else {
						return '';
					}
				};
			},
			bargainSecondFlag() {
				return function(startTime, endTime) {
					const now = parseInt(new Date() / 1000, 10);
					if (now < startTime) {
						return '未开始';
					} else if (now < endTime && now >= startTime) {
						return '距结束还有';
					} else {
						return '';
					}
				};
			},
			wholesaleBtnDisabled() {
				if (!this.hasLogin) return true;
				let flag = false;
				this.currentWholesaleOn.order.forEach(item => {
					if (parseInt(item.buyer_id, 10) === parseInt(this.userInfo && this.userInfo.account.id, 10)) {
            flag = true;
					}
				});
				return flag;
      },
			currentProductPrice () {
        let price;
        if (this.type === 'buy_now') {
          if (this.product.memberDiscount && this.product.memberDiscount.length !== 0) {
            // eslint-disable-next-line
            this.product.minSkuPrice = (this.product.minSkuPrice * (1 - this.product.memberDiscount.discount / 100)).toFixed(2);
            // eslint-disable-next-line
            this.product.maxSkuPrice = this.product.maxSkuPrice ? (this.product.maxSkuPrice * (1 - this.product.memberDiscount.discount / 100)).toFixed(2) : 0;
          }
          // eslint-disable-next-line
          price = this.currentSkuPrice || ((this.product.maxSkuPrice && (this.product.minSkuPrice !== this.product.maxSkuPrice)) ? (this.product.minSkuPrice + ' ~ ' + this.product.maxSkuPrice) : parseFloat(this.product.minSkuPrice).toFixed(2));
          return price;
        }
        if (this.type === 'bargain') {
          price = this.currentSkuPrice || this.product.price;
        }
        if (this.type === 'discount') {
          price = this.currentSkuPrice || this.currentPrice;
        }
        if (this.type === 'group_buy') {
          price = this.product.marketing.ladder.price;
        }
        if (this.type === 'wholesale') {
          price = this.currentSkuPrice || this.product.wholesale_price;
        }
        if (this.product.memberDiscount && this.product.memberDiscount.length !== 0) {
          price = price * (1 - this.product.memberDiscount.discount / 100);
        }
        return parseFloat(price || '0').toFixed(2);
			}
		},
    methods: {
      ...mapMutations(['setCartNum']),
      // 轮播图点击监听
      handleCarouselTabClick(val) {
        this.carouselTabActive = val;
      },
			// 返回上一页
			navBack() {
				this.$mRouter.back();
			},
      hide() {
        this.kefuShow = false;
      },
      // 分享商品
      share() {
        // #ifdef H5
        if (this.$mPayment.isWechat()) {
          this.shareClass = 'show';
        } else {
          this.$mHelper.h5Copy(this.url);
        }
        // #endif
        // #ifdef APP-PLUS
				this.$mHelper.handleAppShare(this.url, this.appName, this.product.name, this.product.picture);
				// #endif
			},
			// 通用跳转
			navTo(route) {
				if (this.appServiceType === '1' && route === '/pages/product/service/index') {
					this.kefuShow = true;
					return;
				}
				if (!this.hasLogin) {
					this.$mHelper.backToLogin();
				} else {
					if (this.appServiceType === '0') {
						this.$mHelper.toast('暂不提供客服功能');
					} else {
						this.wholesaleOnClass = 'none';
						this.$mRouter.push({ route });
					}
				}
			},
			// 倒计时结束 刷新页面
			bargainTimeUp() {
				this.$emit('product');
			},
			// 弹窗显示
			showPopupService(type, list) {
				if (list.length === 0) return;
				this[type] = 'show';
			},
			// 关闭服务弹窗
			hideService() {
				this.specClass = 'none';
				this.couponClass = 'none';
				this.serviceClass = 'none';
				this.ladderPreferentialClass = 'none';
				this.attributeValueClass = 'none';
				this.wholesaleOnClass = 'none';
				this.fullGiveClass = 'none';
			},
			// 获取优惠券
			async getCoupon(item) {
				if (!this.hasLogin) {
					await this.$mHelper.backToLogin();
					return;
				}
				await this.$http
					.post(`${couponReceive}`, {
						id: item.id
					})
					.then(() => {
						this.$mHelper.toast('领取成功');
					});
			},
			// 跳转至评价列表
			toEvaluateList() {
				if (!this.product.evaluateStat || parseInt(this.product.comment_num, 10) === 0) return;
				this.$mRouter.push({
					route: `/pages/order/evaluation/list?comment_num=${
						this.product.comment_num
					}&evaluateStat=${JSON.stringify(this.product.evaluateStat)}`
				});
			},
			// 顶部tab点击
			tabClick(index, state) {
				this.page = 1;
				this.addressList.length = 0;
				this.tabCurrentIndex = index;
				this.state = state;
				const api = (this.state === 1 ? addressList : pickupPointIndex);
				this.getAddressList(api);
			},	// 获取收货地址列表
			async getAddressList(api) {
				await this.$http
					.get(api, {
					})
					.then(r => {
						this.addressList = r.data;
					});
			},
			// 规格弹窗开关
			toggleSpec(row) {
				if (!this.product.id) return;
				if (this.specClass === 'show') {
					this.currentStock = row.stock;
					this.currentSkuPrice = row.price;
					this.currentSkuName = row.skuName;
					this.currentCartCount = row.cartCount;
					const skuId = row.skuId;
					if (parseInt(this.currentStock, 10) === 0) {
						this.$mHelper.toast('库存不足');
						return;
					}
					if (this.cartType === 'cart') {
						this.handleCartItemCreate(skuId);
					} else if (this.cartType === 'buy') {
						this.buy(skuId);
					} else if (this.cartType === 'presell') {
						this.preSell(skuId);
					} else if (this.cartType === 'bargain') {
						this.addressClass = 'show';
						const api = this.state === 1 ? addressList : pickupPointIndex;
						this.getAddressList(api);
						this.skuId = skuId;
						this.cartType = null;
						this.specClass = 'none';
						return;
					}
					this.cartType = null;
					this.specClass = 'none';
					setTimeout(() => {
						this.specClass = 'none';
					}, 250);
				} else if (this.specClass === 'none') {
					this.specClass = 'show';
				}
			},
			// 海报弹窗开关
			async openPoster() {
				if (this.product.id && this.productPosterQrType === 'mini_program_qr') {
					await this.$http.get(`${thirdPartyQrCode}`, {
						id: this.product.id,
						marketing_type: this.type
					}).then(async r => {
						this.thirdPartyQrCodeImg = r.data.url;
					});
				}
        this.canvasShow = true;
				const _this = this;
				const productPosterTitle = this.$mSettingConfig.productPosterTitle;
				const productPosterCoverType = this.$mSettingConfig.productPosterCoverType;
				try {
					const d = await getSharePoster({
						_this: this, // 若在组件中使用 必传
						type: 'testShareType',
						formData: {
							// 访问接口获取背景图携带自定义数据
						},
						posterCanvasId: 'default_PosterCanvasId', // canvasId
						delayTimeScale: 20, // 延时系数
						background: {
							width: 750,
							height: 1260,
							backgroundColor: '#fff'
						},
						drawArray: ({ bgObj, type, bgScale }) => {
							let qrCodeObj = {
								type: 'qrcode',
								text: _this.url,
								size: bgObj.width * 0.3,
								dx: bgObj.width * 0.66,
								dy: bgObj.height - bgObj.width * 0.37
							};
							if (_this.thirdPartyQrCodeImg) {
								qrCodeObj = {
									type: 'image',
									url: _this.thirdPartyQrCodeImg,
									dx: bgObj.width * 0.66,
									dy: bgObj.height - bgObj.width * 0.37,
									infoCallBack(imageInfo) {
										return {
											dWidth: bgObj.width * 0.3, // 因为设置了圆形图片 所以要乘以2
											dHeight: bgObj.width * 0.3,
											roundRectSet: { // 圆角矩形
												r: productPosterCoverType === 'roundness' ? bgObj.width * 0.18 : 0
											}
										};
									}
								};
							}
							const fontSize = bgObj.width * 0.05;
							// 可直接return数组，也可以return一个promise对象, 但最终resolve一个数组, 这样就可以方便实现后台可控绘制海报
							// eslint-disable-next-line
							return new Promise((rs, rj) => {
								rs([
									{
										type: 'image',
										url: (_this.userInfo && _this.userInfo.head_portrait) || _this.logo,
										dx: bgObj.width * 0.04,
										dy: bgObj.width * 0.05,
										infoCallBack(imageInfo) {
											return {
												dWidth: bgObj.width * 0.18, // 因为设置了圆形图片 所以要乘以2
												dHeight: bgObj.width * 0.18,
												roundRectSet: { // 圆角矩形
                          r: productPosterCoverType === 'roundness' ? bgObj.width * 0.18 : 0
												}
											};
										}
									},
									{
										type: 'text',
										text: _this.userInfo.nickname || _this.userInfo.realname || _this.appName,
										size: fontSize,
										color: '#000',
										alpha: 1,
										textAlign: 'left',
										textBaseline: 'middle',
										infoCallBack(textLength) {
											return {
												dx: bgObj.width * 0.28,
												dy: bgObj.width * 0.10
											};
										}
									},
									{
										type: 'text',
										text: _this.typeName,
										size: fontSize * 0.88,
										color: _this.themeColor.color,
										alpha: 1,
										textAlign: 'left',
										textBaseline: 'middle',
										infoCallBack(textLength) {
											return {
												dx: bgObj.width * 0.75,
												dy: bgObj.width * 0.10
											};
										}
									},
									{
										type: 'text',
										text: productPosterTitle,
										size: fontSize * 0.8,
										color: '#666',
										alpha: 1,
										textAlign: 'left',
										textBaseline: 'middle',
										infoCallBack(textLength) {
											return {
												dx: bgObj.width * 0.28,
												dy: bgObj.width * 0.17
											};
										}
									},
									{
										type: 'image',
										url: _this.product && _this.product.covers && _this.product.covers[0],
										dx: bgObj.width * 0.04,
										dy: bgObj.width * 0.25,
										infoCallBack(imageInfo) {
											return {
												dWidth: 690, // 因为设置了圆形图片 所以要乘以2
												dHeight: 690,
												roundRectSet: { // 圆角矩形
                          r: 12
												}
											};
										}
									},
									{
										type: 'text',
										text: _this.product.maxSkuPrice ? `${_this.moneySymbol} ${_this.product.minSkuPrice} - ${_this.product.maxSkuPrice}` : `${_this.moneySymbol} ${_this.product.minSkuPrice}`,
										size: fontSize * 1.2,
										color: _this.themeColor.color,
										textAlign: 'left',
										alpha: 1,
										infoCallBack(textLength) {
											return {
												dx: bgObj.width * 0.04,
												dy: bgObj.height * 0.74
											};
										}
									},
									{
										type: 'text',
										text: _this.$mHelper.trim(_this.product.name),
										size: fontSize * 0.85,
										color: '#000',
										textAlign: 'left',
										maxLine: true,
										alpha: 1,
										width: bgObj.width * 0.6,
										infoCallBack(textLength) {
											return {
												dx: bgObj.width * 0.05,
												dy: bgObj.height - bgObj.width * 0.25
											};
										}
									},
									qrCodeObj
								]);
							});
						},
						setCanvasWH: ({ bgObj, type, bgScale }) => {
							// 为动态设置画布宽高的方法，
							this.poster = bgObj;
						}
					});
					this.poster.itempFilePathmg = d.poster.tempFilePath;
          this.canvasShow = false;
					this.posterShow = true;
				} catch (e) {
					this.$mHelper.log(JSON.stringify(e));
				}
			},
			hidePoster () {
        this.posterShow = false;
        this.canvasShow = false;
			},
			hideSpec() {
				this.specClass = 'none';
			},
			hideShareSpec() {
				this.shareClass = 'none';
			},
			// 添加商品至购物车
			async handleCartItemCreate(skuId) {
				await this.$http
					.post(`${cartItemCreate}`, {
						sku_id: skuId,
						num: this.currentCartCount
					})
					.then(() => {
						this.$mHelper.toast('添加购物车成功');
						this.$http.get(`${cartItemCount}`).then(r => {
							this.setCartNum(r.data);
							this.cartNum = r.data;
						});
					});
			},
			// 收藏
			async toFavorite() {
				if (!this.product.id) return;
				if (!this.hasLogin) {
					this.specClass = 'none';
					await this.$mHelper.backToLogin();
				} else {
					this.favorite ? this.handleCollectDel() : this.handleCollectCreate();
				}
			},
			// 收藏商品
			async handleCollectCreate() {
				await this.$http
					.post(`${collectCreate}`, {
						topic_id: this.product.id,
						topic_type: 'product'
					})
					.then(() => {
						this.$mHelper.toast('收藏成功');
						this.$emit('product');
					});
			},
			// 取消收藏商品
			async handleCollectDel() {
				await this.$http
					.delete(`${collectDel}?id=${this.product.myCollect.id}`)
					.then(() => {
						this.$mHelper.toast('取消收藏成功');
						this.$emit('product');
					});
			},
			async buy(skuId) {
        const params = {};
        params.data = JSON.stringify({ sku_id: skuId, num: this.currentCartCount });
				if (
					this.product.point_exchange_type === '2' ||
					this.product.point_exchange_type === '4' ||
					(this.product.point_exchange_type === '3' &&
						this.isPointExchange)
				) {
					params.type = 'point_exchange';
				} else {
          switch (this.type) {
            case 'group_buy':
              params.group_buy_id = this.product.marketing.id;
              break;
            case 'wholesale':
              params.wholesale_product_id = this.product.marketing.id;
							if (this.wholesaleId) {
								params.wholesale_id = this.wholesaleId;
								this.wholesaleId = '';
							}
              break;
            default:
              break;
          }
					params.type = this.type;
				}
				this.$mRouter.push({
					route: `/pages/order/create/order?data=${JSON.stringify(params)}&promo_code=${this.promoCode}`
				});
			},
			async preSell(skuId) {
				let params = {};
				params.type = 'presell_buy';
				params.data = JSON.stringify({ num: this.currentCartCount, sku_id: skuId });
				this.$mRouter.push({ route: `/pages/order/create/order?data=${JSON.stringify(params)}&promo_code=${this.promoCode}` });
			},
			addCart(type, isPointExchange) {
				if (!this.product.id) return;
				if (!this.hasLogin) {
					this.$mHelper.backToLogin();
					return;
				}
				this.wholesaleId = isPointExchange;
				this.wholesaleOnClass = 'none';
				this.specClass = 'show';
				this.cartType = type;
				this.isPointExchange = isPointExchange;
			},
			stopPrevent() {},
      // 创建砍价订单
			handleBargainCreate(id) {
				this.addressClass = 'none';
				const params = {};
				params.sku_id = this.skuId;
				if (this.state === 1) {
					params.address_id = id;
					params.shipping_type = 1;
				} else {
					params.pickup_id = id;
					params.shipping_type = 2;
				}
				params.bargain_id = this.product.marketing.bargain_id;
				this.$http.post(bargainLaunchCreate, params).then(r => {
					this.$mRouter.push({
						route: `/pages/marketing/bargain/detail?id=${r.data.id}`
					});
        });
			},
			hideAddressSpec() {
				this.addressClass = 'hide';
				setTimeout(() => {
					this.addressClass = 'none';
				}, 250);
      },
			// 展示拼团窗口
			showWholesaleOn (id) {
        this.getWholesaleView(id);
      },
			// 获取拼团信息
			async getWholesaleView(id) {
				await this.$http
					.get(`${wholesaleView}`, {
						id
					})
					.then(r => {
						this.currentWholesaleOn = r.data;
						this.wholesaleOnClass = 'show';
					});
			}
    }
  };
</script>
<style lang="scss">
.rf-product-detail {
	.back-btn {
		position: fixed;
		left: 40rpx;
		z-index: 9999;
		padding-top: var(--status-bar-height);
		top: 40rpx;
		font-size: 40rpx;
		color: $font-color-dark;
	}
	.carousel {
		height: 900rpx;
		position: relative;
		.video-wrapper {
			width: 100%;
			height: 100%;
			video {
				width: 100%;
				height: 100%;
			}
		}
		swiper {
			height: 100%;
		}
		.image-wrapper {
			width: 100%;
			height: 100%;
		}
		.swiper-item {
			display: flex;
			justify-content: center;
			align-content: center;
			height: 750rpx;
			overflow: hidden;
			image {
				width: 100%;
				height: 100%;
			}
			.content {
				position: absolute;
				right: $spacing-base;
				bottom: $spacing-base;
			}
		}
		.carousel-tab {
			align-items: center;
			display: flex;
			height: 45rpx;
			justify-content: center;
			margin-right: $spacing-sm;
			z-index: 10;
			position: relative;
			.carousel-tab-item {
				height: 100%;
				width: 120rpx;
				display: flex;
				justify-content: center;
				border: 1rpx solid rgba(255, 255, 255, 0.3);
				align-items: center;
			}
			.carousel-tab-item:first-child {
				border-bottom-left-radius: 12rpx;
				border-right: none;
			}
			.carousel-tab-item:last-child {
				border-bottom-right-radius: 12rpx;
				border-left: none;
			}
			.normal {
				background-color: $color-white;
			}
		}
	}
	.detail {
		padding-bottom: 60rpx;
	}
	.service {
		padding: $spacing-lg 0 0;
		.content {
			padding: 0 $spacing-lg;
			.row {
				font-size: $font-lg;
				margin-bottom: $spacing-sm;
			}
		}
	}
	.selected-text {
		margin-right: 4rpx;
	}
	.sub-list {
		margin-bottom: $spacing-sm;
		.row {
			margin-bottom: $spacing-lg;
		}
	}
	.share-bg {
		image {
			position: fixed;
			z-index: 100;
			width: 70vw;
			height: 45vw;
			right: $spacing-base;
			top: $spacing-base;
		}
	}
	.layer {
		position: fixed;
		z-index: 99;
		bottom: 0;
		width: 100%;
		border-radius: 10rpx 10rpx 0 0;
		background-color: #fff;
		.rf-list {
			max-height: 60vh;
			padding-bottom: 0;
			margin-bottom: $spacing-sm;
		}
	}
	// 拼团公告
	.rf-swiper-slide {
		margin-top: 20rpx;
		.label {
			margin-left: 10rpx;
		}
	}
	// 玩法介绍
	.play-way {
		background-color: $color-white;
		padding: 0 20rpx;
		margin: 20rpx 0;
		font-size: $font-base;
		.title {
			border-bottom: 1px solid #eee;
			padding: $spacing-base 0;
			display: flex;
			justify-content: space-between;
			.iconfont {
				margin-left: 0.13rem;
				font-size: 0.28rem;
				color: #717171;
			}
		}
		.way {
			font-size: $font-base - 2rpx;
			padding: 20rpx 0;
			display: flex;
			.item {
				flex: 1;
				text-align: center;
				.tip {
					font-size: 0.22rem;
					color: #a5a5a5;
				}
			}
			.arrow {
				width: 40rpx;
				.iconfont {
					color: $font-color-light;
					font-weight: 100;
				}
			}
		}
	}
	.assemble {
		background-color: #fff;
		.assemble-item {
			height: 120rpx;
			border-bottom: 1px solid #f0f0f0;
			.pictxt {
				display: flex;
				justify-content: space-between;
				.picture {
					display: flex;
					image {
						width: 80rpx;
						height: 80rpx;
						margin: 20rpx 0;
						border-radius: 50%;
					}
					.text {
						line-height: 120rpx;
						margin-left: 20rpx;
					}
				}
				.right {
					display: flex;
					align-items: center;
					.time-wrapper {
						text-align: right;
						margin-right: 20rpx;
						.lack {
							font-size: $font-sm;
							.font-color-red {
								margin: 0 4rpx;
							}
						}
						.time {
							font-size: $font-sm;
							color: $font-color-light;
						}
					}
					.spellBnt {
						font-size: $font-sm;
						width: 120rpx;
						height: 48rpx;
						display: flex;
						justify-content: center;
						align-items: center;
						border-radius: 48rpx;
					}
				}
			}
		}
	}
	.c-list {
		font-size: $font-sm + 2rpx;
		color: $font-color-base;
		background: #fff;
		.c-row {
			display: flex;
			align-items: center;
			padding: 20rpx 30rpx;
			position: relative;
		}
		.tit {
			width: 140rpx;
		}
		.con {
			flex: 1;
			color: $font-color-dark;
			.selected-text {
				margin-right: 10rpx;
			}
		}
		.bz-list {
			height: 40rpx;
			font-size: $font-sm + 2rpx;
			color: $font-color-dark;
			text {
				display: inline-block;
				margin-right: 30rpx;
			}
		}
		.con-list {
			flex: 1;
			display: flex;
			flex-direction: column;
			color: $font-color-dark;
			line-height: 40rpx;
			.buy-now {
				color: $uni-color-primary;
			}
		}
		.red {
			color: $uni-color-primary;
		}
	}
	// 正在拼团弹窗
	.wholesale-popup {
		.layer {
			position: fixed;
			z-index: 99;
			width: 70%;
			bottom: 40%;
			border-radius: 10rpx 10rpx 0 0;
			background-color: #fff;
			margin: 0 15%;
			.content {
				padding: 0;
				text-align: center;
				.title {
					display: block;
					margin: 20rpx 0 10rpx;
					font-size: $font-lg;
				}
				.font-color-red {
					margin: 0 4rpx;
				}
				.time {
					font-size: $font-sm;
					color: $font-color-light;
				}
				.avatar-wrapper {
					.avatar {
						display: inline-block;
						margin: 20rpx 10rpx 0;
						position: relative;
						.avatar-tag {
							display: flex;
							justify-content: center;
							position: absolute;
							top: -20rpx;
							left: 10rpx;
							z-index: 100;
						}
						image {
							width: 100rpx;
							height: 100rpx;
							border-radius: 60rpx;
						}
					}
				}
			}
			.confirm-btn {
				width: 80%;
				height: 64rpx;
				line-height: 64rpx;
				margin: 30rpx auto;
			}
		}
	}
	.kefu-bg {
		height: 100vh;
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 98;
		image {
			width: 60vw;
			height: 60vw;
			border-radius: 12rpx;
			z-index: 98;
		}
	}
}
</style>
