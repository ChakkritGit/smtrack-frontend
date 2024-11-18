import { useTranslation } from "react-i18next"
import { LiNoti, NotificationSoundButton, NotificationSoundFlex } from "../../style/components/notification"
import { useDispatch, useSelector } from "react-redux"
import { RootState, storeDispatchType } from "../../stores/store"
import { setPopUpMode, setSoundMode } from "../../stores/utilsStateSlice"
import { RiSpeakerLine } from "react-icons/ri"

export default function Noti() {
  const { t } = useTranslation()
  const dispatch = useDispatch<storeDispatchType>()
  const { soundMode, popUpMode } = useSelector((state: RootState) => state.utilsState)

  const switchOption = () => {
    dispatch(setSoundMode(!soundMode))
    localStorage.setItem('soundMode', String(!soundMode))
  }

  const turnOffPopup = () => {
    dispatch(setPopUpMode(!popUpMode))
    localStorage.setItem('popUpMode', String(!popUpMode))
  }

  return (
    <div>
      <h3>{t('titleNotification')}</h3>
      <NotificationSoundFlex>
        <span>{t('notificationPopup')}</span>
        <NotificationSoundButton onClick={turnOffPopup} $primary={!popUpMode}>
          <div className="icon">
            {/* {popUpMode ? t('stateOff') : t('stateOn')} */}
          </div>
        </NotificationSoundButton>
      </NotificationSoundFlex>
      <ul className="mt-3">
        <LiNoti>
          <NotificationSoundFlex $primary={popUpMode}>
            <span><RiSpeakerLine size={24} />{t('notificationSound')}</span>
            <NotificationSoundButton disabled={popUpMode} onClick={switchOption} $primary={!soundMode}>
              <div className="icon">
                {/* {soundMode ? t('stateOff') : t('stateOn')} */}
              </div>
            </NotificationSoundButton>
          </NotificationSoundFlex>
        </LiNoti>
      </ul>
    </div>
  )
}
