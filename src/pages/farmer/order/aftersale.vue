<template>
  <view class="aftersale-container">
    <view class="order-info-card">
      <view class="section-title">退款商品</view>
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
      <view class="refund-amount">
        <text>退款金额:</text>
        <text class="amount">¥{{ order.total_price }}</text>
      </view>
    </view>
    
    <view class="reason-card">
      <view class="section-title">买家退款说明</view>
      <view class="reason-content">
        <text class="label">退款原因:</text>
        <text class="value">商品质量问题</text>
      </view>
      <view class="reason-content">
        <text class="label">详细说明:</text>
        <text class="value">收到的腊肉包装破损，有点变质。</text>
      </view>
      <view class="reason-images">
        <image src="/static/default-product.png" mode="aspectFill" class="reason-img"></image>
      </view>
    </view>
    
    <view class="action-card">
      <view class="section-title">处理结果</view>
      <u-form :model="form" ref="formRef" label-width="80">
        <u-form-item label="处理方式" prop="action">
          <u-radio-group v-model="form.action">
            <u-radio label="同意退款" name="approve" activeColor="#4caf50" class="mr-20"></u-radio>
            <u-radio label="拒绝退款" name="reject" activeColor="#ff4d4f"></u-radio>
          </u-radio-group>
        </u-form-item>
        
        <u-form-item label="拒绝理由" prop="reason" v-if="form.action === 'reject'" required>
          <u-textarea v-model="form.reason" placeholder="请输入拒绝理由..." count></u-textarea>
        </u-form-item>
      </u-form>
    </view>
    
    <view class="footer-btn">
      <u-button type="primary" shape="circle" text="提交处理" @click="submit" :loading="submitting"></u-button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { getOrderDetail, refundOrder } from '@/api/order'
import type { Order } from '@/api/order'

const orderId = ref(0)
const order = ref<Partial<Order>>({})
const submitting = ref(false)

const form = reactive({
  action: 'approve',
  reason: ''
})

onLoad((options: any) => {
  if (options.id) {
    orderId.value = parseInt(options.id)
    loadDetail()
  }
})

const loadDetail = async () => {
  // Mock data for demo
  order.value = {
    id: orderId.value,
    total_price: 58.00,
    items: [
      {
        product_id: 3,
        product_name: '农家自制腊肉',
        price: 58.00,
        quantity: 1,
        product_image: '/static/default-product.png'
      }
    ]
  }
}

const submit = async () => {
  if (form.action === 'reject' && !form.reason) {
    uni.showToast({ title: '请输入拒绝理由', icon: 'none' })
    return
  }
  
  submitting.value = true
  try {
    await refundOrder(orderId.value, form.action as any, form.reason)
    uni.showToast({ title: '处理成功', icon: 'success' })
    setTimeout(() => {
      uni.navigateBack()
    }, 1500)
  } catch (e) {
    uni.showToast({ title: '处理失败', icon: 'none' })
  } finally {
    submitting.value = false
  }
}
</script>

<style lang="scss" scoped>
.aftersale-container {
  min-height: 100vh;
  background: #f5f5f5;
  padding: 20rpx;
}

.order-info-card, .reason-card, .action-card {
  background: #fff;
  border-radius: 20rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
}

.section-title {
  font-size: 30rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 20rpx;
  border-left: 6rpx solid #4caf50;
  padding-left: 16rpx;
}

.goods-item {
  display: flex;
  margin-bottom: 16rpx;
  
  .goods-img {
    width: 120rpx;
    height: 120rpx;
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
    }
    
    .goods-sub {
      display: flex;
      justify-content: space-between;
      color: #999;
      font-size: 24rpx;
    }
  }
}

.refund-amount {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  border-top: 1rpx solid #f5f5f5;
  padding-top: 20rpx;
  font-size: 28rpx;
  
  .amount {
    color: #ff4d4f;
    font-weight: bold;
    font-size: 32rpx;
    margin-left: 10rpx;
  }
}

.reason-content {
  margin-bottom: 16rpx;
  font-size: 26rpx;
  display: flex;
  
  .label {
    color: #666;
    width: 140rpx;
  }
  
  .value {
    color: #333;
    flex: 1;
  }
}

.reason-images {
  display: flex;
  gap: 20rpx;
  margin-top: 20rpx;
  
  .reason-img {
    width: 140rpx;
    height: 140rpx;
    border-radius: 8rpx;
    background: #f5f5f5;
  }
}

.mr-20 {
  margin-right: 40rpx;
}

.footer-btn {
  margin-top: 60rpx;
  padding: 0 40rpx;
}
</style>
