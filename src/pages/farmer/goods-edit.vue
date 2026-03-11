<template>
  <view class="product-add-container">
    <view class="form-card">
      <u-form :model="form" ref="formRef" label-width="80">
        <u-form-item label="商品名称" prop="name" borderBottom required>
          <u-input v-model="form.name" placeholder="请输入商品名称"></u-input>
        </u-form-item>
        
        <u-form-item label="商品分类" prop="category" borderBottom required>
          <view class="category-select" @click="showCategory = true">
            <text :class="form.category ? 'text-black' : 'text-gray'">{{ form.category || '请选择分类' }}</text>
            <u-icon name="arrow-right" color="#999"></u-icon>
          </view>
        </u-form-item>
        
        <u-form-item label="商品图片" prop="images" borderBottom required>
          <u-upload
            :fileList="fileList"
            @afterRead="afterRead"
            @delete="deletePic"
            name="1"
            multiple
            :maxCount="5"
            width="160"
            height="160"
          ></u-upload>
          <view class="tips">首图将作为封面图</view>
        </u-form-item>
        
        <u-form-item label="商品价格" prop="price" borderBottom required>
          <u-input v-model="form.price" type="digit" placeholder="0.00">
            <template #suffix>元</template>
          </u-input>
        </u-form-item>
        
        <u-form-item label="原价" prop="original_price" borderBottom>
          <u-input v-model="form.original_price" type="digit" placeholder="0.00">
            <template #suffix>元</template>
          </u-input>
        </u-form-item>
        
        <u-form-item label="库存数量" prop="stock" borderBottom required>
          <u-input v-model="form.stock" type="number" placeholder="0">
            <template #suffix>件</template>
          </u-input>
        </u-form-item>
        
        <u-form-item label="库存预警" prop="stock_warning" borderBottom>
          <u-input v-model="form.stock_warning" type="number" placeholder="低于该值提醒">
            <template #suffix>件</template>
          </u-input>
        </u-form-item>
        
        <u-form-item label="单位" prop="unit" borderBottom>
          <u-input v-model="form.unit" placeholder="如: 斤、盒、箱"></u-input>
        </u-form-item>
        
        <u-form-item label="上架状态" prop="status" borderBottom>
           <u-switch v-model="statusValue" activeColor="#4caf50" @change="onStatusChange"></u-switch>
           <text class="status-text">{{ statusValue ? '上架销售' : '暂不上架' }}</text>
        </u-form-item>
        
        <u-form-item label="商品描述" prop="description">
          <u-textarea v-model="form.description" placeholder="请输入商品详细描述..." count height="200"></u-textarea>
        </u-form-item>
      </u-form>
    </view>
    
    <view class="footer-btn">
      <u-button type="primary" shape="circle" :text="isEdit ? '保存修改' : '立即发布'" @click="submit" :loading="submitting"></u-button>
    </view>
    
    <u-picker :show="showCategory" :columns="categoryList" @confirm="confirmCategory" @cancel="showCategory = false"></u-picker>
  </view>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { createProduct, updateProduct, getProductDetail } from '@/api/product'

const formRef = ref()
const showCategory = ref(false)
const fileList = ref<any[]>([])
const submitting = ref(false)
const isEdit = ref(false)
const productId = ref(0)
const statusValue = ref(true)

const form = reactive({
  name: '',
  category: '',
  price: '',
  original_price: '',
  stock: '',
  stock_warning: '',
  unit: '',
  description: '',
  status: 1,
  images: [] as string[]
})

const categoryList = [
  ['新鲜水果', '蔬菜', '肉禽蛋品', '粮油米面', '茶叶冲饮', '中药材', '手工制品']
]

onLoad(async (options: any) => {
  if (options.id) {
    isEdit.value = true
    productId.value = parseInt(options.id)
    uni.setNavigationBarTitle({ title: '编辑商品' })
    loadProductData(productId.value)
  }
})

const loadProductData = async (id: number) => {
  try {
    const res = await getProductDetail(id)
    if (res) {
      form.name = res.name
      form.category = res.category || ''
      form.price = String(res.price)
      form.original_price = res.original_price ? String(res.original_price) : ''
      form.stock = String(res.stock)
      form.stock_warning = res.stock_warning ? String(res.stock_warning) : ''
      form.unit = res.unit || ''
      form.description = res.description || ''
      form.status = res.status !== undefined ? res.status : 1
      statusValue.value = form.status === 1
      
      // 处理图片回显
      if (res.cover_image) {
        fileList.value = [{ url: res.cover_image }]
      }
      if (res.images && res.images.length > 0) {
        // 假设 images 是字符串数组
        fileList.value = res.images.map(url => ({ url }))
      }
    }
  } catch (e) {
    console.error('Failed to load product', e)
    uni.showToast({ title: '加载失败', icon: 'none' })
  }
}

const afterRead = (event: any) => {
  // 模拟上传：直接使用本地临时路径
  // 真实场景：调用 uni.uploadFile 上传到服务器
  const { file } = event
  const files = [].concat(file)
  
  files.forEach((item: any) => {
    fileList.value.push({
      ...item,
      status: 'success',
      message: ''
    })
  })
}

const deletePic = (event: any) => {
  fileList.value.splice(event.index, 1)
}

const confirmCategory = (e: any) => {
  form.category = e.value[0]
  showCategory.value = false
}

const onStatusChange = (val: boolean) => {
  form.status = val ? 1 : 0
}

const submit = async () => {
  if (!form.name || !form.price || !form.stock || !form.category) {
    uni.showToast({ title: '请填写必填项', icon: 'none' })
    return
  }
  
  if (fileList.value.length === 0) {
    uni.showToast({ title: '请至少上传一张图片', icon: 'none' })
    return
  }
  
  submitting.value = true
  
  // 提取图片URL (模拟)
  const images = fileList.value.map(item => item.url)
  const cover_image = images[0]
  
  const payload = {
    ...form,
    price: parseFloat(form.price),
    original_price: form.original_price ? parseFloat(form.original_price) : undefined,
    stock: parseInt(form.stock),
    stock_warning: form.stock_warning ? parseInt(form.stock_warning) : undefined,
    cover_image,
    images
  }
  
  try {
    if (isEdit.value) {
      await updateProduct(productId.value, payload)
      uni.showToast({ title: '修改成功', icon: 'success' })
    } else {
      await createProduct(payload)
      uni.showToast({ title: '发布成功', icon: 'success' })
    }
    
    setTimeout(() => {
      uni.navigateBack()
    }, 1500)
  } catch (e) {
    uni.showToast({ title: isEdit.value ? '修改失败' : '发布失败', icon: 'none' })
  } finally {
    submitting.value = false
  }
}
</script>

<style lang="scss" scoped>
.product-add-container {
  min-height: 100vh;
  background: #f5f5f5;
  padding: 20rpx;
  padding-bottom: 120rpx;
}

.form-card {
  background: #fff;
  border-radius: 20rpx;
  padding: 30rpx;
}

.category-select {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.text-black { color: #333; }
.text-gray { color: #c0c4cc; }

.tips {
  font-size: 22rpx;
  color: #999;
  margin-top: 10rpx;
}

.status-text {
  font-size: 26rpx;
  color: #666;
  margin-left: 20rpx;
}

.footer-btn {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background: #fff;
  padding: 20rpx 40rpx;
  padding-bottom: calc(20rpx + constant(safe-area-inset-bottom));
  padding-bottom: calc(20rpx + env(safe-area-inset-bottom));
  box-shadow: 0 -2rpx 10rpx rgba(0,0,0,0.05);
  z-index: 10;
}
</style>
