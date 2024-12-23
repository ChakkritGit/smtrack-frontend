import Chart from "react-apexcharts"
import { useSelector } from "react-redux"
import { useTheme } from "../../theme/ThemeProvider"
import { RootState } from "../../stores/store"
import { useMemo } from "react"
import { FilterLogType } from "../../types/tms.type"

type chartType = {
  chartData: FilterLogType[],
  tempHeight: number | string | undefined,
  tempWidth: number | string | undefined,
  isExport: boolean,
  showDataLabel: boolean
}

const TmsApexChart = (chart: chartType) => {
  const { expand } = useSelector((state: RootState) => state.utilsState)
  const { chartData, isExport, showDataLabel } = chart
  const tempAvgValues = chartData.map((items) => items._value)
  const minTempAvg = Math.min(...tempAvgValues) - 2
  const maxTempAvg = Math.max(...tempAvgValues) + 2
  const { theme } = useTheme()

  const mappedData = useMemo(() => {
    return chartData.map((items) => {
      const time = new Date(items._time).getTime()
      return {
        time,
        tempAvg: items._value,
      }
    })
  }, [chartData])

  const series: ApexAxisChartSeries = [
    {
      name: 'Temperature',
      data: mappedData.map((data) => ({
        x: data.time,
        y: data.tempAvg
      }))
    },
  ]

  const options: ApexCharts.ApexOptions = {
    chart: {
      height: isExport ? Math.min(window.innerHeight * 0.8, 600) : undefined,
      width: isExport ? Math.min(window.innerWidth * 0.8, 1185) : undefined,
      type: 'line',
      animations: {
        enabled: true,
        dynamicAnimation: {
          speed: 500
        }
      },
      stacked: false,
      zoom: {
        type: 'x',
        enabled: isExport ? false : true,
        autoScaleYaxis: isExport ? false : true
      },
      toolbar: {
        show: isExport ? false : true,
        autoSelected: 'zoom',
        tools: {
          download: false,
          selection: false
        }
      },
      locales: [{
        "name": "en",
        "options": {
          "months": ["มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"],
          "shortMonths": ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."],
          "days": ["อาทิตย์", "จันทร์", "อังคาร", "พุธ", "พฤหัสบดี", "ศุกร์", "เสาร์"],
          "shortDays": ["อา", "จ", "อ", "พ", "พฤ", "ศ", "ส"],
          "toolbar": {
            "exportToSVG": "Download SVG",
            "exportToPNG": "Download PNG",
            // "menu": "Menu",
            "selection": "เลือก",
            "selectionZoom": "ซูมเลือก",
            "zoomIn": "ซูมเข้า",
            "zoomOut": "ซูมออก",
            "pan": "การแพน",
            "reset": "ยกเลิกการซูม"
          } //make it component
        }
      }],
      defaultLocale: "en"
    },
    tooltip: {
      enabled: isExport ? false : true,
      theme: 'apexcharts-tooltip',
      x: {
        format: 'dd MMM yy HH:mm'
      },
      style: {
        fontSize: '14px'
      }
    },
    grid: {
      show: true,
      borderColor: theme.mode === 'dark' ? 'var(--grid-line-dark)' : 'var(--grid-line-light)',
      strokeDashArray: 5,
      xaxis: {
        lines: {
          show: true
        }
      },
      yaxis: {
        lines: {
          show: true
        }
      }
    },
    dataLabels: {
      enabled: showDataLabel
    },
    markers: {
      size: 0
    },
    stroke: {
      lineCap: 'round',
      curve: ["smooth"],
      width: [2.5]
    },
    xaxis: {
      type: "datetime"
    },
    yaxis: [
      {
        axisTicks: {
          show: true
        },
        axisBorder: {
          show: false,
          color: "rgba(255, 76, 60 , 1)"
        },
        min: minTempAvg,
        max: maxTempAvg
      },
    ],
    noData: {
      text: undefined,
      align: 'center',
      verticalAlign: 'middle',
      offsetX: 0,
      offsetY: 0,
      style: {
        color: undefined,
        fontSize: '14px',
        fontFamily: undefined
      }
    },
    colors: ["rgba(255, 76, 60 , 1)"],
    ...(isExport
      ? {}
      : {
        responsive: [
          {
            breakpoint: 1185,
            options: {
              chart: {
                height: 600,
                width: expand ? 1050 : 900,
              },
            },
          },
          {
            breakpoint: 430,
            options: {
              chart: {
                height: 330,
                width: 350,
              },
            },
          },
        ],
      }),
  }

  return (
    <>
      {showDataLabel ?
        <Chart
          key={'1'}
          // ref={chartRef}
          type="line"
          options={options}
          series={series}
          height={chart.tempHeight}
          width={chart.tempWidth}
        /> :
        <Chart
          key={'2'}
          // ref={chartRef}
          type="line"
          options={options}
          series={series}
          height={chart.tempHeight}
          width={chart.tempWidth}
        />
      }
    </>
  )
}

export default TmsApexChart