<template>
  <a-table :columns="columns" :data-source="data" :pagination="false" bordered></a-table>
</template>

<script setup lang="ts">
import { uploadType } from '@/stores/commonStore'
import { UploadType } from '@/types/enum'
import { ref } from 'vue'

const columns = ref([
  {
    title: '文件名',
    dataIndex: 'name',
    hide: UploadType.Single
  },
  {
    title: 'bpm',
    dataIndex: 'bpm'
  },
  {
    title: '吸气相最大正偏差',
    dataIndex: 'inPos'
  },
  {
    title: '吸气相最大负偏差',
    dataIndex: 'inNeg'
  },
  {
    title: '吸气相最大偏差',
    dataIndex: 'inMax'
  },
  {
    title: '呼气相最大正偏差',
    dataIndex: 'outPos'
  },
  {
    title: '呼气相最大负偏差',
    dataIndex: 'outNeg'
  },
  {
    title: '呼气相最大偏差',
    dataIndex: 'outMax'
  }
])

// 每次计算，执行render，更新列
function render() {
  columns.value = columns.value.filter((x) => x.hide !== uploadType.value)
}

const data: any = ref([])

defineExpose({ data, render })
</script>
