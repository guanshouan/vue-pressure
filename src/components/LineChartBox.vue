<template>
  <div :style="{ display: isHide ? 'none' : 'block' }">
    <div :id="props.id" @click="record" class="chart-box"></div>
    <div style="margin-left: 140px">
      <span class="input-title">point1:</span><a-input class="mr20 short-input" v-model:value="point1" readonly />
      <span class="input-title">point2:</span><a-input class="mr20 short-input" v-model:value="point2" readonly />
      <span class="input-title">point3:</span><a-input class="mr20 short-input" v-model:value="point3" readonly />
      <span class="input-title">point4:</span><a-input class="mr20 short-input" v-model:value="point4" readonly />
      <a-button @click="back" class="mr10">撤销</a-button>
      <a-button @click="reset" type="primary" class="mr10">重置</a-button>
      <span class="input-title">实际:</span><a-input class="mr20 short-input" v-model:value="point4" readonly />
      <span class="input-title">期望:</span><a-input class="mr20 short-input" v-model:value="point4" readonly />
    </div>
  </div>
</template>

<script setup lang="ts">
import { excelData } from '@/stores/excelDataStore'
import type { LineData } from '@/types/type'
import { computed, ref, watch } from 'vue'

const props = defineProps({
  id: String
})

const isHide = ref(true)

const point1 = ref('')
const point2 = ref('')
const point3 = ref('')
const point4 = ref('')

function record() {
  let tooltipOpacity = (document.querySelector(`#${props.id} .tooltip`) as any).style.opacity
  if (tooltipOpacity === 0 || tooltipOpacity === '0') {
    return
  }

  let [x, y] = [0, 0]
  let xEL = document.querySelector(`#${props.id} .tooltip>div>div>div`)
  let yEl = document.querySelector(`#${props.id} .tooltip>div>div :nth-child(2)>div span:nth-child(3)`)
  if (xEL && yEl) {
    x = Number(xEL.innerHTML.replace(/,/g, ''))
    y = Number(yEl.innerHTML.replace(/,/g, ''))
  }

  let val = `${x}, ${y}`
  if (!point1.value) {
    point1.value = val
  } else if (!point2.value) {
    point2.value = val
  } else if (!point3.value) {
    point3.value = val
  } else if (!point4.value) {
    point4.value = val
  }
}

function back() {
  if (point4.value) {
    point4.value = ''
  } else if (point3.value) {
    point3.value = ''
  } else if (point2.value) {
    point2.value = ''
  } else if (point1.value) {
    point1.value = ''
  }
}

function reset() {
  point1.value = ''
  point2.value = ''
  point3.value = ''
  point4.value = ''
}

function generate() {
  const process = (point: string) => point.split(', ')
  return [process(point1.value), process(point2.value), process(point3.value), process(point4.value)]
}

defineExpose({ isHide, generate })
</script>

<style scoped></style>
