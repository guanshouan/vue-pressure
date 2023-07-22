<template>
  <a-table :data-source="data" :pagination="false">
    <a-table-column key="id" title="bpm" data-index="id" />
    <a-table-column-group>
      <template #title>平均值</template>
      <a-table-column key="inPosAvg" title="吸气相正偏差" data-index="inPosAvg" />
      <a-table-column key="inNegAvg" title="吸气相负偏差" data-index="inNegAvg" />
      <a-table-column key="inMaxAvg" title="吸气相偏差" data-index="inMaxAvg" />
      <a-table-column key="outPosAvg" title="呼气相正偏差" data-index="outPosAvg" />
      <a-table-column key="outNegAvg" title="呼气相负偏差" data-index="outNegAvg" />
      <a-table-column key="outMaxAvg" title="呼气相偏差" data-index="outMaxAvg" />
    </a-table-column-group>
    <a-table-column-group>
      <template #title>标准差</template>
      <a-table-column key="inPosSd" title="吸气相正偏差" data-index="inPosSd" />
      <a-table-column key="inNegSd" title="吸气相负偏差" data-index="inNegSd" />
      <a-table-column key="inMaxSd" title="吸气相偏差" data-index="inMaxSd" />
      <a-table-column key="outPosSd" title="呼气相正偏差" data-index="outPosSd" />
      <a-table-column key="outNegSd" title="呼气相负偏差" data-index="outNegSd" />
      <a-table-column key="outMaxSd" title="呼气相偏差" data-index="outMaxSd" />
    </a-table-column-group>
  </a-table>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const data: any = ref([])

defineExpose({ data })
</script>
