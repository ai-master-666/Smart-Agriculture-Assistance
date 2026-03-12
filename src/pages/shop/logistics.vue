<template>
  <view class="logistics-container">
    <view class="header-section">
      <view class="status-row">
        <u-icon name="car-fill" color="#fff" size="28"></u-icon>
        <text class="status-text">{{ logisticsInfo.statusText }}</text>
      </view>
      <text class="courier-info">{{ logisticsInfo.company }}：{{ logisticsInfo.no }}</text>
    </view>
    
    <view class="track-list">
      <u-steps :current="logisticsInfo.tracks.length - 1" direction="column" dot>
        <u-steps-item 
          v-for="(track, index) in logisticsInfo.tracks" 
          :key="index"
          :title="track.status"
          :desc="track.time"
        >
        </u-steps-item>
      </u-steps>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'

const logisticsInfo = ref({
  company: '顺丰速运',
  no: 'SF1234567890',
  statusText: '运输中',
  tracks: [
    { status: '已签收', time: '2026-03-12 14:30:00' },
    { status: '派送中', time: '2026-03-12 08:00:00' },
    { status: '运输中', time: '2026-03-11 18:00:00' },
    { status: '已揽件', time: '2026-03-11 10:00:00' }
  ]
})

onLoad((options: any) => {
  if (options.id) {
    // TODO: Fetch real logistics info by order ID
    // const res = await getLogistics(options.id)
  }
})
</script>

<style lang="scss" scoped>
.logistics-container {
  min-height: 100vh;
  background: #f5f5f5;
}

.header-section {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 40rpx 30rpx;
  color: #fff;
  
  .status-row {
    display: flex;
    align-items: center;
    margin-bottom: 16rpx;
    
    .status-text {
      font-size: 36rpx;
      font-weight: bold;
      margin-left: 16rpx;
    }
  }
  
  .courier-info {
    font-size: 28rpx;
    opacity: 0.9;
  }
}

.track-list {
  background: #fff;
  margin-top: 20rpx;
  padding: 40rpx 30rpx;
  border-radius: 20rpx 20rpx 0 0;
}
</style>
