import styled from "styled-components"

export const PageLoadContainer = styled.div<{ $primary?: boolean }>`
display: flex;
justify-content: center;
align-items: center;
height: 100%;
width: 100%;

&>div>div>svg {
  font-size: 48px;
}
`

export const FailedtoLoad = styled.div<{ $primary?: boolean }>`
display: flex;
justify-content: center;
align-items: center;
height: calc(100dvh - 200px);

&>div {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: .5rem;

  &>svg {
    fill: red;
  }
}
`