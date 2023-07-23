import type { LineData } from '@/types/type'

export function calcResult(
  id: string, // 单文件显示bmp10/bmp15/bmp20, 多文件显示文件名
  offset: number,
  data: any[],
  points: any[],
  inBeginPercent: number,
  inEndPercent: number,
  inStandard: number,
  outBeginPercent: number,
  outEndPercent: number,
  outStandard: number
) {
  let { cycleDataArr, pointIndex } = getCycleDataArr(offset, data, points)

  const stratPointX = points[0][0]
  const midPointX = points[1][0]

  let inCycleDataArr = cycleDataArr.map((x) =>
    getCycleValidData(x.slice(0, midPointX - stratPointX), inBeginPercent, inEndPercent)
  )
  let outCycleDataArr = cycleDataArr.map((x) =>
    getCycleValidData(x.slice(midPointX - stratPointX), outBeginPercent, outEndPercent)
  )

  // 正偏差arr
  let inPosArr = inCycleDataArr.map((x) => getPos(x, inStandard))
  console.log(`-------${id}吸气相正偏差结果集-------`, inPosArr)
  // 负偏差arr
  let inNegArr = inCycleDataArr.map((x) => getNeg(x, inStandard))
  console.log(`-------${id}吸气相负偏差结果集-------`, inNegArr)
  // 偏差arr
  let inMaxArr = inCycleDataArr.map((x) => getMax(x, inStandard))
  console.log(`-------${id}吸气相偏差结果集-------`, inMaxArr)

  // 正偏差arr
  let outPosArr = outCycleDataArr.map((x) => getPos(x, outStandard))
  console.log(`-------${id}呼气相正偏差结果集-------`, outPosArr)
  // 负偏差arr
  let outNegArr = outCycleDataArr.map((x) => getNeg(x, outStandard))
  console.log(`-------${id}呼气相负偏差结果集-------`, outNegArr)
  // 偏差arr
  let outMaxArr = outCycleDataArr.map((x) => getMax(x, outStandard))
  console.log(`-------${id}呼气相偏差结果集-------`, outMaxArr)

  let inPosAvg = calcAvg(inPosArr)
  let inPosSd = calcSd(inPosArr)
  let inNegAvg = calcAvg(inNegArr)
  let inNegSd = calcSd(inNegArr)
  let inMaxAvg = calcAvg(inMaxArr)
  let inMaxSd = calcSd(inMaxArr)

  let outPosAvg = calcAvg(outPosArr)
  let outPosSd = calcSd(outPosArr)
  let outNegAvg = calcAvg(outNegArr)
  let outNegSd = calcSd(outNegArr)
  let outMaxAvg = calcAvg(outMaxArr)
  let outMaxSd = calcSd(outMaxArr)

  let point = {
    id,
    inPos: inPosArr[pointIndex],
    inNeg: inNegArr[pointIndex],
    inMax: inMaxArr[pointIndex],
    outPos: outPosArr[pointIndex],
    outNeg: outNegArr[pointIndex],
    outMax: outMaxArr[pointIndex]
  }
  let result = {
    id,
    inPosAvg,
    inPosSd,
    inNegAvg,
    inNegSd,
    inMaxAvg,
    inMaxSd,
    outPosAvg,
    outPosSd,
    outNegAvg,
    outNegSd,
    outMaxAvg,
    outMaxSd
  }

  return {
    point,
    result,
    detail: {
      [`${id} 选中周期index`]: pointIndex,
      [`${id}吸气相正偏差结果集`]: inPosArr,
      [`${id}吸气相负偏差结果集`]: inNegArr,
      [`${id}吸气相偏差结果集`]: inMaxArr,
      [`${id}呼气相正偏差结果集`]: outPosArr,
      [`${id}呼气相负偏差结果集`]: outNegArr,
      [`${id}呼气相偏差结果集`]: outMaxArr
    }
  }
}

// 获取周期数据  data: [[x, y], ...]
export function getCycleDataArr(offset: number, data: any[], points: any[]) {
  const cycleDataArr = []
  let pointData: any // ponits对应周期的数据，用于后续单独显示值

  const startPointX = points[0][0]
  const endPointX = points[2][0]
  const cycleLength = endPointX - startPointX

  // 取data中，ponits后的数据（含ponits）
  let startIndex = startPointX - offset
  let endIndex = endPointX - offset

  while (endIndex < data.length) {
    const cycleData = data.slice(startIndex, endIndex)
    cycleDataArr.push(cycleData)

    if (cycleDataArr.length === 1) {
      pointData = cycleData
    }

    startIndex += cycleLength
    endIndex += cycleLength
  }

  // 取data中，ponits前的数据
  startIndex = startPointX - offset - cycleLength
  endIndex = endPointX - offset - cycleLength
  while (startIndex > 0) {
    const cycleData = data.slice(startIndex, endIndex)
    cycleDataArr.unshift(cycleData)

    startIndex -= cycleLength
    endIndex -= cycleLength
  }

  return { cycleDataArr, pointIndex: cycleDataArr.indexOf(pointData) }
}

export function getCycleValidData(data: any[], beginPercent: number, endPercent: number) {
  const startIndex = parseInt(((beginPercent / 100) * data.length) as any)
  const endIndex = parseInt((data.length - (endPercent / 100) * data.length) as any)
  return data.slice(startIndex, endIndex)
}

export function getPos(arr: any[], standard: number) {
  return toFixed(Math.max(...arr.map((data) => data[1])) - standard)
}

export function getNeg(arr: any[], standard: number) {
  return toFixed(Math.min(...arr.map((data) => data[1])) - standard)
}

export function getMax(arr: LineData[], standard: number) {
  if (Math.abs(getPos(arr, standard)) > Math.abs(getNeg(arr, standard))) {
    return getPos(arr, standard)
  } else {
    return getNeg(arr, standard)
  }
}

export function calcAvg(data: number[]) {
  return toFixed(data.reduce((sum, value) => sum + value, 0) / data.length)
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

  return toFixed(standardDeviation)
}

function toFixed(value: number, fixNum = 3) {
  return parseFloat(value.toFixed(fixNum))
}
