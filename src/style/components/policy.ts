import styled from "styled-components"

export const PrivacyContainer = styled.div<{$primary?: boolean}>`
  color: ${props => props.theme.mode === 'dark' ? 'var(--white)' : 'var(--black)'};
  padding: 1rem;
  max-width: 720px;
  margin: 1rem auto 3rem auto;
`

export const BR = styled.div `
margin: 1.7rem 0;
`

export const HeadTitle = styled.span`
  font-size: 1.125rem;
  font-weight: bold;
`