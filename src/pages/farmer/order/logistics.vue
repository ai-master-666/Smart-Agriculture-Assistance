<template>
  <view class="logistics-container">
    <view class="info-card">
      <view class="section-title">收货信息</view>
      <view class="address-info" v-if="order.address">
        <view class="user-row">
          <text class="name">{{ order.address.name }}</text>
          <text class="phone">{{ order.address.phone }}</text>
        </view>
        <view class="address-detail">{{ order.address.detail }}</view>
      </view>
    </view>
    
    <view class="form-card">
      <view class="section-title">物流信息</view>
      <u-form :model="form" ref="formRef" label-width="80">
        <u-form-item label="物流公司" prop="company" borderBottom required>
          <view class="select-box" @click="showCompany = true">
            <text :class="form.company ? 'text-black' : 'text-gray'">{{ form.company || '请选择物流公司' }}</text>
            <u-icon name="arrow-right" color="#999"></u-icon>
          </view>
        </u-form-item>
        
        <u-form-item label="物流单号" prop="no" borderBottom required>
          <u-input v-model="form.no" placeholder="请输入物流单号">
            <template #suffix>
              <u-icon name="scan" size="24" color="#4caf50" @click="scanCode"></u-icon>
            </template>
          </u-input>
        </u-form-item>
      </u-form>
    </view>
    
    <view class="footer-btn">
      <u-button type="primary" shape="circle" text="确认发货" @click="submit" :loading="submitting"></u-button>
    </view>
    
    <u-picker :show="showCompany" :columns="companyList" @confirm="confirmCompany" @cancel="showCompany = false"></u-picker>
  </view>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { getOrderDetail, shipOrder } from '@/api/order'
import type { Order } from '@/api/order'

const orderId = ref(0)
const order = ref<Partial<Order>>({})
const showCompany = ref(false)
const submitting = ref(false)

const form = reactive({
  company: '',
  no: ''
})

const companyList = [
  ['顺丰速运', '中通快递', '圆通速递', '申通快递', '韵达快递', '邮政EMS', '京东物流']
]

onLoad((options: any) => {
  if (options.id) {
    orderId.value = parseInt(options.id)
    loadDetail()
  }
})

const loadDetail = async () => {
  // 这里暂时用 mock 数据，因为 API 可能会返回空
  // const res = await getOrderDetail(orderId.value)
  // Mock data for demo
  order.value = {
    id: orderId.value,
    address: {
      name: '李雷',
      phone: '13800138000',
      detail: '北京市朝阳区三里屯SOHO'
    }
  }
}

const confirmCompany = (e: any) => {
  form.company = e.value[0]
  showCompany.value = false
}

const scanCode = () => {
  uni.scanCode({
    success: (res) => {
      form.no = res.result
      uni.showToast({ title: '扫码成功', icon: 'success' })
    }
  })
}

const submit = async () => {
  if (!form.company || !form.no) {
    uni.showToast({ title: '请完善物流信息', icon: 'none' })
    return
  }
  
  submitting.value = true
  try {
    await shipOrder(orderId.value, form)
    uni.showToast({ title: '发货成功', icon: 'success' })
    setTimeout(() => {
      uni.navigateBack()
    }, 1500)
  } catch (e) {
    uni.showToast({ title: '发货失败', icon: 'none' })
  } finally {
    submitting.value = false
  }
}
</script>

<style lang="scss" scoped>
.logistics-container {
  min-height: 100vh;
  background: #f5f5f5;
  padding: 20rpx;
}

.info-card, .form-card {
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

.address-info {
  .user-row {
    margin-bottom: 10rpx;
    font-size: 28rpx;
    color: #333;
    font-weight: bold;
    
    .phone { margin-left: 20rpx; }
  }
  
  .address-detail {
    font-size: 26rpx;
    color: #666;
    line-height: 1.4;
  }
}

.select-box {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.text-black { color: #333; }
.text-gray { color: #c0c4cc; }

.footer-btn {
  margin-top: 60rpx;
  padding: 0 40rpx;
}
</style>
