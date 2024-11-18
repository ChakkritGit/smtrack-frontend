import styled, { css } from "styled-components"

export const MuteEtemp = styled.button<{ $primary?: boolean | string, $disable?: boolean }>`
  position: relative;
  width: 60px;
  height: 35px;
  background-color: ${(propss) => (propss.$primary ? 'var(--main-color)' : '#ddd')};
  border: 1px solid ${(propss) => (propss.$primary ? 'var(--main-color)' : '#ccc')};
  border-radius: 20px;
  outline: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  padding: 0;
  overflow: hidden;

  .icon {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background-color: ${(propss) => (propss.$primary ? 'var(--white-grey-1)' : 'var(--white-grey-1)')};
    transition: transform 0.3s ease;
    transform: ${(propss) =>
    propss.$primary ? 'translateX(25.5px)' : 'translateX(2px)'};
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${(propss) => (propss.$primary ? 'var(--main-last-color)' : 'var(--main-last-color)')};
    transition: .3s;
  }

  &:hover {
  border-color: var(--main-color);
  transition: .3s;
}

${props => props.$disable && css`
  opacity: .5;
  cursor: unset;

  &:hover {
    border-color: #ccc;
  }
`}

${props => props.theme.mode === 'dark' && css`
  background-color: ${props.$primary ? 'var(--main-color)' : 'var(--main-seccond-color)'};
  border: 1px solid ${props.$primary ? 'var(--main-color)' : 'var(--border-dark-color)'};

  .icon {
    background-color: ${props.$primary ? 'var(--main-last-color)' : 'var(--toggle-dark-color)'};
    color: var(--white-grey-1);
  }

  &:hover {
    border-color: ${props.$primary ? 'var(--main-color)' : 'var(--border-dark-color)'};
  }
`}
`