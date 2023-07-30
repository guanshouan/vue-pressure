<template>
  <div class="page-layout">
    <a-menu
      v-model:selectedKeys="selectedKeys"
      style="width: 240px; height: 100%"
      mode="inline"
      :items="items"
      @click="handleClick"
    ></a-menu>
    <div style="flex-grow: 1">
      <router-view></router-view>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

let router = useRouter()
const items = ref([
  {
    key: '1',
    label: '双水平动态压力计算系统'
  },
  {
    key: '2',
    label: 'Navigation One'
  }
])

const selectedKeys = ref(['1'])

function handleClick({ key }: any) {
  if (key === '1') {
    router.push('/home')
  }
  if (key === '2') {
    router.push('/system')
  }
}
</script>

<style scoped lang="less">
.page-layout {
  display: flex;
  height: 100vh;
}
</style>
