import React, { Component } from 'react';
import {Marker, InfoWindow} from 'react-google-maps';

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
                key={this.props.place._id} 
                labelStyle={{backgroundColor: "green", fontSize: "32px", padding: "16px"}}
                position={{lat: this.props.place.latitude, lng: this.props.place.longitude}}
                onClick={this.toggle}
          >
            {this.state.open && <InfoWindow onCloseClick={this.toggle}>
              <div>
                  <h6>{this.props.place.name}</h6>
                  <p>{this.props.place.description}</p>
              </div>
            </InfoWindow>}
          </Marker>
        )
    }
}

export default MarkerWithInfoWindow;