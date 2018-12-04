import React, {Component} from 'react';
import {Switch, Route, withRouter } from 'react-router-dom';
import {connect} from 'react-redux';
import NewPlan from './NewPlan/NewPlan';
import PlansIndex from './PlansIndex/PlansIndex';
import ShowPlan from './ShowPlan/ShowPlan';

class PlansContainer extends Component {
    constructor(){
        super();
        this.state = {
            "newPlan": {
                "title": "",
                "date": null,
                "description": "",
                "errors": {}
            },
            "createdPlans": []
        };
    }
    handleNewFormChange = (e)=>{
        this.setState({
            "newPlan": {
                ...this.state.newPlan,
                [e.currentTarget.name]: e.currentTarget.value
            }
        })
    }
    hasValidPlan = () => {
        const errors = {
            title: [],
            date: [],
            description: []
        };
        if(this.state.newPlan.title === ""){
            errors.title = "Plan must have a title!"
        }
        if(this.state.newPlan.date === null){
            errors.date = "Choose a date and time!"
        }
        if(this.state.newPlan.description === ""){
            errors.description = "Enter a description for this plan"
        }
        if(!errors.title.length && !errors.date.length && !errors.description.length ){
            this.setState({
                "newPlan": {
                    ...this.state.newPlan,
                    errors: {
                        title: [],
                        date: [],
                        description: []
                    }
                }
            })
            return true
        }else{
            this.setState({
                "newPlan": {
                    ...this.state.newPlan,
                    errors
                }
            })
        }
    }
    createPlan = async (e) => {
        e.preventDefault();
        if(this.hasValidPlan()){
            const response = await fetch(`${process.env.REACT_APP_API_HOST}/api/v1/plans`, {
                method: "POST",
                credentials: 'include',
                body: JSON.stringify(this.state.newPlan),
                headers:{
                    'Content-Type': 'application/json'
                }
            })
            const parsedResponse = await response.json();
            if(parsedResponse.status === 200){
                //REFACTOR THIS TO AVOID SO MANY RE-RENDERS WOULD BE NICE
                this.setState({
                    "newPlan": {
                        "title": "",
                        "date": null,
                        "description": ""
                    },
                    "createdPlans": [...this.state.createdPlans, parsedResponse.data]
                })
                this.props.history.push('/plans/'+parsedResponse.data._id)
            } else {
                console.log(parsedResponse)
            }
        } else {
            console.log("FAILED INTERNAL VALIDATION CHECK TO MAKE A PLAN")
        }
    }
    render(){
        return(
            <div>
                <Switch>
                    <Route exact path="/plans/new" render={()=>{
                            return (<NewPlan createPlan={this.createPlan}
                                            handleChange={this.handleNewFormChange}
                                            errors={this.state.newPlan.errors}
                                    />)
                    }}/>
                    <Route path="/plans/:id" render={(props)=>{
                        return <ShowPlan {...props}/>
                    }}/>
                    <Route exact path="/plans" render={(props)=>{
                        return <PlansIndex/>
                    }}/>
                </Switch>
            </div>
        )
    }
}
const mapDispatchToProps = (dispatch) => {
    return {

    }
  };
const mapStateToProps = (state) => {
    return {
      csrfToken: state.auth.csrfToken,
      currentUser: state.auth.currentUser,
      dataLoaded: state.auth.dataLoaded
    }
};
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(PlansContainer))

