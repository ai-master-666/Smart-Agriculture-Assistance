<template>
  <view class="cart-container">
    <!-- 空状态 -->
    <view v-if="cartItems.length === 0" class="empty-state">
      <image src="/static/empty-cart.png" mode="aspectFit" class="empty-img"></image>
      <text class="empty-text">购物车空空如也</text>
      <button class="go-shopping-btn" @click="goShopping">去逛逛</button>
    </view>

    <!-- 购物车列表 -->
    <view v-else class="cart-list">
      <view class="cart-item" v-for="item in cartItems" :key="item.id">
        <view class="item-left">
          <u-checkbox 
            v-model="item.selected" 
            shape="circle"
            @change="updateSelection"
          ></u-checkbox>
          
          <image :src="item.product_image || '/static/default-product.png'" mode="aspectFill" class="product-img"></image>
          
          <view class="product-info">
            <text class="product-name">{{ item.product_name }}</text>
            <view class="price-row">
              <text class="price">¥{{ item.price }}</text>
            </view>
          </view>
        </view>
        
        <view class="item-right">
          <u-stepper 
            v-model="item.quantity" 
            min="1" 
            max="99"
            @change="handleQuantityChange(item)"
          ></u-stepper>
          <u-icon name="trash" size="20" color="#999" @click="handleRemove(item)" style="margin-left: 20rpx;"></u-icon>
        </view>
      </view>
    </view>

    <!-- 底部结算栏 -->
    <view v-if="cartItems.length > 0" class="checkout-bar">
      <view class="left-section">
        <u-checkbox 
          v-model="selectAll" 
          shape="circle"
          @change="toggleSelectAll"
        >
          <text class="select-all-text">全选</text>
        </u-checkbox>
        
        <view class="total-price">
          <text class="label">合计：</text>
          <text class="amount">¥{{ totalPrice.toFixed(2) }}</text>
        </view>
      </view>
      
      <view class="right-section">
        <button class="checkout-btn" @click="handleCheckout">
          结算 ({{ selectedCount }})
        </button>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { onLoad, onShow } from '@dcloudio/uni-app'
import { getCartList, updateCartItemQuery, removeCartItem, createOrder } from '@/api/order'
import type { CartItem } from '@/api/order'

const cartItems = ref<CartItem[]>([])
const selectAll = ref(false)

const loadCartData = async () => {
  try {
    const res = await getCartList()
    if (res && res.items) {
      cartItems.value = res.items.map(item => ({
        ...item,
        selected: true // 默认选中
      }))
      updateSelectAll()
    } else {
        cartItems.value = []
    }
  } catch (e) {
    console.error('Failed to load cart:', e)
  }
}

const updateSelection = () => {
  updateSelectAll()
}

const updateSelectAll = () => {
  const allSelected = cartItems.value.length > 0 && cartItems.value.every(item => item.selected)
  selectAll.value = allSelected
}

const toggleSelectAll = () => {
  cartItems.value.forEach(item => {
    item.selected = selectAll.value
  })
}

const handleQuantityChange = async (item: CartItem) => {
  try {
    await updateCartItemQuery(item.id, item.quantity)
  } catch (e) {
    console.error('Update quantity failed', e)
    uni.showToast({ title: '更新失败', icon: 'none' })
  }
}

const handleRemove = (item: CartItem) => {
    uni.showModal({
        title: '提示',
        content: '确定要删除该商品吗？',
        success: async (res) => {
            if (res.confirm) {
                try {
                    await removeCartItem(item.id)
                    loadCartData() // 重新加载
                } catch (e) {
                    uni.showToast({ title: '删除失败', icon: 'none' })
                }
            }
        }
    })
}

const selectedCount = computed(() => {
  return cartItems.value.filter(item => item.selected).length
})

const totalPrice = computed(() => {
  return cartItems.value
    .filter(item => item.selected)
    .reduce((sum, item) => sum + item.price * item.quantity, 0)
})

const goShopping = () => {
  uni.switchTab({ url: '/pages/shop/index' })
}

const handleCheckout = async () => {
  if (selectedCount.value === 0) {
    uni.showToast({ title: '请选择商品', icon: 'none' })
    return
  }
  
  const selectedItems = cartItems.value.filter(item => item.selected)
  const orderData = {
      items: selectedItems.map(item => ({
          product_id: item.product_id,
          quantity: item.quantity
      })),
      address: { name: "测试用户", phone: "13800000000", detail: "测试地址" } // Mock address for now
  }

  try {
      const res = await createOrder(orderData)
      uni.showToast({ title: '下单成功', icon: 'success' })
      // Refresh cart
      loadCartData()
      // Navigate to order list
      setTimeout(() => {
          uni.navigateTo({ url: '/pages/shop/order' })
      }, 1500)
  } catch (e) {
      console.error(e)
      uni.showToast({ title: '下单失败', icon: 'none' })
  }
}

onShow(() => {
  loadCartData()
})
</script>

<style lang="scss" scoped>
.cart-container {
  min-height: 100vh;
  background: #f5f5f5;
  padding-bottom: 120rpx;
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

.cart-list {
  .cart-item {
    background: #fff;
    padding: 30rpx;
    margin-bottom: 20rpx;
    display: flex;
    justify-content: space-between;
    align-items: center;
    
    .item-left {
      display: flex;
      flex: 1;
      align-items: center;
      
      .product-img {
        width: 160rpx;
        height: 160rpx;
        border-radius: 12rpx;
        margin: 0 20rpx;
      }
      
      .product-info {
        flex: 1;
        
        .product-name {
          display: block;
          font-size: 30rpx;
          color: #333;
          margin-bottom: 10rpx;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        
        .price-row {
          .price {
            font-size: 32rpx;
            color: #ff4444;
            font-weight: bold;
          }
        }
      }
    }
    
    .item-right {
      margin-left: 20rpx;
      display: flex;
      align-items: center;
    }
  }
}

.checkout-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20rpx;
  background: #fff;
  box-shadow: 0 -2rpx 10rpx rgba(0,0,0,0.05);
  
  .left-section {
    display: flex;
    align-items: center;
    flex: 1;
    
    .select-all-text {
      font-size: 28rpx;
      color: #666;
    }
    
    .total-price {
      margin-left: 40rpx;
      
      .label {
        font-size: 28rpx;
        color: #666;
      }
      
      .amount {
        font-size: 36rpx;
        color: #ff4444;
        font-weight: bold;
      }
    }
  }
  
  .right-section {
    .checkout-btn {
      padding: 20rpx 60rpx;
      background: linear-gradient(135deg, #ff6b00 0%, #ff4444 100%);
      color: #fff;
      border-radius: 40rpx;
      border: none;
      font-size: 30rpx;
    }
  }
}
</style>
