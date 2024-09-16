import { PDFViewer } from "@react-pdf/renderer"
import Fullchartpdf from "./fullchartpdf"
import { useLocation, useNavigate, Link as LinkRouter } from "react-router-dom"
import { Breadcrumbs, Typography } from "@mui/material"
import { RiArrowRightSLine, RiDashboardFill } from "react-icons/ri"
import { useTranslation } from "react-i18next"
import Link from '@mui/material/Link'
import { PdfViewerContainer, PreviewContainer } from "../../style/components/pdf"

function PreviewPDF() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { state } = useLocation()
  const { title, ward, image, hospital, devSn, devName, chartIMG, dateTime, hosImg, tempMin, tempMax } = state

  return (
    <PreviewContainer>
      <Breadcrumbs className="mt-3"
        separator={<RiArrowRightSLine fontSize={20} />}
      >
        <LinkRouter to={'/dashboard'}>
          <RiDashboardFill fontSize={20} />
        </LinkRouter>
        <Link
          className="Link-bread-cmui"
          onClick={() => navigate(`/dashboard/chart`, { state: { tempMin: tempMin, tempMax: tempMax } })}>
          <span>{t('pageChart')}</span>
        </Link>
        <Typography color="text.primary">{t('pagePDF')}</Typography>
      </Breadcrumbs>
      <PdfViewerContainer>
        <PDFViewer width={'100%'} height={'100%'} style={{ borderRadius: 'var(--border-radius-small)' }}>
          <Fullchartpdf
            title={title}
            image={image}
            chartIMG={chartIMG}
            devSn={devSn}
            devName={devName}
            hospital={hospital}
            ward={ward}
            dateTime={dateTime}
            hosImg={hosImg}
          />
        </PDFViewer>
      </PdfViewerContainer>
    </PreviewContainer>
  )
}

export default PreviewPDF