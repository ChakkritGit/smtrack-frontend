import { useTranslation } from "react-i18next"
import Loading from "../../components/loading/loading"
import {
  AttentionF, AttentionP, CDF1, CDF2, FSF1, HDF1,
  OriginalPaper, OtherDetails, PrintContainer, PrintContent,
  PrintHeadDescription, PrintHeadDescriptionOne,
  PrintHeadPage, PrintHeadTitle, RR1, SN1, SN2,
  SSR, SectionDetails, SectionSignature,
  SectionWStatus, TUD
} from "../../style/style"
import { repairType } from "../../types/repair.type"
import { RiLoader3Line } from "react-icons/ri"
import { RefObject } from "react"

type printtype = {
  data: repairType[],
  componentRef: RefObject<HTMLDivElement>
}

export default function PrintComponent(printtype: printtype) {
  const { t } = useTranslation()
  const { componentRef, data } = printtype

  return (
    <>
      {
        data.length > 0 ?
          data.map((items, index) => (
            <PrintContainer key={index} ref={componentRef}>
              <PrintContent>
                <PrintHeadPage>
                  <PrintHeadTitle>
                    <span>
                      ลำดับที่
                      <span>{items.repairNo}</span>
                    </span>
                    <span>ใบแจ้งซ่อม</span>
                    <span>
                      เลขที่
                      <span>{items.repairId}</span>
                    </span>
                  </PrintHeadTitle>
                  <PrintHeadDescription>
                    <PrintHeadDescriptionOne>
                      <span>บริษัท ธเนศพัฒนา จำกัด</span>
                      <span>61/34 ซ.อมรพันธ์ 4 (วิภาวดี 42) ถ.วิภาวดีรังสิต แขวงลาดยาว เขตจตุจักร กรุงเทพฯ 10900 โทร. 0-2791-4500</span>
                    </PrintHeadDescriptionOne>
                    <div>
                      <OriginalPaper>
                        ต้นฉบับ
                      </OriginalPaper>
                    </div>
                  </PrintHeadDescription>
                </PrintHeadPage>
                <SectionDetails>
                  <div>
                    <HDF1 $primary>
                      <span>ชื่อลูกค้า <TUD>{items.repairInfo}</TUD></span>
                      <span>ที่อยู่ <TUD $class="t-n-w-1">{items.repairLocation}</TUD></span>
                      <span>โทรศัพท์ <TUD>{items.telePhone}</TUD></span>
                      <span>สถานที่ติดตั้ง <TUD $class="preLine">วอร์ด {items.ward} {data[0]?.device.locInstall}</TUD></span>
                    </HDF1>
                    <HDF1>
                      <span>สินค้า <TUD>{data[0]?.device.devSerial.substring(0, 3) === "eTP" ? "eTEMP" : "iTEMP"}</TUD></span>
                      <span>Model <TUD>{data[0]?.device.devSerial.substring(0, 8)}</TUD></span>
                      <span>S/N <TUD>{data[0]?.device.devSerial}</TUD></span>
                    </HDF1>
                  </div>
                  <SectionWStatus>
                    <span>สถานะ</span>
                    <label>
                      <input
                        type="checkbox"
                        checked={items.warrantyStatus === "1"}
                        disabled
                      />
                      อยู่ในประกัน
                    </label>
                    <label>
                      <input
                        type="checkbox"
                        checked={items.warrantyStatus === "2"}
                        disabled
                      />
                      หมดประกัน
                    </label>
                    <label>
                      <input
                        type="checkbox"
                        checked={items.warrantyStatus === "3"}
                        disabled
                      />
                      ต่อ MA
                    </label>
                    <label>
                      <input
                        type="checkbox"
                        checked={items.warrantyStatus === "4"}
                        disabled
                      />
                      อื่น ๆ
                    </label>
                  </SectionWStatus>
                  <OtherDetails $primary={items.warrantyStatus === "4"}>
                    <TUD $class="t-u-d-t-warp">{items.comment}</TUD>
                  </OtherDetails>
                  <CDF1>
                    <span>สภาพเครื่อง {items.repairInfo1 !== '' ? (<TUD>{items.repairInfo1}</TUD>) : " ........................................................................................................................................................................"}</span>
                    <span>อุปกรณ์ที่นำมาด้วย {items.repairInfo2 !== '' ? (<TUD>{items.repairInfo2}</TUD>) : " .............................................................................................................................................................."}</span>
                    <span>รายละเอียด {items.repairDetails !== '' ? (<TUD>{items.repairDetails}</TUD>) : " ........................................................................................................................................................................"}</span>
                    {
                      items.repairDetails === '' && <>
                        <span>..........................................................................................................................................................................................</span>
                        <span>..........................................................................................................................................................................................</span>
                        <span>..........................................................................................................................................................................................</span>
                      </>
                    }
                  </CDF1>
                  <CDF2>
                    <FSF1 $t1="bd-1" $t2="s-f1">
                      <SN1>
                        <span>...........................................</span>
                        <SSR>( <div></div> )</SSR>
                        <span>ลายเซ็น/ตัวบรรจงของลูกค้า</span>
                      </SN1>
                      <SN2>
                        <span>........../ ........../ ..........</span>
                        <div>&nbsp;</div>
                        <span>(ว-ด-ป.)</span>
                      </SN2>
                    </FSF1>
                    <FSF1 $t2="s-f1">
                      <SN1>
                        <span>...........................................</span>
                        <SSR>( <div></div> )</SSR>
                        <span>ผู้ปฏิบัติงาน</span>
                      </SN1>
                      <SN2>
                        <span>........../ ........../ ..........</span>
                        <div>&nbsp;</div>
                        <span>(ว-ด-ป.)</span>
                      </SN2>
                    </FSF1>
                  </CDF2>
                  {/* <div className='c-d-f-3'>
                2
              </div> */}
                  <RR1>
                    <div>
                      <div>
                        <span>ผลการดำเนินการ</span>
                      </div>
                      <div>
                        <span>
                          <input type="checkbox" />
                          เรียบร้อย
                        </span>
                        <span>
                          <input type="checkbox" />
                          ส่งซ่อม / มีค่าใช้จ่าย
                        </span>
                        <span>
                          <input type="checkbox" />
                          ลูกค้ายกเลิกซ่อม
                        </span>
                        <span>
                          <input type="checkbox" />
                          ไม่เรียบร้อย
                        </span>
                        <span>
                          <input type="checkbox" />
                          ส่งซ่อม / เปลี่ยนในระยะประกัน
                        </span>
                      </div>
                    </div>
                    <div>
                      <span>
                        รายละเอียด ........................................................................................................................................................................
                      </span>
                      <span>
                        .........................................................................................................................................................................................
                      </span>
                    </div>
                  </RR1>
                </SectionDetails>
                <SectionSignature>
                  <FSF1 $t1="bd-1" $t2="s-f1">
                    <SN1>
                      <span>...........................................</span>
                      <SSR>( <div></div> )</SSR>
                      <span>ผู้คืนเครื่องซ่อม</span>
                    </SN1>
                    <SN2>
                      <span>........../ ........../ ..........</span>
                      <div>&nbsp;</div>
                      <span>(ว-ด-ป.)</span>
                    </SN2>
                  </FSF1>
                  <FSF1 $t2="s-f1">
                    <SN1>
                      <span>...........................................</span>
                      <SSR>( <div></div> )</SSR>
                      <span>ผู้รับเครื่องซ่อม</span>
                    </SN1>
                    <SN2>
                      <span>........../ ........../ ..........</span>
                      <div>&nbsp;</div>
                      <span>(ว-ด-ป.)</span>
                    </SN2>
                  </FSF1>
                </SectionSignature>
                <AttentionF>
                  <AttentionP>
                    <span>หมายเหตุ* </span>
                    <span>กรุณาพิมพ์สำเนาสองฉบับเพื่อนำส่งและเก็บไว้</span>
                  </AttentionP>
                  <div>
                    {
                      new Date().toString().replace(/GMT\+\d+\s+\(.+?\)/, '')
                    } Rev.01
                  </div>
                </AttentionF>
              </PrintContent>
            </PrintContainer>
          ))
          :
          <Loading loading={true} title={t('loading')} icn={<RiLoader3Line />} />
      }
    </>
  )
}