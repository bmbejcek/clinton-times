import React, { Component } from "react";
import ReactDOM from "react-dom";


export default class PollingExample extends Component {
  state = {
    last_refreshed: Math.floor(Date.now()/1000),
    current_time: Math.floor(Date.now()/1000),
    last_refreshed_readable: "",
    bottom_headsign: "",
    top_headsign: "",
    bottom_trains: [],
    top_trains:[],
  };

  componentDidMount() {
  this.tick();
  this.tock();
  this.interval = setInterval(this.tick, 30000);
  this.interval = setInterval(this.tock, 1000);
}
componentDidUpdate(prevProps, prevState) {
  if (prevState.delay != this.state.delay) {
    clearInterval(this.interval);
    this.interval = setInterval(this.tick, this.state.delay);
  }
}
componentWillUnmount() {
  clearInterval(this.interval);
}

tick = () => {
  fetch('https://otp-mta-prod.camsys-apps.com/otp/routers/default/nearby?stops=MTASBWY%3AA44&apikey=Z276E3rCeTzOQEoBPPN4JCEc6GfvdnYE')
    .then(result => result.json())
    .then(result => this.setState({
      last_refreshed: Math.floor(Date.now()/1000),
      bottom_headsign: result[0]['groups'][0].headsign,
      top_headsign: result[0]['groups'][1].headsign,
      bottom_trains: result[0]['groups'][0].times,
      top_trains: result[0]['groups'][1].times,
    }))
    .catch(err => {
    console.error('Uh oh, an error!', err);
  })
    var today = new Date();
    var time = today.getHours() + ":" + today.getMinutes();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    this.setState({last_refreshed_readable: date + " " + time})
    console.log(this.state);
}

tock = () => {
  this.setState({
      current_time: Math.floor(Date.now()/1000)
    })
}

render(){
  const zeroPad = (num, places) => String(num).padStart(places, '0')

   const top_trains = (
  <ul style = {{display: "flex", paddingLeft:"0",flexDirection: "column", float: "none", width: "100%", borderTop: "1px solid #dfdfe0"}}>
    {this.state.top_trains.map((t) =>
      <li key = {t.tripId} style = {{padding: "10px 15px", border: "none", borderBottom: "1px solid #dfdfe0", display: "flex", float: "left", listStyle: "none", marginBottom: "0", overflow:"hidden", alignItems: "center"}}>
        <span style = {{float: "left", backgroundColor: "gray", textAlign: "center", color:"white", fontSize: "x-large", margin:"0", height:"32px", width: "32px", border: "2px solid #fff", borderRadius: "50%", display: "block", backgroundImage: "background-image: url(https://new.mta.info/themes/custom/bootstrap_mta/js/apps/ec805c7415caff62cc2641469574683c.svg)"}}><p style={{margin:"0", marginTop: "2px"}}>{t.pattern.id.substr(8,1)}</p></span>
        <span style = {{marginLeft: "10px", position: "static"}}>{t.tripHeadsign}</span>
        <span style = {{marginLeft: "auto", float: "right", backgroundColor: "#777",borderRadius: "10px",color: "#fff", display: "inline-block",fontSize: "14px",fontWeight: "700",lineHeight: "1",minWidth: "10px",padding: "3px 7px", textAlign: "center",verticalAlign: "middle",whiteSpace: "nowrap"}}>{new Date(t.departureFmt).toLocaleTimeString("en-US", {timeZone: "America/New_York"})}</span>
        <span style = {{fontWeight: "700",paddingLeft: "5px",position: "relative",width: "20%"}}>{zeroPad(Math.floor((new Date(t.departureFmt) - new Date())/60000),2)} mins away</span>
      </li>
    )}
  </ul>
)

   const bottom_trains = (
  <ul style = {{display: "flex", paddingLeft:"0", flexDirection: "column", float: "none", width: "100%", borderTop: "1px solid #dfdfe0"}}>
    {this.state.bottom_trains.map((t) =>
      <li key = {t.tripId} style = {{padding: "10px 15px", border: "none", borderBottom: "1px solid #dfdfe0", display: "flex", float: "left", listStyle: "none", marginBottom: "0", overflow:"hidden", alignItems: "center"}}>
        <span style = {{float: "left", backgroundColor: "gray", textAlign: "center", color:"white", fontSize: "x-large", margin:"0", height:"32px", width: "32px", border: "2px solid #fff", borderRadius: "50%", display: "block", backgroundImage: "background-image: url(https://new.mta.info/themes/custom/bootstrap_mta/js/apps/ec805c7415caff62cc2641469574683c.svg)"}}><p style={{margin:"0", marginTop: "2px"}}>{t.pattern.id.substr(8,1)}</p></span>
        <span style = {{marginLeft: "10px", position: "static"}}>{t.tripHeadsign}</span>
        <span style = {{marginLeft: "auto", float: "right", backgroundColor: "#777",borderRadius: "10px",color: "#fff", display: "inline-block",fontSize: "14px",fontWeight: "700",lineHeight: "1",minWidth: "10px",padding: "3px 7px", textAlign: "center",verticalAlign: "middle",whiteSpace: "nowrap"}}>{new Date(t.departureFmt).toLocaleTimeString("en-US", {timeZone: "America/New_York"})}</span>
        <span style = {{fontWeight: "700",paddingLeft: "5px",position: "relative",width: "20%"}}>{zeroPad(Math.floor((new Date(t.departureFmt) - new Date())/60000),2)} mins away</span>
      </li>
    )}
  </ul>
)
  return(
    <div style = {{fontFamily: "Helvetica,Arial,sans-serif", marginLeft:"5%", marginRight:"5%"}}>
    <p> Last refreshed: {this.state.last_refreshed_readable} ({this.state.current_time - this.state.last_refreshed} seconds ago)</p>
    <h1>Clinton Washington Avenue Trains</h1>
    <h2>{this.state.top_headsign}</h2>
    <div style = {{display:"block"}}>
      {top_trains}
    </div>
    <h2>{this.state.bottom_headsign}</h2>
      {bottom_trains}
    </div>
    );
}
}
