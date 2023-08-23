<template>
  <view class="sign-in">
    <!-- 日历头部 -->
    <view class="r-header" v-if="signData.type == 'month'">
      <view class="r-header-icon prev" v-if="indexMonth < (longList.length - 1)" @tap="nextDate(1)"><text class="iconfont iconzuo"></text>
      </view>
      <view class="title" :class="'text-' + themeColor.name">{{showList.year}}年{{showList.month}}月</view>
      <view class="r-header-icon next" v-if="indexMonth > 0" @tap="nextDate(-1)">
				<text class="iconfont iconyou"></text>
			</view>
    </view>
    <view class="r-header" v-if="signData.type == 'week'">
      <view class="r-header-icon prev" v-if="weekIndex > 0" @tap="nextWeekDate(-1)">
        <text class="iconfont iconzuo"></text>
			</view>
      <view class="title" :class="'text-' + themeColor.name">{{yeatTitle.year}}年{{yeatTitle.month}}月 第{{yeatTitle.week}}周</view>
      <view class="r-header-icon next" v-if="weekIndex < (weekList.length - 1)" @tap="nextWeekDate(1)">
				<text class="iconfont iconyou"></text>
      </view>
    </view>
    <!-- 日历星期 -->
    <view class="r-week">
      <view class="item">日</view>
      <view class="item">一</view>
      <view class="item">二</view>
      <view class="item">三</view>
      <view class="item">四</view>
      <view class="item">五</view>
      <view class="item">六</view>
    </view>
    <!-- 日历主体(月) -->
    <view class="r-content" v-if="signData.type == 'month'">
      <view class="r-content-box">
        <view class="item" v-for="(item, index) in showList.data" :key="index">

					<!--								#ifdef MP-->
					<view class="text"
								:class="[item | this.dayClassFilter]"
								@tap="signClick(index, 'week')"
					>{{item.day}}</view>
					<!--								#endif-->
					<!--								#ifndef MP-->
					<view class="text"
								:class="item | dayClassFilter"
								@tap="signClick(index, 'week')"
					>{{item.day}}</view>
					<!--								#endif-->
        </view>
      </view>
			<view class="info">
				<button class="sign-in-btn" :class="['bg-' + themeColor.name,  todayIsSign ? 'sign-in-btn-disabled' : '']" @tap="handleSignCallback('week')"><text class="iconfont iconzhiwen"></text>{{ todayIsSign ? '今日已签到' : '点击签到' }}</button>
			</view>
    </view>
    <!-- 日历主体(周) -->
    <view class="r-content" v-if="signData.type == 'week'">
      <swiper class="week-box" :duration="300" :current="weekIndex" @change="touchendWeek">
        <swiper-item v-for="(itemp, indexp) in weekList" :key="indexp">
          <view class="swiper-item">
            <view class="r-content-week">
              <view class="item" v-for="(item, index) in itemp" :key="index">
<!--								#ifdef MP-->
								<view
											v-if="moment(new Date()).format('YYYYMMDD') < `${item.year}${item.month < 10 ? `0${item.month}` : item.month}${item.day < 10 ? `0${item.day}` : item.day}`"
											class="text after"
											@tap="signClick(index, 'week')"
								>{{item.day}}</view>
								<block v-else>
									<view
										v-if="item.isSign"
										class="text active"
										@tap="signClick(index, 'week')"
									>{{item.day}}</view>
									<view
										v-else-if="moment(new Date()).format('YYYYMMDD') === `${item.year}${item.month < 10 ? `0${item.month}` : item.month}${item.day < 10 ? `0${item.day}` : item.day}`"
										class="text today"
										@tap="signClick(index, 'week')"
									>{{item.day}}</view>
								</block>
								<view class="text"
											:class="item.type === 'notday' ? 'after' : ''"
											@tap="signClick(index, 'week')"
								>{{item.day}}</view>
								<view class="text after"
											v-if="item.type === 'notday'"
											@tap="signClick(index, 'week')"
								>{{item.day}}</view>
<!--								#endif-->
<!--								#ifndef MP-->
								<view class="text"
											:class="item | dayClassFilter"
											@tap="signClick(index, 'week')"
								>{{item.day}}</view>
<!--								#endif-->
              </view>
            </view>
          </view>
        </swiper-item>
			</swiper>
			<view class="info">
				<button class="sign-in-btn" :class="['bg-' + themeColor.name,  todayIsSign ? 'sign-in-btn-disabled' : '']" @tap="handleSignCallback('week')"><text class="iconfont iconzhiwen"></text>{{ todayIsSign ? '今日已签到' : '点击签到' }}</button>
			</view>
		</view>
  </view>
</template>

<script>
/* eslint-disable */
  import moment from '@/common/moment';

	export default {
    props: {
      signData: {
        type: Object,
        default: () => {
          return []
        }
      },
      signList: {
        type: Array,
        default: () => {
					return []
				}
      },
			todayIsSign: {
        type: Boolean,
        default: false
      }
    },
		filters: {
			dayClassFilter (item) {
				const day = moment(new Date()).format('YYYYMMDD');
				let type = 'normal';
				if (day < `${item.year}${item.month < 10 ? `0${item.month}` : item.month}${item.day < 10 ? `0${item.day}` : item.day}`) {
					type = 'after';
				} else {
					if (day === `${item.year}${item.month < 10 ? `0${item.month}` : item.month}${item.day < 10 ? `0${item.day}` : item.day}`) {
						type = 'today';
					}
					if (item.isSign) {
						type = 'active';
					}
				}
				if (item.type === 'notday') {
					type = 'after';
				}
				return type;
			},
		},
		watch: {
			signList(newVal, oldVal) {
				if (newVal.length === 0) return;
				const day = moment(new Date()).format('YYYYMMDD');
				if(this.signData.type == 'week') {
					this.weekList[this.weekIndex].forEach((item, index) => {
						if (day === `${item.year}${item.month < 10 ? `0${item.month}` : item.month}${item.day < 10 ? `0${item.day}` : item.day}`) {
							item.isSign = true;
							this.$set(this.weekList[this.weekIndex], index, item);
						}
					});
				}
				if(this.signData.type == 'month') {
					this.showList.data.forEach((item, index) => {
						if (day === `${item.year}${item.month < 10 ? `0${item.month}` : item.month}${item.day < 10 ? `0${item.day}` : item.day}`) {
							item.isSign = true;
							this.$set(this.showList.data, index, item);
						}
					});
				}
				// 渲染当前显示页
				// this.getMonth()
			},
			'signData.type'(newVal, oldVal) {
				// 渲染当前显示页
				this.getMonth()
			}
		},
    data() {
      return {
				moment: moment,
        indexMonth: 0, // 当前显示月的index
        longList: [], // 从signData.start 到当前的年份月份
        nowList: {}, // 当前月日期数据
        showList: {}, // 显示月日期数据
        today: parseInt(new Date().getDate()), //本日
        toMonth: parseInt(new Date().getMonth() + 1), //本月
        toYear: parseInt(new Date().getFullYear()), //本年
        // 周单位滑动
        weekIndex: 0, // 当前周index
        weekList: [], // 周的列表
        yeatDay: [], // title信息
        yeatTitle: {},
        nextIndex: 0 // 记录已加载签到数据的周
      }
    },
    mounted() {
      this.getMonth()
    },
    methods: {
      // 获取longList数据
      getMonth() {
        // 获取start到当前月共多少月
        let _s = this.signData.start || '2019-08-01'
        let [_y, _m, _d] = _s.split('-')
        let _sy = this.toYear - _y, _sm = 0
        if(_sy > 0) { // 跨年
          if(_sy == 1) {
            _sm = 12 - _m + this.toMonth
          }else {
            _sm = (_sy - 1) * 12 + (12 - _m) + this.toMonth
          }
        }else {
          _sm = this.toMonth - _m
        }
        let y_index = this.toYear, m_index = this.toMonth
        // 遍历添加数组
        for(let i = 0; i <= _sm; i++) {
          let _month = m_index - i, _year = this.toYear
          for(let _i = 0; _i < _sy; _i++) {
            if(_month <= 0) {
              _month += 12
              _year -= 1
            }
          }
          this.longList.push({
            year: _year,
            month: _month,
            data: []
          })
          // 获取每个月的天数
          // let _day = new Date(this.toYear, this.toMonth, 0), _daycount = _day.getDate()
        }
        this.getDay()
      },
      // 获取每个月天数
      getDay() {
        for(let i = 0, _i = this.longList.length; i < _i; i++) {
          let _data = this.longList[i]
          let _day = new Date(_data.year, _data.month, 0), _daycount = _day.getDate()
          let _dayData = []
          // 当月一号前空格
          for(let j = 1; j <= _daycount; j++) { // 遍历每个月天数
            _dayData.push({
              year: _data.year,
              month: _data.month,
              day: j,
              type: 'day'
            })
          }
          this.longList[i].data = this.getDayEnd(_data.year, _data.month, _daycount, _dayData)
        }
        // 渲染当前显示页
        if(this.signData.type == 'month') {
          this.getNowData()
        }
        if(this.signData.type == 'week') {
          this.getNowWeek()
        }
      },
      /*
        补全当前月开头结尾
        @param {Number} year
        @param {Number} month
        @param {Number} daycount 当前月天数
      */
      getDayEnd(year, month, daycount, data) {
        // 获取当前月第一天和最后一天是星期几
        let first = this.getFirstDayOfWeek(year, month, 1),
          last = this.getFirstDayOfWeek(year, month, daycount)
        // 获取上个月最后一天
        let _month = month - 1 < 1 ? 12 : month - 1,
          _year = month - 1 < 1 ? year - 1 : year,
          month_ = month + 1 > 12 ? 1 : month + 1,
          year_ = month + 1 > 12 ? year + 1 : year
        let _prev = new Date(_year, _month, 0).getDate() // 上一月多少天
        // 处理数据
        for(let i = 0; i < first; i++) {
          data.unshift({
            year: _year,
            month: _month,
            day: _prev - i,
            type: 'notday'
          })
        }
        if(7 - last > 1) {
          for(let i = 1; i < 7 - last; i++) {
            data.push({
              year: year_,
              month: month_,
              day: i,
              type: 'notday'
            })
          }
        }
        return data
      },
      // 获取当前月日历
      getNowData() {
        this.longList.map((item, index) => {
          if(item.year == this.toYear) {
            if(item.month == this.toMonth) {
              this.nowList = item
              this.showList = item
            }
          }
        })
        this.signViewShow()
      },
      // 上下月份切换（上一月indexMonth+1，下一月indexMonth-1）
      nextDate(index) {
        this.indexMonth += index
        if(this.indexMonth < 0) {this.indexMonth = 0}
        if(this.indexMonth > this.longList.length - 1) {this.indexMonth = this.longList.length - 1}
        this.showList = this.longList[this.indexMonth]
        this.signViewShow()
				this.$emit('nextDate', {
					date: `${this.showList.year}-${this.showList.month}-01`,
				})
      },
      // 获取当月第一天星期几
      getFirstDayOfWeek(year, month, day) {
      	return new Date(Date.UTC(year, month - 1, day)).getDay()
      },
      // 加载已签到信息
      signViewShow() {
        let days = this.showList.data, dayArr = this.signList
        for(let i = 0, _i = days.length; i < _i; i++) {
          for(let j = 0, _j = dayArr.length; j < _j; j++) {
            if(dayArr[j].year == days[i].year && dayArr[j].month == days[i].month && dayArr[j].day == days[i].day) {
              days[i].isSign = true
            }
          }
        }
        this.showList.data = days
      },
      // 签到操作
      signClick(index, type) {
        let days = {}
        if(type == 'week') {
          days = this.weekList[this.weekIndex][index]
        }
        if(type == 'month') {
          days = this.showList.data[index]
        }
        let _y = days.year, _m = days.month, _d = days.day
        let click_data = _y + '-' + _m + '-' + _d, now_data = this.toYear + '-' + this.toMonth + '-' + this.today
        let _n = new Date(click_data), _z = new Date(now_data)
        let __n = _n.getTime(_n), __z = _z.getTime(_z)
        if(__z >= __n) {
          if(__z == __n) { // 当天签到
            if(!days.isSign) {
              days.isSign = true
              if(type == 'month') {
                this.$set(this.showList.data, index, days)
              }
              if(type == 'week') {
                this.$set(this.weekList[this.weekIndex], index, days)
              }
							this.$emit('callbackSign', {
								type: true,
								msg: '签到成功',
								data: days
							})
            }
          }else { // 补签
            if(!this.signData.ismake) {return false}
            if(days.type == 'notday') {return false}
            if(!days.isSign) {
              days.isSign = true
              if(type == 'month') {
                this.$set(this.showList.data, index, days)
              }
              if(type == 'week') {
                this.$set(this.weekList[this.weekIndex], index, days)
              }
							this.$emit('callbackSign', {
								type: false,
								msg: '补签成功',
								data: days
							})
            }
          }
        }
      },
			handleSignCallback(type) {
				this.$emit('callbackSign')
			},
      touchendWeek(e) {
        this.weekIndex = e.detail.current
        this.yeatTitle = this.yeatDay[this.weekIndex]
        if(this.nextIndex > this.weekIndex) {
          this.weekList = this.signViewShowWeek(this.weekList)
          this.nextIndex = this.weekIndex
        }
      },
      // 获取当前周的信息
      getNowWeek() {
        // month数据已做过处理，若当月一号不为周日，则往前面补位('', '', '', '1', '2')
        let _list = this.longList, _ = [], _yeatDay = []
        _list.reverse()
        _list.map((item, index) => {
          let num = Math.ceil(item.data.length / 7)
          // 在当前月只保留到当前周
          // 获取当前天是当前月第几周
          let __n = this.getMonthWeek(this.toYear, this.toMonth, this.today)
          if(index == _list.length - 1) {
            num = __n
          }
          for(let i = 0; i < num; i++) {
            _.push(item.data.slice(i * 7, i * 7 + 7))
            _yeatDay.push({
              year: item.year,
              month: item.month,
              week: i + 1
            })
          }
        })
        this.yeatDay = _yeatDay
        this.weekIndex = _.length - 1
        this.nextIndex = this.weekIndex
        this.weekList = this.signViewShowWeek(_)
        this.yeatTitle = this.yeatDay[this.weekIndex]
      },
      getMonthWeek(a, b, c) {
        let _k = new Date(a, b - 1, c), w = _k.getDay(), d = _k.getDate()
        if(w == 0) {w = 7}
        return Math.ceil((d + 6 - w) / 7)
      },
      // 二维数组换一维数组
      reduceWeek(arr) {
        let _arr = arr.reduce((a, b) => {
          return a.concat(b)
        })
        return _arr
      },
      // 加载已签到信息
      signViewShowWeek(data) {
        let days = data[this.weekIndex], dayArr = this.signList
        for(let i = 0, _i = days.length; i < _i; i++) {
          for(let j = 0, _j = dayArr.length; j < _j; j++) {
            if(dayArr[j].year == days[i].year && dayArr[j].month == days[i].month && dayArr[j].day == days[i].day) {
              days[i].isSign = true
            }
          }
        }
        data[this.weekIndex] = days
        return data
      },
      nextWeekDate(index) {
        this.weekIndex += index
        if(this.weekIndex < 0) {
          this.weekIndex = 0
          return false
        }
        if(this.weekIndex > this.weekList.length - 1) {
          this.weekIndex = this.weekList.length - 1
          return false
        }
        this.weekList = this.signViewShowWeek(this.weekList)
        this.yeatTitle = this.yeatDay[this.weekIndex]
				this.$emit('nextWeekDate', {
					date: `${this.weekList[this.weekIndex][0].year}-${this.weekList[this.weekIndex][0].month}-${this.weekList[this.weekIndex][0].day}`,
				})
      }
    }
  }
</script>

<style lang="scss">
.sign-in {
	background-color: #fff;
	border-radius: 8rpx;
}
  .r-header {
    position: relative;
    .title {
      height: 88rpx;
      line-height: 88rpx;
      font-size: 28rpx;
      text-align: center;
    }
  }
  .r-header::before, .r-header::after, .r-content::after {
    position: absolute;
    left: 0;
    right: 0;
    height: 1px;
    content: '';
    background-color: #f2f2f2;
    transform: scaleY(.6);
  }
  .r-header::before {
    top: 0;
  }
  .r-header::after, .r-content::after {
    bottom: 0;
  }
  .r-header-icon {
    position: absolute;
    top: 0;
    bottom: 0;
    width: 88rpx;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #666;
    font-size: 26rpx;
  }
  .r-header-icon.prev {
    left: 0;
  }
  .r-header-icon.next {
    right: 0;
  }
  .r-week {
    padding: 0 20rpx;
    height: 88rpx;
    display: flex;
    align-items: center;
    font-size: 24rpx;
    color: #999;
    .item {
      flex: 1;
      text-align: center;
    }
  }
  .r-content {
    padding: 0 20rpx 10rpx;
    position: relative;
  }
  .r-content-box {
    display: flex;
    flex-wrap: wrap;
    .item {
      box-sizing: border-box;
      width: 14.285%;
      padding-bottom: 20rpx;
    }
    .text {
      box-sizing: border-box;
			background: #efefef;
			color: #999;
      width: 60rpx;
      height: 60rpx;
      text-align: center;
      font-size: 22rpx;
      line-height: 60rpx;
      border-radius: 50%;
      margin: 0 auto;
    } // 今日样式
		.text.today {
			background: linear-gradient(to top, #eb3349, #f45c43);
			color: #fff;
		}
		// 普通样式
		.text.normal {
			background: #efefef;
			color: #999;
		}
		// 选中样式
		.text.active {
			background: linear-gradient(to top, #1d976c, #93f9b9);
			color: #fff;
		}
		// 漏签样式
		.text.not {
			color: #fff;
			background: linear-gradient(to top, #ff512f, #f09819)
		}
		// 补全样式
		.text.after {
			color: #999;
		}
  }
  .icon-direction {
    border: 20rpx solid transparent;
  }
  .icon-direction.left {
    border-right-color: #f2f2f2;
    transform: scale(1.1, .6);
  }
  .icon-direction.right {
    border-left-color: #f2f2f2;
    transform: scale(1.1, .6);
  }
  .week-box {
    white-space: nowrap;
    height: 70rpx;
  }
  .r-content-week {
    width: 100%;
    display: inline-block;
    vertical-align: top;
    white-space: nowrap;
    .item {
      display: inline-block;
      vertical-align: top;
      box-sizing: border-box;
      width: 14.285%;
      padding-bottom: 20rpx;
    }
    .text {
      box-sizing: border-box;
      width: 60rpx;
      height: 60rpx;
      text-align: center;
      font-size: 22rpx;
      line-height: 60rpx;
      border-radius: 50%;
      margin: 0 auto;
    }
    // 今日样式
    .text.today {
			background: linear-gradient(to top, #eb3349, #f45c43);
			color: #fff;
    }
    // 普通样式
    .text.normal {
			background: #efefef;
			color: #999;
    }
    // 选中样式
    .text.active {
			background: linear-gradient(to top, #1d976c, #93f9b9);
			color: #fff;
    }
    // 漏签样式
    .text.not {
      color: #fff;
			background: linear-gradient(to top, #ff512f, #f09819)
    }
    // 补全样式
    .text.after {
			color: #999;
    }
  }

.info {
	text-align: center;
	margin: $spacing-base 0 $spacing-sm;
	.sign-in-btn {
		display: inline-block;
		border-radius: 64rpx;
		height: 64rpx;
		line-height: 64rpx;
		font-size: $font-base;
		.iconfont {
			font-size: $font-base;
			margin-right: $spacing-sm;
		}
	}
	.sign-in-btn-disabled {
		opacity: 0.5;
	}
}
</style>
