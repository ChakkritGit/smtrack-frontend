import { useSelector } from "react-redux"
import Chart from "react-apexcharts"
import { CompareType } from "../../types/log.type"
import { useTheme } from "../../theme/ThemeProvider"
import { RootState } from "../../stores/store"

type compareChart = {
  chartData: CompareType[],
  isExport: boolean
}

interface seriesType {
  name: string,
  data: {
    x: number,
    y: number
  }[]
}

const CompareChartComponent = ({ chartData, isExport }: compareChart) => {
  const { expand } = useSelector((state: RootState) => state.utilsState)
  const { theme } = useTheme()

  const seriesData = () => {
    let array: seriesType[] = []
    chartData.forEach((items) => {
      if (items.log.length > 0) {
        array.push({
          name: items.devSerial,
          data: items.log.map(logItem => ({
            x: new Date(logItem.sendTime).getTime(),
            y: logItem.tempAvg
          }))
        })
      }
    })
    return array
  }

  const tempLimit = () => {
    let array: number[] = []
    chartData.forEach((items) => {
      if (items.log.length > 0) {
        items.log.map((items) => array.push(items.tempAvg))
      }
    })
    return array
  }

  const series: ApexAxisChartSeries = seriesData()

  const options: ApexCharts.ApexOptions = {
    chart: {
      animations: {
        enabled: true,
        easing: 'easeinout',
        dynamicAnimation: {
          speed: 500
        }
      },
      stacked: false,
      zoom: {
        type: 'x',
        enabled: true,
        autoScaleYaxis: true
      },
      toolbar: {
        show: true,
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
      enabled: false
    },
    markers: {
      size: 0
    },
    stroke: {
      lineCap: 'round',
      curve: "smooth",
      width: 1.5
    },
    xaxis: {
      type: "datetime",
    },
    yaxis: {
      axisTicks: {
        show: true
      },
      axisBorder: {
        show: false,
      },
      min: Math.min(...(tempLimit())) - 2,
      max: Math.max(...(tempLimit())) + 2
    },
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
    responsive: isExport ? [] : [
      {
        breakpoint: 1185,
        options: {
          chart: {
            height: 600,
            width: expand ? 1050 : 900
          },
        },
      },
      {
        breakpoint: 430,
        options: {
          chart: {
            height: 350,
            width: 350
          },
        },
      },
    ],
  }

  return (
    <Chart
      type="line"
      options={options}
      series={series}
      height={680}
      width={1480}
    />
  )
}

export default CompareChartComponent