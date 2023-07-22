<template>
  <div class="flex">
    <a-upload
      :file-list="fileList"
      name="file"
      accept=".xls, .xlsx"
      class="mr20"
      :beforeUpload="beforeUpload"
      style="width: 140px"
      :disabled="isUploading"
      @remove="remove"
    >
      <a-button>
        <upload-outlined></upload-outlined>
        {{ isUploading ? '正在上传' : '点击上传' }}
      </a-button>
    </a-upload>
    <a-radio-group v-model:value="uploadType" name="radioGroup" class="radio-box" :disabled="fileList.length > 1">
      <a-radio :value="UploadType.Single">单文件</a-radio>
      <a-radio :value="UploadType.Multi">多文件 (最多3个)</a-radio>
    </a-radio-group>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { UploadOutlined } from '@ant-design/icons-vue'
import * as XLSX from 'xlsx'
import { UploadType } from '../types/enum'
import * as excelDataStore from '@/stores/excelDataStore'
import { uploadType } from '@/stores/commonStore'

const fileList = ref<any[]>([])

const isUploading = ref(false)

function beforeUpload(file: any) {
  isUploading.value = true

  const fileReader = new FileReader()
  fileReader.readAsBinaryString(file)
  fileReader.onload = (e) => {
    //workbook存放excel的所有基本信息
    let workbook = XLSX.read(e.target!.result, { type: 'binary', cellDates: true })
    //定义sheetList中存放excel表格的sheet表，就是最下方的tab
    let sheetList = workbook.SheetNames
    //读取文件内容(第一个sheet里的内容); range：设置从第几行开始读取内容
    let json = XLSX.utils.sheet_to_json(workbook.Sheets[sheetList[0]], { range: 0 })

    let data = calcData(json)

    console.log('excel data:::', data)

    isUploading.value = false

    excelDataStore.addExcelData(file.uid, data)

    if (uploadType.value === UploadType.Single && fileList.value.length === 1) {
      excelDataStore.removeExcelData(fileList.value[0].uid)
      fileList.value.pop()
    } else if (uploadType.value === UploadType.Multi && fileList.value.length === 3) {
      excelDataStore.removeExcelData(fileList.value[2].uid)
      fileList.value.pop()
    }

    fileList.value.push(file)
  }

  return false
}

function remove(file: any) {
  let index = fileList.value.findIndex((x: any) => x.uid === file.uid)
  excelDataStore.removeExcelData(file.uid)
  fileList.value.splice(index, 1)
}

function calcData(json: any) {
  return json.map((data: any, index: number) => {
    return {
      x: index,
      time: data['Time (sec)'],
      y: data['Airway Pressure (cmH2O)']
    }
  })
}
</script>

<style scoped>
.radio-box {
  position: relative;
  top: 5px;
}
</style>
