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
  gap: 1rem;

  &>svg {
    fill: var(--danger-color);
    z-index: 1;
  }

  &>span {
    font-size: 24px;
    z-index: 1;
  }

  &>div {
    width: 50px;
    height: 50px;
    background-color: rgba(231, 76, 60, .5);
    filter: blur(40px);
    -backdrop-filter: blur(40px);
    position: fixed;
    margin: 0 0 20px 0;
    z-index: 0;
  }
}
`

export const WaitExportImage = styled.div<{ $primary?: boolean }>`
position: absolute;
top: 0;
left: 0;
background-color: rgba(0, 0, 0, 0.2);
backdrop-filter: blur(5px);
-webkit-backdrop-filter: blur(5px);
color: var(--white);
width: 100%;
height: 100%;
z-index: 1002;

display: flex;
justify-content: center;
align-items: center;
`