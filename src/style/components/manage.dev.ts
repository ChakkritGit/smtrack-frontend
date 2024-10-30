import styled, { css } from "styled-components"

export const OpenModalButton = styled.button`
display: flex;
align-items: center;
justify-content: center;
gap: .5rem;
border-radius: var(--border-radius-big);
border: 2px solid transparent;
background-color: var(--theme-menu-color);
color: var(--white);
font-weight: bold;
padding: .5rem;

&:hover {
  background-color: var(--theme-menu-color-hover);
  transition: .3s;
}

& svg {
  stroke-width: 1px;
}
`

export const BeforeSeq = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  margin-top: 1rem;

  &>div {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  &>div:nth-child(2) {
    max-width: 180px;
    width: max-content;
    height: max-content;
    padding: 1rem;
    border-radius: var(--border-radius-small);
    border: 2px solid var(--main-color);

    &>span:nth-child(1) {
      font-size: 32px;
      font-weight: bold;
      color: var(--main-color);
    }
  }
`

export const MainTabManageContainer = styled.div`
  display: flex;
  align-items: center;
  gap: .5rem;
  border-bottom: 2.5px solid var(--main-color);
  margin: 1rem 0;
`

export const MainTab = styled.button<{ $primary?: boolean }>`
  width: max-content;
  height: 40px;
  padding: 0 .5rem;
  border-top-left-radius: var(--border-radius-small);
  border-top-right-radius: var(--border-radius-small);
  border: 1.5px solid ${props => props.$primary ? 'var(--main-color)' : 'var(--grey)'};
  border-bottom: unset;
  background-color: ${props => props.$primary ? 'var(--main-color)' : 'transparent'};
  color: ${props => props.$primary ? 'var(--white-grey-1)' : props.theme.mode === 'dark' ? 'white' : 'black'};
  max-width: 200px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`

export const AdjustTime = styled.button<{ $primary?: boolean }>`
display: flex;
align-items: center;
justify-content: center;
gap: .5rem;
width: 45;
height: 45;
max-width: 45px;
max-height: 45px;
border-radius: var(--border-radius-big);
border: 2px solid transparent;
background-color: var(--main-color);
color: var(--white);
font-weight: bold;
padding: .5rem;

${props => props.$primary && css`
padding: unset;
width: 36px;
height: 36px;
`}

&:hover {
  background-color: var(--second-color);
  transition: .3s;
}

& svg {
  stroke-width: 1px;
}
`

export const TabContainer = styled.div`
  display: flex;
  gap: .5rem;
  padding: 1rem;
`

export const TabButton = styled.button<{ $primary?: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  width: max-content;
  max-width: 150px;
  max-height: 35px;
  border-radius: var(--border-radius-big);
  border: 2px solid ${props => props.theme.mode === 'dark' ? 'var(--white)' : 'var(--grey-75)'};
  background-color: transparent;
  color: ${props => props.theme.mode === 'dark' ? 'var(--white)' : 'var(--grey-75)'};
  font-weight: bold;
  padding: 0.5rem .8rem;

  &:hover {
    background-color: var(--main-color);
    border: 2px solid var(--main-color);
    color: var(--white);
    transition: .3s;
  }

${props => props.$primary && css`
  color: var(--white);
  background-color: var(--main-color);
  border: 2px solid var(--main-color);
`}
`

export const DowmloadFlex = styled.div<{ $isExpand?: boolean }>`
  display: flex;
  align-items: start;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: .5rem;

  &>div:nth-child(1)>div:nth-child(1) {
    display: flex;
    align-items: start;
    gap: 1rem;
    margin-top: 1rem;

    &>img {
      max-width: 64px;
      max-height: 64px;
      object-fit: cover;
      border-radius: var(--border-radius-small);
    }

    &>div {
      display: flex;
      flex-direction: column;
      justify-content: start;
      gap: .3rem;

      &>span:nth-child(1) {
        font-size: 24px;
        font-weight: bold;
      }

      &>span:nth-child(2) {
        color: var(--grey);
        max-width: 500px;
        display: -webkit-box;
        -webkit-line-clamp: ${props => props.$isExpand ? 'unset' : '1'};
        -webkit-box-orient: vertical;
        overflow: ${props => props.$isExpand ? 'isExpand' : 'hidden'};
        text-overflow: ellipsis;
      }

      &>a {
        cursor: pointer;
      }
    }
  }

  &>a {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: .5rem;
    text-decoration: unset;
    max-height: 35px;
    border-radius: var(--border-radius-big);
    border: 2px solid transparent;
    background-color: var(--main-color);
    color: var(--white);
    font-weight: bold;
    padding: .5rem .8rem;

&:disabled {
  cursor: not-allowed;
  opacity: .5;

  &:hover {
    background-color: var(--main-color);
    color: var(--white);
  }
}

&:hover {
  background-color: var(--second-color);
  transition: .3s;
}
}

@media (max-width: 430px) {
  justify-content: end;
  gap: .8rem;
}
`