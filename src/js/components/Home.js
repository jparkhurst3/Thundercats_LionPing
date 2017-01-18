import React from "react"
import { connect } from "react-redux"

import { fetchUser } from "../actions/userActions"
import { fetchTeams, addTeam, deleteTeam } from "../actions/teamActions"
import FakeHome from "./fakeHome.js"


@connect((store) => {
  // console.log("STORE----")
  // console.log(store)
  return {
    user: store.user.user,
    userFetched: store.user.fetched,
    teams: store.teams.teams
  };
})
export default class Home extends React.Component {
  componentWillMount() {
    this.props.dispatch(fetchUser())
    // this.props.dispatch(fetchTeams())
    // this.props.dispatch(addTeam("lemonade"))
    // this.props.dispatch(fetchTeams())
    // this.props.dispatch(deleteTeam('teamo'))
  }

  addTeam(team) {
    this.props.dispatch(addTeam(team));
  }

  fetchTeams() {
    this.props.dispatch(fetchTeams())
  }

  // render() {
  //   const { user, teams } = this.props;
  //   if (!teams.length) {
  //     return (
  //       <div className="container">
  //         <button onClick={this.fetchTeams.bind(this)}>Load Teams</button>
  //       </div>
  //     )
  //   }
  //   const mappedTeams = teams.map((team) => <li key={team.id}>{team.name}</li>)
  //   // console.log(mappedTeams)
  //   return (
  //     <div className="container">
  //         <h1>Home</h1>
  //         <h2>{user.name}</h2>
  //         <ul>{mappedTeams}</ul>
  //     </div>
  //   )
  // }

  render() {
    return (
      <FakeHome />
    )
  }
}



