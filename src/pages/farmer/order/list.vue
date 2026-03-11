<template>
  <view class="order-list-container">
    <view class="tabs">
      <u-tabs :list="tabList" :current="currentTab" @click="changeTab" activeColor="#4caf50"></u-tabs>
    </view>
    
    <view class="order-list" v-if="orderList.length > 0">
      <view class="order-item" v-for="order in orderList" :key="order.id">
        <view class="order-header">
          <text class="order-no">订单号: {{ order.order_no }}</text>
          <text class="status-text">{{ getStatusText(order.status) }}</text>
        </view>
        
        <view class="goods-list">
          <view class="goods-item" v-for="(item, idx) in order.items" :key="idx">
            <image :src="item.product_image || '/static/default-product.png'" mode="aspectFill" class="goods-img"></image>
            <view class="goods-info">
              <text class="goods-name">{{ item.product_name }}</text>
              <view class="goods-sub">
                <text>¥{{ item.price }}</text>
                <text>x{{ item.quantity }}</text>
              </view>
            </view>
          </view>
        </view>
        
        <view class="order-footer">
          <view class="total-info">
            <text>共{{ getTotalCount(order) }}件商品 合计:</text>
            <text class="total-price">¥{{ order.total_price }}</text>
          </view>
          
          <view class="action-btns">
            <u-button 
              v-if="order.status === 'pending_shipment'" 
              type="primary" 
              size="small" 
              shape="circle" 
              text="立即发货" 
              @click="shipOrder(order)"
            ></u-button>
            
            <u-button 
              v-if="order.status === 'refunding'" 
              type="warning" 
              size="small" 
              shape="circle" 
              text="处理售后" 
              @click="handleAftersale(order)"
            ></u-button>
            
            <u-button 
              type="info" 
              plain 
              size="small" 
              shape="circle" 
              text="查看详情" 
              @click="viewDetail(order)"
            ></u-button>
          </view>
        </view>
      </view>
    </view>
    
    <view class="empty-state" v-else>
      <u-empty mode="order" text="暂无相关订单"></u-empty>
    </view>
    
    <u-loadmore :status="loadStatus" v-if="orderList.length > 0" />
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { getFarmerOrderList } from '@/api/order'
import type { Order } from '@/api/order'

const currentTab = ref(0)
const orderList = ref<Order[]>([])
const loadStatus = ref('nomore')

const tabList = [
  { name: '全部', value: '' },
  { name: '待发货', value: 'pending_shipment' },
  { name: '已发货', value: 'shipped' },
  { name: '售后中', value: 'refunding' }
]

onShow(() => {
  loadData()
})

const changeTab = (item: any) => {
  currentTab.value = item.index
  loadData()
}

const loadData = async () => {
  const status = tabList[currentTab.value].value
  try {
    const res = await getFarmerOrderList({ status })
    if (res) {
      orderList.value = res
    }
  } catch (e) {
    console.error(e)
  }
}

const getStatusText = (status: string) => {
  const map: Record<string, string> = {
    pending_payment: '待付款',
    pending_shipment: '待发货',
    shipped: '已发货',
    completed: '已完成',
    cancelled: '已取消',
    refunding: '售后中',
    refunded: '已退款'
  }
  return map[status] || status
}

const getTotalCount = (order: Order) => {
  return order.items?.reduce((sum, item) => sum + item.quantity, 0) || 0
}

const shipOrder = (order: Order) => {
  uni.navigateTo({
    url: `/pages/farmer/order/logistics?id=${order.id}`
  })
}

const handleAftersale = (order: Order) => {
  uni.navigateTo({
    url: `/pages/farmer/order/aftersale?id=${order.id}`
  })
}

const viewDetail = (order: Order) => {
  uni.showToast({ title: '订单详情开发中', icon: 'none' })
}
</script>

<style lang="scss" scoped>
.order-list-container {
  min-height: 100vh;
  background: #f5f5f5;
  padding-bottom: 40rpx;
}

.tabs {
  background: #fff;
  margin-bottom: 20rpx;
}

.order-list {
  padding: 0 20rpx;
  
  .order-item {
    background: #fff;
    border-radius: 16rpx;
    padding: 24rpx;
    margin-bottom: 20rpx;
    
    .order-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 20rpx;
      font-size: 26rpx;
      
      .order-no { color: #666; }
      .status-text { color: #4caf50; font-weight: bold; }
    }
    
    .goods-list {
      margin-bottom: 20rpx;
      
      .goods-item {
        display: flex;
        margin-bottom: 16rpx;
        
        .goods-img {
          width: 140rpx;
          height: 140rpx;
          border-radius: 8rpx;
          margin-right: 20rpx;
          background: #f5f5f5;
        }
        
        .goods-info {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          
          .goods-name {
            font-size: 28rpx;
            color: #333;
            line-height: 1.4;
          }
          
          .goods-sub {
            display: flex;
            justify-content: space-between;
            color: #999;
            font-size: 24rpx;
          }
        }
      }
    }
    
    .order-footer {
      border-top: 1rpx solid #f5f5f5;
      padding-top: 20rpx;
      display: flex;
      flex-direction: column;
      gap: 20rpx;
      
      .total-info {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        font-size: 26rpx;
        color: #333;
        
        .total-price {
          font-size: 32rpx;
          font-weight: bold;
          color: #ff4d4f;
          margin-left: 10rpx;
        }
      }
      
      .action-btns {
        display: flex;
        justify-content: flex-end;
        gap: 20rpx;
      }
    }
  }
}

.empty-state {
  margin-top: 200rpx;
}
</style>
