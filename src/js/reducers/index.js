import { combineReducers } from "redux"

// import tweets from "./tweetsReducer"
import user from "./userReducer"
import teams from "./teamReducer"
import service from './serviceReducer'

export default combineReducers({
	service,
  user,
  teams
})
