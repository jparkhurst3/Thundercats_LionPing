import React from 'react';
var Select = require('react-select');
import axios from 'axios'

export default class CreateTeamPage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			teamMembers: null,
			value: []
		}
	}

	componentWillMount() {
		axios.get("http://localhost:8080/api/users")
			.then((result) => {
				this.setState({teamMembers: result.data});
			})
			.catch((error) => {
				console.log(err);
			})
	}

	handleSelected(value) {
		console.log(value);
		this.setState({value});
	}

	render() {
		if (!this.state.teamMembers) {
			return <p>loading</p>
		}

		return (
			<div className="container">
				<form>
					<div class="form-group">
						<h1>Create Team</h1>
						<input type="text" class="form-control" id="teamName" placeholder="Team Name" />
						<input type="text" class="form-control" id="teamName" placeholder="Short Description (optional)" />
						<Select multi value={this.state.value} placeholder="Select" options={this.state.teamMembers} onChange={this.handleSelected.bind(this)} />
						<button type="submit" class="btn">Create Team</button>
					</div>
				</form>
			</div>
		)
	}
}