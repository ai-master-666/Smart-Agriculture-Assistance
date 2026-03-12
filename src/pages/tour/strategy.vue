<template>
  <view class="strategy-container">
    <!-- 顶部导航 -->
    <view class="header">
      <view class="back-btn" @click="goBack">
        <u-icon name="arrow-left" size="28" color="#333"></u-icon>
      </view>
      <text class="title">游玩攻略</text>
      <view class="placeholder"></view>
    </view>

    <!-- 攻略类型选择 -->
    <view class="strategy-tabs">
      <u-tabs :list="strategyTabs" :current="currentTab" @click="changeTab" lineColor="#667eea" activeColor="#667eea"></u-tabs>
    </view>

    <!-- 攻略内容 -->
    <scroll-view scroll-y class="strategy-content">
      <!-- 推荐路线 -->
      <view v-if="currentTab === 0" class="route-section">
        <view class="section-header">
          <text class="section-title">推荐路线</text>
        </view>
        
        <view class="route-list">
          <view 
            v-for="route in recommendedRoutes" 
            :key="route.id"
            class="route-card"
            @click="viewRouteDetail(route)"
          >
            <image :src="route.cover_image" mode="aspectFill" class="route-img"></image>
            <view class="route-info">
              <text class="route-title">{{ route.title }}</text>
              <view class="route-meta">
                <view class="meta-item">
                  <u-icon name="clock" size="14" color="#666"></u-icon>
                  <text>{{ route.duration }}</text>
                </view>
                <view class="meta-item">
                  <u-icon name="map" size="14" color="#666"></u-icon>
                  <text>{{ route.distance }}</text>
                </view>
                <view class="meta-item">
                  <u-icon name="star" size="14" color="#ff9900"></u-icon>
                  <text>{{ route.rating }}分</text>
                </view>
              </view>
              <text class="route-desc">{{ route.description }}</text>
              <view class="route-spots">
                <view class="spot-tag" v-for="(spot, index) in route.spots" :key="index">
                  {{ spot }}
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>

      <!-- 行程规划 -->
      <view v-else-if="currentTab === 1" class="plan-section">
        <view class="section-header">
          <text class="section-title">行程规划</text>
          <view class="create-btn" @click="createPlan">
            <u-icon name="plus" size="20" color="#667eea"></u-icon>
            <text>创建行程</text>
          </view>
        </view>
        
        <view class="plan-list">
          <view 
            v-for="plan in myPlans" 
            :key="plan.id"
            class="plan-card"
            @click="viewPlanDetail(plan)"
          >
            <view class="plan-header">
              <text class="plan-title">{{ plan.title }}</text>
              <text class="plan-date">{{ plan.date }}</text>
            </view>
            <view class="plan-spots">
              <text class="spot-count">{{ plan.spots.length }}个景点</text>
              <view class="spot-preview">
                <text v-for="(spot, index) in plan.spots.slice(0, 3)" :key="index">
                  {{ spot }}<text v-if="index < plan.spots.length - 1"> · </text>
                </text>
                <text v-if="plan.spots.length > 3">...</text>
              </view>
            </view>
            <view class="plan-footer">
              <view class="plan-status" :class="plan.status">
                {{ plan.status === 'upcoming' ? '即将出行' : plan.status === 'ongoing' ? '进行中' : '已完成' }}
              </view>
              <u-icon name="arrow-right" size="20" color="#999"></u-icon>
            </view>
          </view>
        </view>
        
        <view v-if="myPlans.length === 0" class="empty-state">
          <u-empty mode="data" text="暂无行程" @click="createPlan"></u-empty>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'

const currentTab = ref(0)
const strategyTabs = [
  { name: '推荐路线' },
  { name: '我的行程' }
]

// 推荐路线数据
const recommendedRoutes = ref([
  {
    id: 1,
    title: '桃源村一日游',
    cover_image: 'https://cdn.uviewui.com/uview/album/1.jpg',
    duration: '6小时',
    distance: '10公里',
    rating: 4.8,
    description: '体验田园风光，感受乡村魅力',
    spots: ['桃源村村委会', '桃花林', '农家乐', '采摘园']
  },
  {
    id: 2,
    title: '古村落文化之旅',
    cover_image: 'https://cdn.uviewui.com/uview/album/2.jpg',
    duration: '8小时',
    distance: '15公里',
    rating: 4.6,
    description: '探索历史文化，品味传统韵味',
    spots: ['李家庄古村', '明清古街', '民俗博物馆', '传统工艺坊']
  },
  {
    id: 3,
    title: '自然生态体验',
    cover_image: 'https://cdn.uviewui.com/uview/album/3.jpg',
    duration: '5小时',
    distance: '8公里',
    rating: 4.9,
    description: '亲近自然，感受生态之美',
    spots: ['杏花岭', '生态湿地', '观鸟台', '登山步道']
  }
])

// 我的行程数据
const myPlans = ref([
  {
    id: 1,
    title: '周末乡村游',
    date: '2024-03-16',
    spots: ['桃源村', '李家庄', '杏花岭'],
    status: 'upcoming'
  },
  {
    id: 2,
    title: '春季赏花之旅',
    date: '2024-03-20',
    spots: ['桃花林', '油菜花海', '樱花园'],
    status: 'upcoming'
  }
])

const changeTab = (item: any) => {
  currentTab.value = item.index
}

const viewRouteDetail = (route: any) => {
  uni.showToast({ title: `查看路线：${route.title}`, icon: 'none' })
}

const viewPlanDetail = (plan: any) => {
  uni.showToast({ title: `查看行程：${plan.title}`, icon: 'none' })
}

const createPlan = () => {
  uni.showToast({ title: '创建新行程', icon: 'none' })
}

const goBack = () => {
  uni.navigateBack()
}

onLoad()
</script>

<style lang="scss" scoped>
.strategy-container {
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

.strategy-tabs {
  background: #fff;
  margin-bottom: 20rpx;
}

.strategy-content {
  padding: 0 20rpx 40rpx;
  min-height: calc(100vh - 168rpx);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
  
  .section-title {
    font-size: 32rpx;
    font-weight: bold;
    color: #333;
  }
  
  .create-btn {
    display: flex;
    align-items: center;
    font-size: 24rpx;
    color: #667eea;
    
    text {
      margin-left: 8rpx;
    }
  }
}

.route-list {
  .route-card {
    background: #fff;
    border-radius: 16rpx;
    margin-bottom: 20rpx;
    overflow: hidden;
    box-shadow: 0 4rpx 12rpx rgba(0,0,0,0.05);
    
    .route-img {
      width: 100%;
      height: 280rpx;
      background-color: #eee;
    }
    
    .route-info {
      padding: 24rpx;
      
      .route-title {
        display: block;
        font-size: 32rpx;
        font-weight: bold;
        color: #333;
        margin-bottom: 16rpx;
      }
      
      .route-meta {
        display: flex;
        gap: 24rpx;
        margin-bottom: 16rpx;
        
        .meta-item {
          display: flex;
          align-items: center;
          font-size: 22rpx;
          color: #666;
          
          text {
            margin-left: 8rpx;
          }
        }
      }
      
      .route-desc {
        font-size: 24rpx;
        color: #999;
        margin-bottom: 20rpx;
        line-height: 1.4;
      }
      
      .route-spots {
        display: flex;
        flex-wrap: wrap;
        gap: 12rpx;
        
        .spot-tag {
          background: #f0f0f0;
          padding: 8rpx 16rpx;
          border-radius: 20rpx;
          font-size: 22rpx;
          color: #666;
        }
      }
    }
  }
}

.plan-list {
  .plan-card {
    background: #fff;
    border-radius: 16rpx;
    margin-bottom: 20rpx;
    padding: 24rpx;
    box-shadow: 0 4rpx 12rpx rgba(0,0,0,0.05);
    
    .plan-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16rpx;
      
      .plan-title {
        font-size: 28rpx;
        font-weight: bold;
        color: #333;
      }
      
      .plan-date {
        font-size: 22rpx;
        color: #999;
      }
    }
    
    .plan-spots {
      margin-bottom: 20rpx;
      
      .spot-count {
        display: block;
        font-size: 22rpx;
        color: #666;
        margin-bottom: 8rpx;
      }
      
      .spot-preview {
        font-size: 24rpx;
        color: #333;
        line-height: 1.4;
      }
    }
    
    .plan-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      
      .plan-status {
        padding: 6rpx 16rpx;
        border-radius: 20rpx;
        font-size: 20rpx;
        
        &.upcoming {
          background: #e6f7ff;
          color: #1890ff;
        }
        
        &.ongoing {
          background: #f6ffed;
          color: #52c41a;
        }
        
        &.completed {
          background: #f0f0f0;
          color: #999;
        }
      }
    }
  }
}

.empty-state {
  margin-top: 100rpx;
}
</style>