import styled, { css } from "styled-components"

export const HeaderText = styled.span`
font-size: 52px;
font-weight: bold;
color: var(--main-color);

@media (max-width: 430px) {
  font-size: 32px;
}
`

export const LangContainer = styled.div`
  display: flex;
  justify-content: right;
  width: 100%;
`

export const CardContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 1rem;

  &>div:nth-child(1) {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 1rem;
  }
`

export const CardFlex = styled.div`
background-color: ${props => props.theme.mode === 'dark' ? 'var(--main-last-color)' : 'var(--white-grey-1)'};
color: ${props => props.theme.mode === 'dark' ? 'var(--white-grey-1)' : 'var(--main-last-color)'};
box-shadow: 0 12px 28px ${props => props.theme.mode === 'dark' ? 'rgb(50 50 50 / 10%)' : 'rgb(190 190 190 / 25%)'};
border-radius: var(--border-radius-big);
padding: 2rem;
width: 570px;

&>div:nth-child(1) {
  display: flex;
  flex-direction: column;

  &>span:nth-child(3) {
    color: var(--grey-50);

    @media (max-width: 430px) {
  font-size: 14px;
}
  }
}

@media (max-width: 430px) {
  width: 345px;
  padding: 1rem;
}
`

export const TimeStap = styled.div`
color: ${props => props.theme.mode === 'dark' ? 'var(--white-grey-1)' : 'black'};
text-align: right;
width: 450px;

@media (max-width: 430px) {
  width: 345px;
}
`

export const LoginButton = styled.button<{ $primary?: boolean }>`
  width: 100%;
  height: 40px;
  color: var(--white-grey-1);
  border: unset;
  background-color: var(--main-color);
  border-radius: var(--border-radius-big);

  &:disabled {
    background-color: ${props => props.$primary && 'var(--main-last-color)'};
  }

  &:hover {
    background-color: var(--login-btn-hover);
    transition: .3s;
  }
`

export const LoadingButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: .5rem;

  & svg {
    width: 20px;
    height: 20px;
    /* Safari */
    -webkit-animation: spin 1.5s linear infinite;
    animation: spin 1.5s linear infinite;
  }

  /* Safari */
@-webkit-keyframes spin {
  0% {
    -webkit-transform: rotate(0deg);
  }

  100% {
    -webkit-transform: rotate(360deg);
  }
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}
`

export const LoginContact = styled.div<{ $primary?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: .5rem;
  margin-top: 1rem;

  ${props => props.$primary && css`
  margin: 0 auto;
  max-width: 700px;  `}

  &>span {
    color: var(--grey);
  }
`

export const StoreContainer = styled.div`
display: flex;
align-items: center;
gap: .5rem;
margin-top: 1rem;

&>div:nth-child(1)>img {
  width: 120px;
  height: 120px;
  border-radius: var(--border-radius-small);
  object-fit: cover;
  box-shadow: 0 12px 28px ${props => props.theme.mode === 'dark' ? 'rgb(50 50 50 / 10%)' : 'rgb(190 190 190 / 50%)'};
}

&>div:nth-child(2) {
  height: 120px;
  width: 1px;
  margin: 0 1.5rem;
  background-color: var(--grey);
  border-radius: var(--border-radius-small);
}

&>div:nth-child(3) {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;

  &>span {
    color: ${props => props.theme.mode === 'dark' ? 'var(--white)' : 'var(--main-dark-color)'};
    font-size: 24px;
    font-weight: bold;
    margin-left: .5rem;
  }

  &>div {
    display: flex;
    align-items: center;
    justify-content: start;
    gap: .5rem;
  }
}

@media (max-width: 430px) {
  flex-direction: column;
  align-items: center;

  &>div:nth-child(2) {
    display: none;
  }
  &>div:nth-child(3) {
    align-items: center;

    &>span {
    font-size: 18px;
  }
  }
}
`

export const StoreBanner = styled.img`
  width: 170px;
  height: 50px;
  object-fit: contain;

  @media (max-width: 430px) {
    width: 120px;
}
`