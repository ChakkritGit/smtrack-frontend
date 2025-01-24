import Chart from "react-apexcharts"
import { logtype } from "../../types/log.type"
import { useTheme } from "../../theme/ThemeProvider"

type chartType = {
  chartData: logtype[],
  devicesData: { tempMin: number | undefined, tempMax: number | undefined },
  tempHeight: number | string | undefined,
  tempWidth: number | string | undefined
}

const ApexchartFull = (chart: chartType) => {
  const { chartData, devicesData } = chart
  const { tempMax, tempMin } = devicesData
  const tempAvgValues = chartData.map((items) => items.tempAvg)
  const minTempAvg = Math.min(...tempAvgValues) - 2
  const maxTempAvg = Math.max(...tempAvgValues) + 2
  const { theme } = useTheme()

  const mappedData = chartData.map((items) => {
    const time = new Date(items.sendTime).getTime()
    return {
      time,
      tempAvg: items.tempAvg,
      humidityAvg: items.humidityAvg,
      door: items.door1 === '1' || items.door2 === '1' || items.door3 === '1' ? 1 : 0
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
      name: 'Humidity',
      data: mappedData.map((data) => ({
        x: data.time,
        y: data.humidityAvg
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
        easing: 'easeinout',
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
      curve: ["smooth", "smooth", "smooth", "smooth", "stepline"],
      width: [2.5, 2, .8, .8, 1.5]
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
      {
        show: true,
        opposite: false,
        axisTicks: {
          show: true
        },
        axisBorder: {
          show: false,
          color: "rgba(52, 152, 219, 1)"
        },
        min: 0,
        max: 100
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
    colors: ["rgba(255, 76, 60 , 1)", "rgba(52, 152, 219, .5)", "rgba(46, 204, 113, 1)", "rgba(46, 204, 113, 1)", "rgba(235, 152, 78, 1)"],
  }

  return (
    <Chart
      type="line"
      options={options}
      series={series}
      height={chart.tempHeight}
      width={chart.tempWidth}
    />
  )
}

export default ApexchartFull