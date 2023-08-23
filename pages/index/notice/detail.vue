//微信：egvh56ufy7hh ，QQ：821898835 
<template>
	<view class="rf-notice-detail">
		<view class="banner" v-if="announceDetail.cover">
			<rf-image class="banner-img" :src="announceDetail.cover"></rf-image>
			<view class="banner-title in2line">{{ announceDetail.title }}</view>
		</view>
		<view class="banner-title" v-if="!announceDetail.cover">{{
			announceDetail.title
		}}</view>
		<view class="article-meta" v-if="announceDetail.created_at">
			<text class="article-author">{{ announceDetail.author_name }}</text>
			<text class="article-text">发布于</text>
			<text class="article-time">{{ announceDetail.created_at | time }}</text>
		</view>
		<view class="article-content">
			<rf-parser lazy-load :html="announceDetail.content"></rf-parser>
		</view>
		<rf-empty
			info="暂无商城公告详情"
			v-if="!announceDetail && !loading"
		></rf-empty>
		<!--加载动画-->
		<rfLoading isFullScreen :active="loading"></rfLoading>
	</view>
</template>

<script>
import { no
		overflow: hidden;
		font-size: 30rpx;
		margin-bottom: 30rpx;
	}
}
</style>
