<template>
	<u-index-list :scrollTop="scrollTop">
		<view v-for="(letter, letterIndex) in letterList" :key="letterIndex">
			<u-index-anchor :index="letter" />
			
			<block v-for="(item, index) in citys" :key="index">
				<block v-if="item.pinyin == letter">
					<view class="list-cell u-border-bottom" @tap="getCity(item)">
							{{item.title}}
					</view>
				</block>
			</block>
		</view>
		
		<rfLoading isFullScreen :active="loading"></rfLoading>
		<!-- <rf-back-top :scrollTop="scrollTop"></rf-back-top> -->
		<!-- <rf-back-home></rf-back-home> -->
	</u-index-list>
</template>

<script>
import { provincesCitys } from '@/api/pet';

export default {
	data() {
		return {
			loading: true,
			scrollTop: 0,
			letterList: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U',
				'V', 'W', 'X', 'Y', 'Z'],
			citys: [],
		};
	},
	onLoad() {
		this.citys = uni.getStorageSync('citys');
		
		if (this.citys) {
			this.loading = false;
		} else {
			this.initData();
		}
	},
	onShow() {

	},
	onPageScroll(e) {
		this.scrollTop = e.scrollTop;
	},
	mounted() {
		
	},
	computed: {
		
	},
	methods: {
		navTo(route) {
			this.$mRouter.push({ route });
		},
		getCity(item) {
			uni.setStorageSync('city', item);
			this.$mRouter.back();
		},
		async initData() {
			await this.getProvincesCitys();
		},
		async getProvincesCitys() {
			await this.$http.get(`${provincesCitys}`).then(async r => {
				this.loading = false;
				let items = r.data;
				
				items.forEach((item, index) => {
					switch (item.id) {
						case '110100':
							item.id = 110000;
							break;
						case '120100':
							item.id = 120000;
							break;
						case '310100':
							item.id = 310000;
							break;
						case '500100':
							item.id = 500000;
							break;
						default:
							break;
					}
				});
				
				this.citys = items;
				uni.setStorageSync('citys', items);
			}).catch(err => {
				this.loading = false;
			});
		},
	}
};
</script>

<style lang="scss">
page {
	background: #F5F5F5;
	.list-cell {
		width: 100%;
		line-height: 24px;
		background: #FFF;
		color: #323233;
		font-size: 14px;
		display: flex;
		justify-content: left;
		box-sizing: border-box;
		padding: 10px 24rpx;
		overflow: hidden;
		text-align: left;
	}
}
</style>
