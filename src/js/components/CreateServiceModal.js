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
   // style={{color: 'white', cursor: 'pointer'}}
   // <Link class="nav-link" activeClassName="activeLink" to={"/"}>Create Service</Link>


  
  render () {
	return (
			<li className="nav-item">
   		    <a className="nav-link" activeClassName="activeLink" style={{color: 'white', cursor: 'pointer'}} onClick={this.handleToggleModal}>Create Service</a>
			<ReactModal 
				isOpen={this.state.showModal}
				contentLabel="Minimal Modal Example" 
				style={{
					overlay: {
						color: 'white'
					},
					content: {
						position: 'relative',
						height: '400px',
						width: '500px',
						left: '25%',
						top: '25%',
						right: 'auto',
						bottom: 'auto',
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
			</li>
	);
  }
}