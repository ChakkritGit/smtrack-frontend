import { RefObject, useEffect } from "react"
import { WCD1, WCDC1, WCDC2 } from "../../style/style"
import Logo from '../../assets/images/Thanes.png'
import Logofooter from '../../assets/images/ts-logo.png'
import LogoTwo from '../../assets/images/Thanesscience_Logo.png'
import LogofooterTwo from '../../assets/images/Thanesscience.png'
// import QRCode from "react-qr-code"
import { warrantyType } from "../../types/warranty.type"
import { ImageComponent } from "../../constants/constants"

type warrantytype = {
  data: warrantyType[],
  componentRef: RefObject<HTMLDivElement>
}

export default function Printwarranty(warrantytype: warrantytype) {
  const { data } = warrantytype

  useEffect(() => {
    console.log(data)
  }, [data])

  return (
    <>
      {
        warrantytype.data.map((items) => {
          const formattedDate = new Date(String(items.installDate)).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
          })
          const formattedDate2 = new Date(items.expire).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
          })
          return (
            <WCD1 ref={warrantytype.componentRef} key={items.warrId}>
              <WCDC1>
                <div>
                  <div>
                    <ImageComponent src={items.saleDept === 'SCI 1' ? Logo : LogoTwo} alt="ts-logo" />
                    {/* <img src={items.saleDept === 'SCI 1' ? Logo : LogoTwo} alt="ts-logo" /> */}
                  </div>
                  <div>
                    <span>บัตรรับประกันผลิตภัณฑ์</span>
                    <span>Warranty Registration Card.</span>
                    <span>[สำหรับลูกค้า]</span>
                  </div>
                </div>
                <div>
                  <div></div>
                  <div>
                    <div>
                      <span>หมายเลขประกัน</span>
                      <span>Warranty No.</span>
                    </div>
                    <div>
                      {Math.floor(Math.random() * 100)}
                    </div>
                  </div>
                  <div>
                    <div>
                      <span>เลขที่ Invoice</span>
                      <span>Invoice No.</span>
                    </div>
                    <div>{items.invoice}</div>
                  </div>
                </div>
                <div>
                  <div>
                    <div>
                      <span>
                        <span>ประเภทสินค้า</span>
                        <span>Product</span>
                      </span>
                      <span>{items.productName}</span>
                    </div>
                    <div>
                      <span>
                        <span>รุ่น</span>
                        <span>Model</span>
                      </span>
                      <span>{items.productModel}</span>
                    </div>
                    <div>
                      <span>
                        <span>วันที่ติดตั้ง</span>
                        <span>Install Date</span>
                      </span>
                      <span>{formattedDate}</span>
                    </div>
                    <div>
                      <span>
                        <span>ชื่อลูกค้า</span>
                        <span>Customer's Name</span>
                      </span>
                      <span>{items.customerName}</span>
                    </div>
                  </div>
                  <div>
                    <div>
                      <span>
                        <span>ยี่ห้อ</span>
                        <span>Trademark</span>
                      </span>
                      <span>{'Siamatic'}</span>
                    </div>
                    <div>
                      <span>
                        <span>หมายเลขเครื่อง</span>
                        <span>Serial No.</span>
                      </span>
                      <span>{items.device.devSerial}</span>
                    </div>
                    <div>
                      <span>
                        <span>วันหมดประกัน</span>
                        <span>Expiry Date</span>
                      </span>
                      <span>{formattedDate2}</span>
                    </div>
                    <div>
                      <span>
                        <span>โทร</span>
                        <span>Tel.</span>
                      </span>
                      <span>{items.saleDept === 'SCI 1' ? '0-2791-4500' : '(662) 941-0202-3'}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <div>
                    <div>
                      <span>ที่อยู่</span>
                      <span>Address</span>
                    </div>
                    <div>
                      {items.customerAddress}
                    </div>
                  </div>
                  <div>
                    <span>หมายเหตุ</span>
                    <div>
                      กรุณากรอกรายละเอียดข้อความให้ชัดเจนและโปรดแสดงบัตรรับประกันผลิตภัณฑ์แก่บริษัท ฯ ทุกครั้งเมื่อนำผลิตภัณฑ์เข้ารับบริการ
                    </div>
                  </div>
                </div>
              </WCDC1>
              <WCDC2>
                <div>
                  <span>เงื่อนไขการรับประกันและบริการ</span>
                  <span>Conditions of Guarantee and Service</span>
                </div>
                <div>
                  <div>
                    <span>1)</span>
                    <span>ระยะเวลาประกันเริ่มต้นจากวันที่ติดตั้ง</span>
                  </div>
                  <div>
                    <span>2)</span>
                    <span>ในกรณีที่ชำรุด เกิดจากความผิดพลาดของมาตรฐานการผลิต หรือจากความบกพร่องของชิ้นส่วนบริษัทฯยินดีเปลี่ยนอะไหล่ให้ โดยไม่คิดมูลค่าใดๆ ทั้งสิ้น แต่ไม่รวมถึงการชำรุดที่เกิดจากอุบัติเหตุ อัคคีภัย</span>
                  </div>
                  <div>
                    <span>3)</span>
                    <span>บริษัทฯจะรับประกันเฉพาะผู้ที่ส่งบัตรลงทะเบียน พร้อมหมายเลขเครื่องคืนมายังบริษัทฯภายในเวลาไม่เกิน 30 วัน นับตั้งแต่วันที่ซื้อ เมื่อมีการเปลี่ยนอะไหล่ใดๆ ในเวลารับประกัน บริษัทฯ จะรับประกันให้เท่ากับเวลาที่เหลืออยู่ของอายุรับประกันเท่านั้น</span>
                  </div>
                  <div>
                    <span>4)</span>
                    <span>
                      บริษัทฯจะไม่รับสินค้าตามที่ระบุข้างต้นในกรณีที่:
                    </span>
                  </div>
                  <div>
                    <span>- ไม่มีบัตรรับประกันมาแสดง (โปรดเก็บรักษาให้ดีและแจ้งหมายเลขประกันทุกครั้ง)</span>
                    <span>- มีการเปลี่ยนมือจากผู้ซื้อคนเดิม</span>
                    <span>- มีการซ่อมหรือดัดแปลงโดยบุคคลอื่นที่ไม่ได้รับมอบหมายจากบริษัทฯ</span>
                  </div>
                  <div>
                    <span>5)</span>
                    <span>การรับประกันนี้ใช้เฉพาะในประเทศเท่านั้น</span>
                  </div>
                </div>
                <div>
                  <div>
                    <ImageComponent src={items.saleDept === 'SCI 1' ? Logofooter : LogofooterTwo} alt="ts-logo" />
                    {/* <img src={items.saleDept === 'SCI 1' ? Logofooter : LogofooterTwo} alt="ts-logo" /> */}
                  </div>
                  <div>
                    <span>61/34 ซ.อมรพันธ์ 4 (วิภาวดี 42) ถ.วิภาวดีรังสิต แขวงลาดยาว เขตจตุจักร กรุงเทพฯ 10900</span>
                    <span>61/34 Amornpan 4 (Vibhavadi 42), Vibhavadi Rangsit RD, Lat Yao, Chatuchak, Bangkok 10900</span>
                    <span>{items.saleDept === 'SCI 1' ? '0-2791-4500' : '(662) 941-0202-3'}</span>
                  </div>
                </div>
              </WCDC2>
              {/* <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'end', width: '100%' }}>
                <QRCode
                  size={48}
                  style={{ height: "auto", maxWidth: "100%", width: "8%" }}
                  value={items.device.devId}
                  viewBox={`0 0 48 48`}
                  level={'H'}
                />
              </div> */}
            </WCD1>
          )
        })
      }
    </>
  )
}
