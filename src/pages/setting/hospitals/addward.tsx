import { RiAddLine, RiEditLine } from "react-icons/ri"
import { ManageWardAdd } from "../../../style/style"
import { useTranslation } from "react-i18next"
import { addWardProp } from "../../../types/prop.type"

export default function Addward(addwardprop: addWardProp) {
  const { t } = useTranslation()
  const { pagestate, openmodal } = addwardprop

  return (
    <>
      {
        pagestate === 'add' ?
          <ManageWardAdd onClick={openmodal}>
            {t('addWard')}
            <RiAddLine />
          </ManageWardAdd>
          :
          <ManageWardAdd onClick={openmodal} $primary >
            <RiEditLine size={16} />
          </ManageWardAdd>
      }
    </>
  )
}
