<template>
  <view class="order-container">
    <!-- 订单状态筛选 -->
    <view class="status-tabs">
      <scroll-view scroll-x class="tabs-scroll">
        <view 
          v-for="(tab, index) in statusTabs" 
          :key="index"
          class="tab-item"
          :class="{ active: currentStatus === index }"
          @click="changeStatus(index)"
        >
          {{ tab }}
        </view>
      </scroll-view>
    </view>

    <!-- 空状态 -->
    <view v-if="orders.length === 0" class="empty-state">
      <image src="/static/empty-order.png" mode="aspectFit" class="empty-img"></image>
      <text class="empty-text">暂无订单</text>
      <button class="go-shopping-btn" @click="goShopping">去购物</button>
    </view>

    <!-- 订单列表 -->
    <view v-else class="order-list">
      <view class="order-card" v-for="order in orders" :key="order.id">
        <!-- 订单头部 -->
        <view class="order-header">
          <text class="order-no">订单号：{{ order.order_no }}</text>
          <text class="order-status" :style="{ color: getStatusColor(order.status) }">
            {{ getStatusText(order.status) }}
          </text>
        </view>

        <!-- 商品列表 -->
        <view class="order-items" @click="viewDetail(order)">
          <view class="order-item" v-for="item in order.items" :key="item.id">
            <image :src="item.product_image || '/static/default-product.png'" mode="aspectFill" class="item-img"></image>
            <view class="item-info">
              <text class="item-name">{{ item.product_name }}</text>
              <view class="item-meta">
                <text class="item-price">¥{{ item.price }}</text>
                <text class="item-quantity">x{{ item.quantity }}</text>
              </view>
            </view>
          </view>
        </view>

        <!-- 订单底部 -->
        <view class="order-footer">
          <view class="order-total">
            <text class="label">实付款：</text>
            <text class="amount">¥{{ order.total_amount }}</text>
          </view>
          
          <view class="order-actions">
            <button v-if="order.status === 'pending_payment'" class="action-btn pay-btn" @click.stop="payOrder(order)">
              立即支付
            </button>
            <button v-if="order.status === 'paid'" class="action-btn ship-btn" @click.stop="confirmShip(order)">
              确认收货
            </button>
            <button v-if="order.status === 'paid' || order.status === 'shipped'" class="action-btn" @click.stop="viewLogistics(order)">
              查看物流
            </button>
            <button v-if="order.status === 'completed'" class="action-btn review-btn" @click.stop="reviewOrder(order)">
              评价
            </button>
            <button class="action-btn detail-btn" @click.stop="viewDetail(order)">
              详情
            </button>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { onLoad, onShow } from '@dcloudio/uni-app'
import { getOrderList } from '@/api/order'

const statusTabs = ['全部', '待付款', '待发货', '待收货', '已完成']
const currentStatus = ref(0)
const orders = ref<any[]>([])

const loadOrders = async () => {
  try {
      // Mapping index to status string
      const statusMap = ['', 'pending_payment', 'paid', 'shipped', 'completed']
      const status = statusMap[currentStatus.value]
      const res = await getOrderList({ status })
      if (res) {
          orders.value = res
      } else {
          orders.value = []
      }
  } catch (e) {
      console.error('Failed to load orders', e)
  }
}

const changeStatus = (index: number) => {
  currentStatus.value = index
  loadOrders()
}

const getStatusText = (status: string) => {
  const map: any = {
    pending_payment: '待付款',
    paid: '待发货',
    shipped: '待收货',
    completed: '已完成',
    cancelled: '已取消'
  }
  return map[status] || '未知状态'
}

const getStatusColor = (status: string) => {
  const colors: any = {
    pending_payment: '#ff6b00',
    paid: '#4facfe',
    shipped: '#43e97b',
    completed: '#667eea',
    cancelled: '#999'
  }
  return colors[status] || '#666'
}

const goShopping = () => {
  uni.switchTab({ url: '/pages/shop/index' })
}

const payOrder = (order: any) => {
  uni.showToast({ title: '支付功能模拟成功', icon: 'success' })
  // Refresh list
  setTimeout(() => loadOrders(), 1000)
}

const confirmShip = (order: any) => {
  uni.showModal({
    title: '提示',
    content: '确认收到商品吗？',
    success: (res) => {
      if (res.confirm) {
        // TODO: Call confirm API
        uni.showToast({ title: '确认成功', icon: 'success' })
        loadOrders()
      }
    }
  })
}

const reviewOrder = (order: any) => {
  uni.navigateTo({ url: `/pages/shop/review?id=${order.id}` })
}

const viewLogistics = (order: any) => {
  uni.navigateTo({ url: `/pages/shop/logistics?id=${order.id}` })
}

const viewDetail = (order: any) => {
  uni.navigateTo({ url: `/pages/shop/order-detail?id=${order.id}` })
}

onLoad((options: any) => {
    if (options.status) {
        currentStatus.value = Number(options.status)
    }
})

onShow(() => {
  loadOrders()
})
</script>

<style lang="scss" scoped>
.order-container {
  min-height: 100vh;
  background: #f5f5f5;
  padding-bottom: 40rpx;
}

.status-tabs {
  background: #fff;
  padding: 20rpx 0;
  margin-bottom: 20rpx;
  position: sticky;
  top: 0;
  z-index: 10;
  
  .tabs-scroll {
    white-space: nowrap;
    width: 100%;
    
    .tab-item {
      display: inline-block;
      padding: 16rpx 40rpx;
      font-size: 28rpx;
      color: #666;
      
      &.active {
        color: #667eea;
        font-weight: bold;
        position: relative;
        
        &::after {
            content: '';
            position: absolute;
            bottom: 6rpx;
            left: 50%;
            transform: translateX(-50%);
            width: 40rpx;
            height: 4rpx;
            background-color: #667eea;
            border-radius: 2rpx;
        }
      }
    }
  }
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 200rpx 40rpx;
  
  .empty-img {
    width: 300rpx;
    height: 300rpx;
    margin-bottom: 40rpx;
  }
  
  .empty-text {
    font-size: 32rpx;
    color: #999;
    margin-bottom: 40rpx;
  }
  
  .go-shopping-btn {
    width: 280rpx;
    height: 80rpx;
    line-height: 80rpx;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: #fff;
    border-radius: 40rpx;
    border: none;
    font-size: 30rpx;
  }
}

.order-list {
  padding: 0 20rpx;
  
  .order-card {
    background: #fff;
    border-radius: 16rpx;
    margin-bottom: 20rpx;
    overflow: hidden;
    
    .order-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 24rpx 30rpx;
      border-bottom: 1rpx solid #f9f9f9;
      
      .order-no {
        font-size: 26rpx;
        color: #999;
      }
      
      .order-status {
        font-size: 28rpx;
        font-weight: bold;
      }
    }
    
    .order-items {
      padding: 30rpx;
      
      .order-item {
        display: flex;
        margin-bottom: 30rpx;
        
        &:last-child {
          margin-bottom: 0;
        }
        
        .item-img {
          width: 140rpx;
          height: 140rpx;
          border-radius: 12rpx;
          margin-right: 20rpx;
          background-color: #f5f5f5;
        }
        
        .item-info {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          height: 140rpx;
          
          .item-name {
            display: block;
            font-size: 28rpx;
            color: #333;
            line-height: 1.4;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
          }
          
          .item-meta {
            display: flex;
            justify-content: space-between;
            align-items: center;
            
            .item-price {
              font-size: 30rpx;
              color: #333;
              font-weight: 500;
            }
            
            .item-quantity {
              font-size: 26rpx;
              color: #999;
            }
          }
        }
      }
    }
    
    .order-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 24rpx 30rpx;
      border-top: 1rpx solid #f9f9f9;
      
      .order-total {
        .label {
          font-size: 26rpx;
          color: #666;
        }
        
        .amount {
          font-size: 32rpx;
          color: #ff4444;
          font-weight: bold;
        }
      }
      
      .order-actions {
        display: flex;
        
        .action-btn {
            padding: 0 30rpx;
            height: 56rpx;
            line-height: 56rpx;
            border-radius: 28rpx;
            font-size: 24rpx;
            margin-left: 16rpx;
            
            &::after {
                border: none;
            }
        }
        
        .pay-btn {
            background: linear-gradient(90deg, #ff6034, #ee0a24);
            color: #fff;
        }
        
        .ship-btn {
            border: 1rpx solid #667eea;
            color: #667eea;
            background: #fff;
        }
        
        .review-btn {
            border: 1rpx solid #ff976a;
            color: #ff976a;
            background: #fff;
        }
        
        .detail-btn {
            border: 1rpx solid #ebedf0;
            color: #323233;
            background: #fff;
        }
      }
    }
  }
}
</style>
