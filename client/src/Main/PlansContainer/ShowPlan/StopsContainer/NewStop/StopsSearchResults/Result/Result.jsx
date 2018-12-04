import React, {Component} from 'react';
import { withGoogleMap, GoogleMap, Marker } from "react-google-maps";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter} from 'reactstrap';
import { connect } from 'react-redux';
import {withRouter } from 'react-router-dom';
import { addLocationToStop } from '../../../../../../../actions/actions';
import NewStopForm from './NewStopForm/NewStopForm';

class Result extends Component {
    constructor(props){
        super(props);
        this.state = {
            modal: false,
        };
    }
    toggle = () => {
        this.setState({
        modal: !this.state.modal
        });
    }
    render(){
        const MyMapComponent = withGoogleMap(() =>
        <GoogleMap defaultZoom={12} defaultCenter={{ lat: this.props.place.latitude, lng: this.props.place.longitude }} >
            <Marker key={this.props.place._id} position={{lat: this.props.place.latitude, lng: this.props.place.longitude}} />
        </GoogleMap>
        )
        return(
            <div>
                <h4>{this.props.place.name}</h4>
                <Button color="primary" onClick={()=>{
                            this.props.addLocationToStop(this.props.place);
                            this.toggle();
                        }}>View Details</Button>
                <Modal isOpen={this.state.modal} toggle={this.toggle}>
                <ModalHeader toggle={this.toggle}>{this.props.place.name}</ModalHeader>
                <ModalBody>
                    <MyMapComponent
                        googleMapURL="https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=AIzaSyA9QS5l8yaDcWpFoQ7kXHN7FgnWuwtW_Gg"
                        loadingElement={<div style={{ height: `10em` }} />}
                        containerElement={<div style={{ height: `10em` }} />}
                        mapElement={<div style={{ height: `10em` }} />}
                    />
                    <NewStopForm toggleModal={this.toggle}></NewStopForm>
                </ModalBody>
                <ModalFooter>
                    <form onSubmit={this.props.addLocationToStop.bind(null, this.props.place)} >
                    <Button type="submit" color="primary" onClick={this.toggle}>Add to Plan</Button>{' '}
                    </form>
                    <Button color="secondary" onClick={this.toggle}>Go Back</Button>
                </ModalFooter>
                </Modal>
            </div>
        )
    }
}
const mapStateToProps = (state) => {
    return {
      plan: state.plan.currentPlan,
    }
};
const mapDispatchToProps = (dispatch) => {
    return {
       addLocationToStop: (location) => { addLocationToStop(dispatch, location)}
    }
}
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Result));