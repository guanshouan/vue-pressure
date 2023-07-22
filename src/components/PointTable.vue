<template>
  <a-table :columns="columns" :data-source="data" :pagination="false"></a-table>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const columns = [
  {
    title: 'bpm',
    dataIndex: 'id'
  },
  {
    title: '吸气相正偏差',
    dataIndex: 'inPos'
  },
  {
    title: '吸气相负偏差',
    dataIndex: 'inNeg'
  },
  {
    title: '吸气相偏差',
    dataIndex: 'inMax'
  },
  {
    title: '呼气相正偏差',
    dataIndex: 'outPos'
  },
  {
    title: '呼气相负偏差',
    dataIndex: 'outNeg'
  },
  {
    title: '呼气相偏差',
    dataIndex: 'outMax'
  }
]

const data: any = ref([])

defineExpose({ data })
</script>
