import type { ExcelData } from '@/types/type'
import { ref } from 'vue'

const excels = ref<ExcelData[]>([])

function addExcelData(data: ExcelData) {
  excels.value.push(data)
}

function removeExcelData(fileId: string) {
  excels.value = excels.value.filter((x) => x.fileId !== fileId)
}

export { excels, addExcelData, removeExcelData }
