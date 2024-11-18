import styled, { css } from "styled-components"

export const TmsManageDevicesContainer = styled.div<{ $primary?: boolean }>`
  padding: 0.5rem;

${props => props.theme.mode === 'dark' &&
    css`
    .hiTDLB-st>div>div>div>div,
    .hiTDLB-st>div>div>div {
      color: var(--white-grey-1);
      background-color: var(--main-seccond-color);
      border-bottom-color: var(--border-dark-color);
    }

    div>nav {
      background-color: var(--main-seccond-color);
      color: var(--white-grey-1);
      border-top-color: var(--border-dark-color);

      div>button {
        color: var(--white-grey-1) !important;
        fill: var(--white-grey-1) !important;
      }

      &>div>button:disabled {
    cursor: unset;
    color: rgba(255, 255, 255, .30) !important;
    fill: rgba(255, 255, 255, .30) !important;
  }
    }
`}
`

export const TmsAddDeviceHead = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 1rem 0;
`