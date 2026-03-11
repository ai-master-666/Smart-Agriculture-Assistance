<template>
  <view class="history-container">
    <view class="empty-state" v-if="historyList.length === 0">
      <u-empty mode="history" text="暂无浏览记录" icon="/static/empty-history.png"></u-empty>
    </view>
    
    <view class="history-list" v-else>
      <view class="history-item" v-for="item in historyList" :key="item.id" @click="goToDetail(item.id)">
        <view class="image-wrapper">
          <image :src="item.cover_image || '/static/default-product.png'" mode="aspectFill" class="history-img"></image>
        </view>
        <view class="history-info">
          <text class="history-name">{{ item.name }}</text>
          <view class="meta-row">
            <text class="price">¥{{ item.price }}</text>
            <text class="date">{{ item.date }}</text>
          </view>
        </view>
        <view class="delete-btn" @click.stop="removeHistory(item.id)">
          <u-icon name="trash" size="18" color="#999"></u-icon>
        </view>
      </view>
    </view>
    
    <view class="clear-btn" v-if="historyList.length > 0">
      <u-button type="default" size="small" shape="circle" @click="clearHistory">清空历史记录</u-button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { onShow } from '@dcloudio/uni-app'

interface HistoryItem {
  id: number
  name: string
  price: number
  cover_image?: string
  date: string
}

const historyList = ref<HistoryItem[]>([])

onShow(() => {
  // 模拟获取历史记录
  // 真实开发需调用 API: const res = await getHistoryList()
  historyList.value = [
    { id: 1, name: '高山有机绿茶', price: 128, date: '刚刚' },
    { id: 2, name: '农家散养土鸡蛋', price: 35, date: '1小时前' },
    { id: 3, name: '新鲜时令草莓', price: 45, date: '昨天' }
  ]
})

const goToDetail = (id: number) => {
  uni.navigateTo({
    url: `/pages/shop/detail?id=${id}`
  })
}

const removeHistory = (id: number) => {
  historyList.value = historyList.value.filter(item => item.id !== id)
}

const clearHistory = () => {
  uni.showModal({
    title: '提示',
    content: '确定清空所有历史记录吗？',
    success: (res) => {
      if (res.confirm) {
        historyList.value = []
        uni.showToast({ title: '已清空', icon: 'none' })
      }
    }
  })
}
</script>

<style lang="scss" scoped>
.history-container {
  min-height: 100vh;
  background-color: #f8f8f8;
  padding: 20rpx;
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.history-item {
  display: flex;
  background: #fff;
  border-radius: 16rpx;
  padding: 20rpx;
  position: relative;
  
  .image-wrapper {
    width: 140rpx;
    height: 140rpx;
    border-radius: 12rpx;
    overflow: hidden;
    margin-right: 20rpx;
    
    .history-img {
      width: 100%;
      height: 100%;
    }
  }
  
  .history-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 10rpx 0;
    
    .history-name {
      font-size: 28rpx;
      color: #333;
      font-weight: 500;
      line-height: 1.4;
    }
    
    .meta-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      
      .price {
        font-size: 30rpx;
        color: #ff4d4f;
        font-weight: bold;
      }
      
      .date {
        font-size: 22rpx;
        color: #999;
      }
    }
  }
  
  .delete-btn {
    position: absolute;
    right: 20rpx;
    top: 20rpx;
    padding: 10rpx;
  }
}

.clear-btn {
  margin-top: 40rpx;
  display: flex;
  justify-content: center;
}

.empty-state {
  margin-top: 200rpx;
}
</style>
