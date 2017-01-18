import React from "react"
import ReactDOM from "react-dom"
import { Provider } from "react-redux"

import Home from "./components/Home"
import Routes from './routes'
import store from "./store"

const app = document.getElementById('app')

ReactDOM.render(<Provider store={store}>
  <Routes />
</Provider>, app);