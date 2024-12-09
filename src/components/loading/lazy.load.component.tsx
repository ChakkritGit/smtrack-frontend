import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
import { useTheme } from '../../theme/ThemeProvider'

const LazyLoadComponent = () => {
  const { theme } = useTheme()
  return (
    <SkeletonTheme baseColor={theme.mode === 'dark' ? 'var(--main-last-color)' : 'var(--grey-25)'} highlightColor={theme.mode === 'dark' ? 'var(--main-seccond-color)' : 'var(--soft-grey)'} borderRadius={'.5rem'}>
      <Skeleton height={30} style={{ gap: '1rem', marginBottom: '.5rem', marginTop: '1rem' }} />
      <Skeleton height={30} width={'75%'} style={{ gap: '1rem', marginBottom: '.5rem' }} />
      <Skeleton height={30} width={'50%'} style={{ gap: '1rem', marginBottom: '.5rem' }} />
    </SkeletonTheme>
  )
}

export default LazyLoadComponent