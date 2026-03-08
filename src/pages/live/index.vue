<template>
  <view class="live-container">
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
          
          <view class="live-status-tag" :class="live.status">
             <text v-if="live.status === 'live'">直播中</text>
             <text v-else-if="live.status === 'pending'">预告</text>
             <text v-else>已结束</text>
          </view>
          
          <view class="viewer-info">
            <u-icon name="eye" size="14" color="#fff"></u-icon>
            <text class="count">{{ live.viewer_count || 0 }}</text>
          </view>
        </view>
        
        <view class="info-section">
          <text class="live-title">{{ live.title }}</text>
          <view class="host-info">
            <image :src="live.host_avatar || '/static/default-avatar.png'" mode="aspectFill" class="host-avatar"></image>
            <text class="host-name">{{ live.host_name || '主播' }}</text>
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

const liveList = ref<LiveRoom[]>([])
const page = ref(1)
const pageSize = ref(10)
const loadStatus = ref<'loadmore' | 'loading' | 'nomore'>('loadmore')

const loadData = async (reset = false) => {
  if (reset) {
      page.value = 1
      loadStatus.value = 'loading'
  }
  if (loadStatus.value === 'nomore' && !reset) return

  try {
      const res = await getLiveList({ page: page.value, page_size: pageSize.value })
      if (res) {
          if (reset) {
              liveList.value = res
          } else {
              liveList.value = [...liveList.value, ...res]
          }
          
          if (res.length < pageSize.value) {
              loadStatus.value = 'nomore'
          } else {
              loadStatus.value = 'loadmore'
              page.value++
          }
      } else {
          if (reset) liveList.value = []
          loadStatus.value = 'nomore'
      }
  } catch (e) {
      console.error('Failed to load live list', e)
      loadStatus.value = 'nomore'
  } finally {
      uni.stopPullDownRefresh()
  }
}

const enterRoom = (roomId: number) => {
  uni.navigateTo({ url: `/pages/live/room?id=${roomId}` })
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
  padding: 20rpx;
}

.live-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  
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
        border-radius: 8rpx;
        font-size: 20rpx;
        color: #fff;
        background: rgba(0,0,0,0.5);
        
        &.live {
            background: #ff4d4f;
        }
        
        &.pending {
            background: #1890ff;
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
    }
    
    .info-section {
      padding: 16rpx;
      
      .live-title {
        font-size: 28rpx;
        font-weight: bold;
        color: #333;
        margin-bottom: 12rpx;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        display: block;
      }
      
      .host-info {
        display: flex;
        align-items: center;
        
        .host-avatar {
          width: 40rpx;
          height: 40rpx;
          border-radius: 20rpx;
          margin-right: 12rpx;
          background-color: #f5f5f5;
        }
        
        .host-name {
          font-size: 24rpx;
          color: #666;
        }
      }
    }
  }
}

.load-more {
  padding: 20rpx 0;
}

.empty-state {
    margin-top: 200rpx;
}
</style>
