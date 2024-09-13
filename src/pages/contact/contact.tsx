import { Container } from "react-bootstrap"
import { ContactContainer, ContactFlexOne, ContactIfram, ContactInfo } from "../../style/style"
import { useTranslation } from "react-i18next"
import { motion } from "framer-motion"
import { items } from "../../animation/animate"
import { RiMailFill, RiPhoneFill } from "react-icons/ri"
import LineIcon from "../../assets/images/line.png"
import FacebookIcon from "../../assets/images/facebook.png"

export default function Contact() {
  const { t } = useTranslation()
  return (
    <Container fluid>
      <motion.div
        variants={items}
        initial="hidden"
        animate="visible"
      >
        <ContactContainer>
          <ContactFlexOne>
            <ContactInfo>
              <div>
                <h2>{t('contactUs')}</h2>
                <p>
                  {t('contactInfo1')}
                  <br />
                  <RiPhoneFill size={18} /> <a href="tel:027914500">02-791-4500</a>
                  <br />
                  <RiMailFill size={18} /> <a href="mailto:thanes@thanesgroup.com">thanes@thanesgroup.com</a>
                </p>
                <p>
                  Monday - Friday (Except Public Holidays)
                  <br />
                  08:00 AM - 05:00 PM
                </p>
              </div>
              <div>
                <label htmlFor="span">
                  <b>{t('follow')}</b>
                  <div className="mt-2">
                    <a href="https://line.me/R/ti/p/%40925maysc">
                      <img src={LineIcon} width={32} alt="LineIcon" />
                    </a>
                    <a href="https://www.facebook.com/thanesgroup">
                      <img src={FacebookIcon} width={32} alt="FacebookIcon" />
                    </a>
                  </div>
                </label>
              </div>
            </ContactInfo>
          </ContactFlexOne>
          <ContactIfram>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d332.66763275400626!2d100.55980290588818!3d13.8396650665891!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x311d619326444ae7%3A0xc8359064cd610a0f!2z4Lia4LiI4LiBLiDguJjguYDguJnguKjguJ7guLHguJLguJnguLI!5e0!3m2!1sen!2sth!4v1707904558458!5m2!1sen!2sth"
              style={{ border: 0 }}>
            </iframe>
          </ContactIfram>
        </ContactContainer>
      </motion.div>
    </Container>
  )
}
