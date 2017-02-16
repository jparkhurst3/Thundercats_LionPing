import React from 'react';
import ReactModal from 'react-modal'
import {Link} from 'react-router'
import axios from 'axios'
import Select from 'react-select';

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
        <div class="align-right" style={{float: "right"}}>
            <span style={{float: "right"}}><a class="btn" href="javascript:;" onClick={this.handleToggleModal}>Create Team</a></span>
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
            </div>
        );
    }
}

class CreateTeamCard extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            teamName: '',
            teamDescription: '',
            created: false,
            allUsers: [], // all users from the databse
            teamMembers: [] // users on the created team
        }
    }

    componentDidMount() {
        axios.get('/api/users/getUsers')
            .then(res => {
                this.setState({
                    allUsers: res.data // get users from database
                })
            })
            .catch(err => {
                console.log(err)
            })
    }

    // TODO: not working for some reason
    createTeam = (event) => {
        event.preventDefault()
        console.log("Create Team");
        const teamData = {
            Name: this.state.teamName,
            Users: this.state.teamMembers.map(user => {return user.value.Username})
        }
        axios.post('/api/teams/createTeam', teamData)
            .then(res => {
                console.log("Successfully created new team"); // success
                console.log(res);
                this.setState({
                    created: true
                })
            })
            .catch(err => {
                console.log('Team not created'); // SHIT!
                console.log(err)
            })
    }

    handleChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    handleSelected(teamMembers) {
        this.setState({teamMembers});
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

        const mappedUsers = this.state.allUsers.map(user => {return {value: user, label: user.FirstName + " " + user.LastName}}) // map users names'

        // display everything
        return (
            <div class="card">
                <div class="card-header"><h3>Create Team</h3></div>
                <div class="card-block">
                    <form>
                        <div class = "form-group">
                            <input type="text" name="teamName" class="form-control" placeholder="Team Name" value={this.state.teamName} onChange={this.handleChange}/>
                            <input type="text" name="teamDescription" class="form-control" aria-describedby="emailHelp" placeholder="Description (Optional)" value={this.state.teamDescription} onChange={this.handleChange}/>
                            <Select multi value={this.state.teamMembers} options={mappedUsers} onChange={this.handleSelected.bind(this)} />
                        </div>
                        <button type="submit" class="btn" onClick={this.createTeam}>Create Team</button>
                    </form>
                </div>
            </div>
        )
    }
}