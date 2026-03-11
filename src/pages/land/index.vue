<template>
  <view class="land-list-container">
    <!-- 顶部操作栏 -->
    <view class="header-action">
      <view class="search-box">
        <u-search placeholder="搜索地块名称" v-model="keyword" :showAction="false"></u-search>
      </view>
      <view class="add-btn" @click="navigateToAdd">
        <u-icon name="plus" color="#fff" size="20"></u-icon>
        <text>新增地块</text>
      </view>
    </view>

    <!-- 土地列表 -->
    <view class="land-grid">
      <view class="land-card" v-for="(land, index) in landList" :key="index" @click="viewDetail(land)">
        <image :src="land.image || '/static/default-land.png'" mode="aspectFill" class="land-image"></image>
        <view class="land-info">
          <view class="land-header">
            <text class="land-name">{{ land.name }}</text>
            <view class="status-tag" :class="land.status">
              {{ land.statusText }}
            </view>
          </view>
          <view class="land-detail">
            <view class="detail-item">
              <u-icon name="map" size="14" color="#999"></u-icon>
              <text>{{ land.location }}</text>
            </view>
            <view class="detail-item">
              <u-icon name="grid" size="14" color="#999"></u-icon>
              <text>{{ land.area }} 亩</text>
            </view>
          </view>
          <view class="crop-info">
            <text class="label">当前作物：</text>
            <text class="value">{{ land.crop }}</text>
          </view>
          <view class="monitor-data">
            <view class="data-item">
              <text class="value">{{ land.humidity }}%</text>
              <text class="label">湿度</text>
            </view>
            <view class="data-item">
              <text class="value">{{ land.temperature }}°C</text>
              <text class="label">温度</text>
            </view>
            <view class="data-item">
              <text class="value">{{ land.ph }}</text>
              <text class="label">pH值</text>
            </view>
          </view>
        </view>
      </view>
    </view>

    <u-empty v-if="landList.length === 0" mode="data" text="暂无土地档案"></u-empty>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const keyword = ref('')

// 模拟数据
const landList = ref([
  {
    id: 1,
    name: '东山果园A区',
    image: '',
    status: 'normal',
    statusText: '生长良好',
    location: '桃源村东山坡',
    area: 15.5,
    crop: '红心猕猴桃',
    humidity: 65,
    temperature: 24,
    ph: 6.5
  },
  {
    id: 2,
    name: '西溪水稻田',
    image: '',
    status: 'warning',
    statusText: '需灌溉',
    location: '桃源村西溪边',
    area: 30.0,
    crop: '优质晚稻',
    humidity: 45,
    temperature: 26,
    ph: 6.2
  },
  {
    id: 3,
    name: '北坡茶园',
    image: '',
    status: 'normal',
    statusText: '采摘期',
    location: '桃源村北坡',
    area: 12.8,
    crop: '白茶',
    humidity: 60,
    temperature: 22,
    ph: 5.8
  }
])

const navigateToAdd = () => {
  uni.showToast({ title: '新增功能开发中', icon: 'none' })
}

const viewDetail = (land: any) => {
  uni.navigateTo({
    url: `/pages/land/detail?id=${land.id}&name=${land.name}`,
    fail: (err) => {
      console.error('Navigate failed:', err)
      uni.showToast({ title: '跳转失败', icon: 'none' })
    }
  })
}
</script>

<style lang="scss" scoped>
.land-list-container {
  min-height: 100vh;
  background: #f5f5f5;
  padding: 20rpx;
}

.header-action {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30rpx;
  
  .search-box {
    flex: 1;
    margin-right: 20rpx;
  }
  
  .add-btn {
    display: flex;
    align-items: center;
    background: #4caf50;
    padding: 12rpx 24rpx;
    border-radius: 30rpx;
    
    text {
      color: #fff;
      font-size: 26rpx;
      margin-left: 8rpx;
    }
  }
}

.land-card {
  background: #fff;
  border-radius: 20rpx;
  overflow: hidden;
  margin-bottom: 30rpx;
  box-shadow: 0 4rpx 16rpx rgba(0,0,0,0.05);
  
  .land-image {
    width: 100%;
    height: 300rpx;
    background-color: #eee;
  }
  
  .land-info {
    padding: 24rpx;
    
    .land-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20rpx;
      
      .land-name {
        font-size: 32rpx;
        font-weight: bold;
        color: #333;
      }
      
      .status-tag {
        font-size: 24rpx;
        padding: 4rpx 16rpx;
        border-radius: 8rpx;
        
        &.normal {
          background: #e6f7ff;
          color: #1890ff;
        }
        
        &.warning {
          background: #fffbe6;
          color: #faad14;
        }
      }
    }
    
    .land-detail {
      display: flex;
      gap: 30rpx;
      margin-bottom: 20rpx;
      
      .detail-item {
        display: flex;
        align-items: center;
        gap: 8rpx;
        
        text {
          font-size: 26rpx;
          color: #666;
        }
      }
    }
    
    .crop-info {
      font-size: 26rpx;
      margin-bottom: 24rpx;
      
      .label {
        color: #999;
      }
      .value {
        color: #333;
        font-weight: 500;
      }
    }
    
    .monitor-data {
      display: flex;
      justify-content: space-between;
      background: #f9f9f9;
      padding: 20rpx;
      border-radius: 12rpx;
      
      .data-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        
        .value {
          font-size: 32rpx;
          font-weight: bold;
          color: #333;
          margin-bottom: 4rpx;
        }
        
        .label {
          font-size: 22rpx;
          color: #999;
        }
      }
    }
  }
}
</style>