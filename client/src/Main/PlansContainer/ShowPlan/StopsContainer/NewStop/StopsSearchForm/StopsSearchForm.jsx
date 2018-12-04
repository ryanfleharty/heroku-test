import React, {Component} from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import {Col, Row, Form, FormGroup, Label, Input, Button } from 'reactstrap';
import { searchForLocationsForPlan } from '../../../../../../actions/actions';

class StopsSearchForm extends Component{
    constructor(){
        super();
        this.state = {
            searchForm: {
                query: "",
                location: ""
            }
        }
    }
    handleSearchFormChange = (e) => {
        this.setState({
            "searchForm": {
                ...this.state.searchForm,
                [e.currentTarget.name] : e.currentTarget.value
            }
        })
    }
    render(){
        return(
            <Form onSubmit={(e)=>{
                e.preventDefault();
                this.props.history.push(this.props.match.url + `?query=${this.state.searchForm.query}&location=${this.state.searchForm.location}`)
                this.props.searchForLocationsForPlan(this.state.searchForm, this.props.plan._id)
                }}>
                <Row>
                    {JSON.stringify(this.props.errors) === "{}" ? null : <p>{JSON.stringify(this.props.errors)}</p> }
                    <Col md={5}>
                    <FormGroup>
                        
                            <Label className="float-left" for="query" >Search for:</Label>
                            <Input onChange={this.handleSearchFormChange} type="text" name="query" id="newStopTitle" />
                    </FormGroup>
                    </Col>
                    <Col md={5}>
                    <FormGroup>
                            <Label className="float-left" for="location">in: </Label>
                            <Input onChange={this.handleSearchFormChange} type="text" name="location" id="newStopDate" />
                            </FormGroup>
                    </Col>
                    <Col sm={2}>
                        <Button className="btn-block">Submit</Button>
                    </Col>
                </Row>
            </Form>
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
       searchForLocationsForPlan: (searchForm, planId) => { searchForLocationsForPlan(dispatch, searchForm, planId)}
    }
}
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(StopsSearchForm))