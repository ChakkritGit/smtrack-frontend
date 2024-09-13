import styled from "styled-components";

export const ManageConfigAdd = styled.button<{ $primary?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: .5rem;
  width: 100%;
  /* max-width: 165px; */
  max-height: 45px;
  border-radius: var(--border-radius-big);
  border: 2px solid var(--main-color);
  background-color: unset;
  color: var(--main-color);
  font-weight: bold;
  padding: .5rem;

&:hover {
  background-color: var(--main-color);
  color: var(--white-grey-1);
  transition: .3s;
}

& svg {
  stroke-width: 1px;
}
`

export const ModeNetworkFlex = styled.div<{ $primary?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
`

export const ConfigBtn = styled.button<{ $primary?: boolean }>`
  width: 40px;
  color: white;
  background-color: var(--main-color);
  border-color: var(--main-color);
  border-style: solid;
  font-size: 24px;
  border-top-left-radius: .3rem;
  border-bottom-left-radius: .3rem;
  border-top-right-radius: .3rem;
  border-bottom-right-radius: .3rem;
`