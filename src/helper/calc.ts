import type { LineData } from '@/types/type'

/**
 * 获取周期内有效数据
 * @param data
 * @param points
 */
export function getCycleData(
  offset: number,
  data: LineData[],
  points: LineData[],
  inBeginPercent: number,
  inEndPercent: number
) {
  const cycleDataArr = []

  const cycleLength = points[3].x - points[0].x

  const inLength = points[1].x - points[0].x

  // 取数据集中，标准点后数据（含标准点）
  let startIndex = points[0].x - offset
  let endIndex = points[1].x - offset
  let startValidIndex = points[0].x + (inLength * inBeginPercent) / 100 - offset
  let endValidIndex = points[1].x - (inLength * inEndPercent) / 100 - offset
  while (endIndex - offset < data.length) {
    const cycleData = data.slice(startValidIndex, endValidIndex)
    cycleDataArr.push(cycleData)

    startIndex += cycleLength
    endIndex += cycleLength

    startValidIndex += cycleLength
    endValidIndex += cycleLength
  }

  // 取数据集中，标准点前数据（不含标准点）
  startIndex = points[0].x - offset - cycleLength
  endIndex = points[1].x - offset - cycleLength
  startValidIndex = points[0].x + (inLength * inBeginPercent) / 100 - offset - cycleLength
  endValidIndex = points[1].x - (inLength * inEndPercent) / 100 - offset - cycleLength
  while (endIndex - offset < data.length) {
    const cycleData = data.slice(startValidIndex, endValidIndex)
    cycleDataArr.unshift(cycleData)

    startIndex -= cycleLength
    endIndex -= cycleLength

    startValidIndex -= cycleLength
    endValidIndex -= cycleLength
  }

  return cycleDataArr
}

export function getPos(arr: LineData[], standard: number) {
  return Math.max(...arr.map((data) => data.y)) - standard
}

export function getNeg(arr: LineData[], standard: number) {
  return Math.min(...arr.map((data) => data.y)) - standard
}

export function getMax(arr: LineData[], standard: number) {
  if (Math.abs(getPos(arr, standard)) > Math.abs(getNeg(arr, standard))) {
    return getPos(arr, standard)
  } else {
    return getNeg(arr, standard)
  }
}

export function calcAvg(data: number[]) {
  return data.reduce((sum, value) => sum + value, 0) / data.length
}

export function calcSd(data: number[]) {
  // 计算平均值
  const mean = data.reduce((sum, value) => sum + value, 0) / data.length

  // 计算每个数据点与平均值的差的平方
  const squaredDifferences = data.map((value) => Math.pow(value - mean, 2))

  // 计算平方差的平均值
  const meanSquaredDifference = squaredDifferences.reduce((sum, value) => sum + value, 0) / squaredDifferences.length

  // 计算标准差
  const standardDeviation = Math.sqrt(meanSquaredDifference)

  return standardDeviation
}
