import styled, { css } from "styled-components"

export const ErrorPageStyled = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 25px;
  height: calc(100dvh - 80px);

  ${props => props.theme.mode === 'dark' && css`
  color: var(--white);
    `}

  & p>i {
    cursor: pointer;
    color: grey;
  }

  & p>i:hover {
    text-decoration: underline;
    text-underline-offset: 5px;
  }
`