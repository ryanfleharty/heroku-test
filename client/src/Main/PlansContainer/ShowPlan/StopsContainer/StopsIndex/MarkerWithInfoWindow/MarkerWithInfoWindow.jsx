import React, { Component } from 'react';
import {Marker, InfoWindow} from 'react-google-maps';
import Moment from 'react-moment';

class MarkerWithInfoWindow extends Component{
    constructor(){
        super()
        this.state = {
            open: false
        }
    }
    toggle = () => {
        this.setState({
            open: !this.state.open
        })
    }
    render(){
        return(
            <Marker
                key={this.props.stop.location._id} 
                label={(this.props.index+1).toString()}
                labelStyle={{backgroundColor: "green", fontSize: "32px", padding: "16px"}}
                position={{lat: this.props.stop.location.latitude, lng: this.props.stop.location.longitude}}
                onClick={this.toggle}
          >
            {this.state.open && <InfoWindow onCloseClick={this.toggle}>
              <div>
                  <h6>{this.props.stop.location.name}</h6>
                  <p><Moment format="hh:mm a">{this.props.stop.startTime}</Moment></p>
                  <p>{this.props.stop.description}</p>
              </div>
            </InfoWindow>}
          </Marker>
        )
    }
}

export default MarkerWithInfoWindow;