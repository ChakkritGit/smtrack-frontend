import { Document, Page, Text, View, Image } from '@react-pdf/renderer'
import { StylesPdf } from "./styles/styles"
// import { useTranslation } from 'react-i18next'

type pdftype = {
  title?: string,
  image?: string,
  chartIMG?: string,
  dev_sn?: string,
  dev_name?: string,
  hospital?: string,
  ward?: string,
  datetime?: string,
  hosImg?: string
}

export default function Fullchartpdf(pdftype: pdftype) {
  const { chartIMG, datetime, dev_name, dev_sn, hospital, title, ward, hosImg } = pdftype
  console.log('re rendering...')

  return (
    <Document
      pdfVersion='1.7ext3'
      title={title}
      author='Thanes Development Co., Ltd'
      subject='eTEMP-Report'
      keywords='Chart, Datatable etc.'
    >
      <Page
        dpi={72}
        orientation='landscape'
        size={'A4'}
        style={StylesPdf.body}
        wrap>
        <Text style={StylesPdf.title}>
          Validation Certificate
        </Text>
        <View style={StylesPdf.Head}>
          <View style={StylesPdf.left}>
            <View style={StylesPdf.left_row}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                <Text style={StylesPdf.tag}>Device SN:&nbsp;</Text>
                <Text>{dev_sn}</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                <Text style={StylesPdf.tag}>Device Name:&nbsp;</Text>
                <Text>{dev_name}</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                <Text style={StylesPdf.tag}>Date:&nbsp;</Text>
                <Text>{datetime}</Text>
              </View>
            </View>
          </View>
          <View style={StylesPdf.right}>
            <Image
              style={StylesPdf.img}
              src={`${import.meta.env.VITE_APP_IMG}${hosImg}`}
            />
            <Text>{hospital}</Text>
            <Text>{ward}</Text>
          </View>
        </View>
        <View style={StylesPdf.Body_img}>
          <Image src={chartIMG} style={StylesPdf.img_width} />
        </View>
      </Page>
    </Document>
  )
}
