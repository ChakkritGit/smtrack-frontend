import styled from "styled-components"

export const Thead = styled.thead<{ $props?: boolean }>`
  display: flex;
  width: 100%;
`

export const Tbody = styled.tbody<{ $props?: boolean }>`
  display: flex;
  flex-direction: column;
`

export const Tr = styled.tr<{ $cursor?: boolean, $dense?: boolean }>`
  display: flex;
  align-items: stretch;
  width: 100%;
  min-height: 40px;
  height: ${props => props.$dense ? '40px' : 'unset'};
  cursor: ${props => props.$cursor ? 'pointer' : 'unset'};

& > th, td {
  flex: 1 0 0px;
  justify-content: center;
}
`

export const Th = styled.th<{ $width?: number }>`
    font-size: 12px;
    font-weight: normal;
    position: relative;
    display: flex;
    align-items: center;
    box-sizing: border-box;
    line-height: normal;
    padding-left: 16px !important;
    padding-right: 16px !important;
    max-width: ${props => props.$width ? props.$width + '%' : 'auto'};
    min-width: ${props => props.$width ? props.$width + 'px' : 'auto'};

    & > div {
      display: inline-flex;
      align-items: center;
      justify-content: inherit;
      height: 100%;
      width: 100%;
      outline: none;
      user-select: none;
      overflow: hidden;

      & > span {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }
`

export const Td = styled.td<{ $width?: number }>`
    font-size: 13px;
    font-weight: normal;
    position: relative;
    display: flex;
    align-items: center;
    box-sizing: border-box;
    line-height: normal;
    padding-left: 16px !important;
    padding-right: 16px !important;
    word-break: break-word;
    max-width: ${props => props.$width ? props.$width + '%' : 'auto'};
    min-width: ${props => props.$width ? props.$width + 'px' : 'auto'};

    & > div {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
`

export const Table = styled.table<{ $table?: boolean }>`
  position: relative;
  width: 100%;
  display: table;
`