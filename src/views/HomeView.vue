<template>
  <div class="layout">
    <DownloadOutlined class="export-icon" @click="download" />
    <h1 class="home-title">双水平动态压力计算系统</h1>
    <div class="split-line" style="margin: 0 -20px"></div>
    <div class="main-box" ref="printDiv">
      <!-- 文件上传区域 -->
      <div style="padding-top: 20px">
        <h3 style="margin-top: 0">数据上传</h3>
        <div class="mb20">
          <UploadExcel />
        </div>
        <div v-if="uploadType === UploadType.Single" class="flex-center mb20">
          <span>
            <span class="input-title">10bpm from:</span>
            <a-input class="short-input mr5" v-model:value="bpm10From" />
            <span class="mr20">秒</span>
          </span>
          <span>
            <span class="input-title">15bpm from:</span>
            <a-input class="short-input mr5" v-model:value="bpm15From" />
            <span class="mr20">秒</span>
          </span>
          <span>
            <span class="input-title">20bpm from:</span>
            <a-input class="short-input mr5" v-model:value="bpm20From" />
            <span class="mr20">秒</span>
          </span>
          <span>
            <span class="input-title">每秒采样率:</span>
            <a-input class="short-input mr5" v-model:value="sampleRate" />
            <span class="mr20">次/秒</span>
          </span>
          <span>
            <span class="input-title">压力单位:</span>
            <a-select ref="select" v-model:value="pressureUnit" style="width: 90px" class="mr20">
              <a-select-option :value="PressureUnit.cmH2O">cmH<sub>2</sub>O</a-select-option>
              <a-select-option :value="PressureUnit.hPa">hPa</a-select-option>
            </a-select>
          </span>
        </div>
        <div class="mb20" v-if="uploadType === UploadType.Multi">
          <div v-for="(value, index) in excelData" :key="value.fileId" class="flex-center mb10">
            <span class="mr10">文件{{ index + 1 }}：</span>
            <span>
              <span class="input-title">呼吸频率:</span>
              <a-input class="short-input mr5" />
              <span class="mr20">bmp</span>
            </span>
            <span>
              <span class="input-title">from:</span>
              <a-input class="short-input mr5" />
              <span class="mr20">秒</span>
            </span>
            <span>
              <span class="input-title">每秒采样率:</span>
              <a-input class="short-input mr5" />
              <span class="mr20">次/秒</span>
            </span>
          </div>
        </div>
        <a-button type="primary" @click="draw" class="mb20">绘制</a-button>
      </div>
      <!-- 图像区域 -->
      <div>
        <LineChartBox id="bpm10" ref="bpm10" class="mb20" />
        <LineChartBox id="bpm15" ref="bpm15" class="mb20" />
        <LineChartBox id="bpm20" ref="bpm20" class="mb20" />
      </div>
      <div class="split-line"></div>
      <!-- 参数设置区域 -->
      <div>
        <h3>参数设置</h3>
        <div class="mb10">
          <span>
            <span class="input-title">吸气设定压力值:</span>
            <a-input class="short-input mr5" v-model:value="inStandard" />
            <span v-if="pressureUnit === PressureUnit.cmH2O" class="mr20">cmH<sub>2</sub>O</span>
            <span v-if="pressureUnit === PressureUnit.hPa" class="mr20">hPa</span>
          </span>
          <span>
            <span class="input-title">吸气起始百分比:</span>
            <a-input class="short-input mr5" v-model:value="inBeginPercent" />
            <span class="mr20">%</span>
          </span>
          <span>
            <span class="input-title">吸气结束百分比:</span>
            <a-input class="short-input mr5" v-model:value="inEndPercent" />
            <span class="mr20">%</span>
          </span>
        </div>
        <div class="mb10">
          <span>
            <span class="input-title">呼气设定压力值:</span>
            <a-input class="short-input mr5" v-model:value="outStandard" />
            <span v-if="pressureUnit === PressureUnit.cmH2O" class="mr20">cmH<sub>2</sub>O</span>
            <span v-if="pressureUnit === PressureUnit.hPa" class="mr20">hPa</span>
          </span>
          <span>
            <span class="input-title">呼气起始百分比:</span>
            <a-input class="short-input mr5" v-model:value="outBeginPercent" />
            <span class="mr20">%</span>
          </span>
          <span>
            <span class="input-title">呼气结束百分比:</span>
            <a-input class="short-input mr5" v-model:value="outEndPercent" />
            <span class="mr20">%</span>
          </span>
        </div>
        <div class="flex mb20">
          <span class="input-title">备注:</span>
          <a-textarea style="width: 842px" v-model:value="remark" />
        </div>
        <a-button class="mb20" type="primary" @click="calc">计算</a-button>
      </div>
      <!-- 计算结果区域 -->
      <div class="result-box">
        <template v-if="showResult">
          <div class="split-line"></div>
          <h3>计算结果</h3>
          <ResultTable />
        </template>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import UploadExcel from '@/components/UploadExcel.vue'
import LineChartBox from '@/components/LineChartBox.vue'
import ResultTable from '@/components/ResultTable.vue'
import { uploadType } from '@/stores/commonStore'
import { PressureUnit, UploadType } from '@/types/enum'
import { excelData } from '@/stores/excelDataStore'
import { watch, getCurrentInstance, ref } from 'vue'
import type { LineData } from '@/types/type'
import LineChartDrawer from '@/helper/LineChartDrawer'
import { DownloadOutlined } from '@ant-design/icons-vue'
import { calcAvg, getCycleData, getPos } from '@/helper/calc'

let echarts = getCurrentInstance()!.appContext.config.globalProperties.$echarts
let getPdf = getCurrentInstance()!.appContext.config.globalProperties.$getPdf

const printDiv = ref()

const bpm10 = ref()
const bpm15 = ref()
const bpm20 = ref()

const showResult = ref(false)

const bpm10From = ref('')
const bpm15From = ref('')
const bpm20From = ref('')
const sampleRate = ref(128)

const pressureUnit = ref(PressureUnit.cmH2O)

const inStandard = ref('')
const inBeginPercent = ref('')
const inEndPercent = ref('')
const outStandard = ref('')
const outBeginPercent = ref('')
const outEndPercent = ref('')

const remark = ref('')

function draw() {
  showResult.value = false

  let allPointNum = Number(sampleRate.value) * 60 * 5

  bpm10.value.isHide = false
  let bpm10PointsPerCycle = (60 / 10) * Number(sampleRate.value)
  let bpm10Offset = Number(bpm10From.value) * Number(sampleRate.value)
  setTimeout(() => {
    LineChartDrawer.draw(
      echarts,
      excelData.value[0]
        ?.map((data: LineData) => {
          return [data.x, data.y]
        })
        .slice(bpm10Offset, bpm10Offset + allPointNum),
      'bpm10',
      { title: '10bpmddddddddddddddddddddssssssssssssssss' }
    )
  })

  bpm15.value.isHide = false
  let bpm15PointsPerCycle = (60 / 15) * Number(sampleRate.value)
  let bpm15Offset = Number(bpm15From.value) * Number(sampleRate.value)
  setTimeout(() => {
    LineChartDrawer.draw(
      echarts,
      excelData.value[0]
        ?.map((data: LineData) => {
          return [data.x, data.y]
        })
        .slice(bpm15Offset, bpm15Offset + bpm15PointsPerCycle * 10),
      'bpm15',
      { title: '15bpm' }
    )
  })

  bpm20.value.isHide = false
  let bpm20PointsPerCycle = (60 / 20) * Number(sampleRate.value)
  let bpm20Offset = Number(bpm20From.value) * Number(sampleRate.value)
  setTimeout(() => {
    LineChartDrawer.draw(
      echarts,
      excelData.value[0]
        ?.map((data: LineData) => {
          return [data.x, data.y]
        })
        .slice(bpm20Offset, bpm20Offset + bpm20PointsPerCycle * 10),
      'bpm20',
      { title: '20bpm' }
    )
  })
}

function calc() {
  showResult.value = true

  let bpm10Offset = Number(bpm10From.value) * Number(sampleRate.value)
  const inPosAvg = calcAvg(
    getCycleData(
      bpm10Offset,
      excelData.value[0]
        ?.map((data: LineData) => {
          return [data.x, data.y]
        })
        .slice(bpm10Offset, bpm10Offset + 5 * 60 * Number(sampleRate.value)),
      bpm10.value.generate(),
      Number(inBeginPercent.value),
      Number(inEndPercent.value)
    ).map((x) => getPos(x, Number(inStandard.value)))
  )

  console.log(inPosAvg)
}

function download() {
  getPdf(printDiv.value, 'mypdf')
}
</script>

<style scoped>
.layout {
  padding: 0 20px;
}

.main-box {
  padding: 0 20px;
}

.home-title {
  text-align: center;
}

.split-line {
  border-top: 1px solid rgba(60, 60, 60, 0.12);
}

.result-box {
  min-height: 200px;
}

.export-icon {
  cursor: pointer;
  position: fixed;
  top: 20px;
  right: 25px;
  font-size: 24px;
  color: #1677ff;
}
</style>
