import styled from "styled-components"

export const AdjustRealTimeFlex = styled.div<{ $primary?: boolean }>`
display: flex;
justify-content: space-evenly;
align-items: center;
padding: .5rem;
margin: 1rem 0;

& > div {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: .5rem;
}

& > div > div {
  display: flex;
  justify-content: center;
  align-items: center;
  width: max-content;
  height: 65px;
  max-width: 300px;
  max-height: 70px;
  border-radius: var(--border-radius-big);
  padding: .7rem 1rem;
  border: 2px solid ${props => props.$primary ? 'var(--danger-color)' : 'var(--main-color)'};
  overflow: hidden;

  & > span {
    font-weight: bold;
    font-size: 16px;
  }

  & > span > span {
    color: ${props => props.$primary ? 'var(--danger-color)' : 'var(--main-color)'};
    font-weight: bold;
    font-size: 28px;
  }
}

& > svg:nth-child(3) {
    display: none;
  }

@media (max-width: 430px) {
  flex-direction: column;
  gap: 1rem;

  & > svg:nth-child(2) {
    display: none;
  }
  & > svg:nth-child(3) {
    display: block;
  }
}
`

export const OpenSettingBuzzer = styled.button<{ $primary?: boolean }>`
display: flex;
align-items: center;
width: max-content;
height: 35px;
gap: .5rem;
padding: 1.5rem .5rem;
background-color: transparent;
border-radius: var(--border-radius-big);
border: 2px solid var(--main-color);

& > svg, span {
  color: var(--main-color);
  font-weight: bold;
}

&:hover {
  background-color: var(--main-color);
  transition: .3s;

  & > svg, span {
  color: var(--white-grey-1);
  transition: .3s;
  }
}

@media (max-width: 430px) {
  padding: 1.3rem;
  justify-content: center;
  width: 100%;
}
`

export const ModalMuteHead = styled.div<{ $primary?: boolean }>`
display: flex;
align-items: center;
gap: .3rem;
cursor: pointer;

&:hover {
  color: var(--grey);
  transition: .3s;

  & > button {
  & svg {
    color: var(--grey);
    transition: .3s;
  }
}
}


`

export const TagCurrentHos = styled.span`
  padding: 7px .8rem;
  background-color: var(--main-color-opacity2);
  border-radius: var(--border-radius-big);
`

export const NotiActionFlex = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;

  & > div {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
`

export const ScheduleFlec = styled.div<{ $primary?: boolean }>`
display: flex;
align-items: center;
gap: 1rem;

&>span {
  font-size: 14px;
  color: var(--grey-50);
}
`

export const ScheduleItem = styled.div`
display: grid;
grid-template-columns: repeat(3, 1fr);
gap: 1rem;
width: 100%;

&>div {
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: .5rem;
  width: 100%;
}

@media (max-width: 430px) {
  grid-template-columns: repeat(1, 1fr);
  gap: 1rem;
}
`

export const ScheduleItemFlex = styled.div`
display: grid;
grid-template-columns: repeat(2, 1fr);
align-content: center;

&>div {
  display: flex;
  gap: .5rem;

  @media (max-width: 430px) {
    flex-direction: column;
    gap: 1rem;
  }
}

@media (max-width: 430px) {
  grid-template-columns: repeat(1, 1fr);
  gap: 1rem;
}
`

export const MuteFlex = styled.div`
display: flex;
justify-content: space-around;

@media (max-width: 430px) {
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}
`