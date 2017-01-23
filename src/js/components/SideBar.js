import React from 'react'
import {Link} from 'react-router'

export default class SideBar extends React.Component {
	render() {
		return (
			<nav class="col-xs-2 hidden-xs-down bg-inverse sidebar">
				<ul class="nav nav-pills flex-column">
					<li class="nav-item">
	            		<Link class="nav-link" activeClassName="activeLink" to={'/'}><h2 style={{'font-family': 'Droid Serif', "color": "gold"}}>LION PING</h2></Link>
	            	</li>
					<SideBarElement links={['Received', 'Sent', 'New']} name='Pings' />
					<SideBarElement links={['Services', 'Find Service', 'Create']} name='Services' />
					<SideBarElement links={['Schedule', 'Find', 'CreateTeam']} name='Teams' />
					<li class="nav-item">
	            		<Link class="nav-link" activeClassName="activeLink" to={'/Help'}><h5>Help</h5></Link>
	            	</li>
				</ul>
			</nav>
		)
	}
};

class SideBarElement extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		const mappedLinks = this.props.links.map((link) => 
			<li class="nav-item">
              <Link class="nav-link" activeClassName="activeLink" to={link}>{link}</Link>
            </li>
        )
        const id = '#' + this.props.name;

		return (
			<div>
				<li class="nav-link">
					<a data-toggle="collapse" href={id} aria-expanded="false" aria-controls={this.props.name}>
						<h5>{this.props.name}</h5>
					</a>
				</li>
				<div class="collapse" id={this.props.name}>
					<ul>
			            {mappedLinks}
					</ul>
				</div>
			</div>
		)
	}
}

