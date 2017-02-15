import React from 'react';
import ReactModal from 'react-modal'
import {Link} from 'react-router'
import axios from 'axios'

// export default class CreateServiceModal extends React.Component {
//   constructor() {
// 	super();
// 	this.state = {
// 	  showModal: false
// 	}
//   }
  
//   handleToggleModal = () => {
// 	this.setState({ showModal: !this.state.showModal });
//   }
  
//   handleCloseModal = () => {
// 	this.setState({ showModal: false });
//   }
//    // style={{color: 'white', cursor: 'pointer'}}
//    // <Link class="nav-link" activeClassName="activeLink" to={"/"}>Create Service</Link>
//    		    // <h6 className="nav-link" activeClassName="activeLink" style={{color: 'white', cursor: 'pointer'}} onClick={this.handleToggleModal}>Create Service</h6>


  
//   render () {
// 	return (
// 			<li className="nav-item">
// 			<a class="nav-link" href="javascript:;" onClick={this.handleToggleModal}>Create Service</a>
// 			<ReactModal 
// 				isOpen={this.state.showModal}
// 				contentLabel="Minimal Modal Example" 
// 				onRequestClose={this.handleToggleModal}
//         		shouldCloseOnOverlayClick={true}

// 				style={{
// 					overlay: {
// 						background: 'rgba(255, 255, 255, .9)'
// 					},
// 					content: {
// 						position: 'absolute',
// 						height: '300px',
// 						width: '500px',
// 						left: '50%',
// 						top: '50%',
// 						transform: 'translate(-50%, -50%)',
// 						right: 'auto',
// 						bottom: 'auto',
// 						zIndex: '1',
// 						padding: 'none',
// 						border: 'none'
// 					}
// 				}} >
// 				<CreateServiceCard />
// 			</ReactModal>
// 			</li>
// 	);
//   }
// }


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
   		    // <h6 className="nav-link" activeClassName="activeLink" style={{color: 'white', cursor: 'pointer'}} onClick={this.handleToggleModal}>Create Service</h6>


  
  render () {
	return (
		<div class="align-right" style={{float: "right"}}>
			<span style={{textAlign: "right"}}><a class="btn" href="javascript:;" onClick={this.handleToggleModal}>Create Service</a></span>
			<ReactModal 
				isOpen={this.state.showModal}
				contentLabel="Minimal Modal Example" 
				onRequestClose={this.handleToggleModal}
        		shouldCloseOnOverlayClick={true}
				style={{
					overlay: {
						background: 'rgba(255, 255, 255, .9)'
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
						zIndex: '100',
						padding: 'none',
						border: 'none'
					}
				}} >
				<CreateServiceCard />
			</ReactModal>
		</div>
	);
  }
}

class CreateServiceCard extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			serviceName: '',
			serviceDescription: '',
			created: false
		}
	}

	componentDidMount() {
		// axios
	}



	createService = (event) => {
		event.preventDefault()
		console.log("Create Service");
		const apiCall = 'http://localhost:8080/api/services/createService'
		const data = {
			Name: this.state.serviceName
		}
		axios.post(apiCall, data)
			.then(res => {
				console.log("Sucessfully created new service");
				console.log(res);
				this.setState({
					created: true
				})

			})
			.catch(err => {
				console.log('ERRROOOORRRRRR');
				console.log(err);
			})
	}

	handleChange = (event) => {
	    this.setState({
	    	[event.target.name]: event.target.value
	    });
	}

	render() {
		if (this.state.created) {
			//should link to that team 
			return (
				<div class="card">
					<div class="card-header">Create Service</div>
					<div class="card-block">
						<h3>Service Successfully Created</h3>
					</div>
				</div>
			)
		}
		return (
			<div class="card">
				<div class="card-header"><h3>Create Service</h3></div>
				<div class="card-block">
					<form>
						<div class="form-group">
							<input type="text" name="serviceName" class="form-control" id="exampleInputEmail1" placeholder="Service Name" value={this.state.serviceName} onChange={this.handleChange}/>
							<input type="text" name="serviceDescription" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Description (Optional)" value={this.state.serviceDescription} onChange={this.handleChange}/>
						</div>
						<button type="submit" class="btn" onClick={this.createService}>Create Service</button>
					</form>
				</div>
			</div>
		  )
	}
}