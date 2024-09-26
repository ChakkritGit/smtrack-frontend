import { ReactNode, useCallback } from 'react'
import {
  CardSpan, DevCardContainer,
  DevCardFooter
} from '../../style/style'
import { useDispatch, useSelector } from 'react-redux'
import { DeviceStateStore, UtilsStateStore } from '../../types/redux.type'
import { FilterText } from '../../types/component.type'
import { useTranslation } from 'react-i18next'
import { storeDispatchType } from '../../stores/store'
import { setOnFilter } from '../../stores/utilsStateSlice'

type DevCardProps = {
  title: string
  count: number
  times: string
  svg: ReactNode
  switchcase?: (filtertext: FilterText, cardactive: boolean) => void
  cardname: FilterText
  active: boolean
}

export default function DevicesCard(DevCard: DevCardProps) {
  const { t } = useTranslation()
  const dispatch = useDispatch<storeDispatchType>()
  const { expand } = useSelector<DeviceStateStore, UtilsStateStore>((state) => state.utilsState)
  const { switchcase } = DevCard

  const handleFilter = useCallback(() => {
    switchcase?.(DevCard.cardname, !DevCard.active)
    dispatch(setOnFilter(!DevCard.active))
  }, [switchcase, DevCard.cardname, DevCard.active])

  return (
    <DevCardContainer
      onClick={handleFilter}
      $primary={DevCard.active}
      $eventcount={DevCard.count > 0}
      $responsivecard={expand}>
      <CardSpan>{t(DevCard.title)}</CardSpan>
      <span>{DevCard.count}</span>
      <DevCardFooter>
        <span>{t(DevCard.times)}</span>
        <div>{DevCard.svg}</div>
      </DevCardFooter>
    </DevCardContainer>
  )
}
