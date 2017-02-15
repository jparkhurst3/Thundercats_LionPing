import React from 'react'
import {Link} from 'react-router'
import CreateServiceModal from './CreateServiceModal'
import CreateTeamModal from './CreateTeamModal'

// export default class SideBar extends React.Component {
//     render() {
//         return (
//             <div className="col-xs-2 bg-inverse sidebar">
//                 <ul className="nav nav-pills flex-column">
//                     <li className="nav-item">
//                         <Link className="nav-link" activeClassName="activeLink" to={'/'}><h2 style={{'fontFamily': 'Droid Serif', "color": "gold"}}>LION PING</h2></Link>
//                     </li>
//                     <SideBarElement links={['Received', 'Sent', 'New']} modals={[]} name='Pings' />
//                     <SideBarElement links={['My Services', 'Find Service']} modals={['Create Service']} name='Services' />
//                     <SideBarElement links={['My Teams', 'Find Team']} modals={['Create Team']} name='Teams' />
//                 </ul>
//                 <footer class="footer">
//                     <div class="container">
//                         <h6 style={{color: 'white'}}><small>
//                             <Link to="/faq">FAQ</Link>
//                             &#160;|&#160;
//                             <Link to="help">Getting Started</Link>
//                         </small></h6>
//                         <h6 style={{color: 'white'}}><small>©2017 Thundercats, LLC</small></h6>
//                     </div>
//                 </footer>
//             </div>
//         )
//     }
// };


/*
need to decide which option we want
I like the simple version
*/
export default class SideBar extends React.Component {
    render() {
        return (
        <div className="col-xs-2 bg-inverse sidebar">
            <ul className="nav nav-pills flex-column">
                <li className="nav-item">
                    <Link className="nav-link" activeClassName="activeLink" to={'/'}><h2 style={{'fontFamily': 'Droid Serif', "color": "gold"}}>LION PING</h2></Link>
                </li>
                <li className="nav-item">
                    <Link className="nav-link" activeClassName="activeLink" to={'/Pings'}><h5>Pings</h5></Link>
                </li>
                <li className="nav-item">
                    <Link className="nav-link" activeClassName="activeLink" to={'/MyServices'}><h5>Services</h5></Link>
                </li>
                <li className="nav-item">
                    <Link className="nav-link" activeClassName="activeLink" to={'/MyTeams'}><h5>Teams</h5></Link>
                </li>
            </ul>


            <footer class="footer">
                <div class="container">
                    <h6 style={{color: 'white'}}><small>
                        <Link to="/faq">FAQ</Link>
                        &#160;|&#160;
                        <Link to="help">Getting Started</Link>
                    </small></h6>
                    <h6 style={{color: 'white'}}><small>©2017 Thundercats, LLC</small></h6>
                </div>
            </footer>
        </div>
        )
    }
}


class SideBarElement extends React.Component {
    constructor(props) {
        super(props);
    }
    
    render() {
        const mappedLinks = this.props.links.map((linkName) => 
            <li class="nav-item">
              <Link class="nav-link" activeClassName="activeLink" to={linkName.replace(/\s+/g, '')}>{linkName}</Link>
            </li>
        )

        const mappedServiceModal = this.props.modals.map((modalName) => {
            if (modalName == 'Create Service') {
                return <CreateServiceModal />
            } else if (modalName == 'Create Team') {
                return <CreateTeamModal />
            }
        }
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
                        {mappedServiceModal}
                    </ul>
                </div>
                
            </div>
        )
    }
}