// GlobalColors.js
import { createGlobalStyle, css } from 'styled-components'

const getColorStyles = (colors: number) => {
  switch (colors) {
    case 1:
      return css`
        --main-color: #2A2AE7;
        --second-color: #2323B7;
        --main-color-opacity1: rgba(35, 35, 183, .3);
        --main-color-opacity2: rgba(42, 42, 231, .3);
      `
    case 2:
      return css`
        --main-color: #2ECC71;
        --second-color: #21874C;
        --main-color-opacity1: rgba(33, 135, 76, .3);
        --main-color-opacity2: rgba(46, 204, 113, .3);
      `
    case 3:
      return css`
        --main-color: #68D2E8;
        --second-color: #03AED2;
        --main-color-opacity1: rgba(3, 174, 210, .3);
        --main-color-opacity2: rgba(104, 210, 232, .3);
      `
    case 4:
      return css`
        --main-color: #FFC700;
        --second-color: #C99E00;
        --main-color-opacity1: rgba(201, 158, 0, .3);
        --main-color-opacity2: rgba(255, 199, 0, .3);
      `
    case 5:
      return css`
        --main-color: #A569BD;
        --second-color: #734A84;
        --main-color-opacity1: rgba(115, 74, 132, .3);
        --main-color-opacity2: rgba(165, 105, 189, .3);
      `
    case 6:
      return css`
        --main-color: #E48D55;
        --second-color: #D67536;
        --main-color-opacity1: rgba(228, 141, 85, .3);
        --main-color-opacity2: rgba(214, 117, 54, .3);
      `
    case 7:
      return css`
        --main-color: #3C4E7F;
        --second-color: #26355D;
        --main-color-opacity1: rgba(60, 78, 127, .3);
        --main-color-opacity2: rgba(38, 53, 93, .3);
      `
    case 8:
      return css`
        --main-color: #EE4545;
        --second-color: #DF3737;
        --main-color-opacity1: rgba(238, 69, 69, .3);
        --main-color-opacity2: rgba(223, 55, 55, .3);
      `
    case 9:
      return css`
        --main-color: #53C1AB;
        --second-color: #3FA28E;
        --main-color-opacity1: rgba(83, 193, 171, .3);
        --main-color-opacity2: rgba(63, 162, 142, .3);
      `
    case 10:
      return css`
        --main-color: #9A9B94;
        --second-color: #888983;
        --main-color-opacity1: rgba(154, 155, 148, .3);
        --main-color-opacity2: rgba(136, 137, 131, .3);
      `
    case 11:
      return css`
        --main-color: #8DC6FF;
        --second-color: #70AAE4;
        --main-color-opacity1: rgba(141, 198, 255, .3);
        --main-color-opacity2: rgba(112, 170, 228, .3);
      `
    case 12:
      return css`
        --main-color: #D65F00;
        --second-color: #C04D00;
        --main-color-opacity1: rgba(214, 95, 0, .3);
        --main-color-opacity2: rgba(192, 77, 0, .3);
      `
    case 13:
      return css`
        --main-color: #06D001;
        --second-color: #059212;
        --main-color-opacity1: rgba(6, 208, 1, .3);
        --main-color-opacity2: rgba(5, 146, 18, .3);
      `
    case 14:
      return css`
        --main-color: #745C97;
        --second-color: #39375B;
        --main-color-opacity1: rgba(116, 92, 151, .3);
        --main-color-opacity2: rgba(57, 55, 91, .3);
      `
    case 15:
      return css`
        --main-color: #000000;
        --second-color: #212121;
        --main-color-opacity1: rgba(0, 0, 0, .3);
        --main-color-opacity2: rgba(33, 33, 33, .3);
      `
    case 16:
      return css`
        --main-color: #93786A;
        --second-color: #7A5947;
        --main-color-opacity1: rgba(147, 120, 106, .3);
        --main-color-opacity2: rgba(122, 89, 71, .3);
      `
    default:
      return css`
        --main-color: #F57B7C;
        --second-color: #EA6B6C;
        --main-color-opacity1: rgba(245, 123, 124, .3);
        --main-color-opacity2: rgba(234, 107, 108, .3);
      `
  }
}

export const GlobalColors = createGlobalStyle`
  ${props => css`
    :root {
      ${getColorStyles(props.theme.colors)}
    }
  `}
`

export default GlobalColors
