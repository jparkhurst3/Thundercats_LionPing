import React from 'react';
import ReactModal from 'react-modal'
import {Link} from 'react-router'
import axios from 'axios'

export default class CreateTeamModal extends React.Component {
	constructor() {
		super();
		this.state = {
			showModal: false
		}
	}

	handleToggleModal = () => {
		this.setState({ showModal: !this.state.showModal });
	}

	handleCloseModal = () => {
		this.setState({ showModal: false });
	}

	render () {
		return (
			<li className = "nav-item">
			<a class = "nav-link" href = "javascript:;" onClick = { this.handleToggleModal } > Create Team</a>
			<ReactModal
				isOpen = { this.state.showModal }
				contentLabel = "Minimal Modal Example"
				onRequestClose = { this.handleToggleModal }
				shouldCloseOnOverlayClick = { true }

				style = {{
					overlay: {
						background: 'rgba(255, 255, 255, 0.9)'
					},
					content: {
						position: 'absolute',
						height: '300px',
						width: '500px',
						left: '50%',
						top: '50%',
						transform: 'translate(-50%, -50%)',
						right: 'auto',
						bottom: 'auto',
						zIndex: '1',
						padding: 'none',
						border: 'none'
					}
				}} >
				<CreateTeamCard />
			</ReactModal>
			</li>
		);
	}
}

class CreateTeamCard extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			teamName: '',
			teamDescription: '',
			// teamMembers: null,
			// value: []
			teamUsers: null,
			created: false
		}
	}

	componentDidMount() {
		// axios
	}

	createTeam = (event) => {
		event.preventDefault()
		console.log("Create Team");
		const apiCall = 'http://localhost:8080/api/teams/createTeam'
		const data = {
			Name: this.state.teamName
		}
		axios.post(apiCall, data)
			.then(res => {
				console.log("Successfully created new team");
				console.log(res);
				this.setState({
					created: true
				})
			})
			.catch(err => {
				console.log('oops my bad guys');
				console.log(err)
			})
	}

	handleChange = (event) => {
		this.setState({
			[event.target.name]: event.target.value
		});
	}

	render() {
		if (this.state.created) {
			return (
				<div class="card">
					<div class="card-header">Create Team</div>
					<div class="card-block">
						<h3>Team Successfully Created</h3>
					</div>
				</div>
			)
		}
		return (
			<div class="card">
				<div class="card-header"><h3>Create Team</h3></div>
				<div class="card-block">
					<form>
						<div class = "form-group">
							<input type="text" name="teamName" class="form-control" placeholder="Team Name" value={this.state.teamName} onChange={this.handleChange}/>
							<input type="text" name="teamDescription" class="form-control" aria-describedby="emailHelp" placeholder="Description (Optional)" value={this.state.teamDescription} onChange={this.handleChange}/>
						</div>
						<button type="submit" class="btn" onClick={this.createTeam}>Create Team</button>
					</form>
				</div>
			</div>
		)
	}
}