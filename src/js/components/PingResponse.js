import React from 'React';
import axios from 'axios'
import moment from 'moment'

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
        <div class="container">
          <h1>Loading yo</h1>
        </div>
      )
    }

    let button = null;
    if (this.state.pingData.Status == "Open") {
      button = <div><input class="btn" name="acknowledge" value="Acknowledge Ping" onClick={this.acknowledgePing} /></div>
    } else if (this.state.pingData.Status == "Acknowledged") {
      button = <div><input class="btn" hidden={this.state.pingData.Status == "Resolved" } name="resolve" value="Resolve Ping" onClick={this.resolvePing} /></div>
    } else {
      button = null;
    }

    return (
      <div class="container">
        <h1>Respond to Ping</h1>
        <div>
          <p><strong>Date created:</strong> {moment(this.state.pingData.CreatedTime).calendar()}</p>
          <p><strong>Created By:</strong> {this.state.pingData.CreatedUser}</p>
          <p><strong>Service:</strong> {this.state.pingData.ServiceName}</p>
          <p><strong>Ping Name:</strong> {this.state.pingData.Name}</p>
          <p><strong>Description:</strong> {this.state.pingData.Description}</p>
          <p><strong>Status:</strong> {this.state.pingData.Status}</p>
          <p><strong>Acknowledged User:</strong> {this.state.pingData.AcknowledgedUser}</p>
          <p><strong>Date Acknowledged:</strong> {moment(this.state.pingData.AcknowledgedTime).calendar()}</p>
          <p><strong>Resolved User:</strong> {this.state.pingData.ResolvedUser}</p>
          <p><strong>Date Resolved:</strong> {moment(this.state.pingData.ResolvedTime).calendar()}</p>


        </div>

        {button}

        <a href="http://localhost:8080" >Go to site</a>
      </div>
    )
  }
}
