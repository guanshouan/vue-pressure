<template>
  <div class="layout">
    <DownloadOutlined class="export-icon" @click="download" />
    <h1 class="home-title">双水平动态压力计算系统</h1>
    <div class="split-line" style="margin: 0 -20px"></div>
    <div class="main-box" ref="printDiv">
      <!-- 检验信息区域 -->
      <div class="flex-center" style="padding-top: 20px">
        <span>
          <span class="input-title">任务号:</span>
          <a-input class="short-input mr10" />
        </span>
        <span>
          <span class="input-title">日期:</span>
          <a-input class="short-input mr10" />
        </span>
        <span>
          <span class="input-title">温度:</span>
          <a-input class="mini-input mr10" />
        </span>
        <span>
          <span class="input-title">湿度:</span>
          <a-input class="mini-input mr10" />
        </span>
        <span>
          <span class="input-title">附件:</span>
          <a-input class="mini-input mr10" />
        </span>
      </div>
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
            <a-input class="mini-input mr5" v-model:value="sampleRate" />
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
            <span class="label ellipsis mr5" :title="excel.fileName" style="width: 120px">{{ excel.fileName }}</span>
            <span>
              <span class="input-title">呼吸频率:</span>
              <a-select v-model:value="multiInfo[excel.fileId]!.bpm" style="width: 100px" class="mr5">
                <a-select-option :value="10">10</a-select-option>
                <a-select-option :value="15">15</a-select-option>
                <a-select-option :value="20">20</a-select-option>
              </a-select>
              <span class="mr20">bpm</span>
            </span>
            <span>
              <span class="input-title">from:</span>
              <a-input v-model:value="multiInfo[excel.fileId]!.from" class="short-input mr5" />
              <span class="mr20">秒</span>
            </span>
            <span>
              <span class="input-title">每秒采样率:</span>
              <a-input class="mini-input mr5" v-model:value="sampleRate" />
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
        </div>
        <a-button type="primary" @click="draw" class="mb20">绘制</a-button>
      </div>
      <!-- 图像区域 -->
      <div>
        <LineChartBox id="chart1" ref="chart1" class="mb20" />
        <LineChartBox id="chart2" ref="chart2" class="mb20" />
        <LineChartBox id="chart3" ref="chart3" class="mb20" />
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
              <div v-for="(value, key, index) in details" :key="index">{{ key }}：<br />{{ value }}<br /><br /></div>
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
import { getCurrentInstance, ref, computed, watch } from 'vue'
import type { ExcelData, LineData } from '@/types/type'
import LineChartDrawer from '@/helper/LineChartDrawer'
import { DownloadOutlined, EyeOutlined } from '@ant-design/icons-vue'
import { calcResult } from '@/helper/calc'
import { message } from 'ant-design-vue'

let echarts = getCurrentInstance()!.appContext.config.globalProperties.$echarts
let getPdf = getCurrentInstance()!.appContext.config.globalProperties.$getPdf

const printDiv = ref()
const resultTable = ref()
const pointTable = ref()

const chart1 = ref()
const chart2 = ref()
const chart3 = ref()

const showResult = ref(false)
const showDetail = ref(false)

const details = ref<any>({})

const bpm10From = ref('')
const bpm15From = ref('')
const bpm20From = ref('')

type Info = {
  name: string
  bpm: '10' | '15' | '20'
  from: string
}
const multiInfo = ref<{ [propName: string]: Info }>({})

watch(
  [excels, uploadType],
  () => {
    if (uploadType.value === UploadType.Multi) {
      excels.value.forEach((excel) => {
        if (!multiInfo.value[excel.fileId]) {
          multiInfo.value[excel.fileId] = {
            name: excel.fileName,
            bpm: '10',
            from: ''
          }
        }
      })
      for (let key in multiInfo.value) {
        if (!excels.value.find((x) => x.fileId === key)) {
          delete multiInfo.value[key]
        }
      }
    } else {
      multiInfo.value = {}
    }
    console.log('---multiInfo---', multiInfo.value)
  },
  { deep: true }
)

const sampleRate = ref(128)

const allPointNum = computed(() => {
  return Number(sampleRate.value) * 60 * 5
})
const isSingle = computed(() => {
  return uploadType.value === UploadType.Single
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
  // 每次绘图，清空结果
  showResult.value = false
  const rate = Number(sampleRate.value)

  if (excels.value.length > 0) {
    chart1.value.isHide = false
    let excel = excels.value[0]
    let chart1bpm = isSingle.value ? 10 : Number(multiInfo.value[excel.fileId]!.bpm)
    let chart1From = isSingle.value ? Number(bpm10From.value) : Number(multiInfo.value[excel.fileId]!.from)
    let chart1Title = isSingle.value ? '10bpm' : multiInfo.value[excel.fileId]!.name
    let chart1PointsPerCycle = (60 / chart1bpm) * rate
    let chart1Offset = chart1From * rate
    setTimeout(() => {
      LineChartDrawer.draw(echarts, transformData(excels.value[0].data, chart1Offset), 'chart1', {
        title: `${chart1Title} (每周期理论采样点：${chart1PointsPerCycle})`
      })
      chart1.value.reset()
    })
  }

  if (uploadType.value === UploadType.Single || excels.value.length > 1) {
    chart2.value.isHide = false
    let excel = isSingle.value ? excels.value[0] : excels.value[1]
    let chart2bpm = isSingle.value ? 15 : Number(multiInfo.value[excel.fileId]!.bpm)
    let chart2From = isSingle.value ? Number(bpm15From.value) : Number(multiInfo.value[excel.fileId]!.from)
    let chart2Title = isSingle.value ? '15bpm' : multiInfo.value[excel.fileId]!.name
    let chart2PointsPerCycle = (60 / chart2bpm) * rate
    let chart2Offset = chart2From * rate
    setTimeout(() => {
      LineChartDrawer.draw(echarts, transformData(excel.data, chart2Offset), 'chart2', {
        title: `${chart2Title} (每周期理论采样点：${chart2PointsPerCycle})`
      })
      chart2.value.reset()
    })
  } else {
    chart2.value.isHide = true
  }

  if (uploadType.value === UploadType.Single || excels.value.length > 2) {
    chart3.value.isHide = false
    let excel = isSingle.value ? excels.value[0] : excels.value[2]
    let chart3bpm = isSingle.value ? 20 : Number(multiInfo.value[excel.fileId]!.bpm)
    let chart3From = isSingle.value ? Number(bpm20From.value) : Number(multiInfo.value[excel.fileId]!.from)
    let chart3Title = isSingle.value ? '20bpm' : multiInfo.value[excel.fileId]!.name
    let chart3PointsPerCycle = (60 / chart3bpm) * rate
    let chart3Offset = chart3From * rate
    setTimeout(() => {
      LineChartDrawer.draw(echarts, transformData(excel.data, chart3Offset), 'chart3', {
        title: `${chart3Title} (每周期理论采样点：${chart3PointsPerCycle})`
      })
      chart3.value.reset()
    })
  } else {
    chart3.value.isHide = true
  }
}

function transformData(excels: LineData[], offset: number) {
  return excels.map((data) => [data.x, data.y]).slice(offset, offset + allPointNum.value)
}

function calc() {
  if (!(checkBasic() && checkChart() && checkParam())) {
    return
  }

  showResult.value = true
  showDetail.value = false

  let chart1Result = calcAdapter(excels.value[0], chart1, { bpm: '10', from: bpm10From.value, name: 'bpm10' })

  let chart2Result: any
  if (!chart2.value.isHide) {
    chart2Result = calcAdapter(isSingle.value ? excels.value[0] : excels.value[1], chart2, {
      bpm: '15',
      from: bpm15From.value,
      name: 'bpm15'
    })
  }

  let chart3Result: any
  if (!chart3.value.isHide) {
    chart3Result = calcAdapter(isSingle.value ? excels.value[0] : excels.value[2], chart3, {
      bpm: '20',
      from: bpm20From.value,
      name: 'bpm20'
    })
  }

  setTimeout(() => {
    resultTable.value.data = [chart1Result.result, chart2Result?.result, chart3Result?.result].filter(Boolean)
    resultTable.value.render()
    pointTable.value.data = [chart1Result.point, chart2Result?.point, chart3Result?.point].filter(Boolean)
    pointTable.value.render()
    details.value = { ...chart1Result.detail, ...chart2Result?.detail, ...chart3Result?.detail }
  })
}

function calcAdapter(excel: ExcelData, chart: any, singleParam: Info) {
  const rate = Number(sampleRate.value)

  let from = isSingle.value ? Number(singleParam.from) : Number(multiInfo.value[excel.fileId]!.from)
  let bpm = isSingle.value ? singleParam.bpm : multiInfo.value[excel.fileId]!.bpm
  let name = isSingle.value ? singleParam.name : multiInfo.value[excel.fileId]!.name
  let offset = from * rate

  let res = calcResult(
    name,
    bpm,
    offset,
    transformData(excel.data, offset),
    chart.value.generate(),
    Number(inBeginPercent.value),
    Number(inEndPercent.value),
    Number(inStandard.value),
    Number(outBeginPercent.value),
    Number(outEndPercent.value),
    Number(outStandard.value)
  )

  return res
}

function download() {
  getPdf(printDiv.value, '计算结果')
}

function checkBasic() {
  if (excels.value.length <= 0) {
    message.warn('请先上传文件')
    return false
  }
  if (!sampleRate.value) {
    message.warn('请先填写绘图信息')
    return false
  }
  if (uploadType.value === UploadType.Single) {
    if (!bpm10From.value || !bpm15From.value || !bpm20From.value) {
      message.warn('请先填写绘图信息')
      return false
    }
  }
  if (uploadType.value === UploadType.Multi) {
    for (let key in multiInfo.value) {
      if (!multiInfo.value[key].from) {
        message.warn('请先填写绘图信息')
        return false
      }
    }
  }
  return true
}

function checkChart() {
  if (chart1.value.isHide) {
    message.warn('请先完成绘图')
    return false
  }

  if (!(checkPoint(chart1) && checkPoint(chart2) && checkPoint(chart3))) {
    return false
  }
  return true
}

function checkPoint(chart: any) {
  if (chart.value.isHide) {
    return true
  }
  let points = chart.value.generate()
  if (points.length === 0) {
    message.warn('请先选取计算点')
    return false
  }
  if (!(Number(points[1][0]) > Number(points[0][0]) && Number(points[2][0]) > Number(points[1][0]))) {
    message.warn('请重新选取计算点')
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
  top: 28px;
  right: 26px;
  font-size: 25px;
  color: #1677ff;
  z-index: 999;
}
</style>
