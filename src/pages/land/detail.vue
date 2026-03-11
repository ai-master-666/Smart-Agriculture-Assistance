<template>
  <view class="land-detail-container">
    <!-- 顶部地块信息卡片 -->
    <view class="land-info-card">
      <view class="card-header">
        <text class="title">地块档案</text>
        <view class="status-badge" :class="landInfo.status">{{ landInfo.statusText }}</view>
      </view>
      <view class="info-grid">
        <view class="info-item">
          <text class="label">地块名称</text>
          <text class="value">{{ landInfo.name }}</text>
        </view>
        <view class="info-item">
          <text class="label">地块位置</text>
          <text class="value">{{ landInfo.location }}</text>
        </view>
        <view class="info-item">
          <text class="label">种植面积</text>
          <text class="value">{{ landInfo.area }} 亩</text>
        </view>
        <view class="info-item">
          <text class="label">土壤类型</text>
          <text class="value">{{ landInfo.soilType }}</text>
        </view>
      </view>
      <view class="action-row">
        <u-button size="small" type="primary" plain shape="circle" icon="file-text" text="查看证明" @click="viewCertificate"></u-button>
        <u-button size="small" type="success" plain shape="circle" icon="edit" text="编辑信息" @click="editInfo"></u-button>
      </view>
    </view>

    <!-- 功能导航九宫格 -->
    <view class="function-grid">
      <view class="grid-item" @click="navigateTo('monitor')">
        <view class="icon-box monitor">
          <u-icon name="dashboard" size="28" color="#fff"></u-icon>
        </view>
        <text class="grid-text">环境监测</text>
      </view>
      <view class="grid-item" @click="navigateTo('dashboard')">
        <view class="icon-box data">
          <u-icon name="trending-up" size="28" color="#fff"></u-icon>
        </view>
        <text class="grid-text">数据看板</text>
      </view>
      <view class="grid-item" @click="navigateTo('record')">
        <view class="icon-box record">
          <u-icon name="list-dot" size="28" color="#fff"></u-icon>
        </view>
        <text class="grid-text">农事记录</text>
      </view>
      <view class="grid-item" @click="navigateTo('iot')">
        <view class="icon-box iot">
          <u-icon name="wifi" size="28" color="#fff"></u-icon>
        </view>
        <text class="grid-text">IoT设备</text>
      </view>
    </view>

    <!-- 预警提醒 -->
    <view class="section-card">
      <view class="section-header">
        <text class="title">预警提醒</text>
        <text class="more">全部 ></text>
      </view>
      <view class="warning-list">
        <view class="warning-item" v-for="(item, index) in warningList" :key="index">
          <u-icon name="info-circle-fill" size="20" color="#ff4d4f" class="warning-icon"></u-icon>
          <view class="warning-content">
            <text class="warning-title">{{ item.title }}</text>
            <text class="warning-time">{{ item.time }}</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 生长周期追踪 -->
    <view class="section-card">
      <view class="section-header">
        <text class="title">生长周期</text>
        <text class="subtitle">预计收获：{{ landInfo.harvestDate }}</text>
      </view>
      <view class="cycle-timeline">
        <u-steps :current="1" direction="column" dot>
          <u-steps-item title="播种期" desc="2024-03-01 已完成"></u-steps-item>
          <u-steps-item title="生长期" desc="当前阶段 预计持续至 05-15"></u-steps-item>
          <u-steps-item title="成熟期" desc="预计 05-20 开始"></u-steps-item>
          <u-steps-item title="收获期" desc="预计 06-01 开始"></u-steps-item>
        </u-steps>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'

const landInfo = ref({
  id: 1,
  name: '东山果园A区',
  status: 'normal',
  statusText: '生长良好',
  location: '桃源村东山坡',
  area: 15.5,
  soilType: '红壤土',
  harvestDate: '2024-06-01'
})

const warningList = ref([
  { title: '未来24小时可能有大雨，请注意排水', time: '10分钟前' },
  { title: '土壤湿度偏低，建议灌溉', time: '2小时前' }
])

onLoad((options: any) => {
  if (options.id) {
    // Mock: Load data by ID
    // landInfo.value = await getLandDetail(options.id)
  }
})

const navigateTo = (type: string) => {
  if (type === 'monitor') {
    uni.navigateTo({ url: `/pages/land/monitor?id=${landInfo.value.id}&name=${landInfo.value.name}` })
  } else {
    uni.showToast({ title: '功能开发中', icon: 'none' })
  }
}

const viewCertificate = () => {
  uni.previewImage({
    urls: ['/static/default-land.png'] // Mock certificate image
  })
}

const editInfo = () => {
  uni.showToast({ title: '编辑功能开发中', icon: 'none' })
}
</script>

<style lang="scss" scoped>
.land-detail-container {
  min-height: 100vh;
  background: #f5f7fa;
  padding: 20rpx;
}

.land-info-card {
  background: #fff;
  border-radius: 20rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
  
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30rpx;
    padding-bottom: 20rpx;
    border-bottom: 1rpx solid #f0f0f0;
    
    .title {
      font-size: 32rpx;
      font-weight: bold;
      color: #333;
    }
    
    .status-badge {
      font-size: 24rpx;
      padding: 6rpx 16rpx;
      border-radius: 8rpx;
      
      &.normal {
        background: #e6f7ff;
        color: #1890ff;
      }
    }
  }
  
  .info-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 24rpx;
    margin-bottom: 30rpx;
    
    .info-item {
      .label {
        font-size: 24rpx;
        color: #999;
        margin-bottom: 8rpx;
        display: block;
      }
      .value {
        font-size: 28rpx;
        color: #333;
        font-weight: 500;
      }
    }
  }
  
  .action-row {
    display: flex;
    justify-content: flex-end;
    gap: 20rpx;
  }
}

.function-grid {
  display: flex;
  justify-content: space-between;
  background: #fff;
  padding: 30rpx 40rpx;
  border-radius: 20rpx;
  margin-bottom: 20rpx;
  
  .grid-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    
    .icon-box {
      width: 88rpx;
      height: 88rpx;
      border-radius: 24rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 12rpx;
      
      &.monitor { background: linear-gradient(135deg, #36cfc9 0%, #13c2c2 100%); }
      &.data { background: linear-gradient(135deg, #7970ff 0%, #5b50e6 100%); }
      &.record { background: linear-gradient(135deg, #ffbb96 0%, #fa8c16 100%); }
      &.iot { background: linear-gradient(135deg, #ff85c0 0%, #eb2f96 100%); }
    }
    
    .grid-text {
      font-size: 24rpx;
      color: #666;
    }
  }
}

.section-card {
  background: #fff;
  border-radius: 20rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
  
  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24rpx;
    
    .title {
      font-size: 30rpx;
      font-weight: bold;
      color: #333;
      border-left: 8rpx solid #4caf50;
      padding-left: 16rpx;
    }
    
    .more {
      font-size: 24rpx;
      color: #999;
    }
    
    .subtitle {
      font-size: 24rpx;
      color: #666;
    }
  }
  
  .warning-list {
    .warning-item {
      display: flex;
      align-items: flex-start;
      padding: 20rpx 0;
      border-bottom: 1rpx solid #f9f9f9;
      
      &:last-child {
        border-bottom: none;
      }
      
      .warning-icon {
        margin-top: 4rpx;
        margin-right: 16rpx;
      }
      
      .warning-content {
        flex: 1;
        display: flex;
        flex-direction: column;
        
        .warning-title {
          font-size: 28rpx;
          color: #333;
          margin-bottom: 8rpx;
        }
        
        .warning-time {
          font-size: 22rpx;
          color: #999;
        }
      }
    }
  }
  
  .cycle-timeline {
    padding: 0 10rpx;
  }
}
</style>