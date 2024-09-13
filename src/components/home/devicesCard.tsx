import { ReactNode } from 'react'
import {
  CardSpan, DevCardContainer,
  DevCardFooter
} from '../../style/style'
import { useSelector } from 'react-redux'
import { DeviceStateStore, UtilsStateStore } from '../../types/redux.type'
import { FilterText } from '../../types/component.type'

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
  const { expand } = useSelector<DeviceStateStore, UtilsStateStore>((state) => state.utilsState)
  const { switchcase } = DevCard
  const acTive = () => {
    switchcase?.(DevCard.cardname, !DevCard.active)
  }

  return (
    <DevCardContainer
      onClick={acTive}
      $primary={DevCard.active}
      $eventcount={DevCard.count > 0}
      $responsivecard={expand}>
      <CardSpan>{DevCard.title}</CardSpan>
      <span>{DevCard.count}</span>
      <DevCardFooter>
        <span>{DevCard.times}</span>
        <div>{DevCard.svg}</div>
      </DevCardFooter>
    </DevCardContainer>
  )
}
