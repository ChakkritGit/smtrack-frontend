import { LoadingData, LoadingSVGspin } from "../../style/style"
import { ReactNode } from "react"

type LoaderType = {
  title?: string,
  icn?: ReactNode,
  loading?: boolean
}

export default function Loading(LoaderType: LoaderType) {
  return (
    <LoadingData>
      <LoadingSVGspin $primary={LoaderType.loading}>{LoaderType.icn}</LoadingSVGspin>
      <span>{LoaderType.title}</span>
    </LoadingData>
  )
}
