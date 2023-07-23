<template>
  <div class="layout">
    <DownloadOutlined class="export-icon" @click="download" />
    <h1 class="home-title">双水平动态压力计算系统</h1>
    <div class="split-line" style="margin: 0 -20px"></div>
    <div class="main-box" ref="printDiv">
      <!-- 文件上传区域 -->
      <div class="upload-box">
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
            <a-select v-model:value="pressureUnit" style="width: 90px" class="mr20">
              <a-select-option :value="PressureUnit.cmH2O">cmH<sub>2</sub>O</a-select-option>
              <a-select-option :value="PressureUnit.hPa">hPa</a-select-option>
            </a-select>
          </span>
        </div>
        <div class="mb20" v-if="uploadType === UploadType.Multi">
          <div v-for="excel in excels" :key="excel.fileId" class="flex-center mb10">
            <span class="label ellipsis mr10" :title="excel.fileName" style="width: 120px">{{ excel.fileName }}</span>
            <span>
              <span class="input-title">呼吸频率:</span>
              <a-select style="width: 80px" class="mr5">
                <a-select-option :value="10">10</a-select-option>
                <a-select-option :value="15">15</a-select-option>
                <a-select-option :value="20">20</a-select-option>
              </a-select>
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
          <a-textarea style="width: 808px" v-model:value="remark" />
        </div>
        <a-button class="mb20" type="primary" @click="calc">计算</a-button>
      </div>
      <!-- 计算结果区域 -->
      <div class="result-box">
        <template v-if="showResult">
          <div class="split-line"></div>
          <h3>
            计算结果&nbsp;(单位：
            <span v-if="pressureUnit === PressureUnit.cmH2O">cmH<sub>2</sub>O</span>
            <span v-if="pressureUnit === PressureUnit.hPa">hPa</span>)
          </h3>
          <div class="mb30">
            <div class="label mb5">选中周期</div>
            <PointTable ref="pointTable" />
          </div>
          <div>
            <div class="label mb5">
              所有周期&nbsp;&nbsp;<eye-outlined @click="showDetail = !showDetail" style="cursor: pointer" />
            </div>
            <div class="detail" v-show="showDetail">
              <div v-for="(value, key, index) in details" :key="index">{{ key }}:<br />{{ value }}<br /><br /></div>
            </div>
            <ResultTable ref="resultTable" />
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import UploadExcel from '@/components/UploadExcel.vue'
import LineChartBox from '@/components/LineChartBox.vue'
import ResultTable from '@/components/ResultTable.vue'
import PointTable from '@/components/PointTable.vue'
import { uploadType } from '@/stores/commonStore'
import { PressureUnit, UploadType } from '@/types/enum'
import { excels } from '@/stores/excelDataStore'
import { getCurrentInstance, ref, computed } from 'vue'
import type { LineData } from '@/types/type'
import LineChartDrawer from '@/helper/LineChartDrawer'
import { DownloadOutlined, EyeOutlined } from '@ant-design/icons-vue'
import { calcResult } from '@/helper/calc'
import { message } from 'ant-design-vue'

let echarts = getCurrentInstance()!.appContext.config.globalProperties.$echarts
let getPdf = getCurrentInstance()!.appContext.config.globalProperties.$getPdf

const printDiv = ref()
const resultTable = ref()
const pointTable = ref()

const bpm10 = ref()
const bpm15 = ref()
const bpm20 = ref()

const showResult = ref(false)
const showDetail = ref(false)

const details = ref<any>({})

const bpm10From = ref(60)
const bpm15From = ref('')
const bpm20From = ref('')

const sampleRate = ref(128)

const allPointNum = computed(() => {
  return Number(sampleRate.value) * 60 * 5
})

const pressureUnit = ref(PressureUnit.cmH2O)

const inStandard = ref('')
const inBeginPercent = ref('')
const inEndPercent = ref('')
const outStandard = ref('')
const outBeginPercent = ref('')
const outEndPercent = ref('')

const remark = ref('')

function draw() {
  if (!checkBasic()) {
    return
  }
  showResult.value = false

  bpm10.value.isHide = false
  let bpm10PointsPerCycle = (60 / 10) * Number(sampleRate.value)
  let bpm10Offset = Number(bpm10From.value) * Number(sampleRate.value)
  setTimeout(() => {
    LineChartDrawer.draw(echarts, transformData(excels.value[0].data, bpm10Offset), 'bpm10', {
      title: `10bpm (每周期采样点：${bpm10PointsPerCycle})`
    })
  })

  bpm15.value.isHide = false
  let bpm15PointsPerCycle = (60 / 15) * Number(sampleRate.value)
  let bpm15Offset = Number(bpm15From.value) * Number(sampleRate.value)
  setTimeout(() => {
    LineChartDrawer.draw(echarts, transformData(excels.value[0].data, bpm15Offset), 'bpm15', {
      title: `15bpm (每周期采样点：${bpm15PointsPerCycle})`
    })
  })

  bpm20.value.isHide = false
  let bpm20PointsPerCycle = (60 / 20) * Number(sampleRate.value)
  let bpm20Offset = Number(bpm20From.value) * Number(sampleRate.value)
  setTimeout(() => {
    LineChartDrawer.draw(echarts, transformData(excels.value[0].data, bpm20Offset), 'bpm20', {
      title: `20bpm (每周期采样点：${bpm20PointsPerCycle})`
    })
  })
}

function transformData(excels: LineData[], offset: number) {
  return excels.map((data) => [data.x, data.y]).slice(offset, offset + allPointNum.value)
}

function calc() {
  // if (!checkBasic() || !checkPoint() || !checkParam()) {
  //   return
  // }
  showResult.value = true
  showDetail.value = false

  let bpm10Offset = Number(bpm10From.value) * Number(sampleRate.value)
  let bpm15Offset = Number(bpm15From.value) * Number(sampleRate.value)
  let bpm20Offset = Number(bpm20From.value) * Number(sampleRate.value)

  let bmp10Result = calcResult(
    'bpm10',
    bpm10Offset,
    transformData(excels.value[0].data, bpm10Offset),
    bpm10.value.generate(),
    Number(inBeginPercent.value),
    Number(inEndPercent.value),
    Number(inStandard.value),
    Number(outBeginPercent.value),
    Number(outEndPercent.value),
    Number(outStandard.value)
  )
  let bmp15Result = calcResult(
    'bpm15',
    bpm15Offset,
    transformData(excels.value[0].data, bpm15Offset),
    bpm15.value.generate(),
    Number(inBeginPercent.value),
    Number(inEndPercent.value),
    Number(inStandard.value),
    Number(outBeginPercent.value),
    Number(outEndPercent.value),
    Number(outStandard.value)
  )
  let bmp20Result = calcResult(
    'bpm20',
    bpm20Offset,
    transformData(excels.value[0].data, bpm20Offset),
    bpm20.value.generate(),
    Number(inBeginPercent.value),
    Number(inEndPercent.value),
    Number(inStandard.value),
    Number(outBeginPercent.value),
    Number(outEndPercent.value),
    Number(outStandard.value)
  )

  setTimeout(() => {
    resultTable.value.data = [bmp10Result.result, bmp15Result.result, bmp20Result.result]
    pointTable.value.data = [bmp10Result.point, bmp15Result.point, bmp20Result.point]

    details.value = { ...bmp10Result.detail, ...bmp15Result.detail, ...bmp20Result.detail }
  })
}

function download() {
  getPdf(printDiv.value, 'mypdf')
}

function checkBasic() {
  if (excels.value.length <= 0) {
    message.warn('请先上传文件')
    return false
  }
  if (!bpm10From.value || !bpm15From.value || !bpm20From.value || !sampleRate.value) {
    message.warn('请先填写绘图信息')
    return false
  }
  return true
}

function checkPoint() {
  if (!bpm10From.value || !bpm15From.value || !bpm20From.value || !sampleRate.value) {
    message.warn('请先完成绘图并取标准点')
    return false
  }
  return true
}

function checkParam() {
  if (
    !inStandard.value ||
    !inBeginPercent.value ||
    !inEndPercent.value ||
    !outStandard.value ||
    !outBeginPercent.value ||
    !outEndPercent.value
  ) {
    message.warn('请先填写参数设置')
    return false
  }
  return true
}
</script>

<style scoped lang="less">
.layout {
  padding: 0 20px;
  .home-title {
    text-align: center;
  }
  .main-box {
    padding: 0 20px;
    .upload-box {
      padding-top: 20px;
      .excel-title {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        width: 120px;
        color: rgba(0, 0, 0, 0.45);
      }
    }
    .result-box {
      min-height: 200px;
      padding-bottom: 50px;

      .detail {
        background: rgb(245, 245, 245);
        padding: 10px;
        max-height: 300px;
        overflow: auto;
        margin: 10px 0px;
      }
    }
  }
}

.split-line {
  border-top: 1px solid rgba(60, 60, 60, 0.12);
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
