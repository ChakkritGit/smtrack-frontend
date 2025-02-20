import { useTranslation } from 'react-i18next'
import {
  AgreeSection,
  CardListFlex,
  ContactContainer,
  InputSupport,
  LabelContact,
  ListGrid,
  PhoneGroup,
  SubmitButton,
  TextAreContact
} from '../../style/components/contact.styled'
import { LoginContact } from '../../style/components/login'
import { LineHr } from '../../style/style'
import { Col, Form, Row } from 'react-bootstrap'
import { FormEvent, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { countryCodes, supportInitData } from '../../constants/constants'
import {
  RiArrowLeftSLine,
  RiFacebookCircleFill,
  RiMailFill,
  RiPhoneFill
} from 'react-icons/ri'
import { FaLine } from 'react-icons/fa'
import Swal from 'sweetalert2'
import axios from 'axios'
import { BackPre, NavigateTop } from '../../style/components/policy'
import { useSelector } from 'react-redux'
import { RootState } from '../../stores/store'

function Support () {
  const { t } = useTranslation()
  const navagate = useNavigate()
  const { cookieEncode } = useSelector((state: RootState) => state.utilsState)
  const [supportData, setSupportData] = useState(supportInitData)
  const {
    details,
    email,
    firstName,
    hospitalName,
    lastName,
    codePhone,
    phone,
    wardName
  } = supportData

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (
      details !== '' &&
      email !== '' &&
      firstName !== '' &&
      hospitalName !== '' &&
      lastName !== '' &&
      codePhone !== '' &&
      phone !== '' &&
      wardName !== ''
    ) {
      const combineText = `\n *** SUPPORT *** \n\n Name: ${firstName} ${lastName} \n Hospitals: ${hospitalName} \n Ward: ${wardName} \n Tel: ${codePhone}${phone} \n Email: ${email} \n Details: ${details} \n\n ----------------------- END -----------------------`

      const response = await axios.post(
        `${import.meta.env.VITE_APP_API}/utils/ticket`,
        { text: combineText }
      )
      Swal.fire({
        title: t('alertHeaderSuccess'),
        text: String(response.data.data),
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      })
      setSupportData(supportInitData)
    } else {
      Swal.fire({
        title: t('alertHeaderWarning'),
        text: t('completeField'),
        icon: 'warning',
        timer: 2000,
        showConfirmButton: false
      })
    }
  }

  return (
    <ContactContainer>
      <NavigateTop $primary={cookieEncode === undefined}>
        {cookieEncode ? (
          <BackPre onClick={() => navagate('/settings')}>
            <RiArrowLeftSLine size={24} />
            <span>{t('backToPre')}</span>
          </BackPre>
        ) : (
          <div></div>
        )}
        <h1>{t('contactSupport')}</h1>
        <div></div>
      </NavigateTop>
      <ListGrid>
        <div>
          <h3>{t('getInTouch')}</h3>
          <span>{t('contactDes')}</span>
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col lg={6}>
                <LabelContact htmlFor='first-name'>
                  <InputSupport
                    type='text'
                    id='first-name'
                    name='first-name'
                    placeholder={t('contactFirstName')}
                    value={firstName}
                    onChange={e =>
                      setSupportData({
                        ...supportData,
                        firstName: e.target.value
                      })
                    }
                  />
                </LabelContact>
              </Col>
              <Col lg={6}>
                <LabelContact htmlFor='last-name'>
                  <InputSupport
                    type='text'
                    id='last-name'
                    name='last-name'
                    placeholder={t('contactLastName')}
                    value={lastName}
                    onChange={e =>
                      setSupportData({
                        ...supportData,
                        lastName: e.target.value
                      })
                    }
                  />
                </LabelContact>
              </Col>
              <Col lg={12}>
                <LabelContact htmlFor='email'>
                  <InputSupport
                    type='email'
                    id='email'
                    name='email'
                    placeholder={t('contactEmail')}
                    value={email}
                    onChange={e =>
                      setSupportData({ ...supportData, email: e.target.value })
                    }
                  />
                </LabelContact>
              </Col>
              <Col lg={12}>
                <LabelContact htmlFor='tel'>
                  <PhoneGroup>
                    <select
                      name='countryCode'
                      id='countryCode'
                      value={codePhone}
                      onChange={e =>
                        setSupportData({
                          ...supportData,
                          codePhone: e.target.value
                        })
                      }
                    >
                      <option value=''>Select Country Code</option>
                      {countryCodes.map((item, index) => (
                        <option key={index} value={item.code}>
                          {item.country} ({item.code})
                        </option>
                      ))}
                    </select>
                    <InputSupport
                      type='tel'
                      id='email'
                      name='tel'
                      placeholder={t('contactPhone')}
                      value={phone}
                      onChange={e =>
                        setSupportData({
                          ...supportData,
                          phone: e.target.value
                        })
                      }
                    />
                  </PhoneGroup>
                </LabelContact>
              </Col>
              <Col lg={6}>
                <LabelContact htmlFor='first-name'>
                  <InputSupport
                    type='text'
                    id='first-name'
                    name='first-name'
                    placeholder={t('hosName')}
                    value={hospitalName}
                    onChange={e =>
                      setSupportData({
                        ...supportData,
                        hospitalName: e.target.value
                      })
                    }
                  />
                </LabelContact>
              </Col>
              <Col lg={6}>
                <LabelContact htmlFor='first-name'>
                  <InputSupport
                    type='text'
                    id='first-name'
                    name='first-name'
                    placeholder={t('wardName')}
                    value={wardName}
                    onChange={e =>
                      setSupportData({
                        ...supportData,
                        wardName: e.target.value
                      })
                    }
                  />
                </LabelContact>
              </Col>
              <Col lg={12}>
                <LabelContact htmlFor='howcanwehelp'>
                  <TextAreContact
                    id='howcanwehelp'
                    name='howcanwehelp'
                    placeholder={t('contactDetail')}
                    rows={4}
                    value={details}
                    onChange={e =>
                      setSupportData({
                        ...supportData,
                        details: e.target.value
                      })
                    }
                  />
                </LabelContact>
              </Col>
              <Col lg={12}>
                <SubmitButton type='submit'>{t('contactSubmit')}</SubmitButton>
              </Col>
              <AgreeSection>
                <span>
                  {t('contactAgree')}{' '}
                  <Link to={'/privacy-policy'}>{t('contactAgreeLink')}</Link>
                </span>
              </AgreeSection>
            </Row>
          </Form>
        </div>
      </ListGrid>
      <LoginContact $primary>
        <LineHr />
        <span className=''>{t('contactUs')}</span>
        <LineHr />
      </LoginContact>
      <CardListFlex>
        <a href='tel:027914500' target='_blank' rel='noopener noreferrer'>
          <RiPhoneFill />
          {/* <span>Phone</span> */}
        </a>
        <a
          href='mailto:thanes@thanesgroup.com'
          target='_blank'
          rel='noopener noreferrer'
        >
          <RiMailFill />
          {/* <span>Mail</span> */}
        </a>
        <a
          href='https://line.me/R/ti/p/%40925maysc'
          target='_blank'
          rel='noopener noreferrer'
        >
          <FaLine />
          {/* <span>Line</span> */}
        </a>
        <a
          href='https://www.facebook.com/thanesgroup'
          target='_blank'
          rel='noopener noreferrer'
        >
          <RiFacebookCircleFill />
          {/* <span>Facebook</span> */}
        </a>
      </CardListFlex>
    </ContactContainer>
  )
}

export default Support
