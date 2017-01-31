import React from 'react';
import ReactModal from 'react-modal'
import {Link} from 'react-router'

export default class CreateServiceModal extends React.Component {
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
			<div>
		    <a className="nav-link modalLink" style={{color: 'white'}} onClick={this.handleToggleModal}>Create Service</a>
			<ReactModal 
				isOpen={this.state.showModal}
				contentLabel="Minimal Modal Example" 
				style={{
					overlay: {
						// backgroundColor: 'white'
						color: 'white'
					},
					content: {
						position: 'relative',
						height: '400px',
						width: '500px',
						left: '25%',
						top: '25%',
						zIndex: '1',
						backgroundColor: 'white'
					}
				}} >
				<div className="container">
					<form>
						<div class="form-group">
							<h1 style={{color: 'black'}}>Create Service</h1>
							<input type="text" class="form-control" id="serviceName" placeholder="Service Name" />
							<input type="text" class="form-control" id="serviceDescription" placeholder="Short Description (optional)" />
							<button type="submit" class="btn">Create Service</button>
						</div>
					</form>
				</div>
			</ReactModal>
			</div>
	);
  }
}