import React from 'react';
import axios from 'axios'
import SearchInput, {createFilter} from 'react-search-input'
import CreateTeamModal from './CreateTeamModal'
import {Link, browserHistory, withRouter} from 'react-router'
import Select from 'react-select'


export default class SelectTeam extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			teams: null,
			value: props.team,
		}
		console.log("value set")
		console.log(this.state.value)
	}

	componentWillMount() {
		axios.get("/api/teams/getTeams")
			.then((result) => {
				console.log('got teams')
				console.log(result.data)
				console.log(result.data[0])
				this.setState({teams: result.data});
			})
			.catch((err) => {
				console.log(err);
			})
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps !== this.props) {
			console.log("new props in select team")
			// this.props = nextProps
			console.log(this.props)
			console.log(nextProps)
			this.setState({
				value: nextProps.team
			})
		}
	}

	handleSelected = (value) => {
		console.log("selected")
		console.log(value)
		browserHistory.push(`teams/${value.label}`);
		// window.location.reload()

		this.setState({
			value
		})
	}

	valueRenderer = (option) => {
		return <h3 style={{ paddingTop: '8px' }}><strong>{option.label}</strong></h3>
	}

	render() {
		const mappedAllTeams = this.state.teams ?
			this.state.teams.map(team => { return {value: team.Name, label: team.Name} })
			: [{value: this.props.team, label: this.props.team}]

		console.log(mappedAllTeams)
		return (
			<div class="row" style={{verticalAlign: 'text-bottom'}}>
				<Select class="col-xs-4" style={{paddingLeft: '0px', height: "50px"}} valueRenderer={this.valueRenderer} clearable={false} value={this.state.value} placeholder={<h3 style={{ paddingTop: '8px' }}><strong>Select Team</strong></h3>} options={mappedAllTeams} onChange={this.handleSelected} />
				<div class="col-xs-6"></div>
				<div class="col-xs-2" style={{textAlign: "right"}}>
					<h6><CreateTeamModal style={{display: "inline-block", height: "50px"}} /></h6>
				</div>
			</div>
		)
	}
}
