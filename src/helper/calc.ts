function calcResult(
  name: string, // 单文件显示bpm10/bpm15/bpm20, 多文件显示文件名
  bpm: string,
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

  const startPointX = points[0][0]
  const midPointX = points[1][0]

  let inCycleDataArr = cycleDataArr.map((x) =>
    getCycleValidData(x.slice(0, midPointX - startPointX), inBeginPercent, inEndPercent)
  )
  let outCycleDataArr = cycleDataArr.map((x) =>
    getCycleValidData(x.slice(midPointX - startPointX), outBeginPercent, outEndPercent)
  )

  // 正偏差arr
  let inPosArr = inCycleDataArr.map((x) => getPos(x, inStandard))
  // 负偏差arr
  let inNegArr = inCycleDataArr.map((x) => getNeg(x, inStandard))
  // 偏差arr
  let inMaxArr = inCycleDataArr.map((x) => getMax(x, inStandard))

  // 正偏差arr
  let outPosArr = outCycleDataArr.map((x) => getPos(x, outStandard))
  // 负偏差arr
  let outNegArr = outCycleDataArr.map((x) => getNeg(x, outStandard))
  // 偏差arr
  let outMaxArr = outCycleDataArr.map((x) => getMax(x, outStandard))

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
    name,
    bpm,
    inPos: inPosArr[pointIndex],
    inNeg: inNegArr[pointIndex],
    inMax: inMaxArr[pointIndex],
    outPos: outPosArr[pointIndex],
    outNeg: outNegArr[pointIndex],
    outMax: outMaxArr[pointIndex]
  }
  let result = {
    name,
    bpm,
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
      [`${name}选中周期index`]: pointIndex,
      [`${name}吸气相正偏差结果集`]: inPosArr,
      [`${name}吸气相负偏差结果集`]: inNegArr,
      [`${name}吸气相偏差结果集`]: inMaxArr,
      [`${name}呼气相正偏差结果集`]: outPosArr,
      [`${name}呼气相负偏差结果集`]: outNegArr,
      [`${name}呼气相偏差结果集`]: outMaxArr
    }
  }
}

// 获取周期数据  data: [[x, y], ...]
function getCycleDataArr(offset: number, data: any[], points: any[]) {
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

function getCycleValidData(data: any[], beginPercent: number, endPercent: number) {
  const startIndex = parseInt(((beginPercent / 100) * data.length) as any)
  const endIndex = parseInt((data.length - (endPercent / 100) * data.length) as any)
  return data.slice(startIndex, endIndex)
}

function getPos(arr: any[], standard: number) {
  return toFixed(Math.max(...arr.map((data) => data[1])) - standard)
}

function getNeg(arr: any[], standard: number) {
  return toFixed(Math.min(...arr.map((data) => data[1])) - standard)
}

function getMax(arr: any[], standard: number) {
  if (Math.abs(Number(getPos(arr, standard))) > Math.abs(Number(getNeg(arr, standard)))) {
    return getPos(arr, standard)
  } else {
    return getNeg(arr, standard)
  }
}

function calcAvg(data: string[]) {
  return toFixed(data.reduce((sum, value) => sum + Number(value), 0) / data.length)
}

function calcSd(data: string[]) {
  // 计算平均值
  const mean = data.reduce((sum, value) => sum + Number(value), 0) / data.length

  // 计算每个数据点与平均值的差的平方
  const squaredDifferences = data.map((value) => Math.pow(Number(value) - mean, 2))

  // 计算平方差的平均值
  const meanSquaredDifference = squaredDifferences.reduce((sum, value) => sum + value, 0) / squaredDifferences.length

  // 计算标准差
  const standardDeviation = Math.sqrt(meanSquaredDifference)

  return toFixed(standardDeviation)
}

function toFixed(value: number, fixNum = 3) {
  return value.toFixed(fixNum)
}

export { calcResult }
