import { Container } from "react-bootstrap"
import { CardUserBody, CardUserHead, PaginitionContainer } from "../../style/style"
import { useTranslation } from "react-i18next"
import { ChangeEvent, useEffect, useState } from "react"
import CardUser from "../../components/users/cardUser"
import { usersType } from "../../types/user.type"
import Adduser from "./adduser"
import Paginition from "../../components/filter/paginition"
import { useDispatch, useSelector } from "react-redux"
import { DeviceStateStore, UserState, UtilsStateStore } from "../../types/redux.type"
import { motion } from "framer-motion"
import { items } from "../../animation/animate"
import { setSearchQuery } from "../../stores/utilsStateSlice"
import { storeDispatchType } from "../../stores/store"

export default function Permission() {
  const { t } = useTranslation()
  const dispatch = useDispatch<storeDispatchType>()
  const { userDaata } = useSelector<DeviceStateStore, UserState>((state) => state.user)
  const [currentPage, setCurrentPage] = useState<number>(0)
  const [cardsPerPage, setCardsPerPage] = useState<number>(10)
  const [displayedCards, setDisplayedCards] = useState<usersType[]>(userDaata ? userDaata.slice(0, cardsPerPage) : [])
  const { searchQuery, expand, tokenDecode } = useSelector<DeviceStateStore, UtilsStateStore>((state) => state.utilsState)
  const { userId } = tokenDecode
  const totalPages = Math.ceil(userDaata.length / cardsPerPage)

  useEffect(() => {
    return () => {
      dispatch(setSearchQuery(''))
    }
  }, [])

  // ส่วนของการค้นหาและเลื่อนหน้าการ์ด
  useEffect(() => {
    setCurrentPage(0)
    setDisplayedCards(userDaata ? userDaata.slice(0, cardsPerPage) : [])
    showPage(0, searchQuery)
  }, [searchQuery, userDaata, cardsPerPage])

  useEffect(() => {
    showPage(currentPage, searchQuery)
  }, [currentPage, userDaata, cardsPerPage])

  const showPage = (pageNumber: number, query: string = '') => {
    const startIndex = pageNumber * cardsPerPage
    const endIndex = startIndex + cardsPerPage
    const filteredCards = userDaata ? (query ? userDaata.filter(card => [card.displayName, card.userName, card.userId].some(attr => attr.toLowerCase().includes(query.toLowerCase()))) : userDaata) : []
    const cardsToDisplay = filteredCards ? filteredCards.slice(startIndex, endIndex) : []
    setDisplayedCards(cardsToDisplay)
  }

  const changePage = (change: number) => {
    const newPage = currentPage + change
    if (newPage >= 0 && newPage < totalPages) {
      setCurrentPage(newPage)
    }
  }

  const displaySelectDevices = (event: ChangeEvent<HTMLSelectElement>) => {
    setCardsPerPage(Number(event.target.value))
  }
  // จบส่วนการ์ด

  return (
    <Container fluid>
      <motion.div
        variants={items}
        initial="hidden"
        animate="visible"
      >
        <CardUserHead>
          <h3>{t('sidePermission')}</h3>
          <Adduser pagestate={"add"} />
        </CardUserHead>
        <CardUserBody $primary={expand}>
          {
            displayedCards.filter((f) => f.userId !== userId).map((item, index) => (
              <CardUser
                key={item.userId}
                keyindex={index}
                userPic={item.userPic}
                displayName={item.displayName}
                userName={item.userName}
                userLevel={item.userLevel}
                userId={item.userId}
                hosId={item.ward.hosId}
                userStatus={item.userStatus}
                wardId={item.wardId}
              />
            ))
          }
        </CardUserBody>
        <PaginitionContainer>
          <div></div>
          <Paginition
            currentPage={currentPage}
            cardsPerPage={cardsPerPage}
            changePage={changePage}
            displaySelectDevices={displaySelectDevices}
            displayedCards={displayedCards}
            userdata={userDaata}
            totalPages={totalPages}
          />
        </PaginitionContainer>
      </motion.div>
    </Container >
  )
}
