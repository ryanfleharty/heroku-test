import React, {Component} from 'react';
import { withRouter} from 'react-router-dom';
import StopsSearchResults from './StopsSearchResults/StopsSearchResults';
import { connect } from 'react-redux';
import { addStopToPlan, addLocationToStop } from '../../../../../actions/actions';
import queryString from 'query-string';
import StopsSearchForm from './StopsSearchForm/StopsSearchForm';

class NewStop extends Component{
    componentDidMount(){
        if(this.props.location.search){
            console.log(this.props);
            const queryData = queryString.parse(this.props.location.search);
            console.log(queryData);
            console.log(queryData.query);
        }else{
            console.log("STARTING THE SEARCH PROCESS ALL GOOD HERE");
        }
    }
    render(){
        return(
            <div>
                <StopsSearchForm />
                { this.props.locationHasBeenSearched ?
                    <StopsSearchResults locations={this.props.searchResults} />
                    :
                    null
                }
            </div>
        )
    }
}
const mapStateToProps = (state) => {
    return {
      plan: state.plan.currentPlan,
      searchResults: state.plan.searchResults,
      locationHasBeenSearched: state.plan.locationHasBeenSearched,
      locationHasBeenChosen: state.plan.locationHasBeenChosen,
      currentUser: state.auth.currentUser
    }
};
const mapDispatchToProps = (dispatch) => {
    return {
       addStopToPlan: (formData, planId) => { addStopToPlan(dispatch, formData, planId); },
       addLocationToStop: (location) => { addLocationToStop(dispatch, location)}
    }
}
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(NewStop));