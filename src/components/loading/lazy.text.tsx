import Skeleton from "react-loading-skeleton"
import { useTheme } from "../../theme/ThemeProvider"

interface LazyProps {
  width: string,
  height?: number,
}

const LazyText = (lazyProps: LazyProps) => {
  const { theme } = useTheme()
  const { width, height } = lazyProps
  return (
    <Skeleton width={width} height={height ?? 25} baseColor={theme.mode === 'dark' ? 'var(--main-last-color)' : 'var(--grey-25)'} highlightColor={theme.mode === 'dark' ? 'var(--main-seccond-color)' : 'var(--soft-grey)'} borderRadius={'.5rem'} />
  )
}

export default LazyText