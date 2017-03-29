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
        this.setState({
          pingData: this.state.pingData
        })
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
        this.state.pingData.Status = "Resolved"
        this.setState({
          pingData: this.state.pingData
        })
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


    return (
      <div class="container">
        <h1>Respond to Ping</h1>
        <div>
          <p>Date created: {moment(this.state.pingData.CreatedTime).calendar()}</p>
          <p>Service: {this.state.pingData.ServiceName}</p>
          <p>Ping Name: {this.state.pingData.Name}</p>
          <p>Description: {this.state.pingData.Description}</p>
          <p>Status: {this.state.pingData.Status}</p>
        </div>

        <div>
          <input class="btn" hidden={this.state.pingData.Status == "Acknowledged" || this.state.pingData.Status == "Resolved"} name="acknowledge" value="Acknowledge Ping" onClick={this.acknowledgePing} />
        </div>

        <div>
          <input class="btn" hidden={this.state.pingData.Status == "Resolved"} name="resolve" value="Resolve Ping" onClick={this.resolvePing} />

        </div>

        <a href="http://localhost:8080" >Go to site</a>
      </div>
    )
  }
}
