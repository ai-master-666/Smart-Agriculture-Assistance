<template>
  <view class="recommend-container">
    <!-- 顶部导航 -->
    <view class="header">
      <view class="back-btn" @click="goBack">
        <u-icon name="arrow-left" size="28" color="#333"></u-icon>
      </view>
      <text class="title">景点推荐</text>
      <view class="placeholder"></view>
    </view>

    <!-- 推荐条件 -->
    <view class="condition-section">
      <view class="condition-card">
        <text class="condition-label">游玩时长</text>
        <view class="condition-options">
          <view 
            v-for="duration in durationOptions" 
            :key="duration.value"
            class="option-item"
            :class="{ active: selectedDuration === duration.value }"
            @click="selectedDuration = duration.value"
          >
            {{ duration.label }}
          </view>
        </view>
      </view>
      
      <view class="condition-card">
        <text class="condition-label">游玩偏好</text>
        <view class="condition-options">
          <view 
            v-for="preference in preferenceOptions" 
            :key="preference.value"
            class="option-item"
            :class="{ active: selectedPreferences.includes(preference.value) }"
            @click="togglePreference(preference.value)"
          >
            {{ preference.label }}
          </view>
        </view>
      </view>
      
      <view class="condition-card">
        <text class="condition-label">出行日期</text>
        <u-datetime-picker 
          :show="showDatePicker" 
          mode="date" 
          @confirm="selectDate" 
          @cancel="showDatePicker = false"
        ></u-datetime-picker>
        <view class="date-selector" @click="showDatePicker = true">
          <text>{{ selectedDate || '请选择日期' }}</text>
          <u-icon name="calendar" size="20" color="#666"></u-icon>
        </view>
      </view>
      
      <button class="recommend-btn" @click="generateRecommendations">
        生成推荐路线
      </button>
    </view>

    <!-- 推荐结果 -->
    <view class="result-section" v-if="recommendations.length > 0">
      <text class="section-title">推荐路线</text>
      <view class="route-card" v-for="(route, index) in recommendations" :key="index">
        <view class="route-header">
          <text class="route-name">{{ route.name }}</text>
          <text class="route-duration">{{ route.duration }}</text>
        </view>
        <view class="route-stops">
          <view class="stop-item" v-for="(stop, stopIndex) in route.stops" :key="stopIndex">
            <view class="stop-number">{{ stopIndex + 1 }}</view>
            <view class="stop-info">
              <text class="stop-name">{{ stop.name }}</text>
              <text class="stop-desc">{{ stop.description }}</text>
              <text class="stop-time">{{ stop.time }}</text>
            </view>
          </view>
        </view>
        <view class="route-footer">
          <text class="route-distance">{{ route.distance }}</text>
          <button class="navigate-btn" @click="navigateRoute(route)">
            导航
          </button>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'

// 推荐条件
const durationOptions = [
  { label: '半天', value: 'half-day' },
  { label: '一天', value: 'one-day' },
  { label: '两天', value: 'two-days' }
]
const selectedDuration = ref('one-day')

const preferenceOptions = [
  { label: '自然风光', value: 'nature' },
  { label: '人文古迹', value: 'culture' },
  { label: '农事体验', value: 'farming' },
  { label: '美食之旅', value: 'food' },
  { label: '休闲娱乐', value: 'leisure' }
]
const selectedPreferences = ref(['nature', 'culture'])

const showDatePicker = ref(false)
const selectedDate = ref('')

// 推荐结果
const recommendations = ref([
  {
    name: '桃源村一日游',
    duration: '约8小时',
    distance: '约15公里',
    stops: [
      {
        name: '桃花林',
        description: '欣赏美丽的桃花，拍照打卡',
        time: '09:00-11:00'
      },
      {
        name: '古村落',
        description: '参观历史悠久的古村落，了解传统文化',
        time: '11:30-13:00'
      },
      {
        name: '农家乐',
        description: '品尝当地特色美食',
        time: '13:30-15:00'
      },
      {
        name: '采摘园',
        description: '体验采摘乐趣，购买新鲜水果',
        time: '15:30-17:00'
      }
    ]
  },
  {
    name: '李家庄文化之旅',
    duration: '约6小时',
    distance: '约10公里',
    stops: [
      {
        name: '明清古街',
        description: '漫步在历史悠久的古街上',
        time: '10:00-11:30'
      },
      {
        name: '民俗博物馆',
        description: '了解当地的民俗文化',
        time: '12:00-13:30'
      },
      {
        name: '传统工艺坊',
        description: '参观传统手工艺品制作过程',
        time: '14:00-16:00'
      }
    ]
  }
])

// 方法
const togglePreference = (value: string) => {
  const index = selectedPreferences.value.indexOf(value)
  if (index === -1) {
    selectedPreferences.value.push(value)
  } else {
    selectedPreferences.value.splice(index, 1)
  }
}

const selectDate = (e: any) => {
  selectedDate.value = e.value
  showDatePicker.value = false
}

const generateRecommendations = () => {
  // 实际项目中这里应该根据用户选择的条件生成推荐
  uni.showToast({ title: '生成推荐路线', icon: 'success' })
}

const navigateRoute = (route: any) => {
  uni.showToast({ title: `导航到：${route.name}`, icon: 'none' })
}

const goBack = () => {
  uni.navigateBack()
}

onLoad()
</script>

<style lang="scss" scoped>
.recommend-container {
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

.condition-section {
  background: #fff;
  padding: 24rpx;
  margin-bottom: 20rpx;
  
  .condition-card {
    margin-bottom: 30rpx;
    
    &:last-child {
      margin-bottom: 40rpx;
    }
    
    .condition-label {
      display: block;
      font-size: 26rpx;
      font-weight: bold;
      color: #333;
      margin-bottom: 16rpx;
    }
    
    .condition-options {
      display: flex;
      flex-wrap: wrap;
      gap: 16rpx;
      
      .option-item {
        padding: 12rpx 24rpx;
        border: 2rpx solid #f0f0f0;
        border-radius: 24rpx;
        font-size: 24rpx;
        color: #666;
        
        &.active {
          border-color: #667eea;
          background: rgba(102, 126, 234, 0.1);
          color: #667eea;
        }
      }
    }
    
    .date-selector {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 20rpx;
      background: #f5f5f5;
      border-radius: 12rpx;
      font-size: 24rpx;
      color: #333;
    }
  }
  
  .recommend-btn {
    width: 100%;
    height: 80rpx;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: #fff;
    font-size: 28rpx;
    font-weight: bold;
    border-radius: 40rpx;
    border: none;
  }
}

.result-section {
  padding: 0 24rpx 40rpx;
  
  .section-title {
    display: block;
    font-size: 30rpx;
    font-weight: bold;
    color: #333;
    margin-bottom: 24rpx;
  }
  
  .route-card {
    background: #fff;
    border-radius: 16rpx;
    padding: 24rpx;
    margin-bottom: 20rpx;
    box-shadow: 0 4rpx 12rpx rgba(0,0,0,0.05);
    
    .route-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20rpx;
      
      .route-name {
        font-size: 28rpx;
        font-weight: bold;
        color: #333;
      }
      
      .route-duration {
        font-size: 22rpx;
        color: #667eea;
        background: rgba(102, 126, 234, 0.1);
        padding: 6rpx 16rpx;
        border-radius: 20rpx;
      }
    }
    
    .route-stops {
      margin-bottom: 24rpx;
      
      .stop-item {
        display: flex;
        margin-bottom: 24rpx;
        
        &:last-child {
          margin-bottom: 0;
        }
        
        .stop-number {
          width: 40rpx;
          height: 40rpx;
          border-radius: 20rpx;
          background: #667eea;
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 22rpx;
          font-weight: bold;
          margin-right: 16rpx;
          flex-shrink: 0;
        }
        
        .stop-info {
          flex: 1;
          
          .stop-name {
            display: block;
            font-size: 26rpx;
            font-weight: bold;
            color: #333;
            margin-bottom: 8rpx;
          }
          
          .stop-desc {
            font-size: 22rpx;
            color: #666;
            margin-bottom: 4rpx;
          }
          
          .stop-time {
            font-size: 20rpx;
            color: #999;
          }
        }
      }
    }
    
    .route-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 20rpx;
      border-top: 1rpx solid #f0f0f0;
      
      .route-distance {
        font-size: 22rpx;
        color: #666;
      }
      
      .navigate-btn {
        padding: 10rpx 24rpx;
        background: #667eea;
        color: #fff;
        font-size: 22rpx;
        border-radius: 20rpx;
        border: none;
      }
    }
  }
}
</style>