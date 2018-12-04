import React, {Component} from 'react';
import { withGoogleMap, GoogleMap, Marker } from "react-google-maps";
import { withRouter } from 'react-router-dom';
import Result from './Result/Result';
import { Row, Col } from 'reactstrap';
import './style.css';
import MarkerWithInfoWindow from './MarkerWithInfoWindow/MarkerWithInfoWindow';


export default withRouter(class StopsSearchResults extends Component{
    constructor(){
        super();
        this.state = {
            "locations": []
        }
    }
    render(){
        console.log(this.props.locations)
        const resultLocations = this.props.locations;
        const markers = resultLocations.map((location)=>{
            return <MarkerWithInfoWindow key={location._id} place={location} />
        })
        const MyMapComponent = withGoogleMap((props) =>
        <GoogleMap
            defaultZoom={11}
            defaultCenter={{ lat: resultLocations[0].latitude, lng: resultLocations[0].longitude }}
        >
            {markers}
        </GoogleMap>
        )
        const locations = this.props.locations.map((place)=>{
            return(
                <Result addLocationToStop={this.props.addLocationToStop} place={place} key={place._id} />
            )
        })
        return(
            <div>
               
                { this.props.locations.length === 0 ? null : 
                <Row className="location-search-results">
                <Col sm={8} className="location-search-results-map">

                <MyMapComponent
                    googleMapURL="https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=AIzaSyA9QS5l8yaDcWpFoQ7kXHN7FgnWuwtW_Gg"
                    loadingElement={<div style={{ height: `100%` }} />}
                    containerElement={<div style={{ height: `30em` }} />}
                    mapElement={<div style={{ height: `100%` }} />}
                />
                </Col>
                <Col sm={4} className="location-search-results-list">
                {locations}
                </Col>
                </Row>
                
                }
            </div>
        )
    }
})