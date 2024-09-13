import { ChangeEvent, Dispatch, SetStateAction } from "react"
import { DataTableFilterContainer, SearchButton, SearchFlex, SearchInput } from "../../style/style"
import { RiCloseLine, RiSearch2Line } from "react-icons/ri"

type searchuser = {
  searchCards: (e: ChangeEvent<HTMLInputElement>) => void,
  searchQuery: string,
  setSearchQuery: Dispatch<SetStateAction<string>>,
  onState: string
}

export default function Searchuser(searchuser: searchuser) {
  return (
    <DataTableFilterContainer>
      <SearchFlex>
        <RiSearch2Line />
        <SearchInput type="text" name={searchuser.onState} onChange={searchuser.searchCards} value={searchuser.searchQuery} placeholder="Search" autoComplete='off' autoFocus={false} />
        {searchuser.searchQuery !== '' ?
          <SearchButton onClick={() => searchuser.setSearchQuery('')}>
            <RiCloseLine />
          </SearchButton>
          :
          <></>
        }
      </SearchFlex>
    </DataTableFilterContainer>
  )
}
