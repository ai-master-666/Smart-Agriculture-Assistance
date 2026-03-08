<template>
  <view class="tour-container">
    <!-- 顶部轮播图 -->
    <swiper class="banner-swiper" indicator-dots autoplay circular>
      <swiper-item v-for="(banner, index) in banners" :key="index">
        <image :src="banner.image" mode="aspectFill" class="banner-img"></image>
      </swiper-item>
    </swiper>

    <!-- 景点列表 -->
    <view class="scenic-list">
      <view 
        v-for="spot in scenicSpots" 
        :key="spot.id"
        class="scenic-card"
        @click="goToDetail(spot.id)"
      >
        <image :src="spot.cover_image || '/static/default-scenic.png'" mode="aspectFill" class="scenic-img"></image>
        
        <view class="scenic-info">
          <text class="scenic-title">{{ spot.name }}</text>
          <view class="scenic-meta">
            <u-icon name="map" size="14" color="#666"></u-icon>
            <text class="location">{{ spot.location || '未知位置' }}</text>
          </view>
          
          <view class="scenic-desc" v-if="spot.description">
              {{ spot.description }}
          </view>
          
          <view class="scenic-footer">
            <view class="price-box">
                <text class="scenic-price" v-if="spot.price > 0">¥{{ spot.price }}</text>
                <text class="scenic-free" v-else>免费开放</text>
            </view>
            <view class="rating" v-if="spot.rating">
              <u-rate :value="spot.rating" size="14" readonly activeColor="#ff9900"></u-rate>
              <text class="score">{{ spot.rating }}分</text>
            </view>
          </view>
        </view>
      </view>
    </view>
    
    <!-- 空状态 -->
    <view v-if="scenicSpots.length === 0" class="empty-state">
        <u-empty mode="data" text="暂无景点"></u-empty>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { onLoad, onPullDownRefresh } from '@dcloudio/uni-app'
import { getSpotList } from '../../api/tour'
import type { ScenicSpot } from '../../api/tour'

const banners = ref([
  { image: 'https://cdn.uviewui.com/uview/swiper/swiper1.png' },
  { image: 'https://cdn.uviewui.com/uview/swiper/swiper2.png' }
])

const scenicSpots = ref<ScenicSpot[]>([])

const loadScenicSpots = async () => {
  try {
    const res = await getSpotList()
    if (res) {
      scenicSpots.value = res
    } else {
      scenicSpots.value = []
    }
  } catch (e) {
    console.error('Failed to load scenic spots:', e)
  } finally {
      uni.stopPullDownRefresh()
  }
}

const goToDetail = (id: number) => {
  uni.navigateTo({ url: `/pages/tour/detail?id=${id}` })
}

onLoad(() => {
  loadScenicSpots()
})

onPullDownRefresh(() => {
    loadScenicSpots()
})
</script>

<style lang="scss" scoped>
.tour-container {
  min-height: 100vh;
  background: #f5f5f5;
  padding-bottom: 20rpx;
}

.banner-swiper {
  height: 360rpx;
  
  .banner-img {
    width: 100%;
    height: 100%;
  }
}

.scenic-list {
  padding: 20rpx;
  
  .scenic-card {
    background: #fff;
    border-radius: 16rpx;
    margin-bottom: 20rpx;
    overflow: hidden;
    box-shadow: 0 4rpx 12rpx rgba(0,0,0,0.05);
    
    .scenic-img {
      width: 100%;
      height: 320rpx;
      background-color: #eee;
    }
    
    .scenic-info {
      padding: 24rpx;
      
      .scenic-title {
        display: block;
        font-size: 32rpx;
        font-weight: bold;
        color: #333;
        margin-bottom: 12rpx;
      }
      
      .scenic-meta {
        display: flex;
        align-items: center;
        font-size: 24rpx;
        color: #666;
        margin-bottom: 12rpx;
        
        .location {
          margin-left: 8rpx;
        }
      }
      
      .scenic-desc {
          font-size: 24rpx;
          color: #999;
          margin-bottom: 20rpx;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
      }
      
      .scenic-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        
        .scenic-price {
          font-size: 36rpx;
          color: #ff4444;
          font-weight: bold;
        }
        
        .scenic-free {
          font-size: 28rpx;
          color: #43e97b;
          font-weight: bold;
        }
        
        .rating {
          display: flex;
          align-items: center;
          
          .score {
              font-size: 24rpx;
              color: #ff9900;
              margin-left: 8rpx;
              font-weight: bold;
          }
        }
      }
    }
  }
}

.empty-state {
    margin-top: 100rpx;
}
</style>
