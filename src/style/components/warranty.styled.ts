import styled, { css } from "styled-components"

export const AddWarrantyButton = styled.button<{ $primary?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: .5rem;
  border-radius: var(--border-radius-big);
  border: 2px solid transparent;
  background-color: var(--main-color);
  color: var(--white);
  font-weight: bold;
  padding: .5rem .8rem;

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

export const PrintButton = styled.button<{ $primary?: boolean }>`
  display: flex;
  align-items: center;
  gap: .5rem;
  width: 100%;
  height: 40px;
  border: unset;
  background-color: unset;
  color: ${props => props.theme.mode === 'dark' ? 'var(--white)' : 'var(--black)'};
`

export const WarrantySpan = styled.span<{ $expired?: boolean }>`
${props => props.$expired && css`
  padding: .3rem .5rem;
  border-radius: var(--border-radius-small);
  background-color: var(--danger-primary);
  color: var(--white);
`}
`