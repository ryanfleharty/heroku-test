import React, {Component} from 'react';
import { Form, Input, Label, FormGroup, Button} from 'reactstrap';
import { addStopToPlan, addLocationToStop } from '../../../../../../../../actions/actions';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

class NewStopForm extends Component{
    constructor(props){
        super(props);
        this.state = {
            newStop: {
                "location": this.props.newStop.location,
                "errors": {},
                "description": "",
                "plan": this.props.plan._id,
                "startTime": null
            },
        }
    }
    handleNewStopFormChange = (e) => {
        console.log(this.state);
        this.setState({
            newStop: {
                ...this.state.newStop,
                [e.currentTarget.name]: e.currentTarget.value
            }
        })
    }
    render(){
        return(
            <Form onSubmit={async (e)=>{
                e.preventDefault();
                //Franken-data, half in state, half in props. ew.
                const newStopData = {
                    ...this.state.newStop,
                    ...this.props.newStop,
                }
                this.props.addStopToPlan(newStopData, this.props.plan._id)
                this.props.toggleModal();
                this.props.history.push("/plans/"+this.props.plan._id)
                }}>
                <FormGroup>
                    <Label for="startTime">Start Time</Label>
                        <Input type="datetime-local" name="startTime" onChange={this.handleNewStopFormChange}/>
                </FormGroup>
                <FormGroup>
                    <Label for="description">Description</Label>
                    <Input type="text" name="description" onChange={this.handleNewStopFormChange}/>
                </FormGroup>
                <Button type="submit" >Add stop to trip</Button>
            </Form>
        )
    }
}

const mapStateToProps = (state) => {
    return {
      plan: state.plan.currentPlan,
      currentUser: state.auth.currentUser,
      newStop: state.plan.newStop
    }
};
const mapDispatchToProps = (dispatch) => {
    return {
       addStopToPlan: (formData, planId) => { addStopToPlan(dispatch, formData, planId); },
       addLocationToStop: (location) => { addLocationToStop(dispatch, location)}
    }
}
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(NewStopForm));