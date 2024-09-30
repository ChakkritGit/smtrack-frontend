import { RiArrowLeftDoubleFill, RiArrowLeftSLine, RiArrowRightDoubleFill, RiArrowRightSLine } from "react-icons/ri"
import { usersType } from "../../types/user.type"
import {
  PaginitionButton,
  PaginitionContainer,
  PaginitionFlex,
  PaginitionFlexOne,
  PaginitionFlexTwo,
  PaginitionSelect,
} from "../../style/style"
import { firmwareType } from "../../types/component.type"
import { devicesType } from "../../types/device.type"

type pagniprop = {
  currentPage: number
  cardsPerPage: number
  changePage: (change: number) => void
  displaySelectDevices: (event: React.ChangeEvent<HTMLSelectElement>) => void
  displayedCards: usersType[] | firmwareType[] | devicesType[]
  userdata: usersType[] | firmwareType[] | devicesType[]
  pagPerpage?: { key: number; value: string }[]
  totalPages?: number
}

export default function Paginition(pagniprop: pagniprop) {
  const {
    cardsPerPage,
    changePage,
    currentPage,
    displaySelectDevices,
    displayedCards,
    userdata,
    pagPerpage,
    totalPages
  } = pagniprop

  return (
    <PaginitionContainer>
      <PaginitionFlex>
        <PaginitionFlexOne>
          <span>{displayedCards.length}</span>
          <span>of</span>
          <span>{userdata.length}</span>
        </PaginitionFlexOne>
        <PaginitionFlexTwo>
          <PaginitionButton
            disabled={currentPage === 0}
            onClick={() => changePage(-currentPage)} // ไปหน้าแรก
          >
            <RiArrowLeftDoubleFill />
          </PaginitionButton>
          <PaginitionButton
            disabled={currentPage === 0}
            onClick={() => changePage(-1)}
          >
            <RiArrowLeftSLine />
          </PaginitionButton>
          <PaginitionSelect
            defaultValue={cardsPerPage}
            onChange={displaySelectDevices}
          >
            {pagPerpage
              ? pagPerpage.map((items) => (
                <option value={items.key} key={items.key}>
                  {items.value}
                </option>
              ))
              : [10, 25, 50, 100].map((num) => (
                <option value={num} key={num}>
                  {num}
                </option>
              ))}
          </PaginitionSelect>
          <PaginitionButton
            disabled={currentPage + 1 >= totalPages!}
            onClick={() => changePage(1)}
          >
            <RiArrowRightSLine />
          </PaginitionButton>
          <PaginitionButton
            disabled={currentPage + 1 >= totalPages!}
            onClick={() => changePage(totalPages! - currentPage - 1)}
          >
            <RiArrowRightDoubleFill />
          </PaginitionButton>
          <span>
            Page {currentPage + 1} of {totalPages}
          </span>
        </PaginitionFlexTwo>
      </PaginitionFlex>
    </PaginitionContainer>
  )
}