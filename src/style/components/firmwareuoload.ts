import styled, { css } from "styled-components"

export const FirmwareContainer = styled.div<{ $primary?: boolean }>`
${props => props.theme.mode === 'dark' &&
    css`
    .hiTDLB-st>div>div>div>div,
    .hiTDLB-st>div>div>div {
      color: var(--white-grey-1);
      background-color: var(--main-seccond-color);
      border-bottom-color: var(--border-dark-color);
    }

    div>nav {
      background-color: var(--main-seccond-color);
      color: var(--white-grey-1);
      border-top-color: var(--border-dark-color);

      div>button {
        color: var(--white-grey-1) !important;
        fill: var(--white-grey-1) !important;
      }

      &>div>button:disabled {
    cursor: unset;
    color: rgba(255, 255, 255, .30) !important;
    fill: rgba(255, 255, 255, .30) !important;
  }
    }
`}
`

export const FirmwareHeader = styled.div<{ $primary?: boolean }>`
display: flex;
align-items: center;
justify-content: space-between;

&>div {
  display: flex;
  gap: .5rem;
  align-items: center;
}

& h3 {
  margin-bottom: unset;
}

@media (max-width: 430px) {
  flex-direction: column;
  align-items: start;
  gap: 1rem;

  &>div:nth-child(2) {
    width: 100%;
    justify-content: end;
    flex-wrap: wrap;
  }
}
`

export const FirewareContent = styled.div<{ $primary?: boolean }>`
display: grid;
grid-template-columns: repeat(4, 1fr);
justify-items: center;
gap: .5rem;
margin-top: .5rem;

@media (max-width: 1185px) {
  grid-template-columns: repeat(2, 1fr);
}

@media (max-width: 430px) {
  grid-template-columns: repeat(1, 1fr);
}
`

export const SelectDevicetoUpdateButton = styled.button<{ $primary?: boolean }>`
display: flex;
align-items: center;
justify-content: center;
gap: .5rem;
/* width: 100%; */
max-height: 45px;
border-radius: var(--border-radius-big);
border: 2px solid transparent;
background-color: var(--main-color);
color: var(--white);
font-weight: bold;
padding: .5rem .8rem;

${props => props.$primary &&
    css`
  width: 30px;
  height: 30px;
`}

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

& svg {
  stroke-width: 1px;
}
`

export const UploadButton = styled.button<{ $primary?: boolean }>`
display: flex;
align-items: center;
justify-content: center;
gap: .5rem;
/* width: 100%; */
max-height: 45px;
border-radius: var(--border-radius-big);
border: 2px solid transparent;
background-color: var(--main-color);
color: var(--white);
font-weight: bold;
padding: .5rem .8rem;

${props => props.$primary &&
    css`
  width: 30px;
  height: 30px;
`}

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

& svg {
  stroke-width: 1px;
}
`

export const DropContainer = styled.div<{ $primary?: File | undefined, $error?: boolean }>`
display: flex;
align-items: center;
justify-content: center;
height: 500px;
max-height: 500px;
border-radius: .5rem;
border: 3px dashed ${props => props.$primary ? 'var(--main-color)' : 'var(--grey)'};
background-color: ${props => props.$primary ? 'var(--main-color-opacity2)' : propsTheme => propsTheme.theme.mode === 'dark' ? 'var(--main-seccond-color)' : 'var(--soft-grey)'};
transition: .3s;

${props => props.$error && css`
  border: 3px dashed var(--danger-75);
  background-color: ${propsTheme => propsTheme.theme.mode === 'dark' ? 'var(--danger-25)' : 'var(--danger-50)'};
`}
`

export const RowChildren = styled.div`
  width: 100%;

  &>label {
    width: 100%;
    padding: 0;
  }
`

export const DropHereFile = styled.div`
display: flex;
flex-direction: column;
justify-content: center;
align-items: center;
gap: 2rem;

&>span {
  font-size: 24px;
}

&>div {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${propsTheme => propsTheme.theme.mode === 'dark' ? 'var(--main-last-color)' : 'var(--grey-25)'};
  width: 184px;
  height: 184px;
  padding: 1.5rem;
  border-radius: 50%;

  &>svg {
    color: var(--border-dark-color);
  }
}

@media (max-width: 430px) {
  &>span {
  font-size: 18px;
}
}
`

export const FileDroped = styled.div<{ $primary?: boolean, $error?: boolean }>`
display: flex;
flex-direction: column;
justify-content: center;
align-items: center;
gap: 2rem;

&>div:nth-child(1) {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${propsTheme => propsTheme.theme.mode === 'dark' ? 'var(--main-last-rgba-05)' : 'var(--main-last-rgba-03)'};
  width: 184px;
  height: 184px;
  padding: 1.5rem;
  border-radius: 50%;

  ${props => props.$error && css`
    background-color: ${propsTheme => propsTheme.theme.mode === 'dark' ? 'var(--danger-15)' : 'var(--danger-75)'};
    `}
}

&>div:nth-child(2) {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: .5rem;
}

${props => props.$primary && css`
  .CircularProgressbar .CircularProgressbar-text {
    fill: var(--main-color);
  }

  .CircularProgressbar .CircularProgressbar-trail {
    stroke: var(--main-color-opacity1);
  }

  .CircularProgressbar .CircularProgressbar-path {
    stroke: var(--main-color);;
  }

  &>svg {
  width: 200px;
  height: 200px;
}
`}

${props => props.$error && css`
.CircularProgressbar .CircularProgressbar-text {
    fill: var(--danger-100);
  }

  .CircularProgressbar .CircularProgressbar-trail {
    stroke: var(--danger-75);
  }

  .CircularProgressbar .CircularProgressbar-path {
    stroke: var(--danger-100);;
  }
`}

&>div>span:nth-child(1) {
  font-weight: bold;
}

&>div>span, svg {
  font-size: 18px;
  color: var(--main-color);

  ${props => props.$error && css`
    color: var(--danger-100);
    `}
}
`

export const FileList = styled.div<{ $primary?: number }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  background-color: ${propsTheme => propsTheme.theme.mode === 'dark' ? 'var(--main-last-color)' : 'var(--white-grey-1)'};
  box-shadow: 0 12px 28px ${props => props.theme.mode === 'dark' ? 'rgb(50 50 50 / 10%)' : 'rgb(190 190 190 / 25%)'};
  border-radius: .8rem;
  padding: .7rem 1.5rem;
  height: 110px;

  &>div:nth-child(1) {
    display: flex;
    align-items: center;
    gap: .7rem;

    &>div {
      display: flex;
      flex-direction: column;
      justify-content: center;
      gap: 5px;

      &>span {
        max-width: 220px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }

      &>div:nth-child(3) {
        display: flex;
        gap: .5rem;

      &>small {
        font-size: 12px;
      }
    }
    }

    &>img {
      max-width: 32px;
      max-height: 32px;
    }
  }

  &>div:nth-child(2) {
    display: flex;
    align-items: center;
    gap: .7rem;

      &>div:nth-child(1) {
        display: flex;
        align-items: center;
        gap: .5rem;

      &>button:nth-child(1) {
        width: 40px;
        height: 40px;
        background-color: transparent;
        border: unset;
        color: ${propsTheme => propsTheme.theme.mode === 'dark' ? 'var(--white-grey-1)' : 'var(--black)'};

        &:hover {
          color: var(--main-color);
          transition: .3s;
        }
      }
      &>button:nth-child(2) {
        width: 40px;
        height: 40px;
        background-color: transparent;
        border: unset;
        color: ${propsTheme => propsTheme.theme.mode === 'dark' ? 'var(--white-grey-1)' : 'var(--black)'};

        &:hover {
          color: var(--danger-color);
          transition: .3s;
        }
      }
    }
  }

  @media (max-width: 430px) {
    &>div:nth-child(2) {
      flex-direction: column;
      font-size: 12px;
      gap: 5px;

      &>div:nth-child(1) {
        align-items: center;
      }
    }
}
`

export const ProgressBar = styled.div<{ $primary?: string }>`
  height: 8px;
  width: ${props => props.$primary + '%'};
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  background-color: var(--main-color);
  transition: .3s;
`

export const SendOTAtoBoard = styled.div<{ $primary?: boolean }>`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: .5rem;

  &>select {
    width: 100%;
    height: 45px;
    max-height: 45px;
    overflow: hidden;
    border-radius: var(--border-radius-big);
  }

  @media (max-width: 430px) {
    grid-template-columns: repeat(1, 1fr);
}
`

export const FlashFirmwareContainer = styled.div<{ $primary?: boolean }>`
  margin-top: 1.5rem;
`

export const ConnectionFlex = styled.div<{ $primary?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: .5rem;
  width: 100%;

  &>div {
    display: flex;
    align-items: center;
    gap: .5rem;
  }

  @media (max-width: 430px) {
  flex-wrap: wrap;
}
`

export const ConnectButton = styled.button<{ $primary?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: .3rem;
  width: max-content;
  height: 45px;
  max-height: 45px;
  border-radius: var(--border-radius-big);
  border: 2px solid transparent;
  background-color: var(--main-color);
  color: var(--white);
  font-weight: bold;
  padding: .5rem 1rem;

  &:hover {
  background-color: var(--second-color);
  transition: .3s;
}
`

export const DisConnectButton = styled.button<{ $primary?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: .3rem;
  width: max-content;
  height: 45px;
  max-height: 45px;
  border-radius: var(--border-radius-big);
  border: 2px solid transparent;
  background-color: var(--danger-color);
  color: var(--white);
  font-weight: bold;
  padding: .5rem 1rem;

  &:hover {
  background-color: var(--danger-color-hover);
  transition: .3s;
}

${props => props.$primary && css`
  opacity: .5;
  transition: .3s;

  &:hover {
  background-color: unset;
  color: var(--danger-color);
}
`}
`

export const TraceButton = styled.button<{ $primary?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: .3rem;
  width: max-content;
  height: 45px;
  max-height: 45px;
  border-radius: var(--border-radius-big);
  border: 2px solid transparent;
  background-color: var(--main-color);
  color: var(--white);
  font-weight: bold;
  padding: .5rem 1rem;

  &:hover {
  background-color: var(--second-color);
  transition: .3s;
}
`

export const EraseButton = styled.button<{ $primary?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: .3rem;
  width: max-content;
  height: 45px;
  max-height: 45px;
  border-radius: var(--border-radius-big);
  border: 2px solid transparent;
  background-color: var(--danger-color);
  color: var(--white);
  font-weight: bold;
  padding: .5rem 1rem;

  &:hover {
  background-color: var(--danger-color-hover);
  transition: .3s;
}

${props => props.$primary && css`
  opacity: .5;
  transition: .3s;

  &:hover {
  background-color: unset;
  color: var(--danger-color);
}
`}
`

export const ProgramButton = styled.button<{ $primary?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: .3rem;
  width: max-content;
  height: 45px;
  max-height: 45px;
  border-radius: var(--border-radius-big);
  border: 2px solid transparent;
  background-color: var(--main-color);
  color: var(--white);
  font-weight: bold;
  padding: .5rem 1rem;

  &:hover {
  background-color: var(--second-color);
  transition: .3s;
}
`

export const TerminalDiv = styled.div`
@media (max-width: 430px) {
  &>div:nth-child(1)>div {
  width: 100dvh;
}

  max-width: 335px;
  overflow-x: scroll;
}
`

export const ConsoleFlex = styled.div`
  display: flex;
  align-items: center;
  gap: .5rem;
`

export const StartConsoleButton = styled.button<{ $primary?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: .3rem;
  width: max-content;
  height: 45px;
  max-height: 45px;
  border-radius: var(--border-radius-big);
  border: 2px solid transparent;
  background-color: var(--main-color);
  color: var(--white);
  font-weight: bold;
  padding: .5rem 1rem;

  &:hover {
  background-color: var(--second-color);
  transition: .3s;
}
`

export const StopConsoleButton = styled.button<{ $primary?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: .3rem;
  width: max-content;
  height: 45px;
  max-height: 45px;
  border-radius: var(--border-radius-big);
  border: 2px solid transparent;
  background-color: var(--danger-color);
  color: var(--white);
  font-weight: bold;
  padding: .5rem 1rem;

  &:hover {
  background-color: var(--danger-color-hover);
  transition: .3s;
}
`

export const ResetButton = styled.button<{ $primary?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: .3rem;
  width: max-content;
  height: 45px;
  max-height: 45px;
  border-radius: var(--border-radius-big);
  border: 2px solid transparent;
  background-color: var(--main-color);
  color: var(--white);
  font-weight: bold;
  padding: .5rem 1rem;

  &:hover {
  background-color: var(--second-color);
  transition: .3s;
}
`

export const SelectFWFlex = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  &>div:nth-child(2) {
    width: 30%
  }

  @media (max-width: 430px) {
    flex-direction: column;
    align-items: start;

    &>div:nth-child(2) {
    width: 100%
  }
}
`

export const CheckBoxInput = styled.input`
  display: grid;
  place-content: center;
  appearance: none;
  background-color: transparent;
  margin: 5px;
  font: inherit;
  color: currentColor;
  width: 24px;
  height: 24px;
  border: 1px solid ${props => props.theme.mode === 'dark' ? 'grey' : 'black'};
  border-radius: unset;

  &::before {
  content: "";
  width: 15px;
  height: 15px;
  transform: scale(0);
  transition: 120ms transform ease-in-out;
  box-shadow: inset 1em 1em var(--main-color);
  transform-origin: bottom left;
  clip-path: polygon(14% 44%, 0 65%, 50% 100%, 100% 16%, 80% 0%, 43% 62%);
}

&:checked::before {
  transform: scale(1);
}
`

export const CheckBoxFlex = styled.div`
  display: flex;
  align-items: center;
  gap: .5rem;
`

export const CheckBoxList = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);

  @media (max-width: 1185px) {
    grid-template-columns: repeat(3, 1fr);
}

  @media (max-width: 1000px) {
    grid-template-columns: repeat(2, 1fr);
}

  @media (max-width: 720px) {
    grid-template-columns: repeat(1, 1fr);
}
`