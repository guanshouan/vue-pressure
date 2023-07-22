import type { LineData } from '@/types/type'
import { ref } from 'vue'

// const excelData = ref<Map<string, LineData[]>>(new Map())
// const excelData = ref<{ [propName: string]: LineData[] | undefined }>({})
// const excelData = ref<Array<LineData[]>>([])
const excelData = ref<any>([])

function addExcelData(fileId: string, data: LineData[]) {
  ;(data as any).fileId = fileId
  excelData.value.push(data)
}

function removeExcelData(fileId: string) {
  excelData.value = excelData.value.filter((x: any) => x.fileId === fileId)
}

export { excelData, addExcelData, removeExcelData }
