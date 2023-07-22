<template><a-table :columns="columns" :data-source="data"></a-table>></template>

<script setup lang="ts">
const columns = [
  {
    title: '吸气相正偏差平均值',
    dataIndex: 'inPosAvg'
  },
  {
    title: '吸气相负偏差平均值',
    dataIndex: 'inNegAvg'
  },
  {
    title: '吸气相偏差平均值',
    dataIndex: 'inAvg'
  },
  {
    title: '呼气相正偏差平均值',
    dataIndex: 'outPosAvg'
  },
  {
    title: '呼气相负偏差平均值',
    dataIndex: 'outNegAvg'
  },
  {
    title: '呼气相偏差平均值',
    dataIndex: 'outAvg'
  },
  {
    title: '吸气相正偏差标准差',
    dataIndex: 'inPosSd'
  },
  {
    title: '吸气相负偏差标准差',
    dataIndex: 'inNegSd'
  },
  {
    title: '吸气相偏差标准差',
    dataIndex: 'inSd'
  },
  {
    title: '呼气相正偏差标准差',
    dataIndex: 'outPosSd'
  },
  {
    title: '呼气相负偏差标准差',
    dataIndex: 'outNegSd'
  },
  {
    title: '呼气相偏差标准差',
    dataIndex: 'outSd'
  }
]

const data: any = []
</script>
