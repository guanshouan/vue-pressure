class LineChartDrawer {
  // [[1,11], [2,12], ...]
  draw(
    echarts: any,
    data: any,
    id: string,
    options: any = {
      title: 'Title'
    }
  ) {
    const el = document.getElementById(id)
    if (!el) {
      console.log('容器未初始化')
      return
    }
    const option = {
      tooltip: {
        trigger: 'axis',
        position: function (pt: any) {
          return [pt[0], '10%']
        },
        className: 'tooltip'
      },
      title: {
        left: 'center',
        text: options.title
      },
      toolbox: {
        feature: {
          dataZoom: {
            yAxisIndex: 'none'
          },
          restore: {},
          saveAsImage: {}
        }
      },
      xAxis: {
        type: 'value',
        boundaryGap: true
      },
      yAxis: {
        type: 'value',
        boundaryGap: [0, '100%']
      },
      dataZoom: [
        {
          type: 'inside',
          start: 0,
          end: 100
        },
        {
          start: 0,
          end: 20
        }
      ],
      series: [
        {
          name: '压力值',
          type: 'line',
          smooth: true,
          symbol: 'none',
          areaStyle: {},
          data
        }
      ]
    }
    const chart = echarts.init(el)
    chart.setOption(option)
  }
}

export default new LineChartDrawer()
