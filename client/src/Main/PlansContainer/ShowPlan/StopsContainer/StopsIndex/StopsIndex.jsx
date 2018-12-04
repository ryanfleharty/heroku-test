import React, {Component} from 'react';
import {Link, withRouter} from 'react-router-dom';
import { withGoogleMap, GoogleMap, DirectionsRenderer } from "react-google-maps";
import { Row, Col } from 'reactstrap';
import {connect } from 'react-redux';
import Moment from 'react-moment';
import MarkerWithInfoWindow from './MarkerWithInfoWindow/MarkerWithInfoWindow';

class StopsIndex extends Component{
    constructor(){
        super();
        this.state = {
            "directions": {}
        }
    }
    render(){
    const locationOne = this.props.plan.stops[0];
    const lastLocation = this.props.plan.stops[this.props.plan.stops.length - 1];
    const markers = this.props.plan.stops.map((stop, index)=>{
        return <MarkerWithInfoWindow key={index} stop={stop} index={index} />
    })
    const theseWaypoints = this.props.plan.stops.slice(1, this.props.plan.stops.length-1).map((stop)=>{return{location: {lat:stop.location.latitude, lng: stop.location.longitude}}});
    const DirectionsService = new window.google.maps.DirectionsService();
    if(this.props.plan.stops.length > 1 && JSON.stringify(this.state.directions) === "{}"){
        DirectionsService.route({
            origin: new window.google.maps.LatLng(locationOne.location.latitude, locationOne.location.longitude),
            destination: new window.google.maps.LatLng(lastLocation.location.latitude, lastLocation.location.longitude),
            waypoints: theseWaypoints,
            travelMode: window.google.maps.TravelMode.DRIVING
        }, (result, status) => {
            if(status === window.google.maps.DirectionsStatus.OK){
                console.log(result);
                this.setState({
                    directions: result
                })
            } else {
                console.log("ERROR FINDING DIRECTIONS")
            }
        })
    }
    const MyMapComponent = withGoogleMap(() =>
    <GoogleMap
        defaultZoom={12}
        defaultCenter={{ lat: this.props.plan.stops[0].location.latitude, lng: this.props.plan.stops[0].location.longitude }}
    >    <DirectionsRenderer options={{suppressMarkers: true}} directions={this.state.directions} />
        {markers}
    </GoogleMap>
    )
    const stops = this.props.plan.stops.map((stop, index)=>{
        return(
            <div key={stop._id}>
            <h5>
                <span className="float-left">{index + 1}</span>
                <Link to={this.props.match.url + '/stops/' + stop._id}>
                {stop.location.name}
                </Link> at <Moment format="hh:mm a">{stop.startTime}</Moment>
            </h5>
                <p>{stop.description}</p>
            </div>
        )
    })
    return(
        <div>
            {this.props.plan.stops.length > 0 ? 
            <Row>
                <Col sm={6} >
                    <MyMapComponent
                        googleMapURL="https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=AIzaSyA9QS5l8yaDcWpFoQ7kXHN7FgnWuwtW_Gg"
                        loadingElement={<div style={{ height: `100%` }} />}
                        containerElement={<div style={{ height: `400px` }} />}
                        mapElement={<div style={{ height: `100%` }} />}
                    />
                </Col>
                <Col sm={6}  style={{ overflow: 'scroll', height: '400px'}}>
                    {stops}
                </Col>
            </Row>
            :
            <Row>
            <p>This plan is going nowhere!</p>
            <Link to={this.props.match.url + '/stops/new'}>Add a location to this plan</Link>
            </Row>
            }
        </div>
    )}
}
const mapStateToProps = (state) => {
    return {
      plan: state.plan.currentPlan,
      currentUser: state.auth.currentUser
    }
};
const mapDispatchToProps = (dispatch) => {
    return {
        
    }
}
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(StopsIndex));