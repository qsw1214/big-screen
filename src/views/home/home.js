/*
 * @Author: Mr.zhao
 * @Date: 2017-12-13 13:58:06
 * @Last Modified by: Mr.zhao
 * @Last Modified time: 2018-01-16 15:58:23
 */
const Page_init = {
  firstLoad: 0,
  odometerObj: {},
  chartWarning: {},
  chartWarningStat: 0,
  chartHarm: {},
  chartHarmStat: 0,
  chartUnqualified: {},
  chartUnqualifiedStat: 0,
  chartSampling: {},
  chartSamplingStat: 0,
  chartArea: {},
  chartAreaStat: 0,
  groupNum: 0,
  scollStatus: 0,
  scollStatus2: 0,
  resScrollTimer: 0,
  resScrollTimer2: 0,
  init: function () {
    let _this = this;
    //自适应
    datavBox.init ();
    //统计数据
    _this.getTotalNum ();
    //预警图表
    _this.getChartDataByWarning()
    //危害因子图表
    _this.getChartDataByHarm()
    //大宗食品不合格率统计
    _this.getChartDataByUnqualified()
    //抽检图表-年份
    _this.getChartDataBySampling()
    //抽检区域图表
    _this.getChartDataByArea()
    //全国预警数据
    _this.getMapDataByChina()
    //产品抽检结果
    _this.getProductList()
    //企业抽检结果
    _this.getCompanyList()
    //心跳包-数据实时更新
    _this.heartbeat()
  },
  getTotalNum: function () {
    let _this = this
    $.ajax({
      type: 'get',
      dataType: 'jsonp',
      url: "https://easy-mock.com/mock/5a5827717793b1482690ad90/dataV/totalNum?jsonp_param_name=callback",
      success: function (res) {
        //统计数量滚动
        !_this.firstLoad ? (_this.firstLoad = 1, _this.bindOdometer(res.data.total)) : _this.updateOdometer(res.data.total)
        //总体数据
        let str = '', str1 = '', str2 = '', str3 = ''
        res.data.list.length > 0 && $.each(res.data.list, function (i, o) {
          str = '<div class="item"><label>' + o.name + '</label><span>' + o.pass + '/' + o.num + '  ' + Math.ceil(parseInt(o.pass) / parseInt(o.num) * 100) + '%</span></div>'
          i > 1 ? str2 += str : str1 += str
        })
        $('#js_totalBoxL').html(str1)
        $('#js_totalBoxR').html(str2)
        //预警数据
        res.data.list2.length > 0 && $.each(res.data.list2, function (i, o) {
          str3 += '<div class="item"><label>' + o.name + '</label><span>' + o.num + '</div>'
        })
        $('#js_totalBoxC').html(str3)
      }
    })
  },
  bindOdometer: function (v) {
    let _this = this
    let el = document.querySelector('#js_odometerNum')
    od = new Odometer({
      el: el,
      value: v,
      format: '',
      theme: 'digital'
    })
  },
  updateOdometer: function (v) {
    od.update(v)
  },
  getChartDataByWarning: function () {
    let _this = this
    $.ajax({
      type: 'get',
      dataType: 'jsonp',
      url: "https://easy-mock.com/mock/5a5827717793b1482690ad90/dataV/chartWarning?jsonp_param_name=callback",
      success: function (res) {
        //总体数据
        let seriesArray = []
        res.data.list.length > 0 && $.each(res.data.list, function (i, o) {
          let obj = {
            name: o.name,
            type: "line",
            smooth: true,
            symbol: "circle",
            symbolSize: 5,
            showSymbol: false,
            lineStyle: {
              normal: {
                width: 1
              }
            },
            areaStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                  offset: 0,
                  color: o.color[0]
                }, {
                  offset: .8,
                  color: o.color[1]
                }], false),
                shadowColor: "rgba(0, 0, 0, 0.1)",
                shadowBlur: 10
              }
            },
            itemStyle: {
              normal: {
                color: o.color[2],
                borderColor: o.color[3],
                borderWidth: 12
              }
            },
            data: o.data
          }
          seriesArray.push(obj)
        })
        let optionByWarning = {
          title: {
            text: res.data.title,
            textStyle: {fontWeight: "normal", fontSize: 22, color: "#fff"},
            top: "3px",
            left: "6%"
          },
          tooltip: {
            trigger: "axis",
            axisPointer: {
              lineStyle: {color: "transparent"}
            }
          },
          legend: {
            icon: "diamond",
            itemWidth: 14,
            itemHeight: 5,
            itemGap: 13,
            data: res.data.legendData,
            top: "1.5%",
            right: "4%",
            textStyle: {
              fontSize: 12,
              color: "#F1F1F3"
            }
          },
          grid: {
            left: "3%",
            right: "4%",
            bottom: "2%",
            containLabel: true
          },
          xAxis: [{
            type: "category",
            boundaryGap: false,
            axisLine: {
              lineStyle: {
                color: "#abcbff"
              }
            },
            // axisLabel:{
            //     interval:0,//横轴信息全部显示
            //     rotate:-30,//-30度角倾斜显示
            // },
            data: res.data.xAxisData
          }],
          yAxis: [{
            type: "value",
            axisTick: {
              show: false
            },
            axisLine: {
              lineStyle: {
                color: "#abcbff"
              }
            },
            axisLabel: {
              margin: 10,
              interval: 1,
              textStyle: {
                fontSize: 14
              }
            },
            splitArea: {
              show: true,
              areaStyle: {
                color: 'transparent'
              }
            },
            splitLine: {
              lineStyle: {
                color: "transparent"
              }
            }
          }],
          series: seriesArray
        }
        if (!_this.chartWarningStat) {
          _this.chartWarningStat = 1
          if ($('#js_chartWarning').length > 0) {
            chartWarning = echarts.init(document.getElementById('js_chartWarning'), 'macarons')
            chartWarning.setOption(optionByWarning, true)
            charts.push(chartWarning)
          }
        } else {
          chartWarning.setOption(optionByWarning)
        }
      }
    })
  },
  getChartDataByHarm: function () {
    let _this = this
    $.ajax({
      type: 'get',
      dataType: 'jsonp',
      url: "https://easy-mock.com/mock/5a5827717793b1482690ad90/dataV/chartHarm?jsonp_param_name=callback",
      success: function (res) {
        //总体数据
        let data = []
        res.data.list.length > 0 && (data = res.data.list)
        let optionByHarm = {
          title: {
            text: res.data.title,
            textStyle: {
              fontWeight: "normal",
              fontSize: 16,
              color: "#24edef"
            },
            top: "10%",
            x: "center"
          },
          legend: {
            icon: "diamond",
            itemWidth: 14,
            itemHeight: 5,
            itemGap: 13,
            right: 0,
            top: "30%",
            orient: "vertical",
            textStyle: {
              color: "#fff"
            },
            data: res.data.legendData
          },
          tooltip: {
            formatter: "{b} ({c})"
          },
          grid: {
            left: "3%",
            right: "4%",
            bottom: 0,
            containLabel: true
          },
          series: [{
            type: "pie",
            radius: "50%",
            center: ["25%", "55%"],
            data: data,
            itemStyle: {
              normal: {
                label: {
                  show: true,
                  formatter: "{b} \n ({d}%)",
                  textStyle: {
                    color: "#B1B9D3"
                  }
                }
              }
            }
          }, {
            type: "funnel",
            left: "60%",
            bottom: "11%",
            minSize: "0%",
            maxSize: "100%",
            sort: "ascending",
            gap: 2,
            label: {
              normal: {
                show: true,
                position: "inside"
              },
              emphasis: {
                textStyle: {
                  fontSize: 20
                }
              }
            },
            itemStyle: {
              normal: {
                borderColor: "#fff",
                borderWidth: 0
              }
            },
            data: data
          }]
        }
        if (!_this.chartHarmStat) {
          _this.chartHarmStat = 1
          if ($('#js_chartHarm').length > 0) {
            chartHarm = echarts.init(document.getElementById('js_chartHarm'), 'macarons')
            chartHarm.setOption(optionByHarm, true)
            charts.push(chartHarm)
          }
        } else {
          chartHarm.setOption(optionByHarm)
        }
      }
    })
  },
  getChartDataByUnqualified: function () {
    let _this = this
    $.ajax({
      type: 'get',
      dataType: 'jsonp',
      url: "https://easy-mock.com/mock/5a5827717793b1482690ad90/dataV/chartUnqualified?jsonp_param_name=callback",
      success: function (res) {
        //总体数据
        let seriesArray = []
        res.data.list.length > 0 && (seriesArray = res.data.list)
        let optionByUnqualified = {
          title: {
            text: res.data.title,
            textStyle: {
              fontWeight: "normal",
              fontSize: 16,
              color: "#24edef"
            },
            top: "8%",
            x: "center"
          },
          tooltip: {
            trigger: "axis",
            axisPointer: {
              lineStyle: {
                color: "transparent"
              }
            }
          },
          grid: {
            left: "3%",
            right: "4%",
            bottom: "2%",
            containLabel: true
          },
          xAxis: {
            type: "category",
            boundaryGap: false,
            data: res.data.xAxisData
          },
          yAxis: {
            type: "value",
            splitArea: {
              show: true,
              areaStyle: {
                color: 'transparent'
              }
            },
            splitLine: {
              lineStyle: {
                color: "transparent"
              }
            }
          },
          series: seriesArray
        }

        if (!_this.chartUnqualifiedStat) {
          _this.chartUnqualifiedStat = 1
          if ($('#js_chartUnqualified').length > 0) {
            chartUnqualified = echarts.init(document.getElementById('js_chartUnqualified'), 'macarons')
            chartUnqualified.setOption(optionByUnqualified, true)
            charts.push(chartUnqualified)
          }
        } else {
          chartUnqualified.setOption(optionByUnqualified)
        }
      }
    })
  },
  getChartDataBySampling: function () {
    let _this = this
    $.ajax({
      type: 'get',
      dataType: 'jsonp',
      url: "https://easy-mock.com/mock/5a5827717793b1482690ad90/dataV/chartSampling?jsonp_param_name=callback",
      success: function (res) {
        //总体数据
        let seriesArray = []
        res.data.list.length > 0 && $.each(res.data.list, function (i, o) {
          var obj = {
            name: o.name,
            type: 'bar',
            barGap: 0,
            itemStyle: {
              normal: {
                color: o.color
              }
            },
            data: o.data
          }
          seriesArray.push(obj)
        })
        //抽检图表
        let optionBySampling = {
          title: {
            text: res.data.title,
            textStyle: {
              fontWeight: "normal",
              fontSize: 22,
              color: "#fff"
            },
            top: "3px",
            left: "6%"
          },
          tooltip: {
            trigger: "axis",
            axisPointer: {
              lineStyle: {
                color: "transparent"
              }
            }
          },
          legend: {
            data: res.data.legendData,
            top: "1.5%",
            right: "4%",
            textStyle: {
              fontSize: 14,
              color: "#F1F1F3"
            }
          },
          grid: {
            left: "3%",
            right: "4%",
            bottom: "2%",
            containLabel: true
          },
          calculable: true,
          xAxis: [{
            type: "category",
            data: res.data.xAxisData
          }],
          yAxis: [{
            type: "value",
            splitArea: {
              show: true,
              areaStyle: {
                color: 'transparent'
              }
            },
            splitLine: {
              lineStyle: {
                color: "#172f57"
              }
            }
          }],
          series: seriesArray
        }

        if (!_this.chartSamplingStat) {
          _this.chartSamplingStat = 1
          if ($('#js_chartSampling').length > 0) {
            chartSampling = echarts.init(document.getElementById('js_chartSampling'), 'macarons')
            chartSampling.setOption(optionBySampling, true)
            charts.push(chartSampling)
          }
        } else {
          chartSampling.setOption(optionBySampling)
        }
      }
    })
  },
  getChartDataByArea: function () {
    let _this = this
    $.ajax({
      type: 'get',
      dataType: 'jsonp',
      url: "https://easy-mock.com/mock/5a5827717793b1482690ad90/dataV/chartArea?jsonp_param_name=callback",
      success: function (res) {
        //总体数据
        let seriesArray = []
        res.data.list.length > 0 && $.each(res.data.list, function (i, o) {
          let obj = {
            name: o.name,
            type: 'bar',
            barGap: 0,
            itemStyle: {
              normal: {
                color: o.color
              }
            },
            data: o.data
          }
          seriesArray.push(obj)
        })
        //抽检图表
        let optionByArea = {
          title: {
            text: res.data.title,
            textStyle: {
              fontWeight: "normal",
              fontSize: 22,
              color: "#fff"
            },
            top: "3px",
            left: "6%"
          },
          tooltip: {
            trigger: "axis",
            axisPointer: {
              lineStyle: {
                color: "transparent"
              }
            }
          },
          legend: {
            data: res.data.legendData,
            top: "1.5%",
            right: "4%",
            textStyle: {
              fontSize: 14,
              color: "#F1F1F3"
            }
          },
          grid: {
            left: "3%",
            right: "4%",
            bottom: "2%",
            containLabel: true
          },
          calculable: true,
          xAxis: [{
            type: "category",
            data: res.data.xAxisData
          }],
          yAxis: [{
            type: "value",
            splitArea: {
              show: true,
              areaStyle: {
                color: 'transparent'
              }
            },
            splitLine: {
              lineStyle: {
                color: "#172f57"
              }
            }
          }],
          series: seriesArray
        }

        if (!_this.chartAreaStat) {
          _this.chartAreaStat = 1
          if ($('#js_chartArea').length > 0) {
            chartArea = echarts.init(document.getElementById('js_chartArea'), 'macarons')
            chartArea.setOption(optionByArea, true)
            charts.push(chartArea)
          }
        } else {
          chartArea.setOption(optionByArea)
        }
      }
    })
  },
  getMapDataByChina: function () {
    let _this = this
    $.ajax({
      type: 'get',
      dataType: 'jsonp',
      url: "https://easy-mock.com/mock/5a5827717793b1482690ad90/dataV/mapDataByChina?jsonp_param_name=callback",
      success: function (res) {
        // 每个地区的坐标
        let geoCoordMap = res.data.geoCoordMap || {}
        // 每个地区的设备数量值
        let data = res.data.mapData || []
        //百度地图SVG
        $.get("js/json/china.json", function (as) {
          // 引入china地区地图
          echarts.registerMap('china', as)
          let convertData = function (data) {
            let res = []
            for (let i = 0; i < data.length; i++) {
              let geoCoord = geoCoordMap[data[i].name]
              if (geoCoord) {
                res.push({
                  name: data[i].name,
                  value: geoCoord.concat(data[i].value)
                })
              }
            }
            return res
          }
          let series = []
          ['china', ...data].forEach(function (item, i) {
            series.push({
              name: '',
              type: 'effectScatter',
              coordinateSystem: 'geo',
              hoverAnimation: 'false',
              legendHoverLink: 'false',
              rippleEffect: {
                period: 8,
                brushType: 'stroke',
                scale: 3
              },
              data: convertData(item[1]),
              zlevel: 2
            })
          })

          option = {
            tooltip: {
              trigger: 'item',
              formatter: function (params) {
                return params.name + ' : ' + params.value[2]
              }
            },
            visualMap: {
              show: false,
              min: 0,
              max: 200,
              calculable: true,
              inRange: {
                color: ['#50a3ba', '#eac736', '#d94e5d']
              },
              textStyle: {
                color: '#fff'
              }
            },
            geo: {
              map: 'china',
              zoom: 1.25,
              label: {
                emphasis: {
                  show: false
                }
              },
              itemStyle: {
                normal: {
                  areaColor: '#323c48',
                  borderColor: '#111'
                },
                emphasis: {
                  areaColor: '#2a333d'
                }
              }
            },
            series: series
          }
          chartMap = echarts.init(document.getElementById('js_mapBox'))
          chartMap.setOption(option)

          //自动提示
          let timer = 0
          let total = option.series[0].data.length
          let count = 0

          function autoTip() {
            timer = setInterval(function () {
              var curr = count % total
              chartMap.dispatchAction({type: 'showTip', seriesIndex: 0, dataIndex: curr})
              count += 1
            }, 6000)
          }

          autoTip()
          chartMap.on('mousemove', function (param) {
            if (timer) {
              clearInterval(timer)
              timer = 0
            }
          })
          chartMap.on('mouseout', function (param) {
            if (param.event) {
              if (!timer) {
                autoTip()
              }
            }
          })
        })
      }
    })
  },
  getProductList: function () {
    let _this = this
    $.ajax({
      type: 'get',
      dataType: 'jsonp',
      url: "https://easy-mock.com/mock/5a5827717793b1482690ad90/dataV/productList?jsonp_param_name=callback",
      success: function (res) {
        let eleNum = $('#js_resList .item').length
        if (eleNum >= 100) {
          _this.groupNum = 0
          _this.scollStatus = 0
          clearInterval(resScrollTimer)
          $('#js_resList').html('')
        }
        let str = ''
        res.data.list.length > 0 && $.each(res.data.list, function (i, o) {
          if (i % 4 == 0) {
            _this.groupNum++
          }
          str += '<div class="item groupNum_' + _this.groupNum + '"><span>' + o.city + '</span><span>' + o.name + '</span><span>' + o.company + '</span>'
          str += (o.status == 0 ? '<span class="red_txt">不合格</span>' : '<span>合格</span>')
          str += '</div>'
        })
        $('#js_resList').append(str)
        if (!_this.scollStatus) {
          _this.scorllList()
          _this.scollStatus = 1
        }
      }
    })
  },
  scorllList: function () {
    let _this = this
    //列表滚动动画
    let total = 1, num = 1
    total = Math.ceil($('#js_resList .item').length / 4)
    resScrollTimer = setInterval(function () {
      num >= total ? num = 1 : num = num
      if (num == 1) {
        $('#js_resList').stop().css('top', 0)
      } else {
        $('#js_resList').animate({"top": "-" + num * 35 + "px"}, 2000, 'linear')
      }
      num += 1
    }, 2000)
  },
  getCompanyList: function () {
    let _this = this
    $.ajax({
      type: 'get',
      dataType: 'jsonp',
      url: "https://easy-mock.com/mock/5a5827717793b1482690ad90/dataV/companyList?jsonp_param_name=callback",
      success: function (res) {
        let eleNum = $('#js_areaList dd').length
        if (eleNum >= 100) {
          _this.scollStatus2 = 0
          clearInterval(resScrollTimer2)
          $('#js_areaList').html('')
        }
        let str = ''
        res.data.list.length > 0 && $.each(res.data.list, function (i, o) {
          str += '<dd><div class="l">'
          str += '<label class="name">' + o.company + '</label>'
          str += '<span class="ico_chart num">抽检总数 <b>' + o.total + '</b></span>'
          str += '</div><div class="r">'
          str += '<span class="ico_noPass">不合格数 <b>' + o.num + '</b></span>'
          str += '<span class="ico_pie">不合格率 <b>' + Math.ceil(parseInt(o.num) / parseInt(o.total) * 100) + '%</b></span>'
          str += '</div></dd>'
        })
        $('#js_areaList').append(str)
        if (!_this.scollStatus2) {
          _this.scorllList2()
          _this.scollStatus2 = 1
        }
      }
    })
  },
  scorllList2: function () {
    let _this = this
    //列表滚动动画
    let num = 0, total = $('#js_areaList dd').length
    resScrollTimer2 = setInterval(function () {
      (num >= total - 2) ? ($('#js_areaList dd').show(), num = 0) : num = num
      $('#js_areaList dd').eq(num).slideUp('300')
      num += 1
    }, 5000)
  },
  heartbeat: function () {
    let _this = this
    setInterval(function () {
      console.log('心跳包1...')
      _this.getTotalNum()
    }, 30e3)
    setInterval(function () {
      console.log('心跳包2...')
      _this.getChartDataByWarning()
      _this.getChartDataByHarm()
      _this.getChartDataByUnqualified()
    }, 12e3)
    setInterval(function () {
      console.log('心跳包3...')
      _this.getChartDataBySampling()
      _this.getChartDataByArea()
    }, 16e3)
    setInterval(function () {
      console.log('心跳包4...')
      _this.getProductList()
      _this.getCompanyList()
    }, 20e3)
  }
}
const chartMap = []
const charts = []
$(function () {
  Page_init.init()
})
