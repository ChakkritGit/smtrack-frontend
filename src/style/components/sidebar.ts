import styled, { css } from "styled-components"

export const AboutVersion = styled.span<{ $primary?: boolean, $click?: boolean }>`
text-align: ${props => props.$primary ? 'center' : 'right'};
font-size: 14px;
padding: ${props => props.$primary ? 'unset' : '0px 16px 0px 16px'};
color: var(--grey);
margin-top: .5rem;
cursor: ${props => props.$click && 'pointer'};

${props => props.$click && css`
  &:hover {
  text-decoration: underline;
}
`}
`