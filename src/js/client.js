import React from "react"
import ReactDOM from "react-dom"
import { Provider } from "react-redux"

import Home from "./components/Home"
import Routes from './routes'

const app = document.getElementById('app')

ReactDOM.render(<Routes />, app);