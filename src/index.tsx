/// <reference types="@emotion/react/types/css-prop" />
import "core-js/stable"
import { render } from "react-dom"
import { App } from "./App"

render(<App />, document.getElementById("root"))

if (module.hot) {
  module.hot.accept()
}
