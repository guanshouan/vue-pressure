<template>
  <div class="page-layout">
    <div class="flex-center top-area">
      <div class="top-area-title" @click="toHome">辽宁省医疗器械检验检测院</div>
      <div>联系方式：724504782@qq.com</div>
    </div>
    <div class="flex main-area">
      <a-menu
        v-model:selectedKeys="selectedKeys"
        style="width: 240px; height: 100%; padding-top: 5px"
        mode="inline"
        :items="items"
        @click="changeMenu"
      ></a-menu>
      <div style="flex-grow: 1">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

let router = useRouter()
let route = useRoute()
const items = ref([
  {
    key: 'CPAP',
    label: 'CPAP模式动态压力计算系统'
  },
  {
    key: 'BIPAP',
    label: '双水平动态压力计算系统'
  }
])

const selectedKeys = ref(['CPAP'])

watch(
  () => route.name,
  (newVal) => {
    if (newVal) {
      selectedKeys.value = [newVal as string]
    }
  },
  { immediate: true }
)

function changeMenu({ key }: any) {
  router.push({ name: key })
}

function toHome() {
  selectedKeys.value = ['CPAP']
  router.push({ name: 'CPAP' })
  // window.open('https://www.lmti.cn/?d20q8=idfa7.html')
}
</script>

<style scoped lang="less">
.page-layout {
  height: 100vh;
  .top-area {
    padding-left: 25px;
    padding-right: 60px;
    justify-content: space-between;
    box-sizing: border-box;
    height: 50px;
    background-color: #f5f5f5;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    .top-area-title {
      font-weight: bold;
      cursor: pointer;
    }
  }
  .main-area {
    height: calc(100% - 50px);
  }
}
</style>
