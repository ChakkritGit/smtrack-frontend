import styled, { css } from "styled-components"

export const LangContainer = styled.div<{ $primary?: boolean }>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: .3rem;
  padding: 5px 10px;
`

export const LangSwitchButton = styled.button<{ $lang?: boolean }>`
  background-color: unset;
  border: unset;
  padding: .5rem;
  border-radius: var(--border-radius-big);
  color: var(--black);
  ${(propss) => (propss.theme.mode === 'dark' && css`
    color: var(--white-grey-1);
  `)}

  ${props => props.$lang && css`
  background-color: var(--main-color);
  color: var(--white-grey-1);
  `}

  &:hover {
    background-color: var(--main-color);
    color: var(--white-grey-1);
    transition: .3s;
  }
`