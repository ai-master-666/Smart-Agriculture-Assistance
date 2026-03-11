<template>
  <view class="product-list-container">
    <!-- 顶部操作栏 -->
    <view class="header-action">
      <view class="search-box">
        <u-search placeholder="搜索商品名称" v-model="keyword" :showAction="false" @search="onSearch" @clear="onSearch"></u-search>
      </view>
      <view class="add-btn" @click="navigateToAdd">
        <u-icon name="plus" color="#fff" size="20"></u-icon>
        <text>发布商品</text>
      </view>
    </view>
    
    <!-- 状态筛选 -->
    <view class="filter-tabs">
        <view :class="['tab-item', currentStatus === -1 ? 'active' : '']" @click="switchStatus(-1)">全部</view>
        <view :class="['tab-item', currentStatus === 1 ? 'active' : '']" @click="switchStatus(1)">出售中</view>
        <view :class="['tab-item', currentStatus === 0 ? 'active' : '']" @click="switchStatus(0)">已下架</view>
    </view>

    <!-- 商品列表 -->
    <view class="product-list" v-if="productList.length > 0">
      <view class="product-item" v-for="(item, index) in productList" :key="index" @click="editProduct(item)">
        <image :src="item.cover_image || '/static/default-product.png'" mode="aspectFill" class="product-img"></image>
        <view class="product-info">
          <text class="product-name">{{ item.name }}</text>
          <view class="stock-info">
            <text :class="item.stock <= (item.stock_warning || 10) ? 'warn' : ''">库存: {{ item.stock }}</text>
            <text>销量: {{ item.sales_count || 0 }}</text>
          </view>
          <view class="price-row">
            <text class="price">¥{{ item.price }}</text>
            <view class="status-switch" @click.stop>
              <text :class="item.status === 1 ? 'on' : 'off'">{{ item.status === 1 ? '上架中' : '已下架' }}</text>
              <u-switch v-model="item.statusValue" size="20" activeColor="#4caf50" @change="(val: boolean) => toggleStatus(item, val)"></u-switch>
            </view>
          </view>
        </view>
        
        <!-- 操作按钮 -->
        <view class="action-bar" @click.stop>
            <view class="btn" @click="editProduct(item)">
                <u-icon name="edit-pen" size="16" color="#666"></u-icon>
                <text>编辑</text>
            </view>
            <view class="divider"></view>
            <view class="btn delete" @click="handleDelete(item)">
                <u-icon name="trash" size="16" color="#ff4d4f"></u-icon>
                <text>删除</text>
            </view>
        </view>
      </view>
    </view>
    
    <view class="empty-state" v-else>
        <u-empty mode="data" text="暂无商品"></u-empty>
    </view>
    
    <u-loadmore :status="loadStatus" v-if="productList.length > 0" />
    
    <view class="bottom-spacer"></view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { getProductList, updateProductStatus, deleteProduct } from '@/api/product'
import type { Product } from '@/api/product'

const keyword = ref('')
const currentStatus = ref(-1) // -1: all, 1: active, 0: inactive
const loadStatus = ref('nomore')
const productList = ref<any[]>([])
const loading = ref(false)

// 扩展 Product 类型以包含前端辅助字段 statusValue
interface ProductItem extends Product {
    statusValue: boolean
}

onShow(() => {
    loadData()
})

const loadData = async () => {
    loading.value = true
    try {
        const params: any = {
            keyword: keyword.value
        }
        if (currentStatus.value !== -1) {
            params.status = currentStatus.value
        }
        
        const res = await getProductList(params)
        if (res) {
            productList.value = res.map((item: Product) => ({
                ...item,
                statusValue: item.status === 1
            }))
        }
    } catch (e) {
        uni.showToast({ title: '加载失败', icon: 'none' })
    } finally {
        loading.value = false
    }
}

const onSearch = () => {
    loadData()
}

const switchStatus = (status: number) => {
    if (currentStatus.value === status) return
    currentStatus.value = status
    loadData()
}

const navigateToAdd = () => {
  uni.navigateTo({ url: '/pages/farmer/goods-edit' })
}

const editProduct = (item: ProductItem) => {
  uni.navigateTo({ url: `/pages/farmer/goods-edit?id=${item.id}` })
}

const handleDelete = (item: ProductItem) => {
  uni.showModal({
    title: '确认删除',
    content: `确定要删除商品 "${item.name}" 吗？此操作不可恢复。`,
    success: async (res) => {
      if (res.confirm) {
        try {
            await deleteProduct(item.id)
            uni.showToast({ title: '删除成功', icon: 'success' })
            // Refresh list
            const index = productList.value.findIndex(p => p.id === item.id)
            if (index > -1) productList.value.splice(index, 1)
        } catch (e) {
            uni.showToast({ title: '删除失败', icon: 'none' })
        }
      }
    }
  })
}

const toggleStatus = async (item: ProductItem, val: boolean) => {
  const newStatus = val ? 1 : 0
  try {
      await updateProductStatus(item.id, newStatus)
      item.status = newStatus
      uni.showToast({ title: val ? '已上架' : '已下架', icon: 'none' })
  } catch (e) {
      // Revert if failed
      item.statusValue = !val
      uni.showToast({ title: '操作失败', icon: 'none' })
  }
}
</script>

<style lang="scss" scoped>
.product-list-container {
  min-height: 100vh;
  background: #f5f5f5;
  padding: 20rpx;
}

.header-action {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
  background: #fff;
  padding: 20rpx;
  border-radius: 12rpx;
  
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

.filter-tabs {
    display: flex;
    background: #fff;
    padding: 20rpx;
    border-radius: 12rpx;
    margin-bottom: 20rpx;
    
    .tab-item {
        flex: 1;
        text-align: center;
        font-size: 28rpx;
        color: #666;
        position: relative;
        padding-bottom: 10rpx;
        
        &.active {
            color: #4caf50;
            font-weight: bold;
            
            &::after {
                content: '';
                position: absolute;
                bottom: 0;
                left: 50%;
                transform: translateX(-50%);
                width: 40rpx;
                height: 4rpx;
                background: #4caf50;
                border-radius: 2rpx;
            }
        }
    }
}

.product-list {
  .product-item {
    background: #fff;
    border-radius: 12rpx;
    padding: 20rpx;
    margin-bottom: 20rpx;
    display: flex;
    position: relative;
    flex-wrap: wrap;
    
    .product-img {
      width: 180rpx;
      height: 180rpx;
      border-radius: 8rpx;
      background: #eee;
      margin-right: 20rpx;
    }
    
    .product-info {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      min-height: 180rpx;
      
      .product-name {
        font-size: 30rpx;
        font-weight: bold;
        color: #333;
        line-height: 1.4;
        margin-bottom: 10rpx;
      }
      
      .stock-info {
        font-size: 24rpx;
        color: #999;
        display: flex;
        gap: 20rpx;
        margin-bottom: 10rpx;
        
        .warn {
            color: #ff9800;
        }
      }
      
      .price-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        
        .price {
          color: #ff4d4f;
          font-size: 32rpx;
          font-weight: bold;
        }
        
        .status-switch {
          display: flex;
          align-items: center;
          gap: 10rpx;
          transform: scale(0.9);
          transform-origin: right center;
          
          text {
            font-size: 24rpx;
            &.on { color: #4caf50; }
            &.off { color: #999; }
          }
        }
      }
    }
    
    .action-bar {
        width: 100%;
        display: flex;
        justify-content: flex-end;
        align-items: center;
        border-top: 1rpx solid #f5f5f5;
        margin-top: 20rpx;
        padding-top: 20rpx;
        
        .btn {
            display: flex;
            align-items: center;
            padding: 10rpx 20rpx;
            
            text {
                font-size: 26rpx;
                color: #666;
                margin-left: 6rpx;
            }
            
            &.delete {
                text { color: #ff4d4f; }
            }
        }
        
        .divider {
            width: 1rpx;
            height: 24rpx;
            background: #eee;
        }
    }
  }
}

.empty-state {
    margin-top: 100rpx;
}

.bottom-spacer {
    height: 40rpx;
}
</style>
