import { css, Global } from "@emotion/react"

const globalStyle = css`
  html,
  body {
    margin: 0;
  }
`

export function GlobalStyles() {
  return <Global styles={globalStyle} />
}
