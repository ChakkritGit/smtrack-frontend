import { useTheme } from "../../theme/ThemeProvider"

function Support() {
  const mode = useTheme()
  return (
    <div
      className={`${mode.theme.mode === 'dark' ? 'text-white' : 'text-black'} d-flex justify-content-center align-items-center`}
      style={{ height: '100dvh', fontSize: '42px' }}>
      <span>Support</span>
    </div>
  )
}

export default Support