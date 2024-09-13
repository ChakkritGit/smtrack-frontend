import { MyComponentFilters } from "../../types/component.type"
import { DataTableFilterContainer, SearchButton, SearchFlex, SearchInput } from "../../style/style"
import { RiCloseLine, RiSearch2Line } from "react-icons/ri"

export const FilterComponent: React.FC<MyComponentFilters> = ({ filterText, onFilter, onClear, onState }) => (
  <DataTableFilterContainer>
    <SearchFlex>
      <RiSearch2Line />
      <SearchInput type="text" name={onState} value={filterText} onChange={onFilter} placeholder='Search' autoComplete='off' />
      {filterText ?
        <SearchButton onClick={onClear}>
          <RiCloseLine />
        </SearchButton>
        :
        <></>
      }
    </SearchFlex>
  </DataTableFilterContainer>
)