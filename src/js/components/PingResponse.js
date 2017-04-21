import React from 'React';
import axios from 'axios'
import moment from 'moment'
import {Link} from 'react-router'

export default class PingResponse extends React.Component {
  constructor() {
    super()
    this.state = {
      pingData: null
    }
  }

  componentDidMount() {
    this.getPing()
  }

  componentWillReceiveProps(nextProps) {
    if (this.props !== nextProps) {
      this.props = nextProps
      this.getPing()
    }
  }

  getPing = () => {
    axios.get("/api/pings/getPing?ID=" + this.props.params.id)
      .then(res => {
        console.log(res)
        this.setState({
          pingData: res.data
        })
      })
      .catch(err => {
        console.log(err);
      })
  }

  acknowledgePing = () => {
    console.log("acknowlege")
    axios.post("/api/pings/acknowledgePing?ID="+this.props.params.id)
      .then(res => {
        console.log("acknowledged")
        this.state.pingData.Status = "Acknowledged"
        this.getPing()
      })
      .catch(err => {
        console.log(err)
      })
  }

  resolvePing = () => {
    console.log("resolve")
    axios.post("/api/pings/resolvePing?ID="+this.props.params.id)
      .then(res => {
        console.log("resolved")
        this.getPing();
      })
      .catch(err => {
        console.log(err)
      })
  }

  render() {
    if (!this.state.pingData) {
      return (
        <div class="cont">
        <div class="card home-card">
          <div class="card-header home-card-header">
            <h3>Respond to Ping</h3>
          </div>

          <div class="card-block">
          </div>
        </div>
        </div>
      )
    }

    let button = null;
    if (this.state.pingData.Status == "Open") {
      button = <input style={{display:"inline", width: "20%", float:"left"}} class="btn" name="acknowledge" value="Acknowledge Ping" onClick={this.acknowledgePing} />
    } else if (this.state.pingData.Status == "Acknowledged") {
      button = <input style={{display:"inline", width: "20%", float:"left"}} class="btn" hidden={this.state.pingData.Status == "Resolved" } name="resolve" value="Resolve Ping" onClick={this.resolvePing} />
    } else {
      button = null;
    }

    return (
      <div class="cont">
      <div class="card home-card">
        <div class="card-header home-card-header">
          <h3>Respond to Ping</h3>
        </div>

        <div class="card-block">
          <p><strong>Date Created:</strong> {moment(this.state.pingData.CreatedTime).calendar()}</p>
          <p><strong>Created By:</strong> {this.state.pingData.CreatedUser}</p>
          <p><strong>Service:</strong> {this.state.pingData.ServiceName}</p>
          <p><strong>Ping Name:</strong> {this.state.pingData.Name}</p>
          <p><strong>Description:</strong> {this.state.pingData.Description}</p>
          <p><strong>Status:</strong> {this.state.pingData.Status}</p>
          <p><strong>Acknowledged User:</strong> {this.state.pingData.AcknowledgedUser}</p>
          <p><strong>Date Acknowledged:</strong> {this.state.pingData.AcknowledgedTime ? moment(this.state.pingData.AcknowledgedTime).calendar() : null}</p>
          <p><strong>Resolved User:</strong> {this.state.pingData.ResolvedUser}</p>
          <p><strong>Date Resolved:</strong> {this.state.pingData.ResolvedTime ? moment(this.state.pingData.ResolvedTime).calendar() : null}</p>
          {button}
          <Link class="btn" style={{display:"inline", width: "20%", float:"right"}} to="/" >Go to site</Link>

        </div>

        </div>
      </div>
    )
  }
}
