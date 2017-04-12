/* @flow */

import React from 'react'
import {Link} from 'react-router'
import ToolTip from 'react-portal-tooltip'
import CreateServiceModal from './CreateServiceModal'
import CreateTeamModal from './CreateTeamModal'
import Logo from './Logo'

export default class SideBar extends React.Component {
    constructor(props) {
        super(props)
        this.state={
            isPingTipActive: false
        }
    }

    showToolTip = (event) => {
        // console.log("handling tool tip")
        this.setState({
            //isPingTipActive: true
            [event.target.name]: true
        })
    }

    hideToolTip = (event) => {
        console.log("handling tool tip")
        this.setState({
            //isPingTipActive: false
            [event.target.name]: false
        })
    }
    // <Link className="nav-link" activeClassName="activeLink" to={'/'}><h1>LION PING</h1></Link>

    render() {
        return (
        <div className="col-xs-2 sidebar">
            <ul className="nav nav-pills flex-column">
                <li className="nav-item">
                  <Link className="nav-link logo" activeClassName="activeLink" to={'/'}><Logo loading={this.props.loading} /></Link>
                </li>
                <li className="nav-item">
                    <div>
                        <Link className="nav-link" activeClassName="activeLink" to={'/Pings'}><h3>Pings</h3></Link>
                        <img id="pingQuestion" style={{float: "right", marginRight:"15px", marginTop:"10px"}} height="15" width="15" name="pingQuestion" onMouseEnter={this.showToolTip} onMouseLeave={this.hideToolTip} src={require("../../../assets/questionmark.png")} />
                        <ToolTip position="right" parent="#pingQuestion" active={this.state.pingQuestion}>
                            <div>
                                <p>
                                    Ping is a message to particular service, <br/>
                                    indicating there was an incident that needs to be resolved
                                </p>
                            </div>
                        </ToolTip>
                    </div>
                </li>
                <li className="nav-item">
                    <div>
                        <Link className="nav-link" activeClassName="activeLink" to={'/MyServices'}><h3>Services</h3></Link>
                        <img id="serviceQuestion" style={{float: "right", marginRight:"15px", marginTop:"10px"}} height="15" width="15" name="serviceQuestion" onMouseEnter={this.showToolTip} onMouseLeave={this.hideToolTip} src={require("../../../assets/questionmark.png")} />
                        <ToolTip position="right" parent="#serviceQuestion" active={this.state.serviceQuestion}>
                            <div>
                                <p>
                                    Service is a product that end-users are using <br/>
                                    that needs to be managed to prevent down-time
                                </p>
                            </div>
                        </ToolTip>
                    </div>
                </li>
                <li className="nav-item">
                    <div>
                        <Link className="nav-link" activeClassName="activeLink" to={'/MyTeams'}><h3>Teams</h3></Link>
                        <img id="teamQuestion" style={{float: "right", marginRight:"15px", marginTop:"10px"}} height="15" width="15" name="teamQuestion" onMouseEnter={this.showToolTip} onMouseLeave={this.hideToolTip} src={require("../../../assets/questionmark.png")} />
                        <ToolTip position="right" parent="#teamQuestion" active={this.state.teamQuestion}>
                            <div>
                                <p>
                                    Team is a group of members that may be responsible for <br/>
                                    several different services. Team are also used to keep <br/>
                                    an on-duty schedules
                                </p>
                            </div>
                        </ToolTip>
                    </div>
                </li>
                <li className="nav-item">
                    <Link to={'/'} onClick={this.props.logout} className="nav-link" activeClassName="activeLink"><h3>Logout</h3></Link>
                </li>
            </ul>


            <footer class="footer">
                <div class="container">
                    <h6 style={{color: 'white'}}><small>
                        <Link to="/faq">FAQ</Link>
                        &#160;|&#160;
                        <Link to="/gettingstarted">Getting Started</Link>
                    </small></h6>
                    <h6 style={{color: 'white'}}><small>©2017 Thundercats, LLC</small></h6>
                </div>
            </footer>
        </div>
        )
    }
}
