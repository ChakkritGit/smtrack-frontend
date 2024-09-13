import styled from "styled-components"

export const ReloadPromptContainer = styled.div`
  padding: 0;
  margin: 0;
  width: 0;
  height: 0;
  transition: .3s;
`

export const ReloadPromptToast = styled.div`
  display: flex;
  flex-direction: column;
  align-items: end;
  position: fixed;
  right: 0;
  top: 60px;
  margin: 16px;
  padding: 14px;
  border-radius: .8rem;
  z-index: 1;
  text-align: left;
  box-shadow: 0 0 10px rgba(0, 0, 0, .1);
  background-color: ${props => props.theme.mode === 'dark' ? 'var(--main-last-color)' : 'var(--white-grey-1)'};
  color: ${props => props.theme.mode === 'dark' ? 'var(--white-grey-1)' : 'var(--main-last-color)'};
  transition: .3s;
`

export const ReloadPromptMessage = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-bottom: 8px;
`

export const ReloadPromptButton = styled.div`
  display: flex;
  align-items: center;
  gap: .5rem;
`

export const ReloadPromptToastButton = styled.button`
  border: 1px solid var(--main-color);
  outline: none;
  margin-right: 5px;
  border-radius: var(--border-radius-big);
  background-color: var(--main-color);
  color: var(--white-grey-1);
  padding: 3px 10px;
  width: max-content;

  &:hover {
    background-color: var(--main-color-opacity1);
    transition: .3s;
  }
`

export const ClosePromptToastButton = styled.button`
  border: 1px solid #8885;
  outline: none;
  margin-right: 5px;
  border-radius: var(--border-radius-big);
  background-color: transparent;
  color: ${props => props.theme.mode === 'dark' ? 'var(--white-grey-1)' : 'var(--main-last-color)'};
  padding: 3px 10px;
  width: max-content;
`