import styled from 'styled-components'

export const OfflineDataFlex = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3rem;
  margin-top: 3rem;

  &>span {
    font-size: 32px;
  }

  &>div {
    display: flex;
    align-items: center;
    gap: 1rem;

    &>div {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      gap: 1rem;
      width: 270px;
      height: 270px;
      max-width: 300px;
      max-height: 300px;
      padding: 1.3rem;
      border-radius: var(--border-radius-small);
      background-color: ${props => props.theme.mode === 'dark' ? "var(--main-last-color)" : "var(--white-grey-1)"};
      box-shadow: ${props => props.theme.mode === 'dark' ? "0 12px 28px rgb(50 50 50 / 10%);" : "0 12px 28px rgb(190 190 190 / 25%)"};

      &>div:nth-child(1) {
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: ${props => props.theme.mode === 'dark' ? "var(--main-seccond-color)" : "var(--soft-grey)"};
        width: 150px;
        height: 150px;
        border-radius: var(--border-radius-small);

        &>svg {
          fill: ${props => props.theme.mode === 'dark' ? "var(--white)" : "var(--grey-75)"};
        }
      }

      &>div:nth-child(2) {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: .5rem;
        width: 100%;

        &>span {
          font-size: 20px;
          font-weight: bold;
        }

        &>button {
          width: 100%;
          height: 50px;
          background-color: var(--main-color-opacity2);
          border-radius: var(--border-radius-small);
          color: ${props => props.theme.mode === 'dark' ? 'var(--white)' : 'var(--main-color)'};
          font-size: 18px;
          font-weight: bold;
          border: unset;

          &:hover {
            background-color: var(--main-color);
            color: var(--white);
            transition: .3s;
          }
        }
      }
    }

    @media (max-width: 430px) {
      flex-direction: column;
      gap: 1rem;
    }
  }

  @media (max-width: 430px) {
      gap: 1rem;
      width: 100%;
    }
`

export const SdCardMqttLoad = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50%;
`

export const SdCardData = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  &>div {
    &>div {
      margin-bottom: 3px;

      &>span {
        font-size: 14px;
      }
    }
  }
`