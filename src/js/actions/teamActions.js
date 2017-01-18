import axios from "axios";

export function fetchTeams() {
  return function(dispatch) {
    axios.get("http://rest.learncode.academy/api/Thundercats/teams/")
      .then((response) => {
        dispatch({type: "FETCH_TEAMS_FULFILLED", payload: response.data})
      })
      .catch((err) => {
        dispatch({type: "FETCH_TEAMS_REJECTED", payload: err})
      })
  }
}

// export function fetchTeam(name) {
//   axios.get("http://rest.learncode.academy/api/Thundercats/teams/")
//     .then((response) => {
//       //find team
//       const team = response.data.filter(team => team.name !== name)
//     })
// }

export function addTeam(name) {
  return function(dispatch) {
    axios.post("http://rest.learncode.academy/api/Thundercats/teams/", {name: name})
      .then((response) => {
        dispatch({type: "ADD_TEAM_FULLFILLED", payload: response.data})
      })
      .catch((err) => {
        dispatch({type: "ADD_TEAM_REJECTED", payload: err})
      })
  }
}

export function deleteTeam(id) {
  return function(dispatch) {
    axios.delete('http://rest.learncode.academy/api/Thundercats/teams/587430480f854b010096682d')
      .then((response) => {
        dispatch({type: "DELETE_TEAM_FULLFILLED", payload: response.data})
      })
      .catch((err) => {
        dispatch({type: "DELETE_TEAM_REJECTED"})
      })
  }
}
