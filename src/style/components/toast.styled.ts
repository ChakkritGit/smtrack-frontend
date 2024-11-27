import styled from "styled-components"

export const ToastContainer = styled.div`
display: flex;
align-items: center;
gap: 1rem;
border-radius: var(--border-radius-big);

&>div {
  display: flex;
  flex-direction: column;

  &>span:nth-child(1) {
    font-size: 1rem;
    font-weight: bold;
  }

  &>span:nth-child(2) {
    font-size: 1rem;
  }

  &>span:nth-child(3) {
    font-size: 1rem;
  }
}

&>button {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${props => props.theme.mode === 'dark' ? 'var(--main-seccond-color)' : 'var(--soft-grey)'};
  color: var(--grey-50);
  border: none;
  border-radius: var(--border-radius-big);
  padding: .4rem;
  cursor: pointer;

  &:hover {
    background-color: ${props => props.theme.mode === 'dark' ? 'var(--danger-color-hover)' : 'var(--danger-75)'};
    color: ${props => props.theme.mode === 'dark' ? 'var(--danger-75)' : 'var(--danger-100)'};
    transition: .3s;
  }
}
`
