import { Document, Page, Text, View, Image } from '@react-pdf/renderer'
import { StylesPdf } from "./styles/styles"
import { pdftype } from '../../types/pdf.type'
import defaultImg from "../../assets/images/default-pic.png"

export default function Fullchartpdf(pdftype: pdftype) {
  const { chartIMG, dateTime, devName, devSn, hospital, title, ward, hosImg } = pdftype

  return (
    <Document
      pdfVersion='1.7ext3'
      title={title}
      author='Thanes Development Co., Ltd'
      subject='smtrack-Report'
      keywords='Chart, Datatable etc.'
      pageLayout='singlePage'
      language='th-TH'
    >
      <Page
        dpi={72}
        orientation='landscape'
        size={'A4'}
        style={StylesPdf.body}
        wrap
        >
        <Text style={StylesPdf.title}>
          Validation Certificate
        </Text>
        <View style={StylesPdf.Head}>
          <View style={StylesPdf.left}>
            <View style={StylesPdf.left_row}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                <Text style={StylesPdf.tag}>Device SN:&nbsp;</Text>
                <Text>{devSn}</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                <Text style={StylesPdf.tag}>Device Name:&nbsp;</Text>
                <Text>{devName}</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                <Text style={StylesPdf.tag}>Date:&nbsp;</Text>
                <Text>{dateTime}</Text>
              </View>
            </View>
          </View>
          <View style={StylesPdf.right}>
            <Image
              style={StylesPdf.img}
              src={hosImg ? `${import.meta.env.VITE_APP_IMG}${hosImg}` : defaultImg}
            />
            <Text>{hospital}</Text>
            <Text>{ward}</Text>
          </View>
        </View>
        <View style={StylesPdf.Body_img}>
          <Image src={chartIMG} style={StylesPdf.img_width}/>
        </View>
      </Page>
    </Document>
  )
}
