import { RiArrowLeftSLine, RiArrowRightSLine } from "react-icons/ri"
import { usersType } from "../../types/user.type"
import { PaginitionButton, PaginitionContainer, PaginitionFlex, PaginitionFlexOne, PaginitionFlexTwo, PaginitionSelect } from "../../style/style"
import { firmwareType } from "../../types/component.type"

type pagniprop = {
  currentPage: number,
  cardsPerPage: number,
  changePage: (change: number) => void,
  displaySelectDevices: (event: React.ChangeEvent<HTMLSelectElement>) => void,
  displayedCards: usersType[] | firmwareType[]
  userdata: usersType[] | firmwareType[]
}

export default function Paginition(pagniprop: pagniprop) {
  const { cardsPerPage, changePage, currentPage, displaySelectDevices, displayedCards, userdata } = pagniprop
  return (
    <PaginitionContainer>
      {/* ปุ่มเลื่อนหน้า */}
      <PaginitionFlex>
        <PaginitionFlexOne>
          <span>{displayedCards ? displayedCards.length : ''}</span>
          <span>of</span>
          <span>{userdata ? userdata.length : ''}</span>
        </PaginitionFlexOne>
        <PaginitionFlexTwo>
          <PaginitionButton disabled={currentPage === 0} onClick={() => changePage(-1)}><RiArrowLeftSLine /></PaginitionButton>
          <PaginitionSelect defaultValue={cardsPerPage} onChange={displaySelectDevices}>
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </PaginitionSelect>
          <PaginitionButton onClick={() => changePage(1)}><RiArrowRightSLine /></PaginitionButton>
        </PaginitionFlexTwo>
      </PaginitionFlex>
    </PaginitionContainer>
  )
}
