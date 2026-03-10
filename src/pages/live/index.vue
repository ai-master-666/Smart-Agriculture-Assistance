<template>
  <view class="live-container">
    <!-- 顶部搜索 -->
    <view class="header-search">
      <u-search placeholder="搜索主播或商品" v-model="keyword" :showAction="false" @search="onSearch"></u-search>
    </view>

    <!-- 分类 Tabs -->
    <view class="tabs-wrapper">
      <u-tabs :list="tabList" :current="currentTab" @click="changeTab" lineColor="#ff4d4f" activeColor="#ff4d4f"></u-tabs>
    </view>

    <!-- 直播列表 -->
    <view class="live-list">
      <view 
        v-for="live in liveList" 
        :key="live.id"
        class="live-card"
        @click="enterRoom(live.id)"
      >
        <view class="cover-section">
          <image :src="live.cover_image || '/static/default-live.png'" mode="aspectFill" class="cover-img"></image>
          
          <!-- 状态标签 -->
          <view class="live-status-tag" :class="live.status">
             <view class="dot" v-if="live.status === 'live'"></view>
             <text v-if="live.status === 'live'">直播中</text>
             <text v-else-if="live.status === 'pending'">预告 {{ live.start_time_str }}</text>
             <text v-else>回放</text>
          </view>
          
          <!-- 观看人数 -->
          <view class="viewer-info" v-if="live.status === 'live'">
            <u-icon name="eye" size="12" color="#fff"></u-icon>
            <text class="count">{{ formatNumber(live.viewer_count) }}</text>
          </view>
          
          <!-- 预约按钮 -->
          <view class="subscribe-btn" v-if="live.status === 'pending'" @click.stop="subscribeLive(live)">
            <text>预约</text>
          </view>
        </view>
        
        <view class="info-section">
          <text class="live-title">{{ live.title }}</text>
          <view class="host-row">
            <view class="host-left">
              <image :src="live.host_avatar || '/static/default-avatar.png'" mode="aspectFill" class="host-avatar"></image>
              <text class="host-name">{{ live.host_name || '主播' }}</text>
            </view>
            <view class="like-btn" @click.stop="toggleFollow(live)">
              <u-icon :name="live.is_followed ? 'heart-fill' : 'heart'" size="18" :color="live.is_followed ? '#ff4d4f' : '#999'"></u-icon>
            </view>
          </view>
          
          <!-- 商品橱窗预览 -->
          <view class="goods-preview" v-if="live.goods && live.goods.length > 0">
            <view class="goods-item" v-for="(good, idx) in live.goods.slice(0, 2)" :key="idx">
              <image :src="good.image" mode="aspectFill" class="goods-img"></image>
              <text class="goods-price">¥{{ good.price }}</text>
            </view>
            <view class="goods-count" v-if="live.goods.length > 2">
              <text>{{ live.goods.length }}件</text>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 加载更多 -->
    <view class="load-more" v-if="liveList.length > 0">
      <u-loadmore :status="loadStatus"></u-loadmore>
    </view>
    
    <!-- 空状态 -->
    <view v-if="liveList.length === 0 && loadStatus === 'nomore'" class="empty-state">
        <u-empty mode="data" text="暂无直播"></u-empty>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { onLoad, onPullDownRefresh, onReachBottom } from '@dcloudio/uni-app'
import { getLiveList } from '@/api/live'
import type { LiveRoom } from '@/api/live'

const liveList = ref<any[]>([])
const page = ref(1)
const pageSize = ref(10)
const loadStatus = ref<'loadmore' | 'loading' | 'nomore'>('loadmore')
const keyword = ref('')
const currentTab = ref(0)

const tabList = [
  { name: '全部' },
  { name: '直播中' },
  { name: '预告' },
  { name: '回放' }
]

// 模拟数据生成
const mockLiveList = (statusTab: number) => {
  const list = []
  for (let i = 0; i < 6; i++) {
    let status = 'live'
    if (statusTab === 2) status = 'pending'
    else if (statusTab === 3) status = 'replay'
    else status = Math.random() > 0.6 ? 'live' : (Math.random() > 0.5 ? 'pending' : 'replay')
    
    list.push({
      id: i + 1,
      title: status === 'live' ? '桃源村春茶上新，限时特惠抢购！' : (status === 'pending' ? '明日上午10点，带你走进有机果园' : '3.10 直播回放：种植技术分享'),
      cover_image: `/static/default-live.png`,
      status: status,
      viewer_count: Math.floor(Math.random() * 50000),
      host_name: '李村长',
      host_avatar: '/static/default-avatar.png',
      is_followed: false,
      start_time_str: '明日 10:00',
      goods: [
        { image: '/static/default-product.png', price: '29.9' },
        { image: '/static/default-product.png', price: '58.0' }
      ]
    })
  }
  return list
}

const loadData = async (reset = false) => {
  if (reset) {
      page.value = 1
      loadStatus.value = 'loading'
  }
  if (loadStatus.value === 'nomore' && !reset) return

  // 模拟接口请求延迟
  setTimeout(() => {
    const res = mockLiveList(currentTab.value)
    
    if (reset) {
        liveList.value = res
    } else {
        liveList.value = [...liveList.value, ...res]
    }
    
    if (liveList.value.length > 20) {
        loadStatus.value = 'nomore'
    } else {
        loadStatus.value = 'loadmore'
        page.value++
    }
    uni.stopPullDownRefresh()
  }, 800)
}

const changeTab = (item: any) => {
  currentTab.value = item.index
  loadData(true)
}

const onSearch = () => {
  loadData(true)
}

const enterRoom = (roomId: number) => {
  uni.navigateTo({ url: `/pages/live/room?id=${roomId}` })
}

const subscribeLive = (live: any) => {
  uni.requestSubscribeMessage({
    tmplIds: ['xxx'], // 需替换为真实模板ID
    complete: () => {
      uni.showToast({ title: '预约成功', icon: 'success' })
    }
  })
}

const toggleFollow = (live: any) => {
  live.is_followed = !live.is_followed
  uni.showToast({ title: live.is_followed ? '关注成功' : '已取消关注', icon: 'none' })
}

const formatNumber = (num: number) => {
  return num > 10000 ? (num / 10000).toFixed(1) + 'w' : num
}

onLoad(() => {
  loadData(true)
})

onPullDownRefresh(() => {
    loadData(true)
})

onReachBottom(() => {
    loadData()
})
</script>

<style lang="scss" scoped>
.live-container {
  min-height: 100vh;
  background: #f5f5f5;
}

.header-search {
  padding: 20rpx;
  background: #fff;
}

.tabs-wrapper {
  background: #fff;
  margin-bottom: 20rpx;
}

.live-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  padding: 0 20rpx;
  
  .live-card {
    width: 48%;
    background: #fff;
    border-radius: 16rpx;
    margin-bottom: 20rpx;
    overflow: hidden;
    box-shadow: 0 4rpx 12rpx rgba(0,0,0,0.05);
    
    .cover-section {
      position: relative;
      height: 360rpx;
      
      .cover-img {
        width: 100%;
        height: 100%;
        background-color: #eee;
      }
      
      .live-status-tag {
        position: absolute;
        top: 16rpx;
        left: 16rpx;
        padding: 4rpx 12rpx;
        border-radius: 30rpx;
        font-size: 20rpx;
        color: #fff;
        background: rgba(0,0,0,0.5);
        display: flex;
        align-items: center;
        backdrop-filter: blur(4rpx);
        
        .dot {
          width: 8rpx;
          height: 8rpx;
          background: #fff;
          border-radius: 50%;
          margin-right: 6rpx;
          animation: pulse 1.5s infinite;
        }
        
        &.live {
            background: linear-gradient(90deg, #ff4d4f 0%, #ff7875 100%);
        }
        
        &.pending {
            background: #1890ff;
        }
        
        &.replay {
            background: rgba(0,0,0,0.6);
        }
      }
      
      .viewer-info {
        position: absolute;
        bottom: 16rpx;
        left: 16rpx;
        display: flex;
        align-items: center;
        background: rgba(0,0,0,0.4);
        padding: 4rpx 10rpx;
        border-radius: 20rpx;
        
        .count {
            font-size: 20rpx;
            color: #fff;
            margin-left: 6rpx;
        }
      }
      
      .subscribe-btn {
        position: absolute;
        bottom: 16rpx;
        right: 16rpx;
        background: #1890ff;
        color: #fff;
        font-size: 22rpx;
        padding: 6rpx 20rpx;
        border-radius: 30rpx;
      }
    }
    
    .info-section {
      padding: 16rpx;
      
      .live-title {
        font-size: 28rpx;
        font-weight: bold;
        color: #333;
        margin-bottom: 16rpx;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        line-height: 1.4;
      }
      
      .host-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 16rpx;
        
        .host-left {
          display: flex;
          align-items: center;
          
          .host-avatar {
            width: 40rpx;
            height: 40rpx;
            border-radius: 20rpx;
            margin-right: 8rpx;
            background-color: #f5f5f5;
          }
          
          .host-name {
            font-size: 22rpx;
            color: #666;
            max-width: 140rpx;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }
      }
      
      .goods-preview {
        display: flex;
        gap: 8rpx;
        
        .goods-item {
          position: relative;
          width: 60rpx;
          height: 60rpx;
          border-radius: 8rpx;
          overflow: hidden;
          
          .goods-img {
            width: 100%;
            height: 100%;
          }
          
          .goods-price {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            background: rgba(0,0,0,0.6);
            color: #fff;
            font-size: 16rpx;
            text-align: center;
          }
        }
        
        .goods-count {
          width: 60rpx;
          height: 60rpx;
          background: #f5f5f5;
          border-radius: 8rpx;
          display: flex;
          align-items: center;
          justify-content: center;
          
          text {
            font-size: 18rpx;
            color: #999;
          }
        }
      }
    }
  }
}

@keyframes pulse {
  0% { opacity: 1; }
  50% { opacity: 0.5; }
  100% { opacity: 1; }
}

.load-more {
  padding: 20rpx 0;
}

.empty-state {
    margin-top: 200rpx;
}
</style>
