<template>
  <view class="review-container">
    <view class="product-info">
      <image :src="productImage" mode="aspectFill" class="product-img"></image>
      <text class="product-name">{{ productName }}</text>
    </view>
    
    <view class="rating-section">
      <text class="label">商品评分</text>
      <u-rate v-model="form.rating" size="24" activeColor="#ff9900" allowHalf></u-rate>
    </view>
    
    <view class="content-section">
      <u-textarea v-model="form.content" placeholder="分享您的使用体验，帮助其他用户~" height="120"></u-textarea>
    </view>
    
    <view class="upload-section">
      <u-upload
        :fileList="fileList"
        @afterRead="afterRead"
        @delete="deletePic"
        name="file"
        multiple
        :maxCount="3"
      ></u-upload>
    </view>
    
    <view class="submit-btn">
      <u-button type="primary" shape="circle" @click="submitReview">提交评价</u-button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'

const productName = ref('')
const productImage = ref('')
const orderId = ref('')

const form = ref({
  rating: 5,
  content: ''
})

const fileList = ref([])

onLoad((options: any) => {
  if (options.id) {
    orderId.value = options.id
    // Mock data
    productName.value = '农家土鸡蛋'
    productImage.value = '/static/default-product.png'
  }
})

const afterRead = (event: any) => {
  // Mock upload
  const { file } = event
  fileList.value.push({
    ...file,
    status: 'success',
    message: ''
  } as never)
}

const deletePic = (event: any) => {
  fileList.value.splice(event.index, 1)
}

const submitReview = () => {
  uni.showLoading({ title: '提交中' })
  setTimeout(() => {
    uni.hideLoading()
    uni.showToast({ title: '评价成功', icon: 'success' })
    setTimeout(() => {
      uni.navigateBack()
    }, 1500)
  }, 1000)
}
</script>

<style lang="scss" scoped>
.review-container {
  padding: 30rpx;
  background: #fff;
  min-height: 100vh;
}

.product-info {
  display: flex;
  align-items: center;
  margin-bottom: 40rpx;
  padding-bottom: 30rpx;
  border-bottom: 1rpx solid #f5f5f5;
  
  .product-img {
    width: 80rpx;
    height: 80rpx;
    border-radius: 8rpx;
    margin-right: 20rpx;
  }
  
  .product-name {
    font-size: 28rpx;
    color: #333;
  }
}

.rating-section {
  display: flex;
  align-items: center;
  margin-bottom: 30rpx;
  
  .label {
    font-size: 30rpx;
    color: #333;
    margin-right: 20rpx;
    font-weight: bold;
  }
}

.content-section {
  margin-bottom: 30rpx;
}

.upload-section {
  margin-bottom: 60rpx;
}

.submit-btn {
  margin-top: 40rpx;
}
</style>
