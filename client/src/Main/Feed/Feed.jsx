import React, {Component } from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import InvitationFeedElement from './InvitationFeedElement/InvitationFeedElement';
import PlanFeedElement from './PlanFeedElement/PlanFeedElement';

class Feed extends Component {
    render(){
        let invitations = this.props.currentUser.invitations.map((invitation)=>{
            return <InvitationFeedElement invitation={invitation} 
                                          key={invitation._id}
             />
        })
        let plans = this.props.currentUser.plans.map((plan)=>{
            return <PlanFeedElement plan={plan} key={plan._id} />
        })
        return(
            <div>
                <h6>------------Invitations-----------</h6>
                {invitations}
                <h6>-------------Plans----------------</h6>
                {plans}
            </div>
        )
    }
}
const mapStateToProps = (state) => {
    return {
      csrfToken: state.auth.csrfToken,
      currentUser: state.auth.currentUser,
      dataLoaded: state.auth.dataLoaded
    }
};
export default withRouter(connect(mapStateToProps)(Feed));