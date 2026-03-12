<template>
  <view class="checkin-container">
    <!-- 顶部导航 -->
    <view class="header">
      <view class="back-btn" @click="goBack">
        <u-icon name="arrow-left" size="28" color="#333"></u-icon>
      </view>
      <text class="title">打卡签到</text>
      <view class="placeholder"></view>
    </view>

    <!-- 景点信息 -->
    <view class="spot-info">
      <image :src="currentSpot.cover_image" mode="aspectFill" class="spot-img"></image>
      <view class="spot-detail">
        <text class="spot-name">{{ currentSpot.name }}</text>
        <view class="spot-location">
          <u-icon name="map" size="16" color="#666"></u-icon>
          <text>{{ currentSpot.location }}</text>
        </view>
        <view class="spot-distance" v-if="distance">
          <u-icon name="location" size="16" color="#667eea"></u-icon>
          <text>{{ distance }}米</text>
        </view>
      </view>
    </view>

    <!-- 打卡区域 -->
    <view class="checkin-section">
      <view class="checkin-card" :class="{ 'checked-in': hasCheckedIn }">
        <view class="checkin-icon">
          <u-icon :name="hasCheckedIn ? 'checkmark-circle' : 'location'" size="80" :color="hasCheckedIn ? '#52c41a' : '#667eea'"></u-icon>
        </view>
        <text class="checkin-status">{{ hasCheckedIn ? '已打卡' : '未打卡' }}</text>
        <text class="checkin-tip" v-if="!hasCheckedIn">
          {{ canCheckIn ? '点击打卡，分享你的旅行足迹' : '距离太远，无法打卡' }}
        </text>
        <button 
          class="checkin-btn" 
          :disabled="!canCheckIn || hasCheckedIn"
          @click="checkIn"
        >
          {{ hasCheckedIn ? '已打卡' : '立即打卡' }}
        </button>
      </view>
    </view>

    <!-- 打卡记录 -->
    <view class="checkin-history">
      <view class="section-header">
        <text class="section-title">打卡记录</text>
        <text class="section-subtitle">{{ checkinHistory.length }}次打卡</text>
      </view>
      <view class="history-list">
        <view 
          v-for="record in checkinHistory" 
          :key="record.id"
          class="history-item"
        >
          <view class="history-date">{{ record.date }}</view>
          <view class="history-time">{{ record.time }}</view>
          <view class="history-weather">{{ record.weather }}</view>
        </view>
      </view>
    </view>

    <!-- 分享海报 -->
    <view class="share-section" v-if="hasCheckedIn">
      <view class="section-header">
        <text class="section-title">分享足迹</text>
      </view>
      <view class="share-card">
        <image :src="posterUrl" mode="aspectFill" class="poster-img"></image>
        <view class="share-actions">
          <button class="share-btn" @click="generatePoster">
            <u-icon name="refresh" size="20" color="#667eea"></u-icon>
            <text>重新生成</text>
          </button>
          <button class="share-btn primary" @click="sharePoster">
            <u-icon name="share" size="20" color="#fff"></u-icon>
            <text>分享到朋友圈</text>
          </button>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { onLoad } from '@dcloudio/uni-app'

const currentSpot = ref({
  id: 1,
  name: '桃源村',
  location: '北京市海淀区上庄镇',
  cover_image: 'https://cdn.uviewui.com/uview/album/1.jpg'
})

const distance = ref(120) // 距离景点的距离（米）
const hasCheckedIn = ref(false)
const canCheckIn = ref(true) // 是否可以打卡
const posterUrl = ref('https://cdn.uviewui.com/uview/album/1.jpg') // 分享海报图片

// 打卡记录
const checkinHistory = ref([
  {
    id: 1,
    date: '2024-03-10',
    time: '14:30',
    weather: '晴'
  },
  {
    id: 2,
    date: '2024-02-25',
    time: '10:15',
    weather: '多云'
  }
])

const checkIn = () => {
  if (!canCheckIn.value) return
  
  // 模拟打卡
  uni.showLoading({ title: '正在打卡...' })
  setTimeout(() => {
    hasCheckedIn.value = true
    // 添加新的打卡记录
    checkinHistory.value.unshift({
      id: Date.now(),
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
      weather: '晴'
    })
    // 生成分享海报
    generatePoster()
    uni.hideLoading()
    uni.showToast({ title: '打卡成功', icon: 'success' })
  }, 1000)
}

const generatePoster = () => {
  // 模拟生成海报
  uni.showLoading({ title: '生成海报中...' })
  setTimeout(() => {
    // 实际项目中，这里应该调用后端API生成海报
    // 这里使用模拟数据
    posterUrl.value = 'https://cdn.uviewui.com/uview/album/1.jpg'
    uni.hideLoading()
    uni.showToast({ title: '海报生成成功', icon: 'success' })
  }, 1500)
}

const sharePoster = () => {
  uni.showToast({ title: '分享到朋友圈', icon: 'none' })
  // 实际项目中，这里应该调用微信的分享API
}

const goBack = () => {
  uni.navigateBack()
}

onLoad((options: any) => {
  if (options.id) {
    // 根据ID加载景点信息
    console.log('Loading spot with id:', options.id)
  }
})

onMounted(() => {
  // 模拟获取当前位置与景点的距离
  setTimeout(() => {
    // 随机生成距离
    distance.value = Math.floor(Math.random() * 500) + 50
    canCheckIn.value = distance.value < 200 // 200米内可以打卡
  }, 500)
})
</script>

<style lang="scss" scoped>
.checkin-container {
  min-height: 100vh;
  background: #f5f5f5;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 88rpx;
  padding: 0 20rpx;
  background: #fff;
  box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.05);
  
  .back-btn {
    width: 60rpx;
    height: 60rpx;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .title {
    font-size: 32rpx;
    font-weight: bold;
    color: #333;
  }
  
  .placeholder {
    width: 60rpx;
  }
}

.spot-info {
  background: #fff;
  margin-bottom: 20rpx;
  
  .spot-img {
    width: 100%;
    height: 320rpx;
    background-color: #eee;
  }
  
  .spot-detail {
    padding: 24rpx;
    
    .spot-name {
      display: block;
      font-size: 32rpx;
      font-weight: bold;
      color: #333;
      margin-bottom: 12rpx;
    }
    
    .spot-location {
      display: flex;
      align-items: center;
      font-size: 24rpx;
      color: #666;
      margin-bottom: 8rpx;
      
      text {
        margin-left: 8rpx;
      }
    }
    
    .spot-distance {
      display: flex;
      align-items: center;
      font-size: 24rpx;
      color: #667eea;
      font-weight: bold;
      
      text {
        margin-left: 8rpx;
      }
    }
  }
}

.checkin-section {
  padding: 0 20rpx;
  margin-bottom: 20rpx;
  
  .checkin-card {
    background: #fff;
    border-radius: 16rpx;
    padding: 40rpx;
    display: flex;
    flex-direction: column;
    align-items: center;
    box-shadow: 0 4rpx 12rpx rgba(0,0,0,0.05);
    
    &.checked-in {
      border: 2rpx solid #52c41a;
    }
    
    .checkin-icon {
      margin-bottom: 20rpx;
    }
    
    .checkin-status {
      font-size: 32rpx;
      font-weight: bold;
      color: #333;
      margin-bottom: 16rpx;
    }
    
    .checkin-tip {
      font-size: 24rpx;
      color: #999;
      margin-bottom: 32rpx;
      text-align: center;
      line-height: 1.4;
    }
    
    .checkin-btn {
      width: 200rpx;
      height: 72rpx;
      background: #667eea;
      color: #fff;
      font-size: 28rpx;
      font-weight: bold;
      border-radius: 36rpx;
      border: none;
      
      &:disabled {
        background: #ccc;
      }
    }
  }
}

.checkin-history {
  background: #fff;
  padding: 24rpx;
  margin-bottom: 20rpx;
  
  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24rpx;
    
    .section-title {
      font-size: 28rpx;
      font-weight: bold;
      color: #333;
    }
    
    .section-subtitle {
      font-size: 22rpx;
      color: #999;
    }
  }
  
  .history-list {
    .history-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16rpx 0;
      border-bottom: 1rpx solid #f0f0f0;
      
      &:last-child {
        border-bottom: none;
      }
      
      .history-date {
        font-size: 24rpx;
        color: #333;
        font-weight: bold;
      }
      
      .history-time {
        font-size: 22rpx;
        color: #666;
      }
      
      .history-weather {
        font-size: 22rpx;
        color: #999;
      }
    }
  }
}

.share-section {
  background: #fff;
  padding: 24rpx;
  margin-bottom: 40rpx;
  
  .section-header {
    margin-bottom: 24rpx;
    
    .section-title {
      font-size: 28rpx;
      font-weight: bold;
      color: #333;
    }
  }
  
  .share-card {
    .poster-img {
      width: 100%;
      height: 480rpx;
      border-radius: 12rpx;
      background-color: #eee;
      margin-bottom: 24rpx;
    }
    
    .share-actions {
      display: flex;
      gap: 16rpx;
      
      .share-btn {
        flex: 1;
        height: 72rpx;
        border: 2rpx solid #667eea;
        color: #667eea;
        font-size: 24rpx;
        border-radius: 36rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        
        text {
          margin-left: 8rpx;
        }
        
        &.primary {
          background: #667eea;
          color: #fff;
        }
      }
    }
  }
}
</style>