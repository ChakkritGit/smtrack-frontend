import { LegacyRef } from "react"
import { TerminalDiv } from "../../style/components/firmwareuoload"

interface terRefType {
  terminalRef: LegacyRef<HTMLDivElement> | undefined
}

export default function TerminalComponent({ terminalRef }: terRefType) {
  return (
    <TerminalDiv ref={terminalRef} />
  )
}
