import { useTheme } from "../../theme/ThemeProvider"
import { TmsLogType } from "../../types/tms.type"
import Chart from "react-apexcharts"

type ChartData = {
  logs: TmsLogType[],
  devicesData: { tempMin: number | undefined, tempMax: number | undefined },
  tempHeight: number | string | undefined,
  tempWidth: number | string | undefined
}

const TmsApexFullChat = (chartData: ChartData) => {
  const { theme } = useTheme()
  const { logs, tempHeight, tempWidth, devicesData } = chartData
  const { tempMax, tempMin } = devicesData

  const tempAvgValues = logs.map((items) => items.tempValue)
  const minTempAvg = Math.min(...tempAvgValues) - 2
  const maxTempAvg = Math.max(...tempAvgValues) + 2

  const mappedData = logs.map((items) => {
    const time = new Date(`${items.createdAt}`).getTime()
    return {
      time,
      tempAvg: items.tempValue,
      door: items.door ? 1 : 0
    }
  })

  const series: ApexAxisChartSeries = [
    {
      name: 'Temperature',
      data: mappedData.map((data) => ({
        x: data.time,
        y: data.tempAvg
      }))
    },
    {
      name: 'Min',
      data: mappedData.map((data) => ({
        x: data.time,
        y: tempMin
      }))
    },
    {
      name: 'Max',
      data: mappedData.map((data) => ({
        x: data.time,
        y: tempMax
      }))
    },
    {
      name: 'Door',
      data: mappedData.map((data) => ({
        x: data.time,
        y: data.door
      }))
    }
  ]

  const options: ApexCharts.ApexOptions = {
    chart: {
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
        enabled: false,
        autoScaleYaxis: false
      },
      toolbar: {
        show: false,
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
      curve: ["smooth", "smooth", "smooth", "stepline"],
      width: [2.5, .8, .8, 1.5]
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
        }
      },
      {
        show: false,
        min: minTempAvg,
        max: maxTempAvg
      },
      {
        show: false,
        min: minTempAvg,
        max: maxTempAvg
      },
      {
        show: false,
        min: 5,
        max: 0
      }
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
    colors: ["rgba(255, 76, 60 , 1)", "rgba(46, 204, 113, 1)", "rgba(46, 204, 113, 1)", "rgba(235, 152, 78, 1)"],
  }

  return (
    <Chart
      type="line"
      options={options}
      series={series}
      height={tempHeight}
      width={tempWidth}
    />
  )
}

export default TmsApexFullChat