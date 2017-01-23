import React from 'react';

export default class CreateTeamPage extends React.Component {
	render() {
		return (
			<div className="container-fluid">
				<form>
					<div class="form-group">
						<h1>New Team</h1>
						<input type="text" class="form-control" id="teamName" placeholder="Team Name" />
					</div>
				</form>
			</div>
		)
	}
}