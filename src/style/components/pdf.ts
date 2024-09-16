import styled from "styled-components"

export const PreviewContainer = styled.div<{ $primary?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`

export const PdfViewerContainer = styled.div<{ $primary?: boolean }>`
  width: 100%;
  height: calc(100dvh - 140px);
`