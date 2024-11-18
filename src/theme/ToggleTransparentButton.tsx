import { useDispatch, useSelector } from "react-redux";
import { RootState, storeDispatchType } from "../stores/store";
import { ToggleTransparentButtonWrapper } from "../style/style";
import { setTransparent } from "../stores/utilsStateSlice";
// import { useTranslation } from "react-i18next";

export function ToggleButtonTransparent() {
  // const { t } = useTranslation()
  const dispatch = useDispatch<storeDispatchType>()
  const { transparent } = useSelector((state: RootState) => state.utilsState)

  const toggleSwitch = () => {
    localStorage.setItem('transparent', String(!transparent))
    dispatch(setTransparent(!transparent))
  }

  return (
    <ToggleTransparentButtonWrapper onClick={(toggleSwitch)} $primary={transparent}>
      <div className="icon">
        {/* {transparent ? t('stateOn') : t('stateOff')} */}
      </div>
    </ToggleTransparentButtonWrapper>
  )
}