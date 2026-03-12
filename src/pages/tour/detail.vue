<template>
  <view class="detail-container" v-if="spot">
    <!-- 顶部 VR 快速入口或封面图 -->
    <view class="media-section">
      <image :src="spot.cover_image || '/static/default-scenic.png'" mode="aspectFill" class="cover-img"></image>
      <view class="vr-badge" @click="goToVR" v-if="spot.scene_config">
        <u-icon name="eye-fill" color="#fff" size="18"></u-icon>
        <text>VR全景</text>
      </view>
    </view>

    <view class="content-section">
      <view class="header-info">
        <view class="title-row">
          <text class="title">{{ spot.name }}</text>
          <view class="favorite-btn" @click="toggleFavorite">
            <u-icon :name="isFavorite ? 'star-fill' : 'star'" :color="isFavorite ? '#ff9900' : '#999'" size="24"></u-icon>
          </view>
        </view>
        <view class="tag-row">
          <u-tag :text="spot.category" size="mini" type="primary" plain></u-tag>
          <text class="rating">{{ spot.rating || '4.8' }}分</text>
        </view>
      </view>

      <!-- 地址导航 -->
      <view class="address-box" @click="openMap">
        <view class="left">
          <u-icon name="map-fill" color="#667eea" size="18"></u-icon>
          <text class="address-text">{{ spot.location || '地址信息加载中...' }}</text>
        </view>
        <u-icon name="arrow-right" color="#999" size="14"></u-icon>
      </view>

      <view class="divider"></view>

      <!-- 景点介绍 -->
      <view class="section-box">
        <text class="section-title">景点介绍</text>
        <view class="intro-content">
          <text class="text">{{ spot.description || '暂无详细介绍' }}</text>
        </view>
      </view>

      <view class="divider"></view>

      <!-- 游玩提示 -->
      <view class="section-box">
        <text class="section-title">游玩提示</text>
        <view class="tips-list">
          <view class="tip-item">
            <u-icon name="clock" size="16" color="#666"></u-icon>
            <text>开放时间：08:30 - 18:00</text>
          </view>
          <view class="tip-item">
            <u-icon name="info-circle" size="16" color="#666"></u-icon>
            <text>门票信息：{{ spot.price > 0 ? '¥' + spot.price : '免费开放' }}</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 底部操作栏 -->
    <view class="action-bar">
      <view class="icon-btns">
        <view class="icon-btn" @click="contactVillage">
          <u-icon name="phone" size="22" color="#666"></u-icon>
          <text>咨询</text>
        </view>
        <view class="icon-btn" @click="shareSpot">
          <u-icon name="share" size="22" color="#666"></u-icon>
          <text>分享</text>
        </view>
        <view class="icon-btn" @click="checkInSpot">
          <u-icon name="map" size="22" color="#666"></u-icon>
          <text>打卡</text>
        </view>
      </view>
      <button class="booking-btn" @click="goToBooking">立即预约体验</button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { getSpotDetail } from '@/api/tour'
import type { SpotDetail } from '@/api/tour'

const spot = ref<SpotDetail | null>(null)
const isFavorite = ref(false)

onLoad(async (options: any) => {
  if (options.id) {
    try {
      const res = await getSpotDetail(Number(options.id))
      if (res) {
        spot.value = res
        // Mock some data if missing
        if (!spot.value.description) {
            spot.value.description = '这是一个美丽的乡村景点，拥有独特的自然风光和深厚的人文底蕴。在这里你可以体验最纯粹的农耕文化，呼吸最新鲜的空气。'
        }
      }
    } catch (e) {
      console.error(e)
    }
  }
})

const goToVR = () => {
  if (spot.value) {
    uni.navigateTo({ url: `/pages/tour/vr?id=${spot.value.id}` })
  }
}

const toggleFavorite = () => {
  isFavorite.value = !isFavorite.value
  uni.showToast({ title: isFavorite.value ? '已收藏' : '已取消', icon: 'none' })
}

const openMap = () => {
  if (spot.value) {
    uni.openLocation({
      latitude: 30.274085, // Mock coords
      longitude: 120.15507,
      name: spot.value.name,
      address: spot.value.location
    })
  }
}

const goToBooking = () => {
  if (spot.value) {
    uni.navigateTo({ url: `/pages/tour/booking?id=${spot.value.id}&name=${spot.value.name}` })
  }
}

const contactVillage = () => {
  uni.makePhoneCall({ phoneNumber: '10086' })
}

const shareSpot = () => {
  uni.showToast({ title: '分享功能开发中', icon: 'none' })
}

const checkInSpot = () => {
  // 1. Check distance (Mock)
  uni.showLoading({ title: '定位中...' })
  setTimeout(() => {
    uni.hideLoading()
    // Mock success
    uni.showModal({
      title: '打卡成功',
      content: `恭喜您成功打卡${spot.value?.name || '景点'}！已为您生成专属纪念海报。`,
      confirmText: '查看海报',
      success: (res) => {
        if (res.confirm) {
          uni.previewImage({
            urls: [spot.value?.cover_image || '/static/default-scenic.png']
          })
        }
      }
    })
  }, 1000)
}
</script>

<style lang="scss" scoped>
.detail-container {
  min-height: 100vh;
  background: #f8f8f8;
  padding-bottom: 120rpx;
}

.media-section {
  position: relative;
  width: 100%;
  height: 500rpx;
  
  .cover-img {
    width: 100%;
    height: 100%;
  }
  
  .vr-badge {
    position: absolute;
    right: 30rpx;
    bottom: 30rpx;
    background: rgba(102, 126, 234, 0.8);
    backdrop-filter: blur(10rpx);
    padding: 10rpx 24rpx;
    border-radius: 40rpx;
    display: flex;
    align-items: center;
    color: #fff;
    font-size: 24rpx;
    
    text {
      margin-left: 8rpx;
      font-weight: bold;
    }
  }
}

.content-section {
  background: #fff;
  border-radius: 30rpx 30rpx 0 0;
  margin-top: -30rpx;
  position: relative;
  padding: 40rpx 30rpx;
}

.header-info {
  margin-bottom: 30rpx;
  
  .title-row {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 16rpx;
    
    .title {
      font-size: 40rpx;
      font-weight: bold;
      color: #333;
      flex: 1;
    }
  }
  
  .tag-row {
    display: flex;
    align-items: center;
    
    .rating {
      font-size: 26rpx;
      color: #ff9900;
      font-weight: bold;
      margin-left: 20rpx;
    }
  }
}

.address-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f9f9f9;
  padding: 24rpx;
  border-radius: 12rpx;
  margin-bottom: 40rpx;
  
  .left {
    display: flex;
    align-items: center;
    flex: 1;
    margin-right: 20rpx;
    
    .address-text {
      font-size: 26rpx;
      color: #666;
      margin-left: 12rpx;
    }
  }
}

.divider {
  height: 20rpx;
  background: #f8f8f8;
  margin: 0 -30rpx 40rpx;
}

.section-box {
  margin-bottom: 40rpx;
  
  .section-title {
    font-size: 32rpx;
    font-weight: bold;
    color: #333;
    margin-bottom: 24rpx;
    display: block;
    position: relative;
    padding-left: 20rpx;
    
    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      width: 6rpx;
      height: 28rpx;
      background: #667eea;
      border-radius: 4rpx;
    }
  }
  
  .intro-content {
    .text {
      font-size: 28rpx;
      color: #666;
      line-height: 1.6;
    }
  }
  
  .tips-list {
    .tip-item {
      display: flex;
      align-items: center;
      margin-bottom: 16rpx;
      
      text {
        font-size: 26rpx;
        color: #666;
        margin-left: 16rpx;
      }
    }
  }
}

.action-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 110rpx;
  background: #fff;
  display: flex;
  align-items: center;
  padding: 0 30rpx;
  box-sizing: border-box;
  box-shadow: 0 -2rpx 10rpx rgba(0,0,0,0.05);
  z-index: 100;
  
  .icon-btns {
    display: flex;
    margin-right: 30rpx;
    
    .icon-btn {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-right: 40rpx;
      
      text {
        font-size: 20rpx;
        color: #666;
        margin-top: 4rpx;
      }
    }
  }
  
  .booking-btn {
    flex: 1;
    height: 80rpx;
    line-height: 80rpx;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: #fff;
    border-radius: 40rpx;
    font-size: 28rpx;
    font-weight: bold;
    border: none;
    
    &::after {
      border: none;
    }
  }
}
</style>
